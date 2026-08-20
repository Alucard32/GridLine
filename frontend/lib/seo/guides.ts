/**
 * Guide Page Data
 * Source of truth for /guide/[slug] landing pages
 */

import type { GuidePageMetadata, GuideSlug } from '@/types/seo';

export const guidePages: GuidePageMetadata[] = [
  // ============================================
  // GUIDE 1: Strava to Poster
  // ============================================
  {
    slug: 'strava-to-poster',
    title: 'How to Turn a Strava Activity Into a Poster',
    subtitle: 'From Strava to your wall in under 5 minutes.',
    intro:
      "You have logged hundreds of activities on Strava. Somewhere in that list is the run that changed everything, the ride you will never forget, or the hike that made you fall in love with a trail. GridLine connects directly to your Strava account and turns any activity into a high-resolution poster you can print and frame.",
    ctaText: 'Connect Strava and Start',

    steps: [
      {
        title: 'Open the Editor',
        description:
          'Go to gridline.eu/create. The editor loads with an interactive map ready for your route.',
        tip: 'No account required to start designing. You only need to sign in when you connect Strava.',
      },
      {
        title: 'Connect Your Strava Account',
        description:
          'Click "Import from Strava" and authorise the connection. GridLine requests read-only access to your activities — it cannot modify your Strava data.',
        tip: 'The connection is one-time. Once authorised, your activities load instantly on future visits.',
      },
      {
        title: 'Select Your Activity',
        description:
          'Browse your recent activities and select the one you want to turn into a poster. Your GPS route, distance, and elevation data are imported automatically.',
      },
      {
        title: 'Choose Your Map Style',
        description:
          'Browse all 11 map styles: minimalist, dark, outdoor, satellite, topographic, and more. Each one completely transforms the look of your poster. Preview them in real time.',
        tip: 'Minimalist and Dark styles are the most popular for Strava imports — they let the route line take centre stage.',
      },
      {
        title: 'Customise the Design',
        description:
          'Select a colour palette, adjust the route colour and width, toggle map layers on or off. Add your activity name, distance, date, or any custom text.',
        tip: 'Use the monospace font for times and distances — it gives the numbers a clean, data-forward look.',
      },
      {
        title: 'Export and Print',
        description:
          'Download your poster as a high-resolution PNG (up to 7200x10800 pixels). Take it to any print shop for professional results, or print at home.',
      },
    ],

    tips: [
      {
        title: 'Best Styles for Running',
        description:
          'Minimalist for city routes, Outdoor for trail runs, Dark for dramatic night-run vibes.',
        icon: 'palette',
      },
      {
        title: 'Privacy Zone',
        description:
          'Enable the privacy zone to obscure the start/end of your route near your home.',
        icon: 'eye',
      },
      {
        title: '3D Sculpture Option',
        description:
          'Switch to the Sculpture tab to generate a 3D model with terrain elevation from your Strava route.',
        icon: 'layers',
      },
      {
        title: 'Gallery Wall Idea',
        description:
          'Create posters for your top 3-4 activities in the same style and palette. Frame them together.',
        icon: 'sparkles',
      },
    ],

    faqs: [
      {
        question: 'Is my Strava data safe?',
        answer:
          'Yes. GridLine requests read-only access. It cannot modify your Strava data, post on your behalf, or access private information beyond your activity routes.',
      },
      {
        question: 'Can I disconnect Strava later?',
        answer:
          'Yes. Go to your account settings and click "Disconnect Strava". The connection is removed immediately.',
      },
      {
        question: 'What if my Strava activity is set to private?',
        answer:
          'Private activities are visible to you when connected. The poster is created locally — your route data is not shared publicly unless you choose to publish it.',
      },
      {
        question: 'Can I use Strava for cycling and hiking too?',
        answer:
          'Absolutely. Any Strava activity type works: running, cycling, hiking, walking, swimming routes — anything with GPS data.',
      },
      {
        question: 'Do I need a Strava premium account?',
        answer:
          'No. The free Strava account works perfectly. GridLine only needs access to your activity GPS data, which is available on all accounts.',
      },
    ],

    finalCTA: {
      heading: 'Your Best Strava Activity Deserves a Frame.',
      subtext: 'Connect, select, customise, download. From EUR 12.',
      buttonText: 'Connect Strava and Start',
    },

    metaTitle: 'How to Turn a Strava Activity Into a Poster | GridLine',
    metaDescription:
      'Connect Strava, select an activity, and create a custom route poster in 5 minutes. 11 map styles. High-res download from EUR 12.',
    keywords: [
      'strava poster',
      'strava to poster',
      'strava art',
      'strava print',
      'strava route poster',
    ],
  },

  // ============================================
  // GUIDE 2: GPX to Poster
  // ============================================
  {
    slug: 'gpx-to-poster',
    title: 'How to Create a Poster from a GPX File',
    subtitle: 'Any GPS device. Any route. One stunning poster.',
    intro:
      "A GPX file is a universal GPS data format that nearly every running watch, cycling computer, and outdoor app can export. If you have a GPX file, you have everything you need to create a custom route poster. Upload it to GridLine, choose a style, and download a print-ready poster in minutes.",
    ctaText: 'Upload Your GPX File',

    steps: [
      {
        title: 'Export Your GPX File',
        description:
          'Export a GPX file from your device or app: Garmin Connect, Suunto, Coros, Komoot, AllTrails, Strava (via export), or any platform that records GPS data.',
        tip: 'Most apps have an "Export GPX" option in the activity details. On Garmin Connect, it is under the gear icon on any activity page.',
      },
      {
        title: 'Open the Editor',
        description:
          'Go to gridline.eu/create and click the route upload button. Select your GPX file from your device. The route appears on the map within seconds.',
      },
      {
        title: 'Position the Map',
        description:
          'The editor auto-centres on your route. Adjust the zoom, bearing, and pitch to frame the route at its best. Try different orientations — portrait for north-south routes, landscape for east-west.',
        tip: 'For long-distance routes (100km+), use a thinner line width so the route does not overwhelm the map at wider zoom levels.',
      },
      {
        title: 'Choose Style and Palette',
        description:
          'Browse 11 map styles and 15+ colour palettes. Each combination creates a different mood. Preview them all in real time before committing.',
      },
      {
        title: 'Add Text and Details',
        description:
          'Add the route name, distance, date, elevation gain, or any personal text. Choose fonts, adjust sizing, and position the text to complement the map layout.',
        tip: 'Place text in areas with less visual complexity — water bodies, parks, or open areas make clean backdrops for typography.',
      },
      {
        title: 'Export and Print',
        description:
          'Download as a high-resolution PNG (up to 7200x10800px for 24x36" at 300 DPI) or export an STL file for 3D printing. Take the file to any print shop.',
      },
    ],

    tips: [
      {
        title: 'Merge Multi-File Routes',
        description:
          'For multi-day hikes logged as separate GPX files, combine them using a free GPX merger tool before uploading.',
        icon: 'layers',
      },
      {
        title: 'Clean Your Data',
        description:
          'GPS tracks from tunnels or dense tree cover can have noise. Most GPX editors can smooth out erratic points.',
        icon: 'target',
      },
      {
        title: 'Try Different Orientations',
        description:
          'Portrait for north-south routes, landscape for east-west. Try both to see which composition feels stronger.',
        icon: 'palette',
      },
      {
        title: 'Layer Options Matter',
        description:
          'Toggle streets, buildings, water, and parks to control detail. Sometimes less is more.',
        icon: 'eye',
      },
    ],

    faqs: [
      {
        question: 'What GPS devices and apps export GPX files?',
        answer:
          'Nearly all of them. Garmin, Suunto, Coros, Polar, Komoot, AllTrails, Strava (via export), MapMyRun, Relive, and many more.',
      },
      {
        question: 'Can I upload multiple GPX files for one poster?',
        answer:
          'The editor accepts one GPX file per route. For multi-file adventures, merge your files first using a free tool like GPX Merger.',
      },
      {
        question: 'What if my GPX file has no elevation data?',
        answer:
          'GridLine can fetch elevation data from terrain sources for your route coordinates. Your poster and 3D sculpture will still show accurate terrain.',
      },
      {
        question: 'Is there a file size limit?',
        answer:
          'The editor handles GPX files with thousands of track points without issue. Even ultra-distance routes with dense GPS logging work smoothly.',
      },
      {
        question: 'Do I need a Strava account?',
        answer:
          'No. GPX upload works independently. You can also draw routes directly on the map. Strava integration is an additional option, not a requirement.',
      },
    ],

    finalCTA: {
      heading: 'That GPX File on Your Computer Is a Poster Waiting to Happen.',
      subtext: 'Upload, customise, and download. From EUR 12. No account needed.',
      buttonText: 'Upload Your GPX File',
    },

    metaTitle: 'How to Create a Poster from a GPX File | GridLine',
    metaDescription:
      'Upload any GPX file and create a custom route poster. Works with Garmin, Suunto, Coros, Komoot. 11 styles. Download from EUR 12.',
    keywords: [
      'gpx poster',
      'gpx to poster',
      'gpx art',
      'gpx route map',
      'gpx print',
    ],
  },

  // ============================================
  // GUIDE 3: 3D Print Running Route
  // ============================================
  {
    slug: '3d-print-running-route',
    title: 'How to 3D Print Your Running Route',
    subtitle: 'Turn kilometres into something you can hold in your hands.',
    intro:
      "A poster hangs on the wall. A 3D sculpture sits on your desk, your shelf, or your mantelpiece — a physical, tactile piece of the terrain you ran across. GridLine generates STL files from real elevation data, creating a miniature landscape of your route. Upload to any 3D printing service or print on your own machine.",
    ctaText: 'Create Your 3D Route',

    steps: [
      {
        title: 'Import Your Route',
        description:
          'Open gridline.eu/create. Import from Strava, upload a GPX file, or select a famous route. Routes with significant elevation changes produce the most dramatic sculptures.',
        tip: 'Mountain runs, trail races, and hilly road routes create the most visually striking 3D models. Flat routes work too, but the terrain relief will be subtle.',
      },
      {
        title: 'Switch to Sculpture Mode',
        description:
          'Navigate to the 3D Sculpture tab. A real-time 3D preview of your route renders with actual terrain elevation data. The model updates as you make changes.',
      },
      {
        title: 'Choose Shape and Size',
        description:
          'Select a rectangular or circular base. Choose your model size: 10cm, 15cm, or 20cm.',
        tip: '15cm is a great default — large enough to show terrain detail, small enough for a desk or shelf.',
      },
      {
        title: 'Adjust the Terrain',
        description:
          'Fine-tune the terrain look. Adjust elevation scale, smoothing, resolution, and maximum height. Set the route to raised or engraved.',
        tip: 'For routes with extreme elevation (alpine trails), reduce the scale slightly so peaks do not dominate. For flatter routes, increase it.',
      },
      {
        title: 'Add Text (Optional)',
        description:
          'Engrave a title and subtitle into the base. Add the route name, distance, date, or a personal message. Adjust text depth for legibility.',
        tip: 'Keep text short and bold. Fine detail can be lost on smaller print sizes.',
      },
      {
        title: 'Export the STL File',
        description:
          'Export the STL file — the industry-standard format for 3D printing, compatible with every printer and service.',
      },
    ],

    tips: [
      {
        title: 'Print at Home',
        description:
          'Use Cura, PrusaSlicer, or BambuStudio. PLA filament at 0.2mm layer height gives a good balance of detail and speed.',
        icon: 'zap',
      },
      {
        title: 'Use a Printing Service',
        description:
          'Upload to Shapeways, Craftcloud, or a local bureau. Materials range from PLA to resin, wood-fill, and metal.',
        icon: 'layers',
      },
      {
        title: 'Two-Colour Printing',
        description:
          'Print the base in one colour and the route in another using dual extrusion. The raised route style works well for this.',
        icon: 'palette',
      },
      {
        title: 'Post-Processing',
        description:
          'Light sanding and matte spray paint gives a gallery-quality finish. White base with coloured route is a classic look.',
        icon: 'sparkles',
      },
    ],

    faqs: [
      {
        question: 'Do I need a 3D printer?',
        answer:
          'No. Upload the STL to any online 3D printing service (Shapeways, Craftcloud, or local bureaus) and receive a finished sculpture by post.',
      },
      {
        question: 'What material should I print in?',
        answer:
          'PLA is the most popular and affordable. For premium feel, try resin (smoother) or wood-fill PLA (natural texture). Metal printing is available through some services.',
      },
      {
        question: 'How much detail will the model show?',
        answer:
          'At maximum resolution, individual hills, ridgelines, and valleys are clearly visible. The route line is a distinct raised or engraved path across the terrain.',
      },
      {
        question: 'Can I 3D print a flat city marathon route?',
        answer:
          'Yes, but terrain relief will be subtle. Increase the elevation scale to make gentle undulations visible, or focus on a section with more variation.',
      },
      {
        question: 'How much does the STL file cost?',
        answer:
          '3D sculpture exports start at EUR 29. The cost of printing depends on your chosen service and material — typically EUR 15-50 for a 15cm PLA print.',
      },
    ],

    finalCTA: {
      heading:
        'Your Route Exists in Three Dimensions. Now Your Art Can Too.',
      subtext: 'Real elevation data. Print-ready STL. From EUR 29.',
      buttonText: 'Create Your 3D Sculpture',
    },

    metaTitle: 'How to 3D Print Your Running Route | GridLine',
    metaDescription:
      'Create a 3D sculpture of your running route with real terrain elevation. STL export for any 3D printer. From EUR 29.',
    keywords: [
      '3d print route',
      '3d print running route',
      'running sculpture',
      '3d printed running route',
      'route sculpture STL',
    ],
  },

  // ============================================
  // GUIDE 4: Custom Running Map
  // ============================================
  {
    slug: 'custom-running-map',
    title: 'How to Create a Custom Running Map Poster',
    subtitle: 'Your route. Your style. Your wall.',
    intro:
      "Whether it is a race you finished, a training run you loved, or a route you designed yourself, GridLine turns any running route into a high-resolution map poster. No design skills needed. Import from Strava, upload a GPX file, or draw the route directly on an interactive map.",
    ctaText: 'Start Creating',

    steps: [
      {
        title: 'Start with Your Route',
        description:
          'Open gridline.eu/create and choose how to add your route: connect Strava, upload a GPX file, or draw directly on the map with automatic road snapping.',
        tip: 'The route builder is perfect if you do not have GPS data. Click waypoints and the route follows roads and paths automatically.',
      },
      {
        title: 'Set Your Location',
        description:
          'Search for any city or location to centre the map. If you imported a route, the map auto-centres on your GPS track.',
      },
      {
        title: 'Choose Your Map Style',
        description:
          'Browse all 11 map styles. Each one completely transforms the look: Minimalist, Dark, Outdoor, Satellite, Topographic, and 6 more.',
      },
      {
        title: 'Select a Colour Palette',
        description:
          'Each style supports 15+ colour palettes. Warm earth tones, cool blues, classic black-and-white, vibrant neons — preview each one instantly.',
      },
      {
        title: 'Style Your Route Line',
        description:
          'Adjust the route colour, line width, and line style (solid, dashed, dotted). Toggle start and end markers. Enable the privacy zone if needed.',
      },
      {
        title: 'Add Text and Details',
        description:
          'Add a title, subtitle, finish time, date, distance, elevation gain. Position the text, choose fonts, and adjust sizing.',
        tip: 'Place text in areas with less visual complexity — water bodies and parks make clean backdrops.',
      },
      {
        title: 'Export in High Resolution',
        description:
          'Choose your aspect ratio and size. Download at 300 DPI, ready for any print shop. Maximum resolution: 7200x10800 pixels.',
      },
    ],

    tips: [
      {
        title: 'Adjust Map Layers',
        description:
          'Toggle streets, buildings, water, and parks. For route-focused posters, turn off buildings and labels.',
        icon: 'layers',
      },
      {
        title: 'Use 3D Terrain',
        description:
          'Enable terrain visualisation for hilly routes. The 3D buildings option adds skyline detail for city runs.',
        icon: 'eye',
      },
      {
        title: 'Frame It Right',
        description:
          'Print on matte or satin paper (200gsm+). A simple black or white frame keeps focus on the map.',
        icon: 'target',
      },
      {
        title: 'Gallery Wall',
        description:
          'Create posters for your favourite races in the same style and palette for a cohesive display.',
        icon: 'sparkles',
      },
    ],

    faqs: [
      {
        question: 'Do I need GPS data to create a poster?',
        answer:
          'No. Draw any route on the map using the built-in route builder. Click waypoints and the route snaps to roads automatically.',
      },
      {
        question: 'What is the difference between Strava import and GPX upload?',
        answer:
          'Same result — your GPS route on the map. Strava import is faster (one click), GPX upload supports data from any device or platform.',
      },
      {
        question: 'Can I create a poster for a planned future route?',
        answer:
          'Absolutely. Use the route builder to draw your planned route, or upload a GPX from a route planning app. Great motivation before race day.',
      },
      {
        question: 'How do print shops handle the file?',
        answer:
          'The PNG file is universally supported. Upload to any online print service or local shop and select your size. 300 DPI ensures sharp results.',
      },
      {
        question: 'Can I edit my poster after downloading?',
        answer:
          'The PNG is a flat image. To make changes, return to the editor, adjust your design, and download a new version. No limits.',
      },
    ],

    finalCTA: {
      heading: 'Every Run Tells a Story. Turn Yours Into Art.',
      subtext: 'Draw, import, or upload. 11 styles, 15+ palettes. From EUR 12.',
      buttonText: 'Create Your Running Map Poster',
    },

    metaTitle: 'How to Create a Custom Running Map Poster | GridLine',
    metaDescription:
      'Create a custom running route poster from Strava, GPX, or hand-drawn routes. 11 map styles. High-res download from EUR 12.',
    keywords: [
      'custom running map',
      'running map poster',
      'custom route poster',
      'running route art',
      'personalised running map',
    ],
  },

  // ============================================
  // GUIDE 5: Cycling Route Poster
  // ============================================
  {
    slug: 'cycling-route-poster',
    title: 'How to Design a Cycling Route Poster',
    subtitle: "From Strava ride to gallery wall. A cyclist's guide.",
    intro:
      "You remember the climbs by gradient, the descents by speed, and the flat stretches by the wind direction. Every ride has a story, and a custom route poster tells it through the language cyclists understand best: the map. Import any ride from Strava or GPX, render it in 11 map styles, and export a print-ready poster.",
    ctaText: 'Start Designing',

    steps: [
      {
        title: 'Import Your Ride',
        description:
          'Open gridline.eu/create and import your cycling route. Connect Strava, upload a GPX from Garmin/Wahoo/Komoot, or draw directly with the cycling profile route builder.',
        tip: 'The cycling profile in the route builder snaps to roads and cycling paths, avoiding pedestrian-only shortcuts.',
      },
      {
        title: 'Frame the Route',
        description:
          'Position the map to show your ride at its best. Zoom in for a single climb to show switchbacks, zoom out for a century ride to capture the full loop.',
        tip: 'North-south routes look best in portrait. East-west routes suit landscape. Rotate the bearing for diagonal routes.',
      },
      {
        title: 'Choose a Style',
        description:
          'Cyclists favour clean, data-forward aesthetics. Popular choices: Minimalist (clean route line), Dark (bold contrast), Satellite (real terrain), Topographic (contour lines for climbs).',
      },
      {
        title: 'Customise the Route Line',
        description:
          'Choose a route colour that stands out. Set the width — medium (2-3px) shows the route clearly without overwhelming detail. Try dashed or solid line styles.',
      },
      {
        title: 'Add Your Ride Data',
        description:
          'Add route name, total distance, elevation gain, date, and your time. Use the monospace font for numbers for that data-dashboard precision.',
        tip: 'For iconic climbs, lead with elevation gain. For distance rides, lead with total kilometres.',
      },
      {
        title: 'Enable 3D Terrain (Optional)',
        description:
          'For mountain passes and hilly routes, enable 3D terrain to add topographic relief. A flat route line transforms into one that climbs across visible ridges.',
      },
      {
        title: 'Export and Print',
        description:
          'Download at up to 7200x10800 pixels (300 DPI). Print at any size from A4 to 24x36 inches. Matte or satin finish recommended.',
      },
    ],

    tips: [
      {
        title: 'Multi-Stage Rides',
        description:
          'Create a poster for each stage in the same style. Display them in sequence for a gallery wall that tells the whole tour.',
        icon: 'layers',
      },
      {
        title: '3D Sculpture',
        description:
          'Mountain passes and alpine routes look extraordinary as 3D sculptures with real terrain elevation. STL export from EUR 29.',
        icon: 'sparkles',
      },
      {
        title: 'Colour Coding',
        description:
          'Use team colours, bike colours, or classic route associations. Mont Ventoux in white, Stelvio in red.',
        icon: 'palette',
      },
      {
        title: 'Pair with Photos',
        description:
          'Frame your route poster next to a photo from the ride for a complete narrative display.',
        icon: 'target',
      },
    ],

    faqs: [
      {
        question: 'Can I import rides from Garmin, Wahoo, or other cycling computers?',
        answer:
          'Yes. Export a GPX file from Garmin Connect, Wahoo, or any platform, then upload it to GridLine. Takes seconds.',
      },
      {
        question: 'Does the poster show elevation gain?',
        answer:
          'Route statistics include total elevation gain. Display it as text, and enable 3D terrain to show climbing visually on the map.',
      },
      {
        question: 'Can I create a poster for a planned ride?',
        answer:
          'Absolutely. Use the route builder with cycling profile, or upload a GPX from Komoot or Ride with GPS. Great motivation before the ride.',
      },
      {
        question: 'What about group rides or sportives?',
        answer:
          'Import your individual GPS track for the most accurate representation. For official routes, draw the standard course using the route builder.',
      },
      {
        question: 'Is there a maximum route length?',
        answer:
          'No practical limit. Cyclists create posters for rides over 1,000km. The editor handles long routes smoothly with high-res export.',
      },
    ],

    finalCTA: {
      heading: 'That Ride Was Worth More Than a Strava Kudos. Frame It.',
      subtext:
        'Import from Strava or GPX. 11 styles, 15+ palettes. From EUR 12.',
      buttonText: 'Design Your Cycling Poster',
    },

    metaTitle: 'How to Design a Cycling Route Poster | GridLine',
    metaDescription:
      'Create a custom cycling route poster from Strava or GPX. Mont Ventoux, Alpe d\'Huez, or any ride. 11 styles. From EUR 12.',
    keywords: [
      'cycling route poster',
      'cycling art',
      'bike route poster',
      'cycling map poster',
      'strava cycling poster',
    ],
  },
];

// ============================================
// Helper functions
// ============================================

export function getGuidePageBySlug(slug: string): GuidePageMetadata | undefined {
  return guidePages.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): GuideSlug[] {
  return guidePages.map((g) => g.slug);
}

export function getRelatedGuidePages(
  currentSlug: string,
  limit = 3
): GuidePageMetadata[] {
  return guidePages.filter((g) => g.slug !== currentSlug).slice(0, limit);
}
