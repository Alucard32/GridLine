import { MetadataRoute } from 'next';
import { getRouteSlugs } from '@/lib/seo/routes';
import { getAllGiftSlugs } from '@/lib/seo/gifts';
import { getAllGuideSlugs } from '@/lib/seo/guides';

const BASE_URL = 'https://gridline.eu';

/**
 * Format date as YYYY-MM-DD for sitemap compatibility.
 * Google's sitemap parser doesn't handle milliseconds well,
 * so we use the simple date format instead of full ISO 8601.
 */
function formatSitemapDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a fixed date for static content (updated when content actually changes)
  // IMPORTANT: These dates must use the correct year (currently 2026). See CLAUDE.md sitemap rules.
  const staticContentDate = formatSitemapDate(new Date('2026-01-20'));
  const routeContentDate = formatSitemapDate(new Date('2026-01-15'));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: staticContentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/create`,
      lastModified: staticContentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/feed`,
      lastModified: staticContentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: staticContentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: staticContentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: staticContentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: staticContentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Race landing pages (marathons)
  const raceSlugs = getRouteSlugs('race');
  const racePages: MetadataRoute.Sitemap = raceSlugs.map((slug) => ({
    url: `${BASE_URL}/race/${slug}`,
    lastModified: routeContentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Trail landing pages (hiking trails)
  const trailSlugs = getRouteSlugs('trail');
  const trailPages: MetadataRoute.Sitemap = trailSlugs.map((slug) => ({
    url: `${BASE_URL}/trail/${slug}`,
    lastModified: routeContentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Cycling landing pages (Tour de France stages, etc.)
  const cyclingSlugs = getRouteSlugs('cycling');
  const cyclingPages: MetadataRoute.Sitemap = cyclingSlugs.map((slug) => ({
    url: `${BASE_URL}/cycling/${slug}`,
    lastModified: routeContentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Gift landing pages
  const giftContentDate = formatSitemapDate(new Date('2026-02-07'));
  const giftSlugs = getAllGiftSlugs();
  const giftPages: MetadataRoute.Sitemap = giftSlugs.map((slug) => ({
    url: `${BASE_URL}/gift/${slug}`,
    lastModified: giftContentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Guide landing pages
  const guideSlugs = getAllGuideSlugs();
  const guidePages: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${BASE_URL}/guide/${slug}`,
    lastModified: giftContentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...racePages,
    ...trailPages,
    ...cyclingPages,
    ...giftPages,
    ...guidePages,
  ];
}
