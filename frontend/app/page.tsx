import { LandingPage } from '@/components/landing';
import { createClient } from '@/lib/supabase/server';

interface RouteThumbnail {
  url: string;
  title: string;
}

/**
 * Fetch random featured route thumbnails for the landing page
 */
async function getFeaturedThumbnails(count: number = 9): Promise<RouteThumbnail[]> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from('maps')
      .select('thumbnail_url, title')
      .eq('is_featured', true)
      .not('thumbnail_url', 'is', null)
      .limit(30);

    if (!data) return [];

    // Shuffle and take requested count
    const shuffled = (data as { thumbnail_url: string; title: string }[])
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(m => ({ url: m.thumbnail_url, title: m.title }));

    return shuffled;
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredThumbnails = await getFeaturedThumbnails(9);

  return (
    <LandingPage
      featuredThumbnails={featuredThumbnails}
    />
  );
}
