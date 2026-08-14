/**
 * API Usage Tracker
 *
 * Tracks API requests to external tile providers (MapTiler, OpenFreeMap, etc.)
 * Uses in-memory batching with periodic flushes to minimize database writes.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Define the api_usage row type directly to avoid complex Database type inference issues
interface ApiUsageRow {
  id: string;
  source: string;
  date: string;
  request_count: number;
  tilejson_count: number;
  error_count: number;
  created_at: string;
  updated_at: string;
}

interface ApiUsageInsert {
  source: string;
  date: string;
  request_count?: number;
  tilejson_count?: number;
  error_count?: number;
}

interface ApiUsageUpdate {
  request_count?: number;
  tilejson_count?: number;
  error_count?: number;
  updated_at?: string;
}

// Track requests in memory, flush periodically
interface UsageCounter {
  requests: number;
  tilejson: number;
  errors: number;
}

// In-memory counters: { 'maptiler:2024-01-15': { requests: 100, tilejson: 2, errors: 5 } }
const counters: Map<string, UsageCounter> = new Map();

// Flush interval in ms (30 seconds for development, could increase in production)
const FLUSH_INTERVAL_MS = 30_000;

// Track if flush is scheduled
let flushTimeout: NodeJS.Timeout | null = null;

/**
 * Get today's date in YYYY-MM-DD format
 */
function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Create a direct Supabase client for edge runtime compatibility
 */
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || process.env.NEXT_PUBLIC_OFFLINE_PREVIEW === 'true' || url.includes('placeholder.supabase.co')) {
    return null;
  }

  return createClient(url, key);
}

/**
 * Log an API request (fire-and-forget)
 */
export function trackApiRequest(
  source: string,
  options: { isTileJson?: boolean; isError?: boolean } = {}
): void {
  const date = getToday();
  const key = `${source}:${date}`;

  const counter = counters.get(key) || { requests: 0, tilejson: 0, errors: 0 };

  counter.requests += 1;
  if (options.isTileJson) counter.tilejson += 1;
  if (options.isError) counter.errors += 1;

  counters.set(key, counter);

  // Schedule flush if not already scheduled
  scheduleFlush();
}

/**
 * Schedule a flush to the database
 */
function scheduleFlush(): void {
  if (flushTimeout) return;

  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushToDatabase().catch((err) => {
      logger.error('Failed to flush API usage to database:', err);
    });
  }, FLUSH_INTERVAL_MS);
}

/**
 * Flush counters to database using upsert with increment
 */
async function flushToDatabase(): Promise<void> {
  if (counters.size === 0) return;

  const supabase = getSupabaseClient();
  if (!supabase) {
    logger.warn('Supabase not configured, skipping API usage flush');
    return;
  }

  // Take a snapshot and clear counters
  const snapshot = new Map(counters);
  counters.clear();

  for (const [key, counter] of snapshot) {
    const [source, date] = key.split(':');

    try {
      // Try to update existing row first
      const { data: existing } = await supabase
        .from('api_usage')
        .select('id, request_count, tilejson_count, error_count')
        .eq('source', source)
        .eq('date', date)
        .single<ApiUsageRow>();

      if (existing) {
        // Update existing row by incrementing counts
        const updateData: ApiUsageUpdate = {
          request_count: existing.request_count + counter.requests,
          tilejson_count: existing.tilejson_count + counter.tilejson,
          error_count: existing.error_count + counter.errors,
          updated_at: new Date().toISOString(),
        };
        await supabase
          .from('api_usage')
          .update(updateData)
          .eq('id', existing.id);
      } else {
        // Insert new row
        const insertData: ApiUsageInsert = {
          source,
          date,
          request_count: counter.requests,
          tilejson_count: counter.tilejson,
          error_count: counter.errors,
        };
        await supabase.from('api_usage').insert(insertData);
      }
    } catch (err) {
      logger.error(`Failed to save API usage for ${key}:`, err);
      // Put the counter back so we don't lose data
      const existing = counters.get(key) || { requests: 0, tilejson: 0, errors: 0 };
      counters.set(key, {
        requests: existing.requests + counter.requests,
        tilejson: existing.tilejson + counter.tilejson,
        errors: existing.errors + counter.errors,
      });
    }
  }
}

/**
 * Force flush (for cleanup/shutdown)
 */
export async function forceFlush(): Promise<void> {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
  await flushToDatabase();
}

/**
 * Get current in-memory counts (for debugging)
 */
export function getCurrentCounts(): Record<string, UsageCounter> {
  return Object.fromEntries(counters);
}
