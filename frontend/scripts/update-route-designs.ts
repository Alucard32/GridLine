/**
 * Update Route Designs Script
 *
 * Reads design URLs from CSV and updates route poster designs in Supabase
 * while preserving the existing route/GPX data.
 *
 * Usage:
 *   npx tsx scripts/update-route-designs.ts [--dry-run]
 *   npx tsx scripts/update-route-designs.ts --route-id tdf-2025-stage-01
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import LZString from 'lz-string';
import dotenv from 'dotenv';

// Load environment variables from .env.local (in frontend directory)
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Import style resolution - must be after dotenv config
import { getStyleById } from '../lib/styles';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isDryRun = process.argv.includes('--dry-run');
const specificRouteId = process.argv.find((arg, i) =>
  process.argv[i - 1] === '--route-id'
);

// Mapping from CSV route IDs to database titles
const ROUTE_ID_TO_TITLE: Record<string, string> = {
  // Tour de France 2025
  'tdf-2025-stage-01': 'Lille Cycling Circuit',
  'tdf-2025-stage-02': 'Boulogne Coastal',
  'tdf-2025-stage-03': 'Dunkirk Cycling',
  'tdf-2025-stage-04': 'Rouen Normandy',
  'tdf-2025-stage-05': 'Caen Time Trial',
  'tdf-2025-stage-06': 'Vire Normandy',
  'tdf-2025-stage-07': 'Mûr-de-Bretagne',
  'tdf-2025-stage-08': 'Laval Brittany',
  'tdf-2025-stage-09': 'Châteauroux Loire',
  'tdf-2025-stage-10': 'Mont-Dore Auvergne',
  'tdf-2025-stage-11': 'Toulouse Circuit',
  'tdf-2025-stage-12': 'Hautacam Mountain',
  'tdf-2025-stage-13': 'Peyragudes Time Trial',
  'tdf-2025-stage-14': 'Superbagnères Pyrenees',
  'tdf-2025-stage-15': 'Carcassonne South',
  'tdf-2025-stage-16': 'Mont Ventoux',
  'tdf-2025-stage-17': 'Valence Rhône',
  'tdf-2025-stage-18': 'Col de la Loze',
  'tdf-2025-stage-19': 'La Plagne Alps',
  'tdf-2025-stage-20': 'Pontarlier Jura',
  'tdf-2025-stage-21': 'Paris Champs-Élysées Circuit',
  // World Marathon Majors
  'boston-marathon-2025': 'Boston 42K',
  'london-marathon-2025': 'London 42K',
  'berlin-marathon-2025': 'Berlin 42K',
  'chicago-marathon-2025': 'Chicago 42K',
  'nyc-marathon-2025': 'New York City 42K',
  'tokyo-marathon-2025': 'Tokyo 42K',
  // European Marathons
  'copenhagen-marathon-2025': 'Copenhagen 42K',
  'paris-marathon-2025': 'Paris 42K',
  'amsterdam-marathon-2025': 'Amsterdam 42K',
  'stockholm-marathon-2025': 'Stockholm 42K',
  // Hiking Trails
  'camino-frances': 'Camino Francés',
  'west-highland-way': 'West Highland Way',
  'tour-du-mont-blanc': 'Tour du Mont Blanc',
  'kungsleden': 'Kungsleden',
  'cotswold-way': 'Cotswold Way',
  'south-downs-way': 'South Downs Way',
  'cleveland-way': 'Cleveland Way',
  'coast-to-coast': 'Coast to Coast',
  'hadrians-wall-path': 'Hadrians Wall Path',
  // Ultra Trails
  'hardrock-100-clockwise': 'San Juan Mountains 100mi',
};

interface RouteUpdate {
  routeId: string;
  name: string;
  url: string;
  config: DecodedConfig | null;
}

interface DecodedConfig {
  l?: unknown; // location
  s: string;   // style ID
  p: string;   // palette ID
  t: unknown;  // typography
  f: unknown;  // format
  ly: unknown; // layers
}

/**
 * Decode the URL config parameter
 */
function decodeUrlConfig(url: string): DecodedConfig | null {
  try {
    const urlObj = new URL(url);
    const encoded = urlObj.searchParams.get('s');
    if (!encoded) {
      console.warn('  ⚠️  No config parameter found in URL');
      return null;
    }

    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) {
      console.warn('  ⚠️  Failed to decompress config');
      return null;
    }

    return JSON.parse(json) as DecodedConfig;
  } catch (error) {
    console.error('  ❌ Error decoding URL:', error);
    return null;
  }
}

/**
 * Parse CSV and extract routes with new design URLs
 */
function parseCSV(csvPath: string): RouteUpdate[] {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  const updates: RouteUpdate[] = [];

  for (const line of lines) {
    // Skip headers and empty lines
    if (!line.trim() ||
        line.startsWith('Route ID,') ||
        line.startsWith('Tour de France') ||
        line.startsWith('World Marathon') ||
        line.startsWith('European Marathon') ||
        line.startsWith('Hiking Trails') ||
        line.startsWith('Ultra Trails')) {
      continue;
    }

    // Parse CSV line (handle commas in URLs)
    const match = line.match(/^([^,]+),([^,]+),(https:\/\/[^,]+|NO NEED TO CHANGE|Doesnt exist in database\?)/);
    if (!match) continue;

    const [, routeId, name, url] = match;

    // Skip routes that don't need changes or don't exist
    if (url === 'NO NEED TO CHANGE' || url === 'Doesnt exist in database?') {
      continue;
    }

    // Decode the URL config
    const config = decodeUrlConfig(url);

    updates.push({
      routeId: routeId.trim(),
      name: name.trim(),
      url: url.trim(),
      config,
    });
  }

  return updates;
}

/**
 * Update a single route in the database
 */
async function updateRoute(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  update: RouteUpdate
): Promise<boolean> {
  console.log(`\n📍 Processing: ${update.routeId} - ${update.name}`);

  const config = update.config;
  if (!config) {
    console.log('  ⚠️  Skipping - no valid config decoded');
    return false;
  }

  // Get database title from mapping
  const dbTitle = ROUTE_ID_TO_TITLE[update.routeId];
  if (!dbTitle) {
    console.log(`  ⚠️  No title mapping found for: ${update.routeId}`);
    return false;
  }

  // Find the map by title
  const { data: existingMap, error: fetchError } = await supabase
    .from('maps')
    .select('id, config')
    .eq('title', dbTitle)
    .single<{ id: string; config: Record<string, unknown> }>();

  if (fetchError || !existingMap) {
    console.log(`  ⚠️  Route not found in database: ${dbTitle}`);
    return false;
  }

  console.log(`  ✓ Found map ID: ${existingMap.id}`);

  // Preserve the existing route data and location
  const existingConfig = existingMap.config;
  const existingRoute = existingConfig?.route;
  const existingLocation = existingConfig?.location;

  // Resolve full style and palette objects (not just IDs)
  const fullStyle = getStyleById(config.s);
  if (!fullStyle) {
    console.log(`  ⚠️  Style not found: ${config.s}`);
    return false;
  }

  const fullPalette = fullStyle.palettes.find(p => p.id === config.p) || fullStyle.defaultPalette;
  if (!fullPalette) {
    console.log(`  ⚠️  Palette not found: ${config.p}`);
    return false;
  }

  // Build the new config, merging design with existing route/location data
  const newConfig = {
    ...existingConfig,
    style: fullStyle,
    palette: fullPalette,
    typography: config.t,
    format: config.f,
    layers: config.ly,
    // Preserve location from existing config (NOT from URL)
    location: existingLocation,
    // Always preserve route data
    route: existingRoute,
  };

  if (isDryRun) {
    console.log('  📋 [DRY RUN] Would update with:');
    console.log(`     Style: ${config.s}`);
    console.log(`     Palette: ${config.p}`);
    console.log(`     Route data preserved: ${existingRoute ? 'Yes' : 'No'}`);
    return true;
  }

  // Update the map config and clear thumbnail for regeneration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('maps')
    .update({
      config: newConfig,
      thumbnail_url: null, // Clear for regeneration
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingMap.id);

  if (updateError) {
    console.error(`  ❌ Update failed:`, updateError);
    return false;
  }

  console.log('  ✅ Updated successfully');
  console.log(`     Style: ${config.s}, Palette: ${config.p}`);

  return true;
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Route Design Update Script');
  console.log('=============================\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Validate environment
  if (!isDryRun) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing required environment variables:');
      console.log('   NEXT_PUBLIC_SUPABASE_URL');
      console.log('   SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }
  }

  // Parse CSV (docs folder is in project root, not frontend)
  const csvPath = path.join(__dirname, '../../docs/GridLine Poster Redesign - Sheet1.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  console.log('📄 Reading CSV file...');
  let updates = parseCSV(csvPath);

  // Filter to specific route if specified
  if (specificRouteId) {
    updates = updates.filter(u => u.routeId === specificRouteId);
    if (updates.length === 0) {
      console.error(`❌ Route not found in CSV: ${specificRouteId}`);
      process.exit(1);
    }
  }

  console.log(`   Found ${updates.length} routes to update\n`);

  // List routes
  console.log('Routes to process:');
  for (const update of updates) {
    const configStatus = update.config ? '✓' : '✗';
    console.log(`  ${configStatus} ${update.routeId}`);
  }

  if (isDryRun) {
    console.log('\n📋 Config details:\n');
    for (const update of updates) {
      if (update.config) {
        console.log(`${update.routeId}:`);
        console.log(`  Style: ${update.config.s}`);
        console.log(`  Palette: ${update.config.p}`);
        console.log(`  Typography:`, JSON.stringify(update.config.t, null, 2).split('\n').join('\n    '));
        console.log();
      }
    }
    console.log('\n✅ Dry run complete. Use without --dry-run to apply changes.');
    return;
  }

  // Create Supabase client
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Process updates
  let successCount = 0;
  let failCount = 0;

  for (const update of updates) {
    const success = await updateRoute(supabase, update);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\n=============================');
  console.log('📊 Summary');
  console.log(`   ✅ Updated: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   Total: ${updates.length}`);

  if (successCount > 0) {
    console.log('\n💡 Next steps:');
    console.log('   1. Run thumbnail generation: npx tsx scripts/seed-famous-routes/generate-thumbnails.ts');
    console.log('   2. Verify changes in the explore feed');
  }
}

main().catch(console.error);
