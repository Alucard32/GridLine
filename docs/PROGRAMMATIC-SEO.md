# GridLine - Programmatic SEO Strategy PRD

> Comprehensive specification for scalable SEO page generation targeting outdoor enthusiasts, athletes, and gift buyers.

**Created**: 2026-01-10
**Updated**: 2026-01-19
**Status**: Phase 1 Complete ✅
**Priority**: High (Growth Initiative)

**Related Documents**:

- [PRD-FAMOUS-ROUTES-SEEDING.md](./PRD-FAMOUS-ROUTES-SEEDING.md) - 100+ famous routes with GPX sources and fetch strategies

---

## Implementation Status

### Phase 1 Complete ✅ (January 2026)

**Implemented:**

- `/race/[slug]` - Marathon and running route landing pages
- `/trail/[slug]` - Hiking trail landing pages
- `/cycling/[slug]` - Cycling route landing pages
- Dynamic sitemap generation (`app/sitemap.ts`)
- JSON-LD structured data (FAQ schema)
- `RouteDisclaimer` component for trademark safety
- Trademark-safe naming convention in route catalog
- Route catalog in `lib/seo/routes.ts`

**Pages Live:** 41 routes across race, trail, and cycling categories

### Remaining Phases

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 2 | City map pages (~10,000) | Planned |
| Phase 3 | SEO optimization, A/B testing | Planned |
| Phase 4 | Gift guides, seasonal content | Planned |

---

## Executive Summary

Programmatic SEO creates thousands of targeted landing pages at scale, capturing long-tail search traffic from people actively searching for custom map posters, route prints, and personalized gifts.

### Why This Matters

| Metric | Opportunity |
|--------|-------------|
| Total addressable pages | ~11,000+ |
| Estimated monthly traffic | 50-100K visits at scale |
| Conversion potential | 2-5% on high-intent pages |
| Competitive moat | Strava + GPX + 3D = unique offering |

### GridLine's Unique Differentiators

Unlike competitors (Mapiful, Grafomap, MixPlaces), GridLine has:

- **Strava integration** → Direct route import (no competitor has this)
- **GPX upload** → Any activity source supported
- **3D terrain & buildings** → Unique visual appeal
- **European focus** (gridline.eu) → Local SEO advantage
- **Social features** → Community-generated content for SEO

---

## Page Architecture

### Overview

| Category | Page Count | Priority | Traffic Potential |
|----------|------------|----------|-------------------|
| City Maps | ~10,000 | Medium | High volume, competitive |
| Marathons & Races | ~500 | High | High intent, seasonal |
| Trails & Hikes | ~200 | High | High intent, evergreen |
| Cycling Routes | ~300 | High | Niche, high value |
| Triathlons | ~100 | Medium | Niche, premium |
| Gift Guides | ~50 | High | Bottom funnel |

---

## 1. City Map Pages (~10,000 pages)

### URL Structure
```
/map/[country]/[city]
/map/denmark/copenhagen
/map/germany/munich
/map/france/paris
/map/united-states/new-york
```

### Target Keywords
- `[City] map poster`
- `[City] street map print`
- `[City] city map wall art`
- `minimalist [City] map`
- `custom [City] map gift`

### Data Requirements

```typescript
interface City {
  slug: string;           // URL-safe identifier
  name: string;           // Display name
  country: string;        // Country slug
  countryName: string;    // Display country name
  lat: number;            // Center latitude
  lng: number;            // Center longitude
  population: number;     // For prioritization
  defaultZoom: number;    // Recommended zoom level
  hasLandmarks?: boolean; // Notable landmarks
  region?: string;        // State/province
}
```

### Page Template Structure

```
┌─────────────────────────────────────────┐
│ H1: [City] Map Poster                   │
│ Breadcrumb: Home > Maps > [Country]     │
├─────────────────────────────────────────┤
│ ┌─────────────┐  ┌───────────────────┐  │
│ │             │  │ Create Your Own   │  │
│ │ Map Preview │  │ [City] Map Poster │  │
│ │ (Interactive)  │                   │  │
│ │             │  │ • 11 styles       │  │
│ │             │  │ • 15+ palettes    │  │
│ └─────────────┘  │ • High-res export │  │
│                  │                   │  │
│                  │ [Create Now →]    │  │
│                  └───────────────────┘  │
├─────────────────────────────────────────┤
│ Style Gallery (9 style previews)        │
├─────────────────────────────────────────┤
│ About [City] (SEO content)              │
│ • Population, landmarks, neighborhoods  │
├─────────────────────────────────────────┤
│ FAQ Section (JSON-LD schema)            │
│ • How to create a [City] map poster?    │
│ • What sizes are available?             │
│ • Can I add my own route?               │
├─────────────────────────────────────────┤
│ Related Cities (internal links)         │
│ • Other cities in [Country]             │
│ • Popular cities worldwide              │
├─────────────────────────────────────────┤
│ Community Maps from [City]              │
│ (Published maps with this location)     │
└─────────────────────────────────────────┘
```

### SEO Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const city = getCityBySlug(params.country, params.city);

  return {
    title: `${city.name} Map Poster | Custom Street Map Print | GridLine`,
    description: `Create a beautiful custom ${city.name} map poster. Choose from 11 unique styles, add your own routes from Strava, and export in stunning high resolution. Perfect gift for ${city.name} lovers.`,
    keywords: [
      `${city.name} map poster`,
      `${city.name} street map print`,
      `custom ${city.name} map`,
      `${city.name} wall art`,
      `${city.name} city print`,
    ],
    openGraph: {
      title: `${city.name} Map Poster`,
      description: `Create your custom ${city.name} map poster with GridLine`,
      images: [`/og/cities/${params.country}/${params.city}.png`],
    },
    alternates: {
      canonical: `https://gridline.eu/map/${params.country}/${params.city}`,
    },
  };
}
```

### Priority Tiers

**Tier 1 (Launch with ~100 cities)**:
- European capitals
- Top 50 world cities by tourism
- Major Nordic cities (home market)

**Tier 2 (Expand to ~1,000 cities)**:
- All European cities >100K population
- US/Canada major metros
- Popular tourist destinations

**Tier 3 (Scale to ~10,000 cities)**:
- All cities >50K population globally
- College towns
- Adventure sport destinations

---

## 2. Marathon & Race Pages (~500 pages)

### URL Structure
```
/race/[slug]
/race/boston-marathon
/race/london-marathon
/race/berlin-marathon
/race/new-york-city-marathon
/race/chicago-marathon
```

### Target Keywords
- `[Race] route poster`
- `[Race] map print`
- `[Race] finish gift`
- `[Race] 2026 route map`
- `custom [Race] poster`
- `[Race] finisher gift`

### Data Requirements

```typescript
interface Race {
  slug: string;
  name: string;
  shortName?: string;      // "Boston" for "Boston Marathon"
  type: 'marathon' | 'half-marathon' | 'ultra' | '10k' | '5k' | 'trail';
  city: string;
  country: string;
  date: string;            // Next race date (YYYY-MM-DD)
  recurring: boolean;      // Annual event?
  website?: string;
  participants?: number;   // Annual participants
  founded?: number;        // Year established
  route: {
    gpxUrl?: string;       // Pre-loaded GPX file
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    distance: number;      // km
    elevationGain?: number;
  };
  tags: string[];          // ['world-major', 'flat', 'scenic', etc.]
}
```

### Pre-loaded Routes

For major marathons, provide pre-loaded GPX routes users can customize:

| Race | Priority | Route Available |
|------|----------|-----------------|
| Boston Marathon | P0 | ✅ Official route |
| London Marathon | P0 | ✅ Official route |
| Berlin Marathon | P0 | ✅ Official route |
| NYC Marathon | P0 | ✅ Official route |
| Chicago Marathon | P0 | ✅ Official route |
| Tokyo Marathon | P0 | ✅ Official route |
| Copenhagen Marathon | P0 | ✅ Home market |
| Paris Marathon | P1 | ✅ |
| Amsterdam Marathon | P1 | ✅ |
| Stockholm Marathon | P1 | ✅ |

### Page Template Structure

```
┌─────────────────────────────────────────┐
│ H1: [Race Name] Map Poster              │
│ Subhead: Celebrate Your [Year] Finish   │
├─────────────────────────────────────────┤
│ ┌─────────────┐  ┌───────────────────┐  │
│ │             │  │ Your [Race] Story │  │
│ │ Map Preview │  │                   │  │
│ │ with route  │  │ Options:          │  │
│ │ highlighted │  │ ○ Use official    │  │
│ │             │  │   route           │  │
│ │             │  │ ○ Upload your     │  │
│ └─────────────┘  │   Strava/GPX      │  │
│                  │                   │  │
│                  │ [Create Now →]    │  │
│                  └───────────────────┘  │
├─────────────────────────────────────────┤
│ Race Stats                              │
│ Distance: 42.195 km | Elevation: +120m  │
│ Next Race: April 20, 2026               │
├─────────────────────────────────────────┤
│ Style Options (route-optimized styles)  │
├─────────────────────────────────────────┤
│ Perfect Gift For                        │
│ • First-time finishers                  │
│ • PR celebrations                       │
│ • Running club members                  │
├─────────────────────────────────────────┤
│ FAQ Section                             │
│ • Can I use my own Strava data?         │
│ • What if I ran a different route?      │
│ • Do you ship internationally?          │
├─────────────────────────────────────────┤
│ Related Races                           │
│ • Other marathons in [Country]          │
│ • World Marathon Majors                 │
├─────────────────────────────────────────┤
│ Community: [Race] Finisher Maps         │
│ (User-generated content)                │
└─────────────────────────────────────────┘
```

### Seasonal SEO Strategy

Marathons have predictable traffic patterns:

| Timing | Strategy |
|--------|----------|
| 3 months before | "Training for [Race]" content |
| Race week | Peak traffic, "official route" focus |
| 1-2 weeks after | "Finisher gift" / "celebrate your [Race]" |
| Off-season | "Register for [Race] 2027" |

---

## 3. Trails & Hiking Routes (~200 pages)

### URL Structure
```
/trail/[slug]
/trail/camino-de-santiago
/trail/tour-du-mont-blanc
/trail/pacific-crest-trail
/trail/west-highland-way
/trail/kungsleden
```

### Target Keywords
- `[Trail] map poster`
- `[Trail] route print`
- `[Trail] completion gift`
- `[Trail] wall art`
- `thru-hike [Trail] poster`

### Data Requirements

```typescript
interface Trail {
  slug: string;
  name: string;
  alternateNames?: string[];  // Kungsleden = "King's Trail"
  type: 'thru-hike' | 'day-hike' | 'multi-day' | 'loop';
  countries: string[];
  distance: number;           // km
  elevationGain: number;
  typicalDays: number;
  difficulty: 'easy' | 'moderate' | 'difficult' | 'expert';
  bestSeason: string[];
  route: {
    gpxUrl?: string;
    bounds: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  };
  highlights: string[];       // Notable waypoints
  tags: string[];
}
```

### Priority Trails

**Europe (Home Market)**:
- Camino de Santiago (all routes)
- Tour du Mont Blanc
- West Highland Way
- Kungsleden (Sweden)
- Hardangervidda (Norway)
- GR20 (Corsica)
- Dolomites Alta Via

**North America**:
- Pacific Crest Trail
- Appalachian Trail
- Continental Divide Trail
- John Muir Trail
- Long Trail (Vermont)

**Worldwide**:
- Inca Trail
- Everest Base Camp
- Kilimanjaro routes
- Torres del Paine

---

## 4. Cycling Routes (~300 pages)

### URL Structure
```
/cycling/[slug]
/cycling/tour-de-france-2026
/cycling/lands-end-john-o-groats
/cycling/eurovelo-15
/cycling/raid-pyreneen
```

### Target Keywords
- `[Route] cycling poster`
- `[Route] bike route map`
- `[Race] route print 2026`
- `cycling wall art [Route]`
- `[Route] completion gift cyclist`

### Data Requirements

```typescript
interface CyclingRoute {
  slug: string;
  name: string;
  type: 'race' | 'sportive' | 'touring' | 'bikepacking';
  countries: string[];
  distance: number;
  elevationGain: number;
  stages?: number;            // For multi-stage races
  annual?: boolean;           // Is it an annual event?
  date?: string;              // Next event date
  route: {
    gpxUrl?: string;
    bounds: [number, number, number, number];
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  tags: string[];
}
```

### Priority Routes

**Grand Tours**:
- Tour de France (each year's route)
- Giro d'Italia
- Vuelta a España

**Classic Challenges**:
- Lands End to John O'Groats (LEJOG)
- Paris-Brest-Paris
- Raid Pyrénéen
- Marmotte

**EuroVelo Routes**:
- EuroVelo 15 (Rhine)
- EuroVelo 6 (Atlantic-Black Sea)
- EuroVelo 1 (Atlantic Coast)

---

## 5. Triathlon & Ironman Pages (~100 pages)

### URL Structure
```
/triathlon/[slug]
/triathlon/ironman-kona
/triathlon/ironman-copenhagen
/triathlon/challenge-roth
/triathlon/ironman-70-3-barcelona
```

### Target Keywords
- `Ironman [Location] map poster`
- `triathlon route print`
- `Ironman finisher gift`
- `[Event] course map art`
- `triathlon wall art`

### Data Requirements

```typescript
interface Triathlon {
  slug: string;
  name: string;
  brand: 'ironman' | 'ironman-70-3' | 'challenge' | 'other';
  location: string;
  country: string;
  distances: {
    swim: number;
    bike: number;
    run: number;
  };
  date: string;
  route: {
    swimGpx?: string;
    bikeGpx?: string;
    runGpx?: string;
    bounds: [number, number, number, number];
  };
  tags: string[];
}
```

---

## 6. Gift Guide Pages (~50 pages)

### URL Structure
```
/gift/[occasion]
/gift/marathon-runner
/gift/cyclist-birthday
/gift/hiking-anniversary
/gift/triathlete
/gift/strava-addict
/gift/outdoor-couple
```

### Target Keywords (Bottom of Funnel)
- `gift for marathon runner`
- `unique cycling gift ideas`
- `personalized hiking gift`
- `Strava gift ideas`
- `outdoor anniversary gift`
- `gift for someone who finished [Race]`

### Page Template Structure

```
┌─────────────────────────────────────────┐
│ H1: Perfect Gifts for [Persona]         │
│ Subhead: Personalized Adventure Art     │
├─────────────────────────────────────────┤
│ Hero: Why This Gift Works               │
│ • Unique and personal                   │
│ • Commemorates achievement              │
│ • High-quality wall art                 │
├─────────────────────────────────────────┤
│ Gift Ideas Grid                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ Their   │ │ Famous  │ │ Custom  │    │
│ │ Strava  │ │ Race    │ │ City    │    │
│ │ Route   │ │ Route   │ │ Map     │    │
│ └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────┤
│ How It Works                            │
│ 1. Choose their location or upload GPX  │
│ 2. Pick a style they'll love            │
│ 3. We deliver (or instant download)     │
├─────────────────────────────────────────┤
│ Price Points                            │
│ Digital: €19 | Print: €49-89            │
├─────────────────────────────────────────┤
│ FAQ: Gift-Specific Questions            │
│ • Can I upload their Strava activity?   │
│ • Do you offer gift wrapping?           │
│ • How long does delivery take?          │
├─────────────────────────────────────────┤
│ Related Gift Guides                     │
└─────────────────────────────────────────┘
```

---

## Technical Implementation

### File Structure

```
frontend/
├── app/
│   ├── map/
│   │   └── [country]/
│   │       └── [city]/
│   │           └── page.tsx
│   ├── race/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── trail/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── cycling/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── triathlon/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── gift/
│   │   └── [occasion]/
│   │       └── page.tsx
│   └── sitemap.ts
├── lib/
│   └── seo/
│       ├── cities.ts         # City database
│       ├── races.ts          # Race database
│       ├── trails.ts         # Trail database
│       ├── cycling.ts        # Cycling route database
│       ├── triathlons.ts     # Triathlon database
│       ├── gifts.ts          # Gift occasion database
│       └── types.ts          # Shared types
├── components/
│   └── seo/
│       ├── CityPage.tsx
│       ├── RacePage.tsx
│       ├── TrailPage.tsx
│       ├── CyclingPage.tsx
│       ├── TriathlonPage.tsx
│       ├── GiftPage.tsx
│       ├── MapPreview.tsx    # Reusable map preview
│       ├── FAQSection.tsx    # JSON-LD FAQ component
│       └── RelatedLinks.tsx  # Internal linking
└── public/
    ├── routes/               # Pre-loaded GPX files
    │   ├── races/
    │   ├── trails/
    │   └── cycling/
    └── og/                   # Generated OG images
        ├── cities/
        ├── races/
        └── trails/
```

### Dynamic Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { cities } from '@/lib/seo/cities';
import { races } from '@/lib/seo/races';
import { trails } from '@/lib/seo/trails';
import { cyclingRoutes } from '@/lib/seo/cycling';
import { triathlons } from '@/lib/seo/triathlons';
import { giftOccasions } from '@/lib/seo/gifts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gridline.eu';

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1, changeFrequency: 'daily' },
    { url: `${baseUrl}/create`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/feed`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${baseUrl}/faq`, priority: 0.6, changeFrequency: 'monthly' },
  ];

  // City pages
  const cityPages = cities.map(city => ({
    url: `${baseUrl}/map/${city.country}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: city.population > 1000000 ? 0.8 : 0.7,
  }));

  // Race pages
  const racePages = races.map(race => ({
    url: `${baseUrl}/race/${race.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: race.tags.includes('world-major') ? 0.9 : 0.8,
  }));

  // Trail pages
  const trailPages = trails.map(trail => ({
    url: `${baseUrl}/trail/${trail.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Cycling pages
  const cyclingPages = cyclingRoutes.map(route => ({
    url: `${baseUrl}/cycling/${route.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: route.type === 'race' ? 0.8 : 0.7,
  }));

  // Triathlon pages
  const triathlonPages = triathlons.map(event => ({
    url: `${baseUrl}/triathlon/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: event.brand === 'ironman' ? 0.8 : 0.7,
  }));

  // Gift guide pages
  const giftPages = giftOccasions.map(occasion => ({
    url: `${baseUrl}/gift/${occasion.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...cityPages,
    ...racePages,
    ...trailPages,
    ...cyclingPages,
    ...triathlonPages,
    ...giftPages,
  ];
}
```

### JSON-LD Structured Data

```typescript
// components/seo/FAQSection.tsx
interface FAQ {
  question: string;
  answer: string;
}

export function FAQSection({ faqs, entityName }: { faqs: FAQ[], entityName: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, i) => (
        <details key={i}>
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}
```

---

## AI/LLM Search Optimization

### Natural Language Queries to Target

People asking AI assistants:

| Query | Target Page | Answer Focus |
|-------|-------------|--------------|
| "What's a good gift for someone who just finished a marathon?" | /gift/marathon-runner | Personalized route poster |
| "I want to make wall art from my Strava data" | /create + FAQ | Strava integration feature |
| "Best way to commemorate my hiking trip" | /gift/hiking-anniversary | GPX upload, trail pages |
| "Custom poster of my cycling route" | /create + FAQ | Route upload feature |
| "Unique gift for a runner" | /gift/marathon-runner | Personalization options |

### FAQ Content Strategy

Each programmatic page should include FAQs answering:

1. **"How do I create a [X] poster?"** → Feature walkthrough
2. **"Can I use my own Strava/GPX data?"** → Yes, integration details
3. **"What sizes are available?"** → Product options
4. **"Do you ship to [Country]?"** → Shipping info
5. **"Is this a good gift for [Persona]?"** → Gift validation

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Launch with ~170 high-value pages

| Task | Pages | Priority |
|------|-------|----------|
| Data files setup | - | P0 |
| Page templates | 6 templates | P0 |
| Top 50 cities | 50 | P0 |
| Top 50 races | 50 | P0 |
| Top 20 trails | 20 | P0 |
| Gift guides | 10 | P0 |
| Sitemap | 1 | P0 |
| JSON-LD schemas | - | P0 |

**Deliverables**:
- `lib/seo/` data modules
- `components/seo/` page components
- Dynamic sitemap
- OG image generation (basic)

### Phase 2: Scale (Weeks 3-6)

**Goal**: Expand to ~1,500 pages

| Task | Pages | Priority |
|------|-------|----------|
| Expand cities to 1,000 | +950 | P1 |
| All major marathons | +200 | P1 |
| Cycling routes | 100 | P1 |
| Triathlons | 50 | P1 |
| More trails | +100 | P1 |
| Gift guides complete | +40 | P1 |

**Deliverables**:
- City data from external API (GeoNames, etc.)
- Race calendar integration
- Pre-loaded GPX routes for top events
- Internal linking system

### Phase 3: Optimization (Weeks 7-10)

**Goal**: SEO refinement and performance

| Task | Priority |
|------|----------|
| Page speed optimization | P1 |
| OG image generation at scale | P1 |
| A/B test page layouts | P2 |
| Add community content sections | P2 |
| Blog content for top keywords | P2 |
| Link building outreach | P2 |

### Phase 4: Full Scale (Weeks 11+)

**Goal**: ~11,000+ pages

| Task | Pages | Priority |
|------|-------|----------|
| All cities >50K population | ~10,000 | P2 |
| Regional races | +200 | P2 |
| Local trails | +100 | P2 |
| Localized content (DE, FR, ES) | Multiply | P3 |

---

## Success Metrics

### Traffic KPIs

| Metric | 3 Month Target | 6 Month Target |
|--------|----------------|----------------|
| Organic sessions | 5,000/mo | 25,000/mo |
| Indexed pages | 500 | 2,000 |
| Avg. position (target keywords) | Top 20 | Top 10 |
| Click-through rate | 2% | 4% |

### Conversion KPIs

| Metric | Target |
|--------|--------|
| Page → Create conversion | 5% |
| Create → Export conversion | 20% |
| Gift page → Purchase | 3% |

### SEO Health

| Metric | Target |
|--------|--------|
| Core Web Vitals | All green |
| Mobile usability | 100% |
| Crawl errors | <1% |
| Duplicate content | 0% |

---

## Data Sources

### Cities
- **GeoNames** (free): 11M+ place names
- **OpenStreetMap** (free): POI data
- **Manual curation**: Top 1,000 priority cities

### Races
- **Marathon Guide**: Race calendars
- **AIMS** (Association of International Marathons)
- **Manual research**: Top 500 events

### Trails
- **OpenStreetMap**: Trail data
- **AllTrails API** (if available)
- **Manual curation**: Famous thru-hikes

### Cycling
- **UCI calendar**: Pro race routes
- **EuroVelo**: Official route data
- **Cycling club databases**

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Thin content penalty | High | Rich FAQ, community content, unique data |
| Slow page speed | Medium | ISR, image optimization, lazy loading |
| Duplicate across cities | High | Unique content per page, city-specific data |
| GPX data accuracy | Medium | Verify top routes, allow user corrections |
| Seasonal traffic drops | Low | Diversify (gifts, cities balance seasonality) |

---

## Open Questions

1. **OG Image Generation**: Build custom or use service (Vercel OG)?
2. **Pre-loaded Routes**: How many GPX files to include at launch?
3. **Localization**: When to add DE/FR/ES versions?
4. **City Data**: Build internal database or use external API?
5. **Community Content**: How to integrate user maps into SEO pages?

---

## References

- [FEATURES.md](../FEATURES.md) - Product roadmap
- [STATUS.md](../STATUS.md) - Implementation status
- [CLAUDE.md](../CLAUDE.md) - Development context
- [Next.js Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Schema.org FAQ](https://schema.org/FAQPage)

---

**Status**: Ready for Phase 1 implementation
