/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowLeft, ChevronDown } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'FAQ | GridLine',
  description: 'Frequently asked questions about GridLine - Get answers about creating map prints, Strava integration, and more.',
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqCategories: { title: string; icon: string; items: FAQItem[] }[] = [
  {
    title: 'Getting Started',
    icon: '🚀',
    items: [
      {
        question: 'What is GridLine?',
        answer: 'GridLine is a map creation platform that lets you turn your adventures into beautiful wall art. Create stunning prints from hiking trails, runs, bike rides, and travels with customizable styles, colors, and typography.',
      },
      {
        question: 'Do I need an account to use GridLine?',
        answer: 'You can explore the editor without an account, but you\'ll need to sign up to save your designs, publish to the community, and connect your Strava account.',
      },
      {
        question: 'Is GridLine free to use?',
        answer: 'Yes! GridLine is currently free to use. You can create and export high-resolution map prints at no cost. We may introduce premium features in the future.',
      },
    ],
  },
  {
    title: 'Creating Prints',
    icon: '🗺️',
    items: [
      {
        question: 'What map styles are available?',
        answer: 'GridLine offers 11 unique map styles including Classic, Minimal, Terrain, Satellite, Watercolor, Blueprint, and more. Each style comes with multiple color palettes to match your aesthetic.',
      },
      {
        question: 'Can I add my own routes to the map?',
        answer: 'Yes! You can upload GPX files from any GPS device or app. You can also connect your Strava account to import activities directly with one click.',
      },
      {
        question: 'What print sizes are supported?',
        answer: 'GridLine supports exports up to 24×36 inches at 300 DPI, perfect for large wall prints. We offer multiple aspect ratios including portrait, landscape, and square formats.',
      },
      {
        question: 'How do I download my design?',
        answer: 'Click the "Export" button in the editor to download a high-resolution PNG image. You can then print it at home or send it to your preferred print shop.',
      },
    ],
  },
  {
    title: 'Strava Integration',
    icon: '🏃',
    items: [
      {
        question: 'How do I connect my Strava account?',
        answer: 'Go to the editor and look for the Strava option in the route panel. Click "Connect Strava" and authorize GridLine to access your activities. We only request read-only access.',
      },
      {
        question: 'What Strava data does GridLine access?',
        answer: 'We only read your activity data (routes, distances, elevation) with read-only permissions. We never post, modify, or delete anything on your Strava account.',
      },
      {
        question: 'Can I disconnect my Strava account?',
        answer: 'Yes, you can disconnect your Strava account at any time from your profile settings or directly from Strava\'s connected apps settings.',
      },
    ],
  },
  {
    title: 'Technical',
    icon: '⚙️',
    items: [
      {
        question: 'What file formats can I upload?',
        answer: 'GridLine supports GPX files, which are the standard format for GPS track data. Most GPS devices and apps like Strava, Garmin Connect, and Komoot can export to GPX.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes. We use industry-standard encryption and security practices. Your data is stored securely in EU-based servers, and we never share your personal information with third parties.',
      },
      {
        question: 'What browsers are supported?',
        answer: 'GridLine works best on modern browsers like Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.',
      },
    ],
  },
  {
    title: 'Printing & Orders',
    icon: '🖨️',
    items: [
      {
        question: 'Do you offer printing services?',
        answer: 'Currently, GridLine provides the digital file for you to print yourself or through your preferred print service. We may offer integrated printing in the future.',
      },
      {
        question: 'What paper should I use for printing?',
        answer: 'For best results, we recommend premium matte or satin photo paper with a weight of at least 200gsm. Museum-quality fine art paper works great for a classic look.',
      },
      {
        question: 'Can I use my prints commercially?',
        answer: 'Personal use is always allowed. For commercial use (selling prints, using in products), please contact us to discuss licensing options.',
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  return (
    <details className="group">
      <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer list-none hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-lg transition-colors">
        <span className="font-medium text-stone-900 dark:text-white text-left">
          {item.question}
        </span>
        <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform flex-shrink-0" />
      </summary>
      <div className="px-4 pb-4 text-stone-600 dark:text-stone-400">
        {item.answer}
      </div>
    </details>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-stone-900 dark:text-white">
              GridLine
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-16 bg-gradient-to-b from-white to-stone-50 dark:from-stone-800/50 dark:to-stone-900 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-4xl mb-4">❓</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
            Everything you need to know about creating beautiful map prints with GridLine.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.title} className="bg-white dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                <div className="p-4 border-b border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50">
                  <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    {category.title}
                  </h2>
                </div>
                <div className="divide-y divide-stone-100 dark:divide-stone-700/50">
                  {category.items.map((item) => (
                    <FAQAccordion key={item.question} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 text-center p-8 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
            <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-4">
              We're here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:joceprod@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
