import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getMapById } from '@/lib/actions/maps';
import { getComments } from '@/lib/actions/comments';
import { getUserVote } from '@/lib/actions/votes';
import { MapDetailView } from '@/components/map/MapDetailView';
import type { PosterConfig } from '@/types/poster';

interface MapDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for social sharing
export async function generateMetadata({ params }: MapDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const supabase = await createClient();

  const { data: mapData } = await supabase
    .from('maps')
    .select(`
      id,
      title,
      subtitle,
      thumbnail_url,
      sculpture_thumbnail_url,
      product_type,
      profiles!maps_user_id_fkey (
        username,
        display_name
      )
    `)
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (!mapData) {
    return {
      title: 'Map Not Found | GridLine',
    };
  }

  // Type assertion for the map data with profiles
  const map = mapData as {
    id: string;
    title: string;
    subtitle: string | null;
    thumbnail_url: string | null;
    sculpture_thumbnail_url: string | null;
    product_type: 'poster' | 'sculpture';
    profiles: { username: string; display_name: string | null };
  };

  const author = map.profiles;
  const authorName = author.display_name || author.username;
  const productType = map.product_type === 'sculpture' ? 'Journey Sculpture' : 'Adventure Print';
  const description = map.subtitle
    ? `${map.subtitle} - A ${productType} by ${authorName}`
    : `A ${productType} by ${authorName} on GridLine`;

  // Use the OG image API route
  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://gridline.eu'}/api/og/map/${id}`;

  return {
    title: `${map.title} | GridLine`,
    description,
    openGraph: {
      title: map.title,
      description,
      type: 'article',
      siteName: 'GridLine',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: map.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: map.title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function MapDetailPage({ params }: MapDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const map = await getMapById(id);

  if (!map) {
    notFound();
  }

  // Only published maps are accessible to non-owners
  if (!map.is_published && map.user_id !== user?.id) {
    redirect('/login?redirect=/map/' + id);
  }

  const [comments, userVote] = await Promise.all([
    getComments(id),
    user ? getUserVote(id) : Promise.resolve(null),
  ]);

  return (
    <MapDetailView
      map={map}
      comments={comments}
      userVote={userVote}
      isOwner={user?.id === map.user_id}
      isAuthenticated={!!user}
    />
  );
}
