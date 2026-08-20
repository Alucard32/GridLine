/**
 * Configuration for the famous routes seeding system
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SEED_ADMIN_USER_ID = process.env.SEED_ADMIN_USER_ID;

// Check if we're in dry-run mode (no DB needed)
const isDryRun = process.argv.includes('--dry-run');

// Create Supabase client with service role (bypasses RLS)
// Only create if we have the required env vars
let _supabaseAdmin: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = _supabaseAdmin as SupabaseClient;

/**
 * Validate that all required configuration is present
 * Returns true if valid, false otherwise (with error messages)
 */
export function validateConfig(): boolean {
  if (isDryRun) {
    console.log('ℹ️  Dry-run mode: Supabase connection not required\n');
    return true;
  }

  let valid = true;

  if (!SUPABASE_URL) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    valid = false;
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    valid = false;
  }

  if (!SEED_ADMIN_USER_ID) {
    console.error('❌ Missing SEED_ADMIN_USER_ID environment variable');
    console.log('   Create an admin user in Supabase and set the UUID');
    valid = false;
  }

  if (!valid) {
    console.log('\n📝 Required environment variables:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL');
    console.log('   SUPABASE_SERVICE_ROLE_KEY - Service role key (bypasses RLS)');
    console.log('   SEED_ADMIN_USER_ID - UUID of admin user to own seeded routes');
    console.log('\n💡 Tip: Use --dry-run to test without database connection');
  }

  return valid;
}

// Admin user ID for owning seeded routes
export const getAdminUserId = (): string => {
  if (!SEED_ADMIN_USER_ID) {
    // In dry-run mode, return a placeholder
    if (isDryRun) {
      return 'dry-run-user-id';
    }
    throw new Error('SEED_ADMIN_USER_ID environment variable is required');
  }
  return SEED_ADMIN_USER_ID;
};

// Fetcher configuration
export const fetcherConfig = {
  // Request timeout in ms
  timeout: 30000,

  // Delay between requests to avoid rate limiting (ms)
  requestDelay: 1000,

  // Maximum retries per request
  maxRetries: 3,

  // User agent for requests
  userAgent:
    'GridLine-Seeder/1.0 (https://gridline.eu; contact@gridline.eu)',
};

// GPX source base URLs
export const gpxSources = {
  cyclingstage: {
    baseUrl: 'https://cdn.cyclingstage.com/images',
    tdfPattern: '/tour-de-france/{year}/stage-{stage}-route.gpx',
    giroPattern: '/giro-{year}/stage-{stage}-route.gpx',
  },
  hardrock: {
    directUrl:
      'https://www.hardrock100.com/files/course/HR100-Course-Clockwise.gpx',
  },
  goandrace: {
    baseUrl: 'https://www.goandrace.com',
  },
  tracedetrail: {
    baseUrl: 'https://tracedetrail.fr',
  },
};

// Default poster configuration values
export const defaultPosterConfig = {
  typography: {
    titleFont: 'DM Sans',
    titleSize: 48,
    titleWeight: 700,
    titleLetterSpacing: 0,
    titleAllCaps: false,
    subtitleFont: 'DM Sans',
    subtitleSize: 18,
    showTitle: true,
    showSubtitle: true,
    showCoordinates: true,
    position: 'bottom' as const,
    textBackdrop: 'subtle' as const,
    backdropHeight: 30,
    backdropAlpha: 0.7,
  },
  format: {
    aspectRatio: '2:3' as const,
    orientation: 'portrait' as const,
    margin: 5,
    borderStyle: 'none' as const,
  },
  layers: {
    streets: true,
    buildings: false,
    water: true,
    parks: true,
    terrain: true,
    terrain3d: false,
    contours: false,
    labels: true,
    marker: false,
    population: false,
    hillshadeExaggeration: 1,
    terrainUnderWater: false,
    contourDensity: 50,
    labelSize: 1,
    labelMaxWidth: 10,
    roadWeight: 1,
  },
  route: {
    color: '#FF4444',
    width: 3,
    opacity: 0.9,
    lineStyle: 'solid' as const,
    showStartEnd: true,
    startColor: '#22C55E',
    endColor: '#EF4444',
  },
};

// Logging configuration
export const logConfig = {
  colors: {
    success: '\x1b[32m', // Green
    error: '\x1b[31m', // Red
    warning: '\x1b[33m', // Yellow
    info: '\x1b[36m', // Cyan
    reset: '\x1b[0m',
  },
};

export function log(
  level: 'success' | 'error' | 'warning' | 'info',
  message: string
): void {
  const color = logConfig.colors[level];
  const reset = logConfig.colors.reset;
  const prefix = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  }[level];
  console.log(`${color}${prefix} ${message}${reset}`);
}
