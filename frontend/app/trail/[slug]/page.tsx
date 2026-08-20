import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRouteBySlug, getRelatedRoutes } from '@/lib/seo/routes';
import { getFAQsForRoute, generateFAQSchema, generateProductSchema } from '@/lib/seo/faqContent';
import { TrailLandingPageClient } from './TrailLandingPageClient';
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
  const route = getRouteBySlug(slug, 'trail');

  if (!route) {
    return { title: 'Trail Not Found' };
  }

  const thumbnailUrl = await getMapThumbnail(route.mapTitle);

  return {
    title: `${route.name} Trail Poster | Custom Map Art | GridLine`,
    description: `Create a beautiful ${route.name} poster. ${route.distance}km through ${route.country}. Perfect gift for hikers. Customize colors, download in high resolution.`,
    keywords: [
      `${route.name} poster`,
      `${route.name} gift`,
      `${route.name} map`,
      'hiking trail poster',
      'trail map art',
      'hiking gift',
    ],
    openGraph: {
      title: `${route.name} Trail Poster`,
      description: `Turn your ${route.name} adventure into stunning wall art`,
      type: 'website',
      url: `https://gridline.eu/trail/${route.slug}`,
      images: thumbnailUrl ? [{ url: thumbnailUrl, width: 800, height: 1067 }] : undefined,
    },
    alternates: {
      canonical: `https://gridline.eu/trail/${route.slug}`,
    },
  };
}

export default async function TrailPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getRouteBySlug(slug, 'trail');

  if (!route) {
    notFound();
  }

  const faqs = getFAQsForRoute(route);
  const relatedRoutes = getRelatedRoutes(slug, 'trail', 3);
  const faqSchema = generateFAQSchema(faqs);
  const productSchema = generateProductSchema(route);
  const thumbnailUrl = await getMapThumbnail(route.mapTitle);

  return (
    <TrailLandingPageClient
      route={route}
      faqs={faqs}
      relatedRoutes={relatedRoutes}
      faqSchema={faqSchema}
      productSchema={productSchema}
      thumbnailUrl={thumbnailUrl}
    />
  );
}

// Generate static paths for all trail routes
export async function generateStaticParams() {
  const { getRouteSlugs } = await import('@/lib/seo/routes');
  const slugs = getRouteSlugs('trail');

  return slugs.map((slug) => ({ slug }));
}
