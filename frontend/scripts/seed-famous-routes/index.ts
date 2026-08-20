#!/usr/bin/env npx tsx
/**
 * Famous Routes Seeding Script
 *
 * Seeds the GridLine database with iconic hiking, cycling, and running routes.
 * Run with: pnpm seed:routes
 *
 * Options:
 *   --dry-run       Preview what would be inserted without writing to DB
 *   --category      Filter by category (cycling, hiking, running, ultra)
 *   --limit         Maximum routes to seed
 *   --direct-only   Only seed routes with direct GPX URLs (most reliable)
 *   --verbose       Enable verbose logging
 */

import { log, validateConfig } from './config';
import { allRoutes, getDirectGpxRoutes, getRoutesByCategory, getRouteCounts } from './data/routes';
import { fetchDirectGPXWithRetry } from './fetchers/direct-gpx';
import { fetchGoAndRaceWithRetry } from './fetchers/goandrace';
import { parseGPX, validateRouteData } from './utils/gpx-parser';
import { buildPosterConfig } from './utils/poster-builder';
import { insertRoute, getSeedStats, type InsertOptions } from './utils/db-insert';
import { shuffleArray, getRandomTemplate, addTemplateVariation } from './utils/randomization';
import type { RouteEntry, SeedResult, SeedOptions } from './types';

// Parse command line arguments
function parseArgs(): SeedOptions {
  const args = process.argv.slice(2);

  const options: SeedOptions = {
    dryRun: args.includes('--dry-run'),
    directOnly: args.includes('--direct-only'),
    verbose: args.includes('--verbose'),
    useRandomUser: true,
    useRandomDate: true,
    daysBackRange: 60,
  };

  // Parse --category=value
  const categoryArg = args.find(a => a.startsWith('--category='));
  if (categoryArg) {
    options.category = categoryArg.split('=')[1] as RouteEntry['category'];
  }

  // Parse --limit=value
  const limitArg = args.find(a => a.startsWith('--limit='));
  if (limitArg) {
    options.limit = parseInt(limitArg.split('=')[1], 10);
  }

  return options;
}

async function seedRoute(
  entry: RouteEntry,
  insertOptions: InsertOptions
): Promise<SeedResult> {
  const routeId = entry.id;

  try {
    log('info', `Processing: ${entry.name}`);

    // 1. Fetch GPX
    let gpxContent: string;
    if (entry.gpxSource.type === 'direct') {
      const fetchResult = await fetchDirectGPXWithRetry(
        entry.gpxSource.url,
        entry.gpxSource.fallbackUrl
      );

      if (!fetchResult.success || !fetchResult.gpxContent) {
        return {
          routeId,
          success: false,
          error: fetchResult.error || 'Failed to fetch GPX',
        };
      }
      gpxContent = fetchResult.gpxContent;
    } else if (entry.gpxSource.type === 'scrape') {
      // Handle goandrace.com and similar scraped sources
      const scrapeResult = await fetchGoAndRaceWithRetry(
        entry.gpxSource.url,
        entry.name
      );

      if (!scrapeResult.success || !scrapeResult.gpxContent) {
        return {
          routeId,
          success: false,
          error: scrapeResult.error || 'Failed to fetch GPX from scraped source',
        };
      }
      gpxContent = scrapeResult.gpxContent;
    } else {
      // Skip other source types (api, manual)
      return {
        routeId,
        success: false,
        error: `GPX source type '${entry.gpxSource.type}' not yet implemented`,
      };
    }

    // 2. Parse GPX
    const routeData = parseGPX(gpxContent);
    if (!validateRouteData(routeData)) {
      return {
        routeId,
        success: false,
        error: 'Invalid route data from GPX',
      };
    }

    log('info', `  → Parsed: ${(routeData.stats.distance / 1000).toFixed(1)}km, ${routeData.points.length} points`);

    // 3. Get template with randomization
    const baseTemplate = getRandomTemplate(entry.category, entry.template);
    const template = addTemplateVariation(baseTemplate);

    // 4. Build poster config
    const posterConfig = buildPosterConfig(entry, routeData, template);

    // 5. Generate map title (used for display)
    const mapTitle = entry.shortName || entry.name;

    // 6. Insert into database
    const result = await insertRoute(entry, posterConfig, mapTitle, insertOptions);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    log('error', `Error seeding ${routeId}: ${message}`);
    return {
      routeId,
      success: false,
      error: message,
    };
  }
}

async function main() {
  console.log('\n🗺️  Famous Routes Seeding Script\n');
  console.log('=' .repeat(50));

  // Validate configuration
  const configValid = validateConfig();
  if (!configValid) {
    process.exit(1);
  }

  // Parse options
  const options = parseArgs();

  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No database writes will occur\n');
  }

  // Get routes to process
  let routes: RouteEntry[];

  if (options.directOnly) {
    routes = getDirectGpxRoutes();
    console.log('📍 Direct GPX sources only');
  } else if (options.category) {
    routes = getRoutesByCategory(options.category);
    console.log(`📍 Category: ${options.category}`);
  } else {
    routes = allRoutes;
  }

  // Apply limit
  if (options.limit && options.limit > 0) {
    routes = routes.slice(0, options.limit);
    console.log(`📍 Limit: ${options.limit} routes`);
  }

  // Shuffle for natural-looking feed
  routes = shuffleArray(routes);

  // Show route counts
  const counts = getRouteCounts();
  console.log('\n📊 Route Catalog:');
  for (const [category, count] of Object.entries(counts)) {
    console.log(`   ${category}: ${count} routes`);
  }
  console.log(`   Total to process: ${routes.length} routes\n`);

  // Show current database stats
  if (!options.dryRun) {
    const stats = await getSeedStats();
    console.log('📊 Current Database:');
    console.log(`   Total maps: ${stats.totalMaps}`);
    console.log(`   Featured: ${stats.featuredMaps}`);
    console.log(`   Published: ${stats.publishedMaps}\n`);
  }

  console.log('=' .repeat(50));
  console.log('Starting seed process...\n');

  // Process routes
  const insertOptions: InsertOptions = {
    dryRun: options.dryRun,
    useRandomUser: options.useRandomUser,
    useRandomDate: options.useRandomDate,
    daysBackRange: options.daysBackRange,
  };

  const results: SeedResult[] = [];
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const progress = `[${i + 1}/${routes.length}]`;

    console.log(`${progress} ${route.name}`);

    const result = await seedRoute(route, insertOptions);
    results.push(result);

    if (result.success) {
      successCount++;
      log('success', `  ✓ Inserted (ID: ${result.mapId})`);
    } else if (result.error?.includes('already exists') || result.error?.includes('Skipped')) {
      skipCount++;
      log('info', `  ⊘ Skipped: ${result.error}`);
    } else {
      failCount++;
      log('error', `  ✗ Failed: ${result.error}`);
    }

    // Small delay between routes to avoid rate limiting
    if (i < routes.length - 1) {
      await delay(200);
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Seed Summary:\n');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ⊘ Skipped: ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📍 Total processed: ${routes.length}`);

  if (!options.dryRun && successCount > 0) {
    const newStats = await getSeedStats();
    console.log('\n📊 Updated Database:');
    console.log(`   Total maps: ${newStats.totalMaps}`);
    console.log(`   Featured: ${newStats.featuredMaps}`);
    console.log(`   Published: ${newStats.publishedMaps}`);
  }

  // Log failures for debugging
  const failures = results.filter(r => !r.success && !r.error?.includes('exists') && !r.error?.includes('Skipped'));
  if (failures.length > 0) {
    console.log('\n⚠️  Failed routes:');
    for (const failure of failures) {
      console.log(`   - ${failure.routeId}: ${failure.error}`);
    }
  }

  console.log('\n✨ Seed process complete!\n');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
