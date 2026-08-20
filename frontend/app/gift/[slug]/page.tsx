import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGiftPageBySlug, getAllGiftSlugs } from '@/lib/seo/gifts';
import { GiftLandingPageClient } from './GiftLandingPageClient';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface RouteThumbnail {
  url: string;
  title: string;
}

async function getFeaturedThumbnails(count: number = 6): Promise<RouteThumbnail[]> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from('maps')
      .select('thumbnail_url, title')
      .eq('is_featured', true)
      .not('thumbnail_url', 'is', null)
      .limit(30);

    if (!data) return [];

    const shuffled = (data as { thumbnail_url: string; title: string }[])
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(m => ({ url: m.thumbnail_url, title: m.title }));

    return shuffled;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gift = getGiftPageBySlug(slug);

  if (!gift) {
    return { title: 'Gift Not Found' };
  }

  return {
    title: gift.metaTitle,
    description: gift.metaDescription,
    keywords: gift.keywords,
    openGraph: {
      title: gift.metaTitle,
      description: gift.metaDescription,
      type: 'website',
      url: `https://gridline.eu/gift/${gift.slug}`,
    },
    alternates: {
      canonical: `https://gridline.eu/gift/${gift.slug}`,
    },
  };
}

export default async function GiftPage({ params }: PageProps) {
  const { slug } = await params;
  const gift = getGiftPageBySlug(slug);

  if (!gift) {
    notFound();
  }

  const thumbnails = await getFeaturedThumbnails(6);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: gift.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${gift.title} - Custom Route Poster`,
    description: gift.metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'GridLine',
    },
    offers: {
      '@type': 'Offer',
      price: '12.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://gridline.eu/gift/${gift.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://gridline.eu',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gift Ideas',
        item: 'https://gridline.eu/gift',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: gift.title,
        item: `https://gridline.eu/gift/${gift.slug}`,
      },
    ],
  };

  return (
    <GiftLandingPageClient
      gift={gift}
      faqSchema={faqSchema}
      productSchema={productSchema}
      breadcrumbSchema={breadcrumbSchema}
      thumbnails={thumbnails}
    />
  );
}

export async function generateStaticParams() {
  const slugs = getAllGiftSlugs();
  return slugs.map((slug) => ({ slug }));
}
