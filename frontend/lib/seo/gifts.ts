/**
 * Gift Page Data
 * Source of truth for /gift/[slug] landing pages
 */

import type { GiftPageMetadata, GiftAudience } from '@/types/seo';

export const giftPages: GiftPageMetadata[] = [
  // ============================================
  // GIFT PAGE 1: Marathon Finisher
  // ============================================
  {
    slug: 'marathon-finisher',
    title: 'The Perfect Gift for a Marathon Finisher',
    subtitle:
      'More than a medal. A piece of art that tells the whole story.',
    intro:
      "Finishing a marathon is months of early mornings, long runs, and quiet determination distilled into a single extraordinary day. A custom route poster captures every kilometre of that journey and turns it into wall art worth framing. Whether they ran Boston, Berlin, or their hometown 42K, this is the gift that says I know what you accomplished.",
    ctaText: 'Create Their Gift Now',

    whyCards: [
      {
        title: 'Personal, Not Generic',
        description:
          'Forget another pair of running socks. A route poster features their exact course, their city, their distance — a one-of-a-kind piece they will never find in a shop.',
        icon: 'heart',
      },
      {
        title: 'Ready in Minutes',
        description:
          'Choose the route, pick a style, and download instantly. No waiting for shipping, no risk of the wrong size. Print it yourself or at any local print shop.',
        icon: 'zap',
      },
      {
        title: 'Built to Last',
        description:
          'While race medals collect dust in a drawer, a framed poster becomes part of their home. A daily reminder of what they achieved, displayed where everyone can see it.',
        icon: 'sparkles',
      },
    ],

    featuredRoutes: [
      {
        name: 'Boston 42K Route',
        description:
          'The iconic point-to-point from Hopkinton to Boylston Street. Heartbreak Hill and all.',
        slug: 'boston-marathon',
        category: 'race',
      },
      {
        name: 'Berlin 42K Route',
        description:
          'The fastest course in the world. Flat, fast, and finishing at the Brandenburg Gate.',
        slug: 'berlin-marathon',
        category: 'race',
      },
      {
        name: 'New York City 42K Route',
        description:
          'Five boroughs, one unforgettable finish in Central Park.',
        slug: 'new-york-city-marathon',
        category: 'race',
      },
      {
        name: 'London 42K Route',
        description:
          'Tower Bridge, the Thames, and a finish on The Mall. A course through centuries of history.',
        slug: 'london-marathon',
        category: 'race',
      },
      {
        name: 'Tokyo 42K Route',
        description:
          'From Shinjuku through the Imperial Palace gardens. Precision, tradition, and electric crowd support.',
        slug: 'tokyo-marathon',
        category: 'race',
      },
      {
        name: 'Chicago 42K Route',
        description:
          'A fast, flat loop through the heart of the city. The marathon with the best skyline views.',
        slug: 'chicago-marathon',
        category: 'race',
      },
    ],

    personalizationHeading: 'Make It Theirs',
    personalizationText:
      "Every poster is fully customisable. Add their finish time and the date they ran. Import their exact GPS data from Strava to show the path they actually took — not just the official course. Choose from 11 map styles and 15+ colour palettes to match their taste. From minimalist black-and-white to rich topographic detail, the design is as personal as the achievement.",

    steps: [
      {
        title: 'Choose Their Route',
        description:
          'Select from famous marathon courses worldwide, or import their Strava activity for the exact path they ran. You can also upload a GPX file.',
      },
      {
        title: 'Personalise It',
        description:
          'Add their name, finish time, and date. Pick from 11 map styles and 15+ colour palettes. Adjust typography, route colour, and line style.',
      },
      {
        title: 'Gift It',
        description:
          'Download instantly as a high-resolution PNG ready for professional printing. Print it at any shop, frame it, and watch their face when they unwrap it.',
      },
    ],

    pricingText:
      'Starting at EUR 12 for a high-resolution digital download. No subscription. No hidden fees. Print at any size, at any shop, anywhere in the world.',

    faqs: [
      {
        question: 'How long does it take to create a poster?',
        answer:
          'About 5 minutes. Choose a route, customise the design, and download. It is genuinely that quick.',
      },
      {
        question: 'Can they add their own Strava data later?',
        answer:
          'Yes. You can gift them a poster using the official race route, and they can always re-create it later with their own GPS data from Strava for a fully personalised version.',
      },
      {
        question: 'What sizes can they print it at?',
        answer:
          'The download is a high-resolution PNG (up to 7200x10800 pixels at 300 DPI). That supports any print size from A4 up to 24x36 inches with perfect clarity.',
      },
      {
        question: 'Is this a physical poster or a digital download?',
        answer:
          'It is a digital download. You get a print-ready PNG file that you can take to any print shop or print at home. Instant delivery and no risk of damage.',
      },
      {
        question: 'What about the 3D sculpture option?',
        answer:
          'For something truly unique, you can export a 3D sculpture STL file (from EUR 29) that shows the route with real terrain elevation. They can 3D print it as a physical desk piece.',
      },
    ],

    finalCTA: {
      heading: 'They Earned 42 Kilometres. Give Them Art Worth Framing.',
      subtext:
        'Free to design and preview. Starting at EUR 12. Takes about 5 minutes.',
      buttonText: 'Create a Marathon Gift',
    },

    metaTitle: 'Marathon Finisher Gifts — Custom Route Posters | GridLine',
    metaDescription:
      'Celebrate their 26.2 miles with a personalised marathon route poster. Import from Strava, choose from 11 styles. Digital download from EUR 12.',
    keywords: [
      'marathon gift',
      'gift for marathon runner',
      'marathon finisher gift',
      'marathon poster',
      'running gift',
    ],
  },

  // ============================================
  // GIFT PAGE 2: Trail Runner
  // ============================================
  {
    slug: 'trail-runner',
    title: 'Gifts for Trail Runners and Hikers',
    subtitle: 'For the ones who go where the pavement ends.',
    intro:
      "Trail runners and hikers do not chase finish lines — they chase ridgelines, alpine passes, and that feeling when the trail breaks above the treeline. A custom route poster captures the terrain, elevation, and raw beauty of their favourite adventure and turns it into something they can hang on their wall.",
    ctaText: 'Create Their Gift Now',

    whyCards: [
      {
        title: 'Terrain That Tells the Story',
        description:
          'Enable 3D terrain to show the actual mountains, valleys, and ridgelines they crossed. Or choose a topographic style with contour lines for that authentic cartographic feel.',
        icon: 'mountain',
      },
      {
        title: 'Any Trail, Anywhere',
        description:
          'From the Camino de Santiago to a local forest loop. Import their GPS data from Strava, upload a GPX file, or draw the route directly on the map.',
        icon: 'globe',
      },
      {
        title: 'More Than a Flat Map',
        description:
          'The 3D sculpture option (STL file) recreates their trail with real elevation data. A physical, tangible piece of the mountain they can hold in their hands.',
        icon: 'box',
      },
    ],

    featuredRoutes: [
      {
        name: 'Tour du Mont Blanc',
        description:
          "170km circling Western Europe's highest peak through France, Italy, and Switzerland.",
        slug: 'tour-du-mont-blanc',
        category: 'trail',
      },
      {
        name: 'Camino de Santiago',
        description:
          '800km across northern Spain. The pilgrimage walk that changes perspectives.',
        slug: 'camino-de-santiago',
        category: 'trail',
      },
      {
        name: 'GR20 Corsica',
        description:
          "180km through the mountains of Corsica. Europe's toughest long-distance trail.",
        slug: 'gr20-corsica',
        category: 'trail',
      },
      {
        name: 'West Highland Way',
        description:
          '154km from Milngavie to Fort William through the Scottish Highlands.',
        slug: 'west-highland-way',
        category: 'trail',
      },
    ],

    personalizationHeading: 'Their Trail, Their Way',
    personalizationText:
      'Every trail is unique, and every poster should be too. Import their GPS data from any device — Garmin, Suunto, Coros, or Strava. Enable 3D terrain to bring the elevation to life. Choose from outdoor, topographic, or satellite styles that showcase the landscape. Add the trail name, date, and total distance.',

    steps: [
      {
        title: 'Choose Their Trail',
        description:
          'Select from famous trails worldwide, or import their GPS data from Strava or upload a GPX file from any device.',
      },
      {
        title: 'Show the Terrain',
        description:
          'Enable 3D terrain or topographic contour lines. Choose from outdoor, satellite, or minimalist styles. Adjust the route colour to complement the landscape.',
      },
      {
        title: 'Gift It',
        description:
          'Download as a high-resolution poster or export a 3D sculpture STL file. Frame it, print it, or 3D print it — the adventure deserves all three.',
      },
    ],

    pricingText:
      'High-resolution poster download from EUR 12. 3D terrain sculpture from EUR 29. Free to design — pay only when it is ready to download.',

    faqs: [
      {
        question: 'Can I create a poster for a multi-day hike?',
        answer:
          'Yes. Import the full route as a single GPX file. For multi-day hikes logged as separate activities, merge them using a free GPX merger tool before uploading.',
      },
      {
        question: 'Does it show the elevation and terrain?',
        answer:
          'Yes. Enable 3D terrain to see mountains and valleys, or choose the topographic style for contour lines. The 3D sculpture option creates a physical model with real elevation data.',
      },
      {
        question: 'What GPS devices are supported?',
        answer:
          'Any device that exports GPX files: Garmin, Suunto, Coros, Polar, Apple Watch (via third-party apps), Komoot, AllTrails, and more. You can also import directly from Strava.',
      },
      {
        question: 'Which map style works best for trails?',
        answer:
          'The Outdoor style shows natural colours and terrain shading. Topographic adds contour lines. Satellite shows real aerial imagery. Preview all 11 styles in the editor.',
      },
      {
        question: 'Can I create a poster for a section of a longer trail?',
        answer:
          'Absolutely. Import only the section you completed, or adjust the map view in the editor to focus on a specific portion of the route.',
      },
    ],

    finalCTA: {
      heading: 'The Mountains Are Not Going Anywhere. But the Memory Deserves a Frame.',
      subtext:
        'From EUR 12. Import from Strava or GPX. 3D sculptures from EUR 29.',
      buttonText: 'Create a Trail Gift',
    },

    metaTitle: 'Trail Runner & Hiker Gifts — Route Map Posters | GridLine',
    metaDescription:
      'Custom trail and hiking route posters with 3D terrain. Import from Strava or GPX. 11 map styles. Digital download from EUR 12.',
    keywords: [
      'trail runner gift',
      'hiking gift',
      'outdoor gift',
      'trail map poster',
      'hiker gift ideas',
    ],
  },

  // ============================================
  // GIFT PAGE 3: Cyclist
  // ============================================
  {
    slug: 'cyclist',
    title: 'The Perfect Gift for a Cyclist',
    subtitle:
      'For the one who measures life in kilometres and vertical metres.',
    intro:
      "Cyclists remember routes the way other people remember songs — the gradient of a climb, the descent that took their breath away, the ride that pushed them past what they thought was possible. A custom route poster captures that ride in meticulous cartographic detail: the exact route, the elevation, the terrain.",
    ctaText: 'Create Their Gift Now',

    whyCards: [
      {
        title: 'Data Meets Art',
        description:
          'Cyclists love data. A route poster combines that precision — distance, elevation gain, exact GPS coordinates — with design that belongs in a gallery.',
        icon: 'target',
      },
      {
        title: 'Import Directly from Strava',
        description:
          'Connect their Strava account to import the exact ride. Every turn, every climb, every detour rendered on the map in their chosen style.',
        icon: 'link',
      },
      {
        title: 'From Iconic Climbs to Local Loops',
        description:
          'Whether it is Mont Ventoux, a century ride, or their favourite Sunday route — any ride, any distance, any terrain.',
        icon: 'route',
      },
    ],

    featuredRoutes: [
      {
        name: 'Mont Ventoux Cycling Route',
        description:
          'The Beast of Provence. 21km and 1,912m of climbing to the lunar summit.',
        slug: 'mont-ventoux-cycling-route',
        category: 'cycling',
      },
      {
        name: "Alpe d'Huez Cycling Route",
        description:
          '21 legendary hairpin bends. The most famous climb in professional cycling.',
        slug: 'alpe-dhuez-cycling-route',
        category: 'cycling',
      },
      {
        name: 'Stelvio Pass Cycling Route',
        description:
          '48 hairpins and 1,808m of elevation gain through the Italian Alps.',
        slug: 'stelvio-pass-cycling-route',
        category: 'cycling',
      },
      {
        name: 'Col du Galibier Cycling Route',
        description:
          '2,642m above sea level. The rooftop of the Alps and a monument to endurance.',
        slug: 'col-du-galibier-cycling-route',
        category: 'cycling',
      },
    ],

    personalizationHeading: 'Their Ride, Down to the Last Metre',
    personalizationText:
      "Cyclists notice details. The poster editor delivers them: import their Strava ride for GPS-accurate route rendering, add their time and date, choose from minimalist, dark, or satellite styles. Adjust route colour, width, and line style. Enable 3D terrain to show every climb and descent in relief.",

    steps: [
      {
        title: 'Choose Their Ride',
        description:
          'Select an iconic climb from our catalogue or import their Strava activity for any ride. Upload a GPX file from Garmin, Wahoo, or any cycling computer.',
      },
      {
        title: 'Design Their Poster',
        description:
          'Choose from minimalist, dark, or satellite styles that cyclists love. Add their name, ride date, and stats. Fine-tune route colour, line width, and palette.',
      },
      {
        title: 'Gift It',
        description:
          'Download as a high-resolution file ready for professional printing. They will want it next to the bike — guaranteed.',
      },
    ],

    pricingText:
      'High-resolution poster download from EUR 12. 3D terrain sculpture from EUR 29. Free to design — they only pay to download.',

    faqs: [
      {
        question: 'Can I import a ride from their Strava account?',
        answer:
          'If you have access to their Strava, you can connect it directly. Alternatively, create the poster with a famous route and they can swap in their own data later.',
      },
      {
        question: 'Does it show climbing data and elevation?',
        answer:
          'Yes. Route statistics include total distance and elevation gain. Enable 3D terrain to show climbs and descents directly on the map.',
      },
      {
        question: 'What about multi-day cycling trips?',
        answer:
          'Import the full route as a single GPX file, or create separate posters for each stage. Some cyclists build a gallery wall with one poster per stage.',
      },
      {
        question: 'Which map style works best for cycling posters?',
        answer:
          'Minimalist and Dark styles are popular with cyclists — clean backgrounds that make the route line stand out. Satellite is dramatic for mountain routes.',
      },
      {
        question: 'Can I add multiple routes to one poster?',
        answer:
          'The editor supports one route per poster. For multi-route displays, create separate posters in complementary styles and arrange them as a gallery wall.',
      },
    ],

    finalCTA: {
      heading: 'Every Great Ride Deserves More Than a Strava Screenshot.',
      subtext: 'From EUR 12. Import from Strava. 11 map styles to choose from.',
      buttonText: 'Create a Cycling Gift',
    },

    metaTitle: 'Gifts for Cyclists — Custom Route Map Posters | GridLine',
    metaDescription:
      'Custom cycling route posters from Strava or GPX. Mont Ventoux, Alpe d\'Huez, or any ride. 11 styles. Digital download from EUR 12.',
    keywords: [
      'cycling gift',
      'gift for cyclist',
      'bike gift',
      'cycling route poster',
      'cyclist gift ideas',
    ],
  },

  // ============================================
  // GIFT PAGE 4: First Marathon
  // ============================================
  {
    slug: 'first-marathon',
    title: 'Celebrate Their First Marathon',
    subtitle:
      '42.195 kilometres they will never forget. Give them art that does it justice.',
    intro:
      'A first marathon is not just a race — it is a before-and-after moment. Months of training, doubt, and determination, all leading to the extraordinary act of crossing that finish line for the very first time. A custom route poster captures that once-in-a-lifetime achievement.',
    ctaText: 'Create Their Gift Now',

    whyCards: [
      {
        title: 'A Once-in-a-Lifetime Moment',
        description:
          'You only run your first marathon once. A custom poster ensures that moment stays vivid — not just as a memory, but as a piece of art on their wall.',
        icon: 'trophy',
      },
      {
        title: 'Add Their Time and Story',
        description:
          'Their finish time, the date, the city. Every detail that made their first marathon theirs. Import from Strava for the exact path they ran.',
        icon: 'timer',
      },
      {
        title: 'The Gift They Will Talk About',
        description:
          'This is the gift that makes them stop, point at the wall, and tell the whole story. Every visitor will hear about that day.',
        icon: 'heart',
      },
    ],

    featuredRoutes: [
      {
        name: 'Boston 42K Route',
        description: 'The qualifying marathon. A poster for those who earned their place.',
        slug: 'boston-marathon',
        category: 'race',
      },
      {
        name: 'Berlin 42K Route',
        description: 'Where world records are set. A flat, fast first marathon favourite.',
        slug: 'berlin-marathon',
        category: 'race',
      },
      {
        name: 'London 42K Route',
        description: 'Past Tower Bridge and Buckingham Palace. Iconic landmarks, iconic achievement.',
        slug: 'london-marathon',
        category: 'race',
      },
      {
        name: 'Copenhagen 42K Route',
        description: 'Through the Danish capital. A scenic first marathon choice.',
        slug: 'copenhagen-marathon',
        category: 'race',
      },
    ],

    personalizationHeading: 'Their First. Their Story.',
    personalizationText:
      "A first marathon deserves more than a generic poster. Add their finish time — however fast or slow, it is their time and it matters. Include the date, the city name, a personal message. Import their GPS data from Strava so the poster shows exactly where they ran, not just the official course. Every customisation makes it more theirs.",

    steps: [
      {
        title: 'Choose Their Marathon',
        description:
          'Select from famous marathon routes or import their exact Strava activity. Any marathon, any city, any course.',
      },
      {
        title: 'Add Their Details',
        description:
          'Finish time, date, name — the details that make this first marathon theirs. Choose a style and palette that suits their taste.',
      },
      {
        title: 'Gift the Moment',
        description:
          'Download and print. Frame it before you wrap it for maximum impact. Or send them the link to customise it themselves.',
      },
    ],

    pricingText:
      'From EUR 12 for a print-ready digital download. The 3D sculpture option starts at EUR 29 — a physical piece of their first 42K.',

    faqs: [
      {
        question: 'What if I do not know which marathon they ran?',
        answer:
          'You can create the poster with any city location and they can swap in their specific route data later using Strava. Or gift them a link to the editor.',
      },
      {
        question: 'Can I add a personal message to the poster?',
        answer:
          'Yes. The text editor lets you add any custom text — their name, a congratulatory message, a quote, their finish time. Position it anywhere on the poster.',
      },
      {
        question: 'Is this suitable as a last-minute gift?',
        answer:
          'Perfect for it. The entire process takes about 5 minutes and the download is instant. Print it same-day at a local shop or send the digital file.',
      },
      {
        question: 'What if they want to change the design later?',
        answer:
          'They can always return to the editor, adjust the style, colours, or text, and download a new version. No limits on re-creating.',
      },
      {
        question: 'Do you have any marathon route?',
        answer:
          'We have famous marathon routes pre-loaded, plus the ability to import any GPS data from Strava or GPX files. If they ran it, we can map it.',
      },
    ],

    finalCTA: {
      heading: 'Their First Marathon Only Happens Once. Make It Permanent.',
      subtext: 'From EUR 12. Free to design. Takes about 5 minutes.',
      buttonText: 'Create a First Marathon Gift',
    },

    metaTitle: 'First Marathon Gifts — Personalised Route Posters | GridLine',
    metaDescription:
      'Celebrate their first marathon with a custom route poster. Add their finish time and Strava data. 11 styles. Digital download from EUR 12.',
    keywords: [
      'first marathon gift',
      'first marathon celebration',
      'marathon gift idea',
      'first 42k gift',
      'new marathon runner gift',
    ],
  },

  // ============================================
  // GIFT PAGE 5: Personal Best
  // ============================================
  {
    slug: 'personal-best',
    title: 'Celebrate a Personal Best',
    subtitle: 'They just ran the race of their life. This is how you honour it.',
    intro:
      "A personal best is not luck. It is the accumulation of every extra rep, every early alarm, every run in the rain that other people skipped. When someone you know smashes their PB, they deserve more than a congratulatory text. A custom route poster turns that breakthrough performance into permanent wall art.",
    ctaText: 'Create Their Gift Now',

    whyCards: [
      {
        title: 'The Time That Changed Everything',
        description:
          'That PB time is burned into their memory. Put it on the wall where they can see it every day — a reminder of what they are capable of.',
        icon: 'timer',
      },
      {
        title: 'Their Exact Route, Their Exact Data',
        description:
          'Import from Strava to show the precise GPS track of their personal best. The poster does not just show a course — it shows their course.',
        icon: 'target',
      },
      {
        title: 'Motivation for the Next One',
        description:
          'A PB poster on the wall is a daily reminder: you did this once, you can do it again. And next time, you will be even faster.',
        icon: 'sparkles',
      },
    ],

    featuredRoutes: [
      {
        name: 'Berlin 42K Route',
        description: 'The fastest marathon course in the world. Where PBs are born.',
        slug: 'berlin-marathon',
        category: 'race',
      },
      {
        name: 'London 42K Route',
        description: 'A flat, fast course through iconic landmarks. PB territory.',
        slug: 'london-marathon',
        category: 'race',
      },
      {
        name: 'Valencia 42K Route',
        description: 'The Spanish speedway. Consistently one of the fastest courses in Europe.',
        slug: 'valencia-marathon',
        category: 'race',
      },
    ],

    personalizationHeading: 'The PB Poster',
    personalizationText:
      "Make the time the hero. The text editor lets you display their PB time prominently — large, bold, unmissable. Add the date, the distance, the race name. Import their Strava data for the exact GPS route of their personal best. Choose a style that lets the numbers speak: minimalist for clean data display, dark for dramatic contrast.",

    steps: [
      {
        title: 'Import Their PB Run',
        description:
          'Connect Strava and select the activity, or upload the GPX file. Their exact GPS route from the day they broke through.',
      },
      {
        title: 'Make the Time the Hero',
        description:
          'Add their PB time in large, bold typography. Include the date, distance, and race name. Choose a style that lets the numbers shine.',
      },
      {
        title: 'Gift It',
        description:
          'Download in high resolution and print. This poster belongs somewhere they will see it every morning before their next run.',
      },
    ],

    pricingText:
      'From EUR 12. A permanent reminder of what they achieved, for less than a pair of race-day socks.',

    faqs: [
      {
        question: 'Can I create this for any distance PB?',
        answer:
          'Yes. 5K, 10K, half marathon, marathon, ultra — any distance. Import the GPS data from Strava or upload a GPX file for any PB run.',
      },
      {
        question: 'How do I make the finish time prominent?',
        answer:
          'Use the text editor to add their time as the main title or subtitle. Choose a large font size and position it prominently. The monospace font option gives times a clean, data-dashboard look.',
      },
      {
        question: 'What if they ran a PB on a training run, not a race?',
        answer:
          'No problem. Import any Strava activity or GPX file — training runs, parkruns, time trials. If they ran it, you can poster it.',
      },
      {
        question: 'Can I include their previous PB for comparison?',
        answer:
          'Use the custom text field to add a subtitle like "Previous: 3:45:12 → New: 3:38:04". The text is fully customisable.',
      },
      {
        question: 'Is this good for parkrun PBs too?',
        answer:
          'Perfect for parkrun PBs. Import their Strava data or draw the parkrun course using the route builder. A weekly 5K PB is just as worth celebrating.',
      },
    ],

    finalCTA: {
      heading:
        'A PB Deserves More Than a Screenshot. Put It on the Wall.',
      subtext: 'From EUR 12. Strava import. 5 minutes to create.',
      buttonText: 'Create a PB Gift',
    },

    metaTitle: 'Personal Best Gifts — PB Route Posters | GridLine',
    metaDescription:
      'Celebrate a running PB with a custom route poster. Import from Strava, display their time. 11 styles. Digital download from EUR 12.',
    keywords: [
      'personal best gift',
      'PB gift runner',
      'PR gift runner',
      'running PB celebration',
      'personal record gift',
    ],
  },
];

// ============================================
// Helper functions
// ============================================

export function getGiftPageBySlug(slug: string): GiftPageMetadata | undefined {
  return giftPages.find((g) => g.slug === slug);
}

export function getAllGiftSlugs(): GiftAudience[] {
  return giftPages.map((g) => g.slug);
}

export function getRelatedGiftPages(
  currentSlug: string,
  limit = 2
): GiftPageMetadata[] {
  return giftPages.filter((g) => g.slug !== currentSlug).slice(0, limit);
}
