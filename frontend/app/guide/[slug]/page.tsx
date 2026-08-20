import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGuidePageBySlug, getAllGuideSlugs } from '@/lib/seo/guides';
import { GuideLandingPageClient } from './GuideLandingPageClient';
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
  const guide = getGuidePageBySlug(slug);

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    keywords: guide.keywords,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: 'article',
      url: `https://gridline.eu/guide/${guide.slug}`,
    },
    alternates: {
      canonical: `https://gridline.eu/guide/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuidePageBySlug(slug);

  if (!guide) {
    notFound();
  }

  const thumbnails = await getFeaturedThumbnails(6);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.intro,
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
    tool: [
      { '@type': 'HowToTool', name: 'Web browser' },
      { '@type': 'HowToTool', name: 'GridLine editor (gridline.eu/create)' },
    ],
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
        name: 'Guides',
        item: 'https://gridline.eu/guide',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.title,
        item: `https://gridline.eu/guide/${guide.slug}`,
      },
    ],
  };

  return (
    <GuideLandingPageClient
      guide={guide}
      faqSchema={faqSchema}
      howToSchema={howToSchema}
      breadcrumbSchema={breadcrumbSchema}
      thumbnails={thumbnails}
    />
  );
}

export async function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}
