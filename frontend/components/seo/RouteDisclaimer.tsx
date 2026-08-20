'use client';

/**
 * Disclaimer component for SEO landing pages
 * Clarifies that GridLine is not affiliated with event organizers
 */
export function RouteDisclaimer() {
  return (
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-8 text-center max-w-2xl mx-auto">
      GridLine is an independent service and is not affiliated with, endorsed by, or
      connected to any race organizers, event companies, or trademark holders. Route
      data is sourced from publicly available GPS information. All trademarks and
      registered trademarks are the property of their respective owners.
    </p>
  );
}
