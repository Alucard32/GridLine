import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRouteBySlug, getRelatedRoutes } from '@/lib/seo/routes';
import { getFAQsForRoute, generateFAQSchema, generateProductSchema } from '@/lib/seo/faqContent';
import { CyclingLandingPageClient } from './CyclingLandingPageClient';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Fetch the seeded map data from Supabase to get the thumbnail URL
 */
async function getMapThumbnail(mapTitle: string): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from('maps')
      .select('thumbnail_url')
      .eq('is_featured', true)
      .ilike('title', `%${mapTitle}%`)
      .single();

    return (data as { thumbnail_url: string | null } | null)?.thumbnail_url || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug, 'cycling');

  if (!route) {
    return { title: 'Stage Not Found' };
  }

  const thumbnailUrl = await getMapThumbnail(route.mapTitle);

  return {
    title: `${route.name} Poster | Custom Map Art | GridLine`,
    description: `Create a beautiful ${route.name} poster. ${route.distance}km through ${route.region}. Perfect gift for cycling fans. Customize colors, download in high resolution.`,
    keywords: [
      `${route.name} poster`,
      `Tour de France poster`,
      `${route.name} map`,
      'cycling route poster',
      'Tour de France gift',
      'cycling wall art',
    ],
    openGraph: {
      title: `${route.name} Poster`,
      description: `Turn the ${route.name} into stunning wall art`,
      type: 'website',
      url: `https://gridline.eu/cycling/${route.slug}`,
      images: thumbnailUrl ? [{ url: thumbnailUrl, width: 800, height: 1067 }] : undefined,
    },
    alternates: {
      canonical: `https://gridline.eu/cycling/${route.slug}`,
    },
  };
}

export default async function CyclingPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getRouteBySlug(slug, 'cycling');

  if (!route) {
    notFound();
  }

  const faqs = getFAQsForRoute(route);
  const relatedRoutes = getRelatedRoutes(slug, 'cycling', 3);
  const faqSchema = generateFAQSchema(faqs);
  const productSchema = generateProductSchema(route);
  const thumbnailUrl = await getMapThumbnail(route.mapTitle);

  return (
    <CyclingLandingPageClient
      route={route}
      faqs={faqs}
      relatedRoutes={relatedRoutes}
      faqSchema={faqSchema}
      productSchema={productSchema}
      thumbnailUrl={thumbnailUrl}
    />
  );
}

// Generate static paths for all cycling routes
export async function generateStaticParams() {
  const { getRouteSlugs } = await import('@/lib/seo/routes');
  const slugs = getRouteSlugs('cycling');

  return slugs.map((slug) => ({ slug }));
}
