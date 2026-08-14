import { updateSession } from '@/lib/supabase/middleware';
import { isOfflinePreview } from '@/lib/utils/env';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (isOfflinePreview()) {
    return NextResponse.next();
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (must be accessible without auth for Google/Bing crawlers)
     * - robots.txt (must be accessible without auth for crawlers)
     * - public folder (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

