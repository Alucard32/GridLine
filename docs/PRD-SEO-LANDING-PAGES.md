# GridLine - SEO Landing Pages PRD

> Actionable PRD for programmatic SEO landing pages, LLM search optimization, and route catalog expansion.

**Created**: 2026-02-03
**Updated**: 2026-02-07
**Status**: Phase 1 & 2 Complete
**Priority**: Critical (Primary Growth Channel)

**Related Documents**:

- [PROGRAMMATIC-SEO.md](./PROGRAMMATIC-SEO.md) - Original SEO strategy (Phase 1 complete)
- [PRD-FAMOUS-ROUTES-SEEDING.md](./PRD-FAMOUS-ROUTES-SEEDING.md) - Famous routes database seeding

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Competitive Landscape](#competitive-landscape)
3. [Landing Page Tiers](#landing-page-tiers)
4. [Current Landing Page Structure](#current-landing-page-structure)
5. [Poster Design Showcase Strategy](#poster-design-showcase-strategy)
6. [How It Works Content Guide](#how-it-works-content-guide)
7. [Testimonials Strategy](#testimonials-strategy)
8. [Route Catalog Expansion](#route-catalog-expansion)
9. [LLM & AI Search Optimization](#llm--ai-search-optimization)
10. [Keyword Strategy](#keyword-strategy)
11. [Technical Implementation](#technical-implementation)
12. [Design Direction & CRO Guide](#design-direction--cro-guide)
13. [Implementation Phases](#implementation-phases)

---

## Executive Summary

As of February 2026, 61% of US searches begin on AI platforms (ChatGPT, Perplexity, Google AI Overviews). GridLine's programmatic SEO strategy must optimize for both traditional search and LLM citation.

**Current state**: 46 landing pages live across `/race/[slug]`, `/trail/[slug]`, `/cycling/[slug]`.

**Target**: 200+ route pages, 50+ gift/guide pages, and city map pages within 6 months. Each page designed to rank for long-tail keywords AND be cited by LLMs answering "best gift for runners" or "custom route poster" queries.

**GridLine's Unique Moat**: No competitor combines Strava import + GPX upload + route builder + 3D terrain + 3D sculpture (STL export). This is our key differentiator on every landing page.

---

## Competitive Landscape

### Direct Competitors

| Competitor | Strengths | Weaknesses | Our Advantage |
|-----------|-----------|------------|---------------|
| **Sportymaps** | Strong SEO, nice designs | No 3D, no Strava | 3D sculptures, Strava import |
| **Run Ink** | Clean UI, gift-focused | Limited routes, no custom GPS | Custom GPS, route builder |
| **Mark Your Moment** | Good marathon coverage | Generic designs | 11 styles, 15+ palettes |
| **Map Medal** | Physical products | No digital, high price | Instant digital download |
| **The Post Trace** | Good route maps | No 3D terrain | 3D terrain, buildings |
| **Outdoor Art Print** | Broad outdoor niche | No route-specific | Route-specific pages |
| **3DTrails** | 3D printing focus | No poster option | Poster + sculpture combo |
| **My Adventure Maps** | Adventure niche | Limited customization | Full editor control |

### Content Gap Opportunities

Competitors are weak on:
- **Gift-intent keywords** ("marathon gift", "gift for trail runner") — high purchase intent, low competition
- **How-to content** ("how to frame a route poster", "Strava to poster") — informational with conversion potential
- **Comparison content** ("custom route poster vs medal display") — captures decision-stage searches
- **City-specific keywords** ("London running map poster") — massive long-tail volume
- **Event-seasonal content** ("TCS New York City Marathon 2026 gift") — time-sensitive, recurring annually

---

## Landing Page Tiers

### Tier 1: Gift & Intent Pages (Highest ROI)

**URL Pattern**: `/gift/[occasion]`

**Target Keywords**:
- "marathon gift ideas" (2,400 mo/searches)
- "gift for runner" (5,400)
- "trail runner gift" (1,600)
- "cycling gift" (3,200)
- "Father's Day gift for runner" (seasonal spike)
- "Christmas gift for cyclist" (seasonal spike)

**Pages to Build**:

| Slug | Title | Target Keyword |
|------|-------|----------------|
| `/gift/marathon-finisher` | Marathon Finisher Gifts | marathon gift, gift for marathon runner |
| `/gift/trail-runner` | Gifts for Trail Runners | trail runner gift, hiking gift |
| `/gift/cyclist` | Gifts for Cyclists | cycling gift, gift for cyclist |
| `/gift/triathlete` | Gifts for Triathletes | triathlon gift |
| `/gift/ultra-runner` | Gifts for Ultra Runners | ultramarathon gift |
| `/gift/fathers-day-runner` | Father's Day Gifts for Runners | father's day running gift |
| `/gift/christmas-runner` | Christmas Gifts for Runners | christmas gift runner |
| `/gift/valentines-runner` | Valentine's Day Running Gifts | valentine gift runner |
| `/gift/personal-best` | Celebrate a Personal Best | PB celebration gift |
| `/gift/first-marathon` | First Marathon Gift Ideas | first marathon gift |
| `/gift/retirement-gift` | Retirement Gift for Runners | retirement gift athlete |

**Page Content Structure**:
1. Hero: "The Perfect Gift for [Audience]" + showcase poster
2. Why a Route Poster: 3 benefit cards
3. Gift ideas grid: Show 4-6 route poster examples
4. Personalization angle: "Add their finish time, date, Strava data"
5. How it works (3 steps)
6. Price anchoring: "Starting at €12"
7. FAQ (gift-specific)
8. CTA: "Create Their Gift Now"

---

### Tier 2: How-To & Guide Pages (SEO Authority)

**URL Pattern**: `/guide/[topic]`

**Target Keywords**:
- "how to create a route poster" (emerging)
- "Strava to poster" (880)
- "GPX to poster" (480)
- "how to print a running map" (320)
- "3D print running route" (720)

**Pages to Build**:

| Slug | Title | Target Keyword |
|------|-------|----------------|
| `/guide/strava-to-poster` | Turn Your Strava Activity into a Poster | strava poster, strava to poster |
| `/guide/gpx-to-poster` | Create a Poster from Your GPX File | gpx poster, gpx to poster |
| `/guide/3d-print-running-route` | 3D Print Your Running Route | 3d print route, running sculpture |
| `/guide/frame-route-poster` | How to Frame Your Route Poster | frame running poster |
| `/guide/best-poster-sizes` | Route Poster Size Guide | poster size guide, what size poster |
| `/guide/custom-running-map` | Create a Custom Running Map | custom running map |
| `/guide/marathon-route-map` | Create Your Marathon Route Map | marathon route map |
| `/guide/cycling-route-poster` | Design a Cycling Route Poster | cycling route poster |
| `/guide/hiking-trail-map-poster` | Create a Hiking Trail Map Poster | hiking trail poster |

**Page Content Structure**:
1. Hero: "How to [Action]" + example result image
2. Step-by-step guide (5-7 steps with screenshots)
3. Tips & customization options
4. Example gallery (3-4 poster styles)
5. FAQ (topic-specific)
6. CTA: "Try It Now — Free to Design"

---

### Tier 3: Collection & Best-Of Pages (Internal Linking)

**URL Pattern**: `/collection/[theme]` and `/best/[category]`

**Target Keywords**:
- "best marathon route posters" (emerging)
- "famous cycling routes poster" (320)
- "world marathon majors poster" (210)

**Pages to Build**:

| Slug | Title |
|------|-------|
| `/collection/world-marathon-majors` | World Marathon Majors Route Posters |
| `/collection/european-marathons` | European Marathon Route Posters |
| `/collection/tour-de-france` | Tour de France Stage Posters |
| `/collection/famous-hiking-trails` | Famous Hiking Trail Posters |
| `/collection/uk-national-trails` | UK National Trail Posters |
| `/collection/alpine-cycling-climbs` | Alpine Cycling Climb Posters |
| `/best/marathon-posters` | Best Marathon Route Posters 2026 |
| `/best/trail-running-posters` | Best Trail Running Route Posters |
| `/best/cycling-posters` | Best Cycling Route Posters |

**Page Content Structure**:
1. Hero: Collection title + intro paragraph
2. Route grid: All routes in collection with poster previews
3. Each card links to individual route page
4. "Why this collection" section
5. CTA: "Or create your own custom route"

---

### Tier 4: City Map Pages (Volume Play)

**URL Pattern**: `/map/[country]/[city]`

**Target Keywords**:
- "[city] map poster" (varies by city, 100-5,000 per city)
- "[city] running map" (100-1,000)
- "[city] street map art" (50-500)

**Initial Cities** (top 50 by search volume):
London, New York, Paris, Berlin, Tokyo, Amsterdam, Barcelona, Rome, San Francisco, Copenhagen, Stockholm, Sydney, Melbourne, Toronto, Chicago, Boston, Los Angeles, Seattle, Portland, Austin, Denver, Munich, Vienna, Zurich, Dublin, Edinburgh, Lisbon, Prague, Budapest, Oslo, Helsinki, Brussels, Milan, Madrid, Osaka, Seoul, Singapore, Hong Kong, Dubai, Cape Town, Vancouver, Montreal, Washington DC, Miami, Nashville, Minneapolis, Philadelphia, Atlanta, Charlotte, Chamonix

**Page Content Structure**:
1. Hero: "[City] Map Poster" + city map preview
2. Popular routes in this city (link to route pages if they exist)
3. Neighborhoods & landmarks shown on map
4. Style gallery (same city in different styles)
5. How it works (3 steps)
6. FAQ (city-specific)
7. CTA: "Create Your [City] Map Poster"

> **Note**: City map pages require a different template component than route pages. This is a Phase 2 effort.

---

### Tier 5: Comparison & Alternative Pages (Decision Stage)

**URL Pattern**: `/compare/[topic]`

**Target Keywords**:
- "route poster vs medal display" (emerging)
- "sportymaps alternative" (210)
- "best custom route poster site" (emerging)

**Pages to Build**:

| Slug | Title |
|------|-------|
| `/compare/poster-vs-medal` | Route Poster vs Medal Display |
| `/compare/poster-vs-sculpture` | 2D Poster vs 3D Route Sculpture |
| `/compare/digital-vs-physical` | Digital Download vs Physical Print |

---

## Current Landing Page Structure

The existing route landing page template ([RaceLandingPageClient.tsx](../frontend/app/race/[slug]/RaceLandingPageClient.tsx)) has this section order:

| # | Section | Purpose |
|---|---------|---------|
| 1 | **HeroSection** | Route name, subtitle, distance, introText, CTA button, poster image, trust badges |
| 2 | **RouteDetailsSection** | Distance, elevation, location, difficulty, website link |
| 3 | **GiftMessagingSection** | 4 cards: Commemorate, Perfect Gift, Remember Every Step, Your Style |
| 4 | **ProductShowcaseSection** | Tabs: Poster (€12) / 3D Sculpture (€29) with feature lists |
| 5 | **PersonalizationSection** | 4 features: Strava, Styles, Time, Palettes |
| 6 | **HowItWorksSection** | 3 steps: Start → Customize → Download |
| 7 | **FAQSection** | Expandable accordion with category + route-specific FAQs |
| 8 | **RelatedRoutesSection** | 3 related route cards |
| 9 | **FinalCTASection** | Green gradient CTA with "Takes just 5 minutes" badge |
| 10 | **RouteDisclaimer** | Trademark-safe disclaimer |

### Sections That Work Well (Keep)
- Hero with poster preview — strong visual hook
- ProductShowcase with poster/sculpture tabs — clear value prop
- HowItWorks — simple 3-step flow
- FAQ with JSON-LD — good for LLM citation
- RelatedRoutes — internal linking

### Sections to Improve
- **GiftMessaging** — too generic, should be dynamic based on route category
- **PersonalizationSection** — could show actual before/after examples
- **Hero trust badges** — add "Used by X runners" once we have data

---

## Poster Design Showcase Strategy

Each landing page must showcase poster designs that are relevant to the route/category. This drives conversion by helping visitors visualize the final product.

### Design Assignment Rules

#### Route Pages (`/race/[slug]`, `/trail/[slug]`, `/cycling/[slug]`)

Each route in `lib/seo/routes.ts` already has `styleId` and `paletteId` fields. The poster preview on the page uses the route's DB thumbnail if available.

**Hero image**: Show the route's primary poster (from DB thumbnail or `posterImageUrl` override).

**Product showcase gallery**: Show 3-4 style variations of the SAME route. These use the `exampleImages` field on `SEORouteMetadata`:

```typescript
exampleImages?: ExampleImage[]; // Gallery of example poster styles
// e.g. { url: "/examples/boston-minimalist.png", label: "Minimalist" }
```

**Style rotation strategy per category**:

| Category | Primary Style | Secondary Styles | Color Palettes |
|----------|---------------|------------------|----------------|
| Race/Marathon | `mapbox-streets` | `minimalist`, `satellite`, `dark` | Route-color driven (red, blue, green) |
| Trail/Hiking | `outdoor` | `topographic`, `satellite`, `terrain` | Earth tones (green, brown, amber) |
| Cycling | `minimalist` | `mapbox-streets`, `dark`, `satellite` | Bold colors (yellow, orange, blue) |

**What to show on each route page**:
1. **Hero**: The route's assigned poster (its `styleId` + `paletteId`) — pulled from DB thumbnail
2. **ProductShowcase Poster tab**: 3 additional style variations from `exampleImages`
3. **ProductShowcase Sculpture tab**: Sculpture render from `sculptureImageUrl` (if available) or a generic sculpture preview

#### Gift Pages (`/gift/[occasion]`)

Gift pages should show a curated mix of routes relevant to the audience:

| Gift Page | Featured Routes | Design Style Focus |
|-----------|-----------------|--------------------|
| Marathon Finisher | Boston, New York, London, Berlin, Tokyo, Chicago | Mix of styles — show variety |
| Trail Runner | Camino, PCT, TMB, Appalachian | Outdoor/topographic styles |
| Cyclist | Mont Ventoux, Alpe d'Huez, TdF stages | Minimalist/dark styles |
| First Marathon | Popular local marathons | Bright, celebratory palettes |

**Rotation logic**: Gift pages show a grid of 4-6 route posters. Randomize which routes appear from the relevant pool on each page load (server-side, with a stable seed per session for consistent SSR).

#### Collection Pages (`/collection/[theme]`)

Show ALL routes in the collection as a grid, each in its assigned style. This is the one page type where we show every route, not a curated selection.

#### Guide Pages (`/guide/[topic]`)

Show step-by-step screenshots from the actual editor. For the "result" images, use a single well-chosen route poster that matches the guide topic:

| Guide | Example Route to Feature |
|-------|-------------------------|
| Strava to Poster | New York Marathon (popular + recognizable) |
| GPX to Poster | Camino de Santiago (long trail, clear route line) |
| 3D Print Route | Mont Blanc (dramatic elevation) |
| Cycling Route Poster | Mont Ventoux (iconic climb) |

### Generating Example Images

**Approach**: Use the existing export pipeline to generate example images for each route in multiple styles. Store in Supabase Storage at a consistent path:

```
/seo/examples/{category}/{slug}/{style}.png
```

Example: `/seo/examples/race/boston-marathon/minimalist.png`

**Priority**: Generate example images for the top 20 routes first (by expected traffic). Remaining routes use their DB thumbnail only.

---

## How It Works Content Guide

The "How It Works" section is critical for conversion. It must be clear, visual, and adapted per page type.

### Route Pages — 3 Steps

| Step | Title | Description | Visual |
|------|-------|-------------|--------|
| 1 | **Start with This Route** | "We've pre-loaded the [Route Name] route. Or import your own GPS data from Strava or upload a GPX file to use your exact path." | Map preview with route highlighted |
| 2 | **Customize Your Design** | "Choose from 11 map styles and 15+ color palettes. Add your finish time, date, and personal message. Adjust route colors, line styles, and typography." | Style picker/editor screenshot |
| 3 | **Download & Print** | "Download your high-resolution poster (up to 24×36" at 300 DPI) or export a 3D sculpture STL file for 3D printing. Print at home or any print shop." | Final poster mockup |

### Gift Pages — 3 Steps (Gift-Focused Framing)

| Step | Title | Description |
|------|-------|-------------|
| 1 | **Choose Their Route** | "Select their race, trail, or ride — or import their Strava activity for the exact path they ran." |
| 2 | **Personalize It** | "Add their finish time, date, and a personal message. Choose a style and colors they'll love." |
| 3 | **Gift It** | "Download instantly and print at any print shop. Or send them the link to customize it themselves." |

### Guide Pages — 5-7 Steps (Tutorial Format)

Guide pages use a longer, more detailed step format with actual editor screenshots. Each step should include:
- Step number and title
- 2-3 sentence description
- Screenshot or image showing the step in the editor
- Optional tip/note callout

Example for "Strava to Poster" guide:
1. Sign in to GridLine
2. Connect your Strava account
3. Browse and select your activity
4. Customize your map style and colors
5. Add your finish time and personal details
6. Download your poster
7. Print and frame it

---

## Testimonials Strategy

**Current Status**: NOT implementing testimonials yet.

**Rationale**: The user explicitly wants to wait until real customers exist so testimonials look authentic. Fake or generic testimonials would hurt credibility.

**Plan**:

1. **Phase 1 (Now)**: No testimonials on any pages. Use trust badges instead:
   - "11 Map Styles"
   - "15+ Color Palettes"
   - "High-Resolution Downloads"
   - "Strava Integration"
   - "Starting at €12"

2. **Phase 2 (When customers exist)**: Add a testimonial section between ProductShowcase and HowItWorks. Design it now as a component that can be toggled on:
   - Reserve the section in the template with a feature flag (`SHOW_TESTIMONIALS = false`)
   - Component name: `TestimonialsSection`
   - Show 3 testimonials per page, relevant to the category
   - Include: name, route/event, star rating, quote, poster thumbnail
   - JSON-LD Review schema for search snippets

3. **Phase 3 (Scale)**: Automated testimonial collection via post-purchase email (Brevo). Route-specific testimonials shown on matching landing pages.

**Testimonial Collection Strategy** (for later):
- Post-purchase email 7 days after download: "Love your poster? Share a photo!"
- In-app prompt after export
- Strava integration: detect when users share poster photos

---

## Route Catalog Expansion

### Current Coverage (46 routes)

| Category | Count | Examples |
|----------|-------|---------|
| Race (marathon) | 16 | Boston, New York, London, Berlin, Tokyo, Chicago |
| Trail | 22 | Camino de Santiago, Tour du Mont Blanc, PCT, AT |
| Cycling | 8 | Mont Ventoux, Alpe d'Huez, TdF stages |

### Routes to Add (Priority Order)

#### Batch 1: Half Marathons (High Search Volume)

Half marathon search volume is 2-3x full marathon for many events. These are missing entirely.

| Route | Country | Distance | Search Volume |
|-------|---------|----------|---------------|
| Great North Run | UK | 21.1km | 8,100 |
| NYC Half Marathon | USA | 21.1km | 2,900 |
| Berlin Half Marathon | Germany | 21.1km | 1,600 |
| Paris Half Marathon | France | 21.1km | 1,300 |
| Gothenburg Half Marathon | Sweden | 21.1km | 1,100 |
| Royal Parks Half Marathon | UK | 21.1km | 2,400 |
| Barcelona Half Marathon | Spain | 21.1km | 880 |
| Copenhagen Half Marathon | Denmark | 21.1km | 720 |
| Amsterdam Half Marathon | Netherlands | 21.1km | 590 |
| Stockholm Half Marathon | Sweden | 21.1km | 480 |

**SEO Slug Pattern**: `/race/great-north-run-half-marathon`

#### Batch 2: Ultra Trails & Mountain Races

Growing segment with passionate, high-spending audience.

| Route | Country | Distance | Search Volume |
|-------|---------|----------|---------------|
| UTMB (Ultra-Trail du Mont-Blanc) | France/Italy/Switzerland | 171km | 14,800 |
| Western States 100 | USA | 161km | 3,600 |
| Hardrock 100 | USA | 161km | 2,400 |
| Lavaredo Ultra Trail | Italy | 120km | 1,900 |
| Marathon des Sables | Morocco | 251km | 5,400 |
| Tor des Géants | Italy | 330km | 1,600 |
| Barkley Marathons | USA | ~100mi | 6,600 |
| Comrades Marathon | South Africa | 89km | 4,400 |
| Leadville Trail 100 | USA | 161km | 1,200 |
| CCC (Courmayeur-Champex-Chamonix) | France/Italy/Switzerland | 101km | 2,100 |

**SEO Slug Pattern**: `/trail/utmb-ultra-trail`

#### Batch 3: Iconic Cycling Climbs

Individual climbs have strong search intent and are underserved by competitors.

| Route | Country | Distance | Elevation | Search Volume |
|-------|---------|----------|-----------|---------------|
| Stelvio Pass | Italy | 24.3km | 1,808m | 6,600 |
| Col du Galibier | France | 34.8km | 2,120m | 2,400 |
| Passo dello Stelvio (from Bormio) | Italy | 21.5km | 1,533m | 1,800 |
| Col du Tourmalet | France | 19km | 1,404m | 3,200 |
| Sa Calobra (Mallorca) | Spain | 9.4km | 682m | 2,100 |
| Monte Zoncolan | Italy | 10.1km | 1,210m | 1,300 |
| Alto de l'Angliru | Spain | 12.5km | 1,266m | 1,100 |
| Mortirolo | Italy | 12.4km | 1,300m | 890 |
| Passo Gavia | Italy | 17.3km | 1,363m | 720 |
| Mont Ventoux (from Bédoin) | France | 21.5km | 1,612m | Already added |

**SEO Slug Pattern**: `/cycling/stelvio-pass-cycling-route`

#### Batch 4: US Long-Distance Trails

High-value US audience, large gift market.

| Route | Distance | Search Volume |
|-------|----------|---------------|
| Pacific Crest Trail (PCT) | 4,265km | 22,200 |
| Appalachian Trail (AT) | 3,524km | 18,100 |
| John Muir Trail (JMT) | 340km | 8,100 |
| Continental Divide Trail (CDT) | 4,989km | 3,600 |
| Colorado Trail | 782km | 2,400 |
| Wonderland Trail | 150km | 2,100 |
| Long Trail (Vermont) | 438km | 1,600 |
| Superior Hiking Trail | 499km | 1,200 |

**SEO Slug Pattern**: `/trail/pacific-crest-trail`

> Note: Some of these may already exist. Check against current `routes.ts` before adding.

#### Batch 5: Ironman / Triathlon Routes

Triathlon audience is affluent and gift-friendly.

| Route | Country | Distance | Search Volume |
|-------|---------|----------|---------------|
| Ironman Hawaii (Kona) | USA | 226km | 9,900 |
| Ironman 70.3 World Championship | Varies | 113km | 3,200 |
| Challenge Roth | Germany | 226km | 2,400 |
| Ironman Barcelona | Spain | 226km | 1,600 |
| Ironman Lanzarote | Spain | 226km | 1,300 |
| Ironman Nice | France | 226km | 1,100 |

**SEO Category**: These could be `/race/ironman-kona-triathlon` or a new `/triathlon/[slug]` category. Recommend using `/race/` to avoid adding a new category type.

---

## LLM & AI Search Optimization

### Why This Matters (February 2026)

- 61% of US searches now begin on AI platforms
- Google AI Overviews appear on 70%+ of informational queries
- FAQPage schema makes pages 3.7x more likely to be cited by LLMs
- LLMs prefer pages with structured data, clear headings, and direct answers

### Actions

#### 1. Create `/llms.txt` File

Place at `gridline.eu/llms.txt` — this is the emerging standard for LLM crawlers (similar to robots.txt).

```
# GridLine - Custom Route Map Posters & 3D Sculptures
# https://gridline.eu

## What We Do
GridLine creates custom map posters and 3D route sculptures from any running, cycling, or hiking route. Users can import GPS data from Strava, upload GPX files, or draw routes directly on the map.

## Products
- High-resolution map posters (up to 24x36" at 300 DPI) - from €12
- 3D route sculptures (STL files for 3D printing) - from €29

## Features
- 11 map styles, 15+ color palettes
- Strava integration (import activities directly)
- GPX file upload
- Interactive route builder with road snapping
- 3D terrain visualization
- Custom typography and text overlays
- Multiple export sizes (A4 to 24x36")

## Popular Routes
See /sitemap.xml for all available route pages.

## API
No public API available.
```

#### 2. Optimize for Bing (ChatGPT's Search Backend)

- Submit sitemap to Bing Webmaster Tools
- Ensure `IndexNow` protocol is implemented for instant indexing
- Bing favors exact-match titles and meta descriptions

#### 3. Schema Markup on Every Page

Already implemented:

- ✅ FAQPage schema (JSON-LD)
- ✅ Product schema (JSON-LD)
- ✅ HowTo schema on guide pages
- ✅ BreadcrumbList schema on all gift and guide pages

To add:

- [ ] Review/AggregateRating schema (when testimonials exist)
- [ ] CollectionPage schema on collection pages
- [ ] BreadcrumbList schema on route pages (`/race/`, `/trail/`, `/cycling/`)

#### 4. Direct-Answer Content Format

LLMs extract content that directly answers questions. Every landing page should have:
- A clear, one-sentence answer to "What is this?" in the first paragraph
- FAQ section with concise, factual answers (already done)
- Structured comparison tables where relevant
- Price information clearly stated (already done: "Starting at €12")

#### 5. Original Data & Statistics

LLMs prefer citing pages with unique data. Add to route pages:
- Route statistics (distance, elevation, difficulty) — already done
- "Did you know?" facts about each route
- Historical context (year established, number of participants)

#### 6. Reddit & Forum Presence

LLMs heavily weight Reddit and forum content. Strategy:
- Monitor r/running, r/cycling, r/hiking, r/trailrunning for "gift" threads
- Contribute genuinely (not spammy) when route posters are relevant
- Create a dedicated post showcasing GridLine when we have customer examples

---

## Keyword Strategy

### Primary Keywords by Intent

#### Transactional (Buy Intent)

| Keyword | Volume | Current Ranking | Target Page |
|---------|--------|-----------------|-------------|
| "marathon poster" | 2,400 | — | `/race/[slug]` pages |
| "running route poster" | 1,900 | — | `/gift/marathon-finisher` |
| "custom route map" | 1,300 | — | `/guide/custom-running-map` |
| "strava poster" | 880 | — | `/guide/strava-to-poster` |
| "3d printed running route" | 720 | — | `/guide/3d-print-running-route` |
| "cycling route poster" | 590 | — | `/guide/cycling-route-poster` |
| "hiking trail poster" | 480 | — | `/guide/hiking-trail-map-poster` |
| "gpx poster" | 480 | — | `/guide/gpx-to-poster` |
| "[city] marathon poster" | 100-500 each | — | `/race/[slug]` pages |

#### Informational (Research Intent)

| Keyword | Volume | Target Page |
|---------|--------|-------------|
| "boston marathon route map" | 6,600 | `/race/boston-marathon` |
| "london marathon route" | 9,900 | `/race/london-marathon` |
| "tour du mont blanc route" | 4,400 | `/trail/tour-du-mont-blanc` |
| "how to create a route poster" | 320 | `/guide/custom-running-map` |
| "strava activity to poster" | 260 | `/guide/strava-to-poster` |

#### Gift Intent (High Conversion)

| Keyword | Volume | Target Page |
|---------|--------|-------------|
| "gift for marathon runner" | 2,400 | `/gift/marathon-finisher` |
| "gift for trail runner" | 1,600 | `/gift/trail-runner` |
| "gift for cyclist" | 3,200 | `/gift/cyclist` |
| "marathon finisher gift" | 1,900 | `/gift/marathon-finisher` |
| "personalized running gift" | 720 | `/gift/personal-best` |
| "unique running gift" | 590 | `/gift/marathon-finisher` |

### Long-Tail Keywords per Route

Every route page should target:
- "[route name] poster"
- "[route name] map art"
- "[route name] route map"
- "[route name] gift"
- "[route name] 3d print"
- "custom [route name] poster"

---

## Technical Implementation

### New URL Patterns Required

| Pattern | Template | Priority |
|---------|----------|----------|
| `/gift/[slug]` | `GiftLandingPageClient.tsx` | P0 |
| `/guide/[slug]` | `GuideLandingPageClient.tsx` | P0 |
| `/collection/[slug]` | `CollectionLandingPageClient.tsx` | P1 |
| `/best/[slug]` | `BestOfLandingPageClient.tsx` | P1 |
| `/compare/[slug]` | `CompareLandingPageClient.tsx` | P2 |
| `/map/[country]/[city]` | `CityMapLandingPageClient.tsx` | P2 |

### Data Model for New Page Types

Gift pages and guide pages need their own data files, similar to `lib/seo/routes.ts`:

```typescript
// lib/seo/gifts.ts
export interface GiftPageMetadata {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  targetAudience: string;
  featuredRoutes: string[]; // slugs from routes.ts
  keywords: string[];
  heroImage: string;
  seasonalPeak?: string; // "december", "june", etc.
}

// lib/seo/guides.ts
export interface GuidePageMetadata {
  slug: string;
  title: string;
  description: string;
  steps: GuideStep[];
  featuredRoute: string; // slug to use as example
  keywords: string[];
  relatedGuides: string[];
}

interface GuideStep {
  title: string;
  description: string;
  image?: string; // screenshot
  tip?: string;
}
```

### Sitemap Updates

Update `app/sitemap.ts` to include all new page types:
- All gift pages
- All guide pages
- All collection pages
- All comparison pages
- City map pages (when implemented)

### Internal Linking Strategy

Every page should link to related pages:
- Route pages → related routes (already done) + relevant gift page + relevant guide
- Gift pages → 4-6 route pages + relevant guide
- Guide pages → relevant route pages + gift page
- Collection pages → all contained route pages
- All pages → "Create Your Own" CTA links to `/create`

---

## Implementation Phases

### Phase 1: Gift Pages (Weeks 1-2) ✅ COMPLETE

**Goal**: 5 gift pages live, targeting highest-volume gift keywords.

1. ✅ Create `GiftLandingPageClient.tsx` template component
2. ✅ Create `lib/seo/gifts.ts` with gift page metadata
3. ✅ Create `app/gift/[slug]/page.tsx` dynamic route
4. ✅ Build 5 gift pages: marathon-finisher, trail-runner, cyclist, first-marathon, personal-best
5. ✅ Add JSON-LD (FAQPage + Product schema) to gift pages
6. ✅ Update sitemap
7. Submit to Google Search Console + Bing Webmaster Tools

**Implemented (2026-02-07)**:

- 5 gift landing pages with UnifiedHeader, Footer, and real Supabase poster thumbnails
- 2-column hero with poster fan layout (3 real posters with rotation/offset)
- Style gallery section with 6 poster examples from Supabase (fallback to PosterThumbnail SVGs)
- FAQPage + Product JSON-LD structured data
- BreadcrumbList schema on all gift pages
- Sections: Hero → WhyThisGift → StyleGallery → FeaturedRoutes → Personalization → HowItWorks → Pricing → FAQ → RelatedGifts → FinalCTA → Disclaimer

### Phase 2: Guide Pages + LLM Optimization (Weeks 3-4) ✅ PARTIALLY COMPLETE

**Goal**: 5 guide pages live, `/llms.txt` deployed, Bing optimization.

1. ✅ Create `GuideLandingPageClient.tsx` template component
2. ✅ Create `lib/seo/guides.ts` with guide page metadata
3. ✅ Create `app/guide/[slug]/page.tsx` dynamic route
4. ✅ Build 5 guide pages: strava-to-poster, gpx-to-poster, 3d-print-running-route, custom-running-map, cycling-route-poster
5. ✅ Add HowTo schema (JSON-LD) to guide pages
6. Deploy `/llms.txt`
7. Set up Bing Webmaster Tools + IndexNow
8. ✅ Add BreadcrumbList schema to all pages

**Implemented (2026-02-07)**:

- 5 guide landing pages with UnifiedHeader, Footer, and real Supabase poster thumbnails
- 2-column hero with poster fan layout (3 real posters with rotation/offset)
- Step-by-step guide section with numbered steps and tips
- Style gallery section ("What You'll Create") with 6 poster examples
- HowTo + FAQPage + BreadcrumbList JSON-LD structured data
- Sections: Hero → StepByStep → StyleGallery → Tips → FAQ → RelatedGuides → FinalCTA → Disclaimer

**Remaining**:

- Deploy `/llms.txt` file
- Set up Bing Webmaster Tools + IndexNow

### Phase 3: Route Catalog Expansion (Weeks 5-8)

**Goal**: 100+ route pages covering half marathons, ultra trails, cycling climbs.

1. Add Batch 1 routes (10 half marathons) to `routes.ts` + seed data
2. Add Batch 2 routes (10 ultra trails) to `routes.ts` + seed data
3. Add Batch 3 routes (9 cycling climbs) to `routes.ts` + seed data
4. Run seed script for all new routes
5. Generate example poster images for top 20 routes
6. Verify all pages render correctly and have proper schema

### Phase 4: Collection & Comparison Pages (Weeks 9-10)

**Goal**: Collection pages for internal linking, comparison pages for decision-stage queries.

1. Create `CollectionLandingPageClient.tsx` template
2. Build 6 collection pages (World Majors, European, TdF, Hiking, UK, Alpine)
3. Create `CompareLandingPageClient.tsx` template
4. Build 3 comparison pages
5. Update internal linking across all pages

### Phase 5: City Map Pages (Weeks 11-16)

**Goal**: Top 50 cities with map poster pages.

1. Design city map page template (different from route pages)
2. Create city data model and metadata
3. Generate city map previews
4. Build 50 city pages
5. Implement city-route cross-linking

### Phase 6: Testimonials (When Ready)

**Goal**: Add real customer testimonials to all page types.

1. Set up post-purchase email flow (Brevo) requesting reviews
2. Build `TestimonialsSection` component
3. Add Review/AggregateRating JSON-LD schema
4. Deploy to route pages first, then gift and guide pages
5. Enable testimonial display once 10+ genuine reviews collected

---

## Success Metrics

| Metric | Current | 3-Month Target | 6-Month Target |
|--------|---------|----------------|----------------|
| SEO landing pages | 46 | 150 | 500+ |
| Organic traffic (monthly) | Baseline | 3x baseline | 10x baseline |
| Gift page conversions | 0 | 50/mo | 200/mo |
| Guide page traffic | 0 | 2,000/mo | 10,000/mo |
| LLM citations | Unknown | Track via PostHog | 100+ referrals/mo |
| Bing organic traffic | Minimal | 500/mo | 2,000/mo |
| Average position (target keywords) | Unranked | Top 20 | Top 10 |

### Tracking

- **PostHog**: Track page views, CTA clicks, and conversions per landing page type
- **Google Search Console**: Monitor impressions, clicks, and position for target keywords
- **Bing Webmaster Tools**: Monitor Bing-specific metrics
- **LLM referral tracking**: UTM parameter detection for AI-sourced traffic (`?ref=chatgpt`, `?ref=perplexity`)

---

## Appendix: FAQ Content Templates

### Gift Page FAQs

```
Q: How long does it take to create a poster?
A: About 5 minutes. Choose a route, customize the style, and download instantly.

Q: Can they add their own data later?
A: Yes! Send them the link and they can import their Strava data or upload a GPX file to personalize it with their exact route.

Q: What sizes are available?
A: From A4 up to 24x36 inches, all at print-quality 300 DPI. Perfect for any frame size.

Q: Is it a physical poster or digital?
A: It's a digital download (high-resolution PNG). You can print it at home or any print shop for the best quality.

Q: What's the 3D sculpture option?
A: An STL file that shows the route in 3D with terrain elevation. Perfect for 3D printing a physical keepsake. Starting at €29.
```

### Guide Page FAQs

```
Q: Do I need a Strava account?
A: Only if you want to import directly from Strava. You can also upload a GPX file or draw a route manually.

Q: What file formats do I get?
A: High-resolution PNG for posters (up to 7200x10800px) or STL for 3D printing.

Q: Can I create a poster without GPS data?
A: Yes! Use the built-in route builder to draw any route directly on the map with automatic road snapping.

Q: How much does it cost?
A: Poster downloads start at €12, 3D sculpture files at €29. Free to design and preview.
```

---

## Design Direction & CRO Guide

### Design Aesthetic: "Cartographic Luxury"

The landing pages should feel like an outdoor-brand lookbook crossed with a high-end print shop. Think: the reverence Aesop gives to skincare, applied to route maps. Not generic SaaS, not sports-tech bro. Elevated, tactile, and worth framing.

**Key Principles**:
- **Tactile quality**: The page should make you *feel* the poster — shadows that suggest paper weight, subtle grain that implies print texture, generous white space that evokes a gallery wall.
- **Cartographic heritage**: Topographic contour lines as decorative motif (already present in the current hero), muted earth tones from the outdoor palette, data presented with the precision of a survey map.
- **Product as hero**: The poster/sculpture image does the heavy lifting. Every design choice serves to make the product preview look irresistible.

**What Makes It Unforgettable**: The **route line itself** is the visual identity. Every page should feel like the route is drawn *through* the page — as a subtle decorative element in backgrounds, as a section divider, as the connecting thread (literally) in the "How It Works" flow. The route is not just content; it's the page's DNA.

### CRO Principles

#### 1. One CTA, Repeated — Not Competing

Every page has ONE primary action: **"Create Your Poster"** (links to `/create?route=[slug]&source=seo`). This CTA appears:
- Hero section (above the fold)
- After ProductShowcase
- After HowItWorks
- Final CTA section

Use the **same orange accent button** (`bg-accent`) every time. No secondary CTAs that compete. The "See Examples" button in the hero is an anchor link, not a navigation away.

**Current issue**: The secondary "See Examples" button has almost equal visual weight to the primary CTA. Fix: reduce it to a text link with underline or make it noticeably smaller.

#### 2. Price Anchoring — Early & Contextual

**Current state**: Price appears as a floating badge on the hero poster image ("Starting at €12") and again in ProductShowcase.

**Improvement**: Add price context at every CTA touchpoint:
- Hero CTA: "Create Your Poster" with "Starting at €12" subtitle
- HowItWorks CTA: "Start Creating Now — from €12"
- Final CTA: "Starting at €12 · High-resolution · No subscription"

Price should never feel like a "reveal" — it should feel like a reassurance. The €12 starting price is a genuine advantage; use it aggressively.

#### 3. Social Proof Hierarchy

Since testimonials are deferred (waiting for real customers), use these social proof signals in order of priority:

1. **Specificity badges** (already present): "11 Map Styles", "15+ Palettes", "300 DPI"
2. **Product quality signals**: Show the actual poster at high resolution. The product IS the social proof.
3. **Process credibility**: "Used by runners from 40+ countries" (when we have data)
4. **Platform trust**: Strava integration badge, "Secure payment via Stripe" (in Final CTA)
5. **Testimonials** (Phase 2): Real customer quotes with route-specific context

#### 4. Reduce Cognitive Load

**Current issue**: 10 sections is a lot. Not every visitor needs every section.

**Priority for above-the-fold + first scroll**:
1. Hero (with poster image + CTA)
2. RouteDetails (the "proof" this is real data)
3. ProductShowcase (what you get)
4. HowItWorks (how easy it is)

**Below the fold** (for engaged visitors):
5. Personalization
6. Gift Messaging (or flip with Personalization based on traffic intent)
7. FAQ
8. Related Routes
9. Final CTA

**Recommendation**: Consider merging GiftMessaging into the Hero subtitle/intro for race pages, rather than giving it a full section. The gift angle is important for SEO but doesn't need 4 cards on every page.

#### 5. Speed Beats Everything

Every 100ms of load time costs ~1% conversion. Optimizations:

- **Lazy-load below-fold sections**: Use `whileInView` (already present) but also `React.lazy()` for section components below the fold
- **Reduce animation overhead**: The current page has 20+ `motion.div` elements with `whileInView`. Batch animations — use a single `staggerContainer` per section rather than individual `whileInView` on every element
- **Critical CSS**: The hero section's topographic SVG pattern is inline — good. Keep it that way.
- **Image priority**: Only the hero poster image should have `priority`. All other images should lazy-load.

### Section-by-Section Blueprint

#### Hero Section

**Goal**: Instant clarity on what this page is, visual desire for the product, and a clear CTA.

**Layout**: Two-column on desktop (content left, poster right). Content stacked above poster on mobile.

**Content hierarchy**:
```
[Category Badge]                        ← Small, muted. Dynamic per category
[H1: Route Name + "Route Poster"]      ← Bold, Sora display font
[Subtitle: Distance · Location]         ← Muted, establishes specifics
[Intro paragraph]                       ← 1-2 sentences, unique per route (SEO-critical)
[Primary CTA] [Anchor: See Examples]    ← Orange button + text link
[Trust badges: 3 items inline]          ← Icon + label, compact
```

**Poster Preview** (right column):
- 3:4 aspect ratio container
- Poster image with subtle paper-texture shadow (box-shadow that implies depth, not flat drop-shadow)
- Price badge floating at bottom-right: "Starting at €12"
- On hover: very subtle scale (1.02) + shadow increase — makes it feel "liftable"

**CRO improvements**:
- [ ] Hero image should use `object-cover` not `object-contain` when the poster has padding — or add a visible frame/mat effect around it
- [ ] The category badge should be dynamic: "Marathon Route" for race, "Hiking Trail" for trail, "Cycling Route" for cycling
- [ ] Add a subtle scroll indicator (bouncing chevron) below the fold on mobile

**Visual treatment**: The hero background should use the route's `routeColor` as a subtle accent in the gradient, not just the generic `primary/5`:

```tsx
// Dynamic hero gradient using route color
<div
  className="absolute inset-0"
  style={{
    background: `linear-gradient(135deg,
      var(--stone-100) 0%,
      var(--stone-50) 40%,
      ${route.routeColor}08 100%)`
  }}
/>
```

#### Route Details Bar

**Goal**: Establish credibility with real data. The "proof bar" for Google and LLMs.

**Layout**: Horizontal pill bar, centered, with dividers. Not cards — pills are more compact and scannable.

**CRO notes**:
- Keep this compact. It's informational, not persuasive.
- Use `font-mono` (JetBrains Mono) for numbers — adds precision feeling
- The "Official Website" link builds trust and is good for SEO (external link to authoritative source)

#### Product Showcase Section

**Goal**: Show exactly what the customer gets. Highest-conversion section after the hero.

**CRO improvements**:
- [ ] **Show multiple poster styles**: Instead of showing the same poster in both Hero and ProductShowcase, show 3-4 style variations in a small horizontal carousel within the Poster tab
- [ ] **Add comparison table** below the tabs:
  ```
  |            | Poster        | 3D Sculpture |
  |------------|---------------|--------------|
  | Format     | PNG (300 DPI) | STL file     |
  | Sizes      | A4 to 24×36"  | 10-20cm      |
  | Price from | €12           | €29          |
  | Best for   | Wall art      | Desk/shelf   |
  ```
- [ ] **"Most Popular" badge**: Add a subtle tag on the Poster tab to anchor the default choice
- [ ] The feature list should use checkmarks, not "+" symbols — checkmarks have higher perceived value
- [ ] The CTA button should include the price: "Create Yours — from €12"

**Poster style gallery** (new sub-component):
```tsx
// Show 3-4 style variations as small thumbnails below the main preview
<div className="flex gap-3 mt-4">
  {route.exampleImages?.map((img) => (
    <button
      key={img.label}
      onClick={() => setActiveStyle(img)}
      className="w-16 h-20 rounded-lg overflow-hidden border-2 border-transparent
                 hover:border-primary transition-colors"
    >
      <Image src={img.url} alt={img.label} fill className="object-cover" />
    </button>
  ))}
</div>
```

#### How It Works Section

**Goal**: Eliminate friction by showing how simple the process is.

**3 steps with route-line connector**:

| Step | Icon | Title | Description |
|------|------|-------|-------------|
| 01 | MapPin | **Choose Your Route** | "Start with {route.name} pre-loaded, or import your own GPS data from Strava or GPX file." |
| 02 | Palette | **Design Your Poster** | "Pick from 11 map styles and 15+ color palettes. Add your finish time, date, and personal text." |
| 03 | Download | **Download & Print** | "Get a high-resolution file ready for any print shop. Or export a 3D sculpture STL." |

**CRO improvements**:
- [ ] **Add micro-visuals**: Each step should have a small illustration or screenshot, not just an icon
- [ ] **Connecting line should use `routeColor`**: The connector between steps should match the route's color — reinforces the route-as-DNA concept:
  ```tsx
  <div
    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5"
    style={{
      backgroundImage: `repeating-linear-gradient(to right,
        ${route.routeColor}80 0, ${route.routeColor}80 8px,
        transparent 8px, transparent 16px)`,
    }}
  />
  ```
- [ ] **Add time anchor**: "Most people finish in under 5 minutes" below the steps
- [ ] **Add CTA after step 3**: "Start with {route.name} →" button

#### Personalization Section

**CRO improvements**:
- [ ] **Lead with Strava**: For race/running pages, the Strava import feature is the strongest differentiator. Make it the first card with more visual prominence (larger, colored border).
- [ ] **Show before/after**: The same route in two different styles side by side is more persuasive than describing features.
- [ ] Consider horizontal scroll of feature cards on mobile rather than a 2×2 grid.

#### Gift Messaging Section

**CRO improvements**:
- [ ] **Make contextual**: For race pages: "Know someone who ran {route.name}?". For trail: "Perfect gift for someone who conquered this trail."
- [ ] **Reduce to 2-3 cards** (4 cards dilute the message):
  1. "Commemorate Their Achievement" (race) / "Celebrate the Adventure" (trail/cycling)
  2. "Personalize It" (add their time, date, Strava data)
  3. "Ready in 5 Minutes" (gift urgency/ease)
- [ ] **Add gift CTA**: "Create a Gift Poster →" with a gift icon. Link to same `/create` page with `&intent=gift` for analytics.

#### FAQ Section

**CRO improvements**:
- [ ] **Put highest-converting questions first**:
  1. "How much does it cost?" (price transparency)
  2. "What do I get?" (format/quality)
  3. "Can I use my own GPS data?" (Strava/GPX — differentiator)
  4. Route-specific questions
  5. General questions
- [ ] **First FAQ auto-expanded**: Increases engagement and content visibility for LLMs
- [ ] **Structured answer format**: Each answer starts with a direct one-sentence answer, then elaborates. LLMs prefer this for citation.

#### Related Routes Section

**CRO improvements**:
- [ ] **Show poster thumbnails**: Each card should show a small poster preview, not just an icon. Dramatically more clickable.
- [ ] **Dynamic heading**: "More Marathon Routes" for race, "More Hiking Trails" for trail, "More Cycling Routes" for cycling
- [ ] **Specific link text**: "View {route.name} Poster →" not just a clickable card

#### Final CTA Section

**CRO improvements**:
- [ ] **Address the #1 objection**: "No account needed to start designing. Pay only when you're happy with your poster."
- [ ] **Add trust signals**: "Secure payment via Stripe · Instant download · No subscription"
- [ ] **No fake urgency**: No countdown timers or "limited time" — the "Takes just 5 minutes" badge is good. Urgency comes from event dates ("Create your London Marathon poster before April 2026").
- [ ] **Background uses `routeColor`**: Tint the CTA gradient with the route's color for visual consistency.

### Typography & Color Rules

#### Font Usage

| Element | Font | Weight | Size (Desktop) | Size (Mobile) |
|---------|------|--------|-----------------|----------------|
| H1 (route name) | Sora (display) | 700 | `text-5xl` to `text-6xl` | `text-4xl` |
| H2 (section heads) | Sora (display) | 700 | `text-3xl` to `text-4xl` | `text-2xl` to `text-3xl` |
| H3 (card titles) | Sora (display) | 600 | `text-lg` to `text-xl` | `text-lg` |
| Body text | Source Sans 3 | 400 | `text-lg` | `text-base` |
| Data/stats | JetBrains Mono | 500 | `text-sm` to `text-base` | `text-sm` |
| Badges/labels | Source Sans 3 | 500-600 | `text-xs` to `text-sm` | `text-xs` |
| Price | Sora (display) | 700 | `text-2xl` to `text-3xl` | `text-2xl` |

#### Color Application

**Primary palette** (defined in `globals.css`):
- **Forest Green** (`--primary`): Section headings, icons, trust badges
- **Summit Orange** (`--accent`): All CTA buttons, price highlights, "starting at" labels
- **Trail Tan** (`--secondary`): Subtle background tints, dividers
- **Stone neutrals**: Body text, backgrounds, cards

**Route-specific color** (`route.routeColor`):
- Hero gradient accent
- HowItWorks connector line
- RouteDetails icon color
- Final CTA gradient tint
- Related route card accent

**Rule**: The route's color should appear as an accent, never as the dominant color. The page's primary identity is GridLine's green/orange, not the route's color.

### Motion & Interaction

#### Animation Budget

Keep animations purposeful and fast. Target: **maximum 10 animated elements per page**.

**High-impact animations** (keep):
- Hero content stagger (fade-in-up, 0.5-0.6s, sequential delays)
- Poster image scale-in (hero)
- Section headings fade-in on scroll

**Low-impact animations** (reduce):
- Individual cards animating separately — use a single stagger on the parent container instead
- Price badge animation — should just be there, not fade in
- Trust badges — should appear with the hero, not delayed

**Recommended pattern**:
```tsx
// Stagger children from parent instead of individual whileInView per card
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
  }}
>
  {cards.map((card) => (
    <motion.div
      key={card.id}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      }}
    >
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```

#### Hover States

- CTA buttons: `-translate-y-0.5` + shadow increase (current — good)
- Cards: `shadow-lg` + subtle scale (1.01-1.02)
- Poster images: Scale 1.02 + deeper shadow (suggests "pick it up")
- Related route cards: `-translate-y-1` (current — good)

### Mobile CRO

Mobile is likely 60-70% of traffic for these pages (running/cycling audience browses on phones).

#### Critical Mobile Rules

1. **Hero poster must be visible above the fold**: The H1 + subtitle + CTA should be compact enough that the poster image peeks without scrolling. Reduce vertical padding on mobile.

2. **CTA must be full-width on mobile**:
   ```tsx
   <Link className="w-full sm:w-auto inline-flex justify-center ...">
   ```

3. **Sticky CTA bar** — after the user scrolls past the hero, show a slim sticky bar at the bottom:
   ```tsx
   <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 backdrop-blur
                   border-t border-stone-200 sm:hidden">
     <Link href={createUrl}
       className="w-full flex items-center justify-center gap-2
                  px-6 py-3 bg-accent text-white font-semibold rounded-xl">
       Create Your Poster — from €12
     </Link>
   </div>
   ```

4. **Reduce section padding on mobile**: Use `py-12 sm:py-16 lg:py-20` instead of `py-20`.

5. **Consider mobile section reorder**: Move HowItWorks up on mobile (answer "how?" early):
   ```
   Desktop order:                Mobile order:
   1. Hero                       1. Hero
   2. RouteDetails               2. RouteDetails
   3. GiftMessaging              3. HowItWorks (moved up)
   4. ProductShowcase            4. ProductShowcase
   5. Personalization            5. Personalization
   6. HowItWorks                 6. GiftMessaging (moved down)
   7. FAQ                        7. FAQ
   8. Related Routes             8. Related Routes
   9. Final CTA                  9. Final CTA
   ```

### Page-Type Design Variations

#### Route Pages (`/race/`, `/trail/`, `/cycling/`)

| Element | Race/Marathon | Trail/Hiking | Cycling |
|---------|-------------|--------------|---------|
| Category badge icon | Trophy | Mountain | Bike (add) |
| Category badge text | "Marathon Route" | "Hiking Trail" | "Cycling Route" |
| Gift messaging lead | "Finishing X is a milestone" | "Conquering X is an adventure" | "Riding X is a challenge" |
| HowItWorks step 1 | "Start with the official race route" | "Start with the trail map" | "Start with the cycling route" |
| Related heading | "More Marathon Routes" | "More Hiking Trails" | "More Cycling Routes" |
| Default poster style | `mapbox-streets` | `outdoor` | `minimalist` |

#### Gift Pages (`/gift/[slug]`) — New Template

- Hero leads with "The Perfect Gift for [Audience]" — audience-first, not route-first
- No RouteDetails section
- Featured route grid replaces ProductShowcase (4-6 route posters)
- HowItWorks is gift-framed: "Choose Their Route → Personalize It → Gift It"
- CTA: "Create Their Gift Now"

#### Guide Pages (`/guide/[slug]`) — New Template

- Hero leads with "How to [Action]" — instructional framing
- Main content is a step-by-step tutorial with screenshots
- CTA after each major step ("Try it yourself")
- HowTo schema (JSON-LD) for Google rich results
- No GiftMessaging; "Related Guides" section at bottom instead

#### Collection Pages (`/collection/[slug]`) — New Template

- Hero: Collection title + intro + poster grid preview
- Main content: Full grid of all routes in collection with poster thumbnails
- Compact layout — browse page, not sales page
- "Or create your own" CTA at bottom

### Anti-Patterns to Avoid

1. **No generic stock photos**: Every image should be an actual poster/sculpture render. If unavailable, use the map placeholder with the route's color — never a stock photo.
2. **No fake urgency**: No countdown timers, no "only X left". Urgency comes from event dates.
3. **No walls of text**: Every section scannable. Max 3 lines per paragraph on desktop.
4. **No autoplay video**: Use static screenshots with optional "Watch demo" link.
5. **No popup modals on entry**: The page's job is conversion to `/create`, not email collection.
6. **No hero carousel**: Single best-looking poster image in hero. Save carousels for ProductShowcase.
7. **No "Starting at €0" tricks**: "Starting at €12" is honest. "Free to design, pay only to download" is mentioned in context, never as headline.
8. **No over-animation**: Maximum 10 animated elements per page.

### Design Implementation Checklist

#### Quick Wins (apply to existing template)

- [ ] Dynamic hero gradient using `routeColor`
- [ ] Route-specific category badge text (not hardcoded "Marathon Route")
- [ ] First FAQ auto-expanded
- [ ] Price at every CTA ("Create Yours — from €12")
- [ ] Reduce secondary CTA visual weight in hero
- [ ] Full-width CTA on mobile
- [ ] `font-mono` for numeric data (distance, elevation)
- [ ] Sticky mobile CTA bar
- [ ] Reduce section padding on mobile (`py-12 sm:py-16 lg:py-20`)

#### New Components Needed

- [ ] `StickyMobileCTA` — fixed bottom bar on mobile
- [ ] `PosterStyleGallery` — small thumbnail carousel for ProductShowcase
- [ ] `ComparisonTable` — poster vs sculpture comparison
- [x] `GiftLandingPageClient` — gift page template ✅
- [x] `GuideLandingPageClient` — guide page template ✅
- [ ] `CollectionLandingPageClient` — collection page template

#### PostHog Events for CRO Tracking

| Event | Trigger | Properties |
|-------|---------|------------|
| `seo_cta_click` | Any CTA button clicked | `section`, `route_slug`, `category` |
| `seo_tab_switch` | Poster/Sculpture tab switch | `tab`, `route_slug` |
| `seo_faq_expand` | FAQ question expanded | `question_index`, `route_slug` |
| `seo_related_click` | Related route card clicked | `target_slug`, `source_slug` |
| `seo_style_preview` | Style thumbnail clicked in gallery | `style`, `route_slug` |
| `seo_scroll_depth` | Scroll milestones (25%, 50%, 75%, 100%) | `depth`, `route_slug` |
| `seo_sticky_cta_click` | Mobile sticky CTA tapped | `route_slug` |
