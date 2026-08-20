/**
 * FAQ Content Templates for SEO Landing Pages
 */

import type { FAQ, SEOCategory, SEORouteMetadata } from '@/types/seo';

/**
 * General FAQs that apply to all route types
 */
export const generalFAQs: FAQ[] = [
  {
    question: 'What file formats do I get?',
    answer:
      'You can download high-resolution PNG files for posters (up to 7200x10800px for 24x36" at 300 DPI) or STL files for 3D printing sculptures.',
  },
  {
    question: 'What resolutions are available?',
    answer:
      'We offer multiple export sizes from A4 up to 24x36 inches, all at print-quality 300 DPI resolution. Perfect for professional printing at any print shop.',
  },
  {
    question: 'Can I add my own GPS data?',
    answer:
      'Yes! You can import your own GPS data from Strava or upload a GPX file. This lets you create a poster with your exact route, including your personal finish time and date.',
  },
  {
    question: 'How do I import from Strava?',
    answer:
      'Connect your Strava account in the editor, then browse your activities and select the one you want to turn into a poster. Your route, distance, and elevation data are imported automatically.',
  },
  {
    question: "What's the difference between poster and sculpture?",
    answer:
      'Posters are 2D map art you can print and frame. Sculptures are 3D models (STL files) that show your route with terrain elevation—perfect for 3D printing a physical keepsake of your adventure.',
  },
  {
    question: 'Can I customize the design?',
    answer:
      'Absolutely! Choose from 11 map styles and 15+ color palettes. Customize typography, route colors, line styles, and add your personal details like finish time and date.',
  },
];

/**
 * Race/Marathon-specific FAQs
 */
export const raceFAQs: FAQ[] = [
  {
    question: 'Can I add my finish time to the poster?',
    answer:
      'Yes! The editor lets you add custom text including your finish time, date, and any personal message you want to commemorate your achievement.',
  },
  {
    question: 'Do you have the official race route?',
    answer:
      'We use GPS data from official race routes. You can also import your own GPS data from Strava to show your exact path during the race.',
  },
  {
    question: 'Is this a good gift for a marathon finisher?',
    answer:
      "It's the perfect gift! A custom route poster celebrates their achievement in a unique, personal way. You can use the official route or they can import their own Strava data later.",
  },
];

/**
 * Trail/Hiking-specific FAQs
 */
export const trailFAQs: FAQ[] = [
  {
    question: 'Can I create a poster for just one section?',
    answer:
      'Yes! You can import your own GPS data showing just the section you completed, or crop and adjust the map view in the editor to focus on specific portions.',
  },
  {
    question: "What's included in the elevation data?",
    answer:
      'The 3D sculpture option shows terrain elevation along your route. The poster can display elevation profile data, total ascent/descent, and terrain styling.',
  },
  {
    question: 'Is this suitable for thru-hikers?',
    answer:
      'Perfect for thru-hikers! Commemorate your entire journey or create separate posters for memorable sections. Many hikers create a poster for each major trail they complete.',
  },
];

/**
 * Cycling-specific FAQs
 */
export const cyclingFAQs: FAQ[] = [
  {
    question: 'Can I track my own ride on this route?',
    answer:
      'Yes! Import your Strava activity or GPX file to create a poster with your exact ride data, including your personal time and the date you rode.',
  },
  {
    question: 'Does it show climbing data?',
    answer:
      'Yes, the route statistics include total elevation gain. You can also enable terrain visualization to see the climbing profile visually on the map.',
  },
];

/**
 * Get FAQ list for a specific category
 */
export function getFAQsForCategory(category: SEOCategory): FAQ[] {
  const categoryFAQs =
    category === 'race'
      ? raceFAQs
      : category === 'trail'
        ? trailFAQs
        : cyclingFAQs;

  return [...categoryFAQs, ...generalFAQs];
}

/**
 * Get complete FAQ list for a route (category FAQs + route-specific FAQs)
 */
export function getFAQsForRoute(route: SEORouteMetadata): FAQ[] {
  const categoryFAQs = getFAQsForCategory(route.category);
  const routeFAQs = route.routeSpecificFAQs || [];

  // Route-specific FAQs first, then category FAQs
  return [...routeFAQs, ...categoryFAQs];
}

/**
 * Generate JSON-LD FAQ schema
 */
export function generateFAQSchema(faqs: FAQ[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Product JSON-LD schema for a route
 */
export function generateProductSchema(route: SEORouteMetadata): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${route.name} Route Poster`,
    description: route.description || `Custom map poster of the ${route.name}`,
    image: `https://gridline.eu/og/${route.category}/${route.slug}.png`,
    brand: {
      '@type': 'Brand',
      name: 'GridLine',
    },
    offers: {
      '@type': 'Offer',
      price: '29.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://gridline.eu/${route.category}/${route.slug}`,
    },
  };
}
