import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { trackApiRequest } from '@/lib/api-usage/tracker';

// Simple in-memory cache for TileJSON responses to reduce MapTiler API calls
// Cache entries expire after 5 minutes
const tileJsonCache = new Map<string, { data: string; timestamp: number; contentType: string }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedTileJson(cacheKey: string): { data: string; contentType: string } | null {
  const cached = tileJsonCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { data: cached.data, contentType: cached.contentType };
  }
  // Clean up expired entry
  if (cached) {
    tileJsonCache.delete(cacheKey);
  }
  return null;
}

function setCachedTileJson(cacheKey: string, data: string, contentType: string): void {
  // Limit cache size to prevent memory issues
  if (tileJsonCache.size > 100) {
    // Remove oldest entries
    const entries = Array.from(tileJsonCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < 20; i++) {
      tileJsonCache.delete(entries[i][0]);
    }
  }
  tileJsonCache.set(cacheKey, { data, timestamp: Date.now(), contentType });
}

const SOURCES: Record<string, string> = {
  openfreemap: 'https://tiles.openfreemap.org/',
  maptiler: 'https://api.maptiler.com/',
  kontur: 'https://disaster.ninja/active/api/tiles/bivariate/v1/',
  osm: 'https://tiles.openstreetmap.org/',
  'aws-terrain': 'https://s3.amazonaws.com/elevation-tiles-prod/',
};

// Allowlist of valid source keys for security
const ALLOWED_SOURCES = Object.keys(SOURCES);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    
    if (!pathArray || pathArray.length < 2) {
      return NextResponse.json({ error: 'Invalid path: path must contain at least 2 segments' }, { status: 400 });
    }

    const sourceKey = pathArray[0];
    
    // Validate source key against allowlist
    if (!ALLOWED_SOURCES.includes(sourceKey)) {
      return NextResponse.json({ 
        error: `Unknown source: ${sourceKey}`, 
        allowedSources: ALLOWED_SOURCES 
      }, { status: 400 });
    }

    const baseUrl = SOURCES[sourceKey];

    // Reconstruct the remaining path
    const remainingPath = pathArray.slice(1).join('/');
    
    // Validate path doesn't contain dangerous patterns (path traversal, double slashes, etc.)
    if (remainingPath.includes('..') || remainingPath.includes('//') || remainingPath.startsWith('/')) {
      return NextResponse.json({ 
        error: 'Invalid path: path contains dangerous patterns', 
        details: 'Path traversal and double slashes are not allowed' 
      }, { status: 400 });
    }
    
    // Additional validation: ensure path segments don't contain control characters or special patterns
    const dangerousPatterns = /[<>:"|?*\x00-\x1f]/;
    if (dangerousPatterns.test(remainingPath)) {
      return NextResponse.json({ 
        error: 'Invalid path: path contains invalid characters' 
      }, { status: 400 });
    }
    
    // Construct the target URL
    const urlObj = new URL(request.url);
    // In production we may be behind a proxy/CDN, so build a public origin using forwarded headers.
    // This is critical because MapLibre workers can fail to resolve relative URLs like "/api/tiles/...".
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? urlObj.protocol.replace(':', '');
    const forwardedHost =
      request.headers.get('x-forwarded-host') ??
      request.headers.get('host') ??
      urlObj.host;
    const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : urlObj.origin;
    const searchParams = urlObj.searchParams.toString();
    const tileUrl = `${baseUrl}${remainingPath}${searchParams ? '?' + searchParams : ''}`;

    // Check if this is a TileJSON request that we can serve from cache
    const isTileJson = remainingPath.endsWith('tiles.json') || remainingPath === 'planet';
    const cacheKey = `${sourceKey}:${remainingPath}:${origin}`;

    if (isTileJson) {
      const cached = getCachedTileJson(cacheKey);
      if (cached) {
        trackApiRequest(sourceKey, { isTileJson, isError: false });
        return new NextResponse(cached.data, {
          status: 200,
          headers: {
            'Content-Type': cached.contentType,
            'Cache-Control': 'public, max-age=300',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'HIT',
          },
        });
      }
    }

    // Forward Referer header for domain-restricted API keys (e.g., MapTiler).
    // Preview hosts (*.vercel.app) are often missing from the key allowlist; if
    // MapTiler returns 403 we retry with MAPTILER_HTTP_REFERER (or localhost).
    const incomingReferer = request.headers.get('referer');
    const refererHeader = incomingReferer || `${origin}/`;
    const browserLikeHeaders = (referer: string, requestOrigin: string) => ({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: referer,
      Origin: requestOrigin.replace(/\/$/, ''),
    });

    let response = await fetch(tileUrl, {
      headers: browserLikeHeaders(refererHeader, origin),
    });

    if (sourceKey === 'maptiler' && response.status === 403) {
      const fallbackReferer =
        process.env.MAPTILER_HTTP_REFERER?.trim() || 'http://localhost:3000/';
      if (fallbackReferer !== refererHeader) {
        const fallbackOrigin = fallbackReferer.replace(/\/$/, '');
        logger.warn(
          `MapTiler 403 with Referer=${refererHeader}; retrying with ${fallbackReferer}`
        );
        response = await fetch(tileUrl, {
          headers: browserLikeHeaders(fallbackReferer, fallbackOrigin),
        });
      }
    }

    // Track the API request (fire-and-forget)
    trackApiRequest(sourceKey, { isTileJson, isError: !response.ok });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error body');
      logger.error(`Tile fetch error (${response.status}) for ${tileUrl}:`, errorText);
      return NextResponse.json(
        {
          error: 'Upstream fetch failed',
          status: response.status,
          url: tileUrl,
          details: errorText.slice(0, 500)
        },
        { status: response.status }
      );
    }

    const data = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || '';

    // If this is a TileJSON request (OpenFreeMap or MapTiler), rewrite tile URLs to go through our proxy
    const shouldRewriteTileJson = contentType.includes('application/json') && isTileJson;

    if (shouldRewriteTileJson) {
      try {
        const text = new TextDecoder().decode(data);
        const json = JSON.parse(text);
        
        // Keep OpenFreeMap at its native maxzoom (14). Raising it makes MapLibre
        // request z15 tiles that do not exist, which renders as a blank map.

        // MapTiler contours-v2 only has native tiles through z14 (400s at z15+)
        if (sourceKey === 'maptiler' && remainingPath.includes('contours-v2') && json.maxzoom > 14) {
          json.maxzoom = 14;
        }

        // Rewrite tile URLs to go through our proxy
        if (json.tiles && Array.isArray(json.tiles)) {
          json.tiles = json.tiles.map((url: string) => {
            // Handle OpenFreeMap
            if (sourceKey === 'openfreemap') {
              const matches = url.match(/https:\/\/tiles\.openfreemap\.org\/(.*)/);
              if (matches && matches[1]) {
                return `${origin}/api/tiles/openfreemap/${matches[1]}`;
              }
            }
            
            // Handle MapTiler
            if (sourceKey === 'maptiler') {
              const matches = url.match(/https:\/\/api\.maptiler\.com\/(.*)/);
              if (matches && matches[1]) {
                // MapTiler URLs in TileJSON already include the key, but we want to proxy them
                // We'll strip the key if it's already in our searchParams to avoid duplication, 
                // but the current proxy setup just appends searchParams from the request.
                return `${origin}/api/tiles/maptiler/${matches[1]}`;
              }
            }

            return url;
          });
        }

        const modifiedJson = JSON.stringify(json);

        // Cache the rewritten TileJSON for future requests
        setCachedTileJson(cacheKey, modifiedJson, 'application/json');

        const modifiedData = new TextEncoder().encode(modifiedJson);
        return new NextResponse(modifiedData, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'MISS',
            'Vary': 'Host, X-Forwarded-Host, X-Forwarded-Proto',
          },
        });
      } catch (e) {
        logger.error(`Error overriding ${sourceKey} TileJSON:`, e);
      }
    }

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'application/x-protobuf',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    logger.error('Tile proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Proxy exception', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}

