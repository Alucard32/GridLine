/**
 * Goandrace.com GPX fetcher
 * Fetches marathon route data from goandrace.com and converts to GPX
 *
 * The site stores route data in JSON files at paths like:
 * /path/{year}/{month}/path_{date}_id{id}_race{n}.json
 */

import { fetcherConfig, log } from '../config';
import type { FetchResult } from '../types';

interface GoAndRacePoint {
  elevation: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface GoAndRaceData {
  AllPointsArray_SIMPLE: [string, string][];
  ElevationInterpolati?: GoAndRacePoint[];
  ContaAllPointsArray?: number;
}

/**
 * Extract the JSON path URL from the goandrace.com page HTML
 */
function extractJsonPath(html: string): string | null {
  // Look for fetch('path/{year}/{month}/path_{...}.json') pattern
  const patterns = [
    /fetch\(['"]\.\.\/\.\.\/\.\.\/path\/(\d{4})\/(\d{2})\/path_(\d{8}_id\d+_race\d+)\.json['"]\)/,
    /fetch\(['"]\.\.\/path\/(\d{4})\/(\d{2})\/path_(\d{8}_id\d+_race\d+)\.json['"]\)/,
    /fetch\(['"](.*?path_\d{8}_id\d+_race\d+\.json)['"]\)/,
    /path\/(\d{4})\/(\d{2})\/path_(\d{8}_id\d+_race\d+)\.json/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      if (match[1] && match[2] && match[3]) {
        return `https://www.goandrace.com/path/${match[1]}/${match[2]}/path_${match[3]}.json`;
      }
      // Handle full path capture
      if (match[1]?.includes('path_')) {
        const fullPath = match[1].replace(/^\.\.\/+/, '');
        return `https://www.goandrace.com/${fullPath}`;
      }
    }
  }

  return null;
}

/**
 * Convert goandrace.com JSON data to GPX format
 */
function convertToGPX(data: GoAndRaceData, raceName: string): string {
  const points = data.AllPointsArray_SIMPLE || [];
  const elevations = data.ElevationInterpolati || [];

  // Build a map of coordinates to elevations for quick lookup
  const elevationMap = new Map<string, number>();
  for (const point of elevations) {
    const key = `${point.location.lat.toFixed(5)},${point.location.lng.toFixed(5)}`;
    elevationMap.set(key, point.elevation);
  }

  // Build trackpoints
  const trackpoints: string[] = [];
  for (const [lat, lng] of points) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const key = `${latNum.toFixed(5)},${lngNum.toFixed(5)}`;
    const elevation = elevationMap.get(key);

    let trkpt = `      <trkpt lat="${lat}" lon="${lng}">`;
    if (elevation !== undefined) {
      trkpt += `\n        <ele>${elevation}</ele>\n      `;
    }
    trkpt += `</trkpt>`;
    trackpoints.push(trkpt);
  }

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GridLine Seed Script via goandrace.com"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(raceName)}</name>
    <desc>Route data from goandrace.com</desc>
  </metadata>
  <trk>
    <name>${escapeXml(raceName)}</name>
    <trkseg>
${trackpoints.join('\n')}
    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Fetch route data from a goandrace.com page
 */
export async function fetchGoAndRace(pageUrl: string, raceName: string): Promise<FetchResult> {
  try {
    log('info', `Fetching goandrace.com page: ${pageUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetcherConfig.timeout);

    // Step 1: Fetch the HTML page
    const pageResponse = await fetch(pageUrl, {
      headers: {
        'User-Agent': fetcherConfig.userAgent,
        Accept: 'text/html',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!pageResponse.ok) {
      return {
        success: false,
        error: `Failed to fetch page: HTTP ${pageResponse.status}`,
        source: pageUrl,
      };
    }

    const html = await pageResponse.text();

    // Step 2: Extract the JSON path URL
    const jsonUrl = extractJsonPath(html);
    if (!jsonUrl) {
      log('error', 'Could not find JSON path in page HTML');
      return {
        success: false,
        error: 'Could not extract JSON path from page',
        source: pageUrl,
      };
    }

    log('info', `Found JSON path: ${jsonUrl}`);

    // Step 3: Fetch the JSON data
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), fetcherConfig.timeout);

    const jsonResponse = await fetch(jsonUrl, {
      headers: {
        'User-Agent': fetcherConfig.userAgent,
        Accept: 'application/json',
      },
      signal: controller2.signal,
    });

    clearTimeout(timeoutId2);

    if (!jsonResponse.ok) {
      return {
        success: false,
        error: `Failed to fetch JSON: HTTP ${jsonResponse.status}`,
        source: jsonUrl,
      };
    }

    const data = (await jsonResponse.json()) as GoAndRaceData;

    if (!data.AllPointsArray_SIMPLE || data.AllPointsArray_SIMPLE.length === 0) {
      return {
        success: false,
        error: 'JSON data contains no route points',
        source: jsonUrl,
      };
    }

    log('success', `Found ${data.AllPointsArray_SIMPLE.length} route points`);

    // Step 4: Convert to GPX
    const gpxContent = convertToGPX(data, raceName);

    log('success', `Generated GPX (${(gpxContent.length / 1024).toFixed(1)}KB)`);

    return {
      success: true,
      gpxContent,
      source: jsonUrl,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    log('error', `Failed to fetch from goandrace.com: ${message}`);
    return {
      success: false,
      error: message,
      source: pageUrl,
    };
  }
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with retry logic
 */
export async function fetchGoAndRaceWithRetry(
  pageUrl: string,
  raceName: string
): Promise<FetchResult> {
  let lastError = '';

  for (let attempt = 1; attempt <= fetcherConfig.maxRetries; attempt++) {
    const result = await fetchGoAndRace(pageUrl, raceName);
    if (result.success) {
      return result;
    }
    lastError = result.error || 'Unknown error';
    log('warning', `Attempt ${attempt}/${fetcherConfig.maxRetries} failed: ${lastError}`);

    if (attempt < fetcherConfig.maxRetries) {
      await delay(fetcherConfig.requestDelay * attempt);
    }
  }

  return {
    success: false,
    error: `All attempts failed. Last error: ${lastError}`,
    source: pageUrl,
  };
}
