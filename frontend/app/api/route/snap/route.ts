import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type RoutingProfile = 'foot' | 'bike';

const OSRM_BASE_URLS: Record<RoutingProfile, string> = {
  foot: 'https://routing.openstreetmap.de/routed-foot',
  bike: 'https://routing.openstreetmap.de/routed-bike',
};

/**
 * Rate limiting: OSRM public server policy is ~1 request per second.
 * Serialized queue ensures compliance from this server instance.
 */
let lastRequestTime = 0;
let queue: Promise<unknown> = Promise.resolve();

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = async () => {
    const now = Date.now();
    const wait = Math.max(0, 1100 - (now - lastRequestTime));
    if (wait) await sleep(wait);
    lastRequestTime = Date.now();
    return task();
  };

  const p = queue.then(run, run) as Promise<T>;
  queue = p.then(
    () => undefined,
    () => undefined
  );
  return p;
}

interface SnapRequest {
  waypoints: [number, number][]; // [lat, lng][]
  profile: RoutingProfile;
}

/**
 * POST /api/route/snap
 *
 * Proxies routing requests to the public OSRM server.
 * Accepts waypoints as [lat, lng] pairs and returns snapped route geometry.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SnapRequest;
    const { waypoints, profile } = body;

    // Validate profile
    if (!profile || !OSRM_BASE_URLS[profile]) {
      return NextResponse.json(
        { error: 'Invalid profile. Must be "foot" or "bike".' },
        { status: 400 }
      );
    }

    // Validate waypoints
    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 waypoints are required.' },
        { status: 400 }
      );
    }

    if (waypoints.length > 25) {
      return NextResponse.json(
        { error: 'Maximum 25 waypoints allowed.' },
        { status: 400 }
      );
    }

    // Convert [lat, lng] to OSRM format: lng,lat;lng,lat;...
    const coordsString = waypoints
      .map(([lat, lng]) => `${lng},${lat}`)
      .join(';');

    const baseUrl = OSRM_BASE_URLS[profile];
    const osrmUrl = `${baseUrl}/route/v1/${profile}/${coordsString}?overview=full&geometries=geojson&steps=false`;

    const result = await enqueue(async () => {
      const response = await fetch(osrmUrl, {
        headers: {
          'User-Agent': 'GridLine/1.0 (https://gridline.eu)',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OSRM returned ${response.status}: ${text}`);
      }

      return response.json();
    });

    if (result.code !== 'Ok') {
      return NextResponse.json(
        { error: `OSRM error: ${result.code}${result.message ? ' - ' + result.message : ''}` },
        { status: 422 }
      );
    }

    const route = result.routes?.[0];
    if (!route) {
      return NextResponse.json(
        { error: 'No route found between waypoints.' },
        { status: 404 }
      );
    }

    // Return snapped route geometry and basic stats
    return NextResponse.json({
      coordinates: route.geometry.coordinates as [number, number][], // [lng, lat][]
      distance: route.distance, // meters
      duration: route.duration, // seconds
    });
  } catch (error) {
    console.error('Route snap error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to snap route.' },
      { status: 500 }
    );
  }
}
