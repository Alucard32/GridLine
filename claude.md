# GridLine - Development Context

> **Single source of truth** for AI development context.
> - See [STATUS.md](STATUS.md) for completed features & history
> - See [FEATURES.md](FEATURES.md) for roadmap & strategy
> - See [docs/PHASE4-3D-PRINTING.md](docs/PHASE4-3D-PRINTING.md) for Phase 4 specification
> - See [docs/PROGRAMMATIC-SEO.md](docs/PROGRAMMATIC-SEO.md) for SEO growth strategy
> - See [docs/PRD-FAMOUS-ROUTES-SEEDING.md](docs/PRD-FAMOUS-ROUTES-SEEDING.md) for famous routes database seeding
> - See [docs/PRD-BREVO-EMAIL-AUTOMATION.md](docs/PRD-BREVO-EMAIL-AUTOMATION.md) for email automation strategy
> - See [docs/PRD-SEO-LANDING-PAGES.md](docs/PRD-SEO-LANDING-PAGES.md) for SEO landing pages strategy & implementation

---

## Development Workflow Rules

**CRITICAL**: Follow these rules when developing features for GridLine.

### Git & Commits

- **NEVER commit to GitHub unless explicitly told to do so**
- Wait for user approval after implementing and testing each feature
- User will manually verify features work before committing
- Commit messages should follow conventional commits format

### Export Pipeline is King

- **Every feature MUST work with the export functionality** — this is what customers pay for
- Always test both:
  - **Poster export (PNG)**: Verify feature renders correctly in high-res PNG export
  - **Sculpture export (STL)**: Verify feature works with 3D sculpture generation
- The editor preview is just a preview — the export is the product
- If a feature looks good in the editor but breaks in export, it's not done

### Dev Server

- **NEVER run `npm run dev`** — the user will handle starting the dev server
- Only run build commands (`npm run build`, `npm run lint`, `npm run typecheck`) to verify code compiles

### Feature Implementation Checklist

1. ✅ Implement feature in editor/preview
2. ✅ Verify TypeScript compiles (`npm run build`)
3. ✅ Test feature renders correctly in PNG export
4. ✅ Test feature works with 3D sculpture (if applicable)
5. ✅ Verify existing features still work
6. ✅ Wait for user approval
7. ✅ Commit only when user explicitly requests it

---

## Quick Reference

**Brand**: GridLine (gridline.eu)
**Phase**: Core Features ✅ Complete — SEO Landing Pages Phase 1-2 ✅ Complete
**Dev Server**: http://localhost:3000

### What's Working

- 11 map styles with 15+ palettes
- GPX route upload with styling (color, width, opacity, dash patterns)
- Multi-point route builder with OSRM road snapping (walking + cycling profiles)
- Strava Connect: import activities directly from your Strava account
- 3D terrain elevation with MapTiler terrain-rgb tiles
- 3D buildings with style presets & perspective controls
- 3D Journey Sculptures with STL export for 3D printing
- High-res PNG export (up to 7200x10800px)
- Scale bar with Haversine distance calculation
- Stripe payment integration for poster and sculpture exports
- Social features (feed, likes, comments, sharing)
- User auth (email/password + Google OAuth) via Supabase
- Marketing landing page with scroll animations
- PostHog analytics (16 custom events)
- GDPR-compliant cookie consent
- Famous routes seeding (41 pre-seeded routes with thumbnails)
- API usage monitoring dashboard
- Programmatic SEO pages (/race, /trail, /cycling)
- Gift SEO landing pages (/gift) — 5 pages targeting gift-intent keywords
- Guide SEO landing pages (/guide) — 5 pages targeting how-to keywords
- Feature voting system in export modals

---

## Trademark Policy

**IMPORTANT**: When working with famous routes and events:

1. **Use geographic/descriptive names** for products, not trademarked event names
   - ✅ "Boston 42K Running Route" (geographic)
   - ❌ "Boston Marathon Poster" (trademark)
   - ✅ "Mont Ventoux Cycling Route" (geographic)
   - ❌ "Tour de France Stage 16" (trademark)

2. **Body text for SEO context** - Can mention events in descriptions for SEO
3. **Disclaimers required** - All route landing pages include `RouteDisclaimer` component
4. **Route data is factual** - GPS coordinates themselves are not copyrightable

See `lib/seo/routes.ts` for the trademark-safe naming convention in the route catalog.

---

## Sitemap & Crawler Rules

**CRITICAL**: These rules MUST be followed to avoid breaking Google Search Console indexing.

### Sitemap Dates (`app/sitemap.ts`)

1. **Always use the correct year** — We are in **2026**. Never write `2025` for dates that should be `2026`. This mistake has happened multiple times.
2. **Date format**: Use `YYYY-MM-DD` only (e.g., `2026-02-07`). No ISO timestamps with milliseconds — Google Search Console rejects them.
3. **Dates must reflect actual content modification**, not sitemap generation date. Update the date only when page content actually changes.
4. **When adding new pages**: Set `lastModified` to the date the content was created/deployed.
5. **When modifying existing pages**: Update the relevant `lastModified` date to the current date.
6. **Verify after changes**: Always check the generated XML in `.next/server/app/sitemap.xml.body` after building to confirm dates are correct.

Current date groups in `app/sitemap.ts`:

- `staticContentDate`: For landing page, create, feed, FAQ, legal pages
- `routeContentDate`: For `/race/`, `/trail/`, `/cycling/` route pages
- `giftContentDate`: For `/gift/` and `/guide/` pages

### Middleware Exclusions (`middleware.ts`)

**NEVER let the Supabase auth middleware run on crawler-facing routes.** The middleware matcher MUST exclude:

- `sitemap.xml` — Supabase auth calls can timeout/fail, causing Google "Couldn't fetch" errors
- `robots.txt` — Must be accessible without any auth processing

These are excluded in the middleware matcher regex. If adding new SEO files (e.g., `llms.txt`), add them to the exclusion list too.

---

## Tech Stack

- **Framework**: Next.js 14+ App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map**: MapLibre GL JS + React Map GL
- **3D**: React Three Fiber + Three.js (sculptures)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Checkout
- **Email**: Brevo (transactional + marketing)
- **Analytics**: PostHog
- **Tiles**: OpenFreeMap / MapTiler
- **Hosting**: Netlify

---

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/           # Login, signup
│   ├── (main)/           # Feed, profile, map detail
│   ├── api/              # geocode, tiles, publish, strava/*, orders/*
│   └── page.tsx          # Landing page
├── components/
│   ├── account/          # ConnectedServices (Strava)
│   ├── controls/         # Editor control panels
│   ├── landing/          # Marketing landing page sections
│   ├── map/              # MapPreview, TextOverlay
│   ├── sculpture/        # 3D sculpture viewer (R3F components)
│   ├── strava/           # StravaActivityPicker
│   ├── ui/               # Shared components
│   └── voting/           # Feature voting (ComingSoonCard, FeatureVoteButton)
├── lib/
│   ├── actions/          # Server actions (maps, votes, comments, orders)
│   ├── api-usage/        # API usage tracking system
│   ├── brevo/            # Brevo email (contacts, events, transactional)
│   ├── errors/           # Custom error classes
│   ├── features/         # Feature voting config (comingSoon.ts)
│   ├── middleware/       # Rate limiting, CSRF protection
│   ├── route/            # GPX parsing + route builder (OSRM snapping)
│   ├── strava/           # Strava API helpers
│   ├── stripe/           # Stripe client, products, checkout
│   ├── styles/           # 11 map style definitions
│   └── validation/       # Zod schemas
├── hooks/
│   └── useRouteDrawing.ts   # Draw mode state management (waypoints, OSRM snapping)
├── scripts/
│   └── seed-famous-routes/  # Famous routes seeding (41 routes)
└── types/
    ├── poster.ts         # Core type definitions
    ├── strava.ts         # Strava API types
    ├── sculpture.ts      # Sculpture config types
    ├── stripe.ts         # Order, checkout, download types
    └── database.ts       # Supabase types (includes orders)
```

---

## Site Map

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing page |
| `/create` | Map editor |
| `/login`, `/signup` | Auth pages |
| `/feed` | Published maps gallery |
| `/map/[id]` | Single map detail view |
| `/profile` | User's saved maps |
| `/faq` | Frequently asked questions |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/cookies` | Cookie Policy |
| `/admin/api-usage` | Admin API usage dashboard (password protected) |
| `/export/success` | Post-payment success page |

### SEO Route Pages (Programmatic)

| Route Pattern | Purpose |
|---------------|---------|
| `/race/[slug]` | Marathon/running route landing pages (e.g., `/race/boston-marathon`) |
| `/trail/[slug]` | Hiking trail landing pages (e.g., `/trail/camino-de-santiago`) |
| `/cycling/[slug]` | Cycling route landing pages (e.g., `/cycling/mont-ventoux-cycling-route`) |
| `/gift/[slug]` | Gift landing pages (e.g., `/gift/marathon-finisher`) |
| `/guide/[slug]` | Guide/how-to landing pages (e.g., `/guide/strava-to-poster`) |

See `lib/seo/routes.ts`, `lib/seo/gifts.ts`, `lib/seo/guides.ts` for all available slugs and `app/sitemap.ts` for sitemap generation.

### API Routes

- `/api/geocode` - Location search (Nominatim)
- `/api/tiles/[...path]` - Tile proxy
- `/api/publish` - Map publishing
- `/api/route/snap` - OSRM proxy for route snapping (foot/bike profiles)
- `/api/route/elevation` - Elevation lookup via MapTiler terrain-RGB tiles (sharp decoding)

### Strava API Routes

- `/api/strava/authorize` - Initiate Strava OAuth flow
- `/api/strava/callback` - Handle OAuth callback, store tokens
- `/api/strava/status` - Check connection status
- `/api/strava/disconnect` - Remove Strava connection
- `/api/strava/activities` - List user's Strava activities
- `/api/strava/activities/[id]` - Get activity detail with GPS streams

### Stripe/Orders API Routes

- `/api/stripe/create-checkout` - Create Stripe checkout session
- `/api/stripe/webhook` - Handle Stripe webhooks (payment completed, refunds)
- `/api/orders` - Create Stripe checkout session for export
- `/api/orders/complete` - Complete order after successful payment
- `/api/orders/[id]` - Get order status and download link

### Export API Routes

- `/api/export/download` - Secure download with token validation and limits

### Admin API Routes

- `/api/admin/usage` - API usage statistics dashboard (password protected)

### Specialty API Routes

- `/api/spaceports` - Rocket launch pad GeoJSON (Launch Library 2 API)

---

## Core Types

### PosterConfig
```typescript
interface PosterConfig {
  location: PosterLocation;
  style: PosterStyle;
  palette: ColorPalette;
  typography: TypographyConfig;
  format: FormatConfig;
  layers: LayerConfig;
  route?: RouteConfig;
}
```

### Key Layer Options
```typescript
layers: {
  streets: boolean;
  buildings: boolean;
  water: boolean;
  parks: boolean;
  terrain: boolean;
  labels: boolean;
  // 3D Terrain (MapLibre raster-dem)
  terrain3d?: boolean;
  terrain3dExaggeration?: number; // 0.5-3.0, default 1.5
  // 3D Buildings
  buildings3d?: boolean;
  buildings3dPitch?: number;      // 0-60°
  buildings3dBearing?: number;    // -180° to 360°
  buildings3dHeightScale?: number; // 0.5-3.0
  buildings3dStyle?: 'solid' | 'glass' | 'wireframe' | 'gradient';
  buildings3dOpacity?: number;    // 0-1
}
```

### RouteConfig
```typescript
interface RouteConfig {
  enabled: boolean;
  data?: RouteData;         // Points, stats, bounds
  style: RouteStyle;        // Color, width, opacity, lineStyle
  showStartMarker: boolean;
  showEndMarker: boolean;
  privacyZone: { enabled: boolean; distance: number; };
}
```

### SculptureConfig

```typescript
interface SculptureConfig {
  shape: 'rectangular' | 'circular';
  size: number;                      // 10, 15, or 20 (cm)
  material: 'pla' | 'wood' | 'resin';
  routeStyle: 'raised' | 'engraved';
  routeThickness: number;            // 1-5 mm
  routeColor: string;
  routeDepth: number;                // 0.01-0.1 (height/depth of route)
  routeElevationSource: 'gps' | 'terrain'; // GPS data or snap to terrain
  terrainColor: string;
  terrainMode: 'route' | 'terrain';  // Terrain data source
  terrainResolution: number;         // Grid resolution (64-256)
  terrainHeightLimit: number;        // Max height fraction (0.3-1.0)
  terrainSmoothing: number;          // Smoothing passes (0-3)
  routeClearance: number;            // Terrain lowering near route (0-0.15)
  elevationScale: number;            // 0.5-3.0
  baseHeight: number;                // 3-10 mm
  rimHeight: number;                 // 0-5 mm
  text: SculptureTextConfig;         // Title, subtitle, depth
  turntableEnabled: boolean;
  turntableSpeed: number;            // 0.1-1.0
}
```

---

## Coding Conventions

- TypeScript strict - no `any` without justification
- Next.js App Router patterns
- Tailwind CSS utilities over custom CSS
- PascalCase components, camelCase utilities
- Server components by default, client only when needed
- Keep components focused and composable

---

## Key Technical Notes

### Map Rendering
- MapLibre style spec with dynamic color swapping via `applyPalette()`
- `preserveDrawingBuffer: true` for canvas export
- GPX parsing with `@we-gold/gpxjs`

### Export
- Client-side canvas composition
- Target: up to 24x36" at 300 DPI (7200x10800px)
- Composite map + text overlays + route layers

### Data Persistence
- Map configs stored as JSONB in Supabase `maps` table
- Zod validation on save/load (`lib/validation/posterConfig.ts`)
- Route data included in config (no separate table needed)

---

## Common Tasks

### Adding a New Style
1. Create style in `lib/styles/[stylename].ts`
2. Define palettes and layer toggles
3. Register in `lib/styles/index.ts`

### Modifying Layer Options
1. Update type in `types/poster.ts`
2. Add Zod validation in `lib/validation/posterConfig.ts`
3. Add UI controls in `components/controls/LayerControls.tsx`
4. Handle in `lib/styles/applyPalette.ts` if affects rendering

---

## Resources

- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- [MapLibre Style Spec](https://maplibre.org/maplibre-style-spec/)
- [Nominatim API](https://nominatim.org/release-docs/develop/api/Search/)
