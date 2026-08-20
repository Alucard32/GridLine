/**
 * Thumbnail Generation Script for Seeded Routes
 *
 * Uses Playwright to render maps in a headless browser and capture thumbnails.
 * Run with: npm run seed:thumbnails
 *
 * Requirements:
 * - Dev server running at localhost:3000
 * - Environment variables loaded from .env.local
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { chromium, type Page, type Browser } from 'playwright';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Config
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const THUMBNAIL_WIDTH = 800;
const THUMBNAIL_HEIGHT = 1200; // 2:3 aspect ratio for posters
const MAP_RENDER_WAIT_MS = 3000; // Time to wait for map tiles to load
const BATCH_SIZE = 5; // Process maps in batches

// Initialize Supabase admin client
function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

interface MapRecord {
  id: string;
  title: string;
  thumbnail_url: string | null;
  user_id: string;
}

// Logging utility
function log(
  type: 'info' | 'success' | 'warning' | 'error',
  message: string
): void {
  const prefixes = {
    info: '  ℹ️ ',
    success: '  ✅',
    warning: '  ⚠️ ',
    error: '  ❌',
  };
  console.log(`${prefixes[type]} ${message}`);
}

/**
 * Fetch maps that need thumbnails (or all if force mode)
 */
async function getMapsNeedingThumbnails(
  supabase: SupabaseClient,
  forceAll: boolean = false
): Promise<MapRecord[]> {
  let query = supabase
    .from('maps')
    .select('id, title, thumbnail_url, user_id')
    .eq('is_featured', true);

  // Only filter for null thumbnails if not forcing regeneration
  if (!forceAll) {
    query = query.is('thumbnail_url', null);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch maps: ${error.message}`);
  }

  return data || [];
}

/**
 * Capture thumbnail from map detail page
 */
async function captureMapThumbnail(
  page: Page,
  mapId: string
): Promise<Buffer | null> {
  try {
    // Navigate to map detail page
    const url = `${BASE_URL}/map/${mapId}`;
    log('info', `Loading: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for the poster container (includes map + border overlay + text overlay)
    const posterContainer = page.locator('[data-poster-preview]').first();
    await posterContainer.waitFor({ state: 'visible', timeout: 30000 });

    // Also wait for the map canvas to ensure tiles are loaded
    const mapCanvas = page.locator('.maplibregl-canvas').first();
    await mapCanvas.waitFor({ state: 'visible', timeout: 30000 });

    // Additional wait for tiles to fully load
    await page.waitForTimeout(MAP_RENDER_WAIT_MS);

    // Hide UI overlays that shouldn't appear in thumbnails, but KEEP border overlay visible
    await page.evaluate(() => {
      // Hide MapPreview's loading/zoom indicators (inside MapPreview component)
      // These have z-30 class but are inside the MapPreview div, not the border overlay
      const mapPreviewContainer = document.querySelector('[data-poster-preview] > div:first-child');
      if (mapPreviewContainer) {
        mapPreviewContainer.querySelectorAll('.z-30, .z-20').forEach((el) => {
          (el as HTMLElement).style.visibility = 'hidden';
        });
      }
      // Hide MapLibre control containers
      document.querySelectorAll('.maplibregl-ctrl-top-right, .maplibregl-ctrl-top-left, .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-bottom-left, .maplibregl-ctrl-group').forEach((el) => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
      // Hide any shadows that might look bad in thumbnails (keep subtle ring though)
      const poster = document.querySelector('[data-poster-preview]') as HTMLElement;
      if (poster) {
        poster.style.boxShadow = 'none';
      }
    });

    // Screenshot the full poster container - includes map, text overlay, and border
    const screenshot = await posterContainer.screenshot({
      type: 'png',
      scale: 'device',
    });

    return screenshot;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    log('error', `Failed to capture thumbnail for ${mapId}: ${message}`);
    return null;
  }
}

/**
 * Upload thumbnail to Supabase storage
 */
async function uploadThumbnail(
  supabase: SupabaseClient,
  mapId: string,
  userId: string,
  imageBuffer: Buffer
): Promise<string | null> {
  try {
    const fileName = `${userId}/${mapId}.png`;

    // Upload to storage
    const { data, error } = await supabase.storage
      .from('map-thumbnails')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('map-thumbnails').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    log('error', `Failed to upload thumbnail for ${mapId}: ${message}`);
    return null;
  }
}

/**
 * Update map record with thumbnail URL
 */
async function updateMapThumbnail(
  supabase: SupabaseClient,
  mapId: string,
  thumbnailUrl: string
): Promise<boolean> {
  const { error } = await supabase
    .from('maps')
    .update({ thumbnail_url: thumbnailUrl })
    .eq('id', mapId);

  if (error) {
    log('error', `Failed to update map ${mapId}: ${error.message}`);
    return false;
  }

  return true;
}

/**
 * Process a single map
 */
async function processMap(
  page: Page,
  supabase: SupabaseClient,
  map: MapRecord
): Promise<boolean> {
  log('info', `Processing: ${map.title} (${map.id})`);

  // Capture thumbnail
  const imageBuffer = await captureMapThumbnail(page, map.id);
  if (!imageBuffer) {
    return false;
  }

  // Upload to storage
  const thumbnailUrl = await uploadThumbnail(
    supabase,
    map.id,
    map.user_id,
    imageBuffer
  );
  if (!thumbnailUrl) {
    return false;
  }

  // Update map record
  const updated = await updateMapThumbnail(supabase, map.id, thumbnailUrl);
  if (!updated) {
    return false;
  }

  log('success', `Thumbnail generated: ${map.title}`);
  return true;
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('\n🖼️  Thumbnail Generation Script');
  console.log('================================\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const forceAll = args.includes('--force');
  const limitArg = args.find((arg) => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }
  if (forceAll) {
    console.log('🔄 FORCE MODE - Regenerating all thumbnails\n');
  }

  // Initialize Supabase
  const supabase = getSupabaseAdmin();
  log('info', 'Connected to Supabase');

  // Fetch maps needing thumbnails (or all in force mode)
  let maps = await getMapsNeedingThumbnails(supabase, forceAll);
  log('info', `Found ${maps.length} maps ${forceAll ? 'to regenerate' : 'needing thumbnails'}`);

  if (maps.length === 0) {
    console.log('\n✅ All maps already have thumbnails!\n');
    return;
  }

  // Apply limit if specified
  if (limit && limit > 0) {
    maps = maps.slice(0, limit);
    log('info', `Limited to ${maps.length} maps`);
  }

  if (dryRun) {
    console.log('\n📋 Maps that would be processed:');
    maps.forEach((map) => {
      console.log(`   - ${map.title} (${map.id})`);
    });
    console.log('\n');
    return;
  }

  // Launch browser
  log('info', 'Launching browser...');
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT },
    deviceScaleFactor: 2, // Retina quality
  });

  // Pre-set cookie consent in localStorage to prevent the banner from appearing
  await context.addInitScript(() => {
    localStorage.setItem(
      'gridline_cookie_consent',
      JSON.stringify({
        version: '2',
        preferences: { necessary: true, analytics: false, marketing: false },
        timestamp: new Date().toISOString(),
      })
    );
  });

  const page = await context.newPage();

  // Process maps
  let successCount = 0;
  let failCount = 0;

  console.log(`\n📷 Generating thumbnails for ${maps.length} maps...\n`);

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    console.log(`[${i + 1}/${maps.length}] ${map.title}`);

    const success = await processMap(page, supabase, map);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay between maps to avoid rate limiting
    if (i < maps.length - 1) {
      await page.waitForTimeout(500);
    }
  }

  // Cleanup
  await browser.close();

  // Summary
  console.log('\n================================');
  console.log('📊 Summary');
  console.log('================================');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📋 Total: ${maps.length}`);
  console.log('================================\n');
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
