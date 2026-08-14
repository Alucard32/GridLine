/**
 * No-op network layer for local preview without a real Supabase project.
 * Auth is treated as logged-out; queries return empty results immediately.
 */

import { isOfflinePreview } from '@/lib/utils/env';

export async function offlineFetch(
  input: RequestInfo | URL,
  _init?: RequestInit
): Promise<Response> {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  const jsonHeaders = { 'Content-Type': 'application/json' };

  if (url.includes('/auth/v1/')) {
    return new Response(
      JSON.stringify({ message: 'Offline preview — auth disabled' }),
      { status: 401, headers: jsonHeaders }
    );
  }

  return new Response(JSON.stringify([]), {
    status: 200,
    headers: {
      ...jsonHeaders,
      'Content-Range': '0-0/0',
    },
  });
}

export function getOfflineSupabaseOptions(): {
  global?: { fetch: typeof fetch };
  auth?: {
    persistSession: boolean;
    autoRefreshToken: boolean;
    detectSessionInUrl: boolean;
  };
} {
  if (!isOfflinePreview()) return {};

  return {
    global: { fetch: offlineFetch },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  };
}
