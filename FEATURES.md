# GridLine - Feature Roadmap & Strategy

> Future plans and business strategy. For completed features see [STATUS.md](STATUS.md).

**Last Updated**: 2026-02-07

---

## Strategic Summary

GridLine transforms GPS activity data into gallery-worthy wall art for outdoor adventurers. Custom poster art for hikers, cyclists, trail runners, and travelers.

### Ideal Customer Profile (ICP)

**Primary**: Active outdoor enthusiasts who want to commemorate their adventures

- **Hikers & Trail Runners**: Long-distance trails, summit attempts, national park visits
- **Cyclists**: Road cycling routes, mountain biking trails, bikepacking adventures
- **Travelers & Adventurers**: Road trips, backpacking journeys, expedition routes
- **Race Finishers**: Marathon runners, triathlon athletes, ultra-distance competitors

**Emotional Hook**: "I conquered this route — now it's art on my wall"

### Competitive Advantage

| Feature | GridLine | Competitors |
| ------- | --------- | ----------- |
| Map styles | 11 | 3-5 typically |
| Color palettes | 15+ | Limited |
| 3D buildings | ✅ 4 presets | ❌ |
| 3D terrain | ✅ | ❌ |
| 3D sculptures | ✅ STL export | ❌ |
| Scale bar | ✅ | Some |
| Privacy zones | ✅ | Some |
| High-res export | 7200x10800px | Varies |
| Social features | ✅ | ❌ |
| Strava integration | ✅ | Some |
| Route drawing/snapping | ✅ OSRM | ❌ |

**Positioning**: "Adventure route art that looks like a design studio made it"

---

## Next: Programmatic SEO Expansion (Growth Initiative)

> **Comprehensive specification**: [docs/PROGRAMMATIC-SEO.md](docs/PROGRAMMATIC-SEO.md)

Scale organic traffic through thousands of targeted landing pages capturing long-tail search queries.

### Phase 1 Complete ✅

**Implemented route landing pages:**

- `/race/[slug]` - Marathon and running routes
- `/trail/[slug]` - Hiking trail routes
- `/cycling/[slug]` - Cycling routes
- Sitemap integration, JSON-LD structured data, trademark-safe naming

### Phase 2 Complete ✅

**Gift & Guide SEO landing pages:**

> **Specification**: [docs/PRD-SEO-LANDING-PAGES.md](docs/PRD-SEO-LANDING-PAGES.md)

- `/gift/[slug]` - 5 gift pages (marathon-finisher, trail-runner, cyclist, first-marathon, personal-best)
- `/guide/[slug]` - 5 guide pages (strava-to-poster, gpx-to-poster, 3d-print-running-route, custom-running-map, cycling-route-poster)
- Real poster thumbnails from Supabase, UnifiedHeader/Footer, JSON-LD structured data

### Remaining Phases

| Category | Pages | Target Keywords | Status |
|----------|-------|-----------------|--------|
| Marathons & Races | ~500 | "[Race] route poster 2026" | ✅ Phase 1 |
| Trails & Hikes | ~200 | "[Trail] map print" | ✅ Phase 1 |
| Cycling Routes | ~300 | "[Route] cycling poster" | ✅ Phase 1 |
| Gift Pages | 5 | "gift for runner/cyclist" | ✅ Phase 2 |
| Guide Pages | 5 | "strava to poster", "gpx to poster" | ✅ Phase 2 |
| City Maps | ~10,000 | "[City] map poster" | Planned |
| Triathlons | ~100 | "Ironman [Location] map" | Planned |
| Bikepacking | ~150 | "[Route] bikepacking map" | Planned |
| Ultra Trails | ~100 | "[Race] ultra trail poster" | Planned |

### Next Steps

1. **Phase 3**: Route catalog expansion (half marathons, ultra trails, cycling climbs)
2. **Phase 4**: Collection & comparison pages
3. **Phase 5**: City map pages (~10,000 pages for major cities)

See [docs/PRD-SEO-LANDING-PAGES.md](docs/PRD-SEO-LANDING-PAGES.md) for complete PRD.

---

## Recently Completed

### SEO Landing Pages (Gift & Guide) ✅

> **Specification**: [docs/PRD-SEO-LANDING-PAGES.md](docs/PRD-SEO-LANDING-PAGES.md)

10 new SEO landing pages targeting gift-intent and how-to keywords.

- ✅ 5 gift pages (`/gift/[slug]`): marathon-finisher, trail-runner, cyclist, first-marathon, personal-best
- ✅ 5 guide pages (`/guide/[slug]`): strava-to-poster, gpx-to-poster, 3d-print-running-route, custom-running-map, cycling-route-poster
- ✅ Real poster thumbnails from Supabase (featured maps)
- ✅ JSON-LD: FAQPage, Product, HowTo, BreadcrumbList schemas
- ✅ Sitemap integration, UnifiedHeader/Footer

### Multi-Point Route Builder ✅

Draw routes directly on the map with automatic road/trail snapping via OSRM.

- ✅ Click-to-place waypoints on map with numbered markers
- ✅ OSRM road snapping (walking + cycling profiles)
- ✅ Elevation data via MapTiler terrain-RGB tiles (server-side sharp decoding)
- ✅ Live distance & elevation stats as route builds
- ✅ Undo/clear waypoints, profile switching
- ✅ Tab UI: Upload GPX / Draw Route / Import from Strava
- ✅ Works with poster export (PNG) and sculpture export (STL)
- ✅ Waypoints preserved for re-editing saved routes

### Feature Voting System ✅

User feedback system for prioritizing upcoming features in export modals.

- ✅ "Coming Soon" cards in poster and sculpture export modals
- ✅ Vote/unvote toggle with PostHog event tracking
- ✅ Anonymous voting via localStorage (no account required)
- ✅ Voteable features: Print fulfillment, framing, canvas, metal prints, 3D printing service

### Brevo Email Automation ✅

> **Specification**: [docs/PRD-BREVO-EMAIL-AUTOMATION.md](docs/PRD-BREVO-EMAIL-AUTOMATION.md)

User lifecycle email automation for retention and conversion.

- ✅ Contact management (create/update on signup)
- ✅ Event tracking (signup, Strava connect, purchase)
- ✅ Marketing consent checkbox
- ✅ Email template documentation

### Programmatic SEO Pages (Phase 1) ✅

- ✅ Race landing pages (`/race/[slug]`)
- ✅ Trail landing pages (`/trail/[slug]`)
- ✅ Cycling landing pages (`/cycling/[slug]`)
- ✅ Sitemap integration
- ✅ RouteDisclaimer for trademark safety

### 3D Journey Sculptures ✅

> **Specification**: [docs/PHASE4-3D-PRINTING.md](docs/PHASE4-3D-PRINTING.md)
> **Developer Guide**: [docs/3D-SCULPTURE-GUIDE.md](docs/3D-SCULPTURE-GUIDE.md)

Transform GPS routes into physical 3D sculptures — tangible keepsakes of adventures.

**Completed Features**:

- ✅ React Three Fiber rendering engine with OrbitControls
- ✅ GPS route extrusion as 3D tube geometry
- ✅ 2 base shapes (Rectangular, Circular) with rim options
- ✅ Material presets (PLA, Wood, Resin) with realistic textures
- ✅ Studio lighting with environment presets
- ✅ Post-processing pipeline (SMAA anti-aliasing)
- ✅ Turntable animation for showcase views
- ✅ STL export for 3D printing
- ✅ Route style options (raised tube vs engraved groove)
- ✅ Route elevation source (GPS data vs terrain snap)
- ✅ Terrain height controls (elevation scale, height limit, smoothing)
- ✅ Auto-orient route start to front
- ✅ Engraved text on base with customization

### Stripe Payment Integration ✅

- ✅ Stripe Checkout for poster exports
- ✅ Stripe Checkout for sculpture exports
- ✅ Order tracking in Supabase
- ✅ Secure download flow after payment

### 3D Terrain ✅

- ✅ MapLibre raster-dem terrain rendering
- ✅ Vertical exaggeration controls (0.5-3.0)
- ✅ Applied to map posters and route visualization

---

## In Progress: Cartographic Enhancements

Adopting high-value features from the upstream carto-art repository to enhance poster design capabilities.

### Scale Bar ✅

Dynamic distance scale for professional cartographic output.

- ✅ Haversine formula for accurate ground distance
- ✅ Auto-switches from meters to kilometers at 1000m
- ✅ Position options (top-left, top-right, bottom-left, bottom-right)
- ✅ Color picker matching poster palette
- ✅ Renders correctly in PNG export

### Compass Rose (Next Up)

SVG compass for circular poster formats — adds a nautical/expedition feel.

- [ ] 8 cardinal/intercardinal directions (N, NE, E, SE, S, SW, W, NW)
- [ ] 24 intermediate tick marks at 15° intervals
- [ ] Uses palette accent color
- [ ] Only renders on circular mask posters
- [ ] Renders in PNG export

**Config exists**: `format.compassRose?: boolean` — just needs component implementation.

### Custom Markers System (Planned)

Enable users to annotate posters with multiple custom location markers.

- [ ] Multiple markers per poster (not just center)
- [ ] 6 marker types: pin, crosshair, dot, ring, heart, home
- [ ] Color and size customization per marker
- [ ] Optional labels with 4 styles (standard, elevated, glass, vintage)
- [ ] Marker path lines connecting points
- [ ] Fill polygon option for marked areas

**Use case**: Mark trail highlights, summit points, rest stops, photo spots.

---

## Future Phases

### Phase 2: Sailing & Voyage Maps

- Nautical mile display
- Port markers for stops
- Nautical chart styling
- Ocean-themed palettes

**Why this niche**: Less crowded, higher price tolerance, already supports routes.

### Phase 3: Advanced Terrain (Deferred)

- Ray-marched terrain shadows with deck.gl
- Configurable light direction (azimuth/altitude)
- Shadow darkness and tint controls

**Why deferred**: Complex implementation, deck.gl dependency, focus on print features first.

---

## Feature Backlog

### Route Enhancements

- [ ] Elevation gradient coloring (show climb difficulty)
- [ ] Glow/shadow effects on route line
- [ ] Mile/KM markers along route
- [ ] Segment highlighting (e.g., steepest climb)
- [x] Strava OAuth integration ✅
- [x] Multi-point route builder with OSRM road snapping ✅
- [ ] Garmin Connect integration
- [ ] Komoot integration

### Cartographic Features

- [ ] Topographic contour lines overlay
- [ ] Trail difficulty indicators
- [ ] Elevation profile mini-chart
- [ ] Distance annotations on route

### Export & Print

- [ ] PDF export (vector output)
- [ ] SVG export for certain styles
- [ ] Print partnership (Printful, Gelato)
- [ ] Multiple print sizes (A4, A3, A2, A1)
- [ ] Physical 3D print fulfillment service

### Editor Enhancements

- [ ] Undo/redo
- [ ] Keyboard shortcuts
- [ ] Famous routes library (pre-loaded popular trails)
- [ ] URL-based state for sharing configs
- [ ] Route simplification slider (reduce detail)

### Social & Community

- [ ] Collections/folders for organizing maps
- [ ] Search within feed
- [ ] User profiles with bio/avatar
- [ ] Follow users
- [ ] Challenge/event groups

### Polish

- [ ] Onboarding tutorial for first-time users
- [ ] Accessibility improvements
- [x] Mobile editor optimization ✅

---

## 3D Sculpture Export Quality ✅ COMPLETED

**Status**: ✅ Fixed — Paid exports now deliver print-quality STL files (~400K triangles).

The export pipeline has been upgraded from browser-preview quality to professional print quality.

### Issues Fixed

| Issue | Status | Solution Implemented |
| ----- | ------ | -------------------- |
| Route tube faceted | ✅ Fixed | 24 radial segments for export (was 8), 12 for preview |
| Terrain mesh blocky | ✅ Fixed | 256×256 grid for high quality exports |
| Route decimation crude | ✅ Fixed | Douglas-Peucker algorithm preserves shape |
| Text hard to read | ✅ Fixed | 2048px canvas, 1.2mm engraving depth |
| Terrain smoothing weak | ✅ Fixed | Multi-pass Gaussian smoothing |
| Preview/export mismatch | ✅ Fixed | Settings sync (heightLimit, clearance, rotation) |
| No mesh validation | ⏳ Planned | Add watertight/manifold checks |

### Current Output Quality

| Printer Type | Max Supported | GridLine Output | Status |
| ------------ | ------------- | ---------------- | ------ |
| Desktop FDM | 2-5 million | ~400K | Good |
| Resin SLA | 10-50 million | ~400K | Good |
| Industrial | 50+ million | ~400K | Good |

### Export Quality Presets (Implemented)

| Preset | Route Segments | Terrain Grid | Est. Triangles | File Size |
|--------|----------------|--------------|----------------|-----------|
| Draft | 8 radial | 128×128 | ~50K | ~2MB |
| Standard | 16 radial | 192×192 | ~200K | ~10MB |
| **High Quality** | 24 radial | 256×256 | ~400K | ~20MB |
| Ultra | 32 radial | 384×384 | ~1M | ~50MB |

**Note**: Paid exports automatically use "High Quality" preset.

### Completed Implementation

**Core Quality Improvements**:

- [x] Export quality presets system (draft, standard, high, ultra) ✅
- [x] Route tube radial segments (8 → 24 for export, 12 for preview) ✅
- [x] Douglas-Peucker algorithm for shape-preserving route simplification ✅
- [x] Multi-pass Gaussian smoothing for terrain surfaces ✅
- [x] Text improvements (2048px canvas, 1024×512 grid, 1.2mm depth) ✅
- [x] Terrain smoothing controls (0-3 passes configurable) ✅

**Export UX Improvements**:

- [x] Pre-export estimation UI (triangles, file size, generation time) ✅
- [x] Progress tracking during export with stage indicators ✅
- [x] Keep-tab-open warning for longer exports ✅

**Preview/Export Consistency**:

- [x] Sync terrainHeightLimit, routeClearance, routeDepth to export ✅
- [x] Apply terrainRotation to STL export (was preview-only) ✅
- [x] Route tube positioning aligned with terrain clearance ✅
- [x] Pass terrain mode to elevation grid for export ✅

**Additional Features**:

- [x] Route elevation source toggle (GPS data vs terrain snap) ✅
- [x] Route clearance optimization (terrain dips beneath raised routes) ✅
- [x] Auto-orientation of route start to front ✅

### Remaining Tasks

- [ ] Add mesh validation (manifold check, self-intersection detection)
- [ ] Add "Optimize for printing" post-processing step (vertex welding)
- [ ] Export quality selector in modal (currently auto-high for paid)

---

## Technical Debt

| Issue | Priority |
| ----- | -------- |
| ~~3D export quality~~ | ✅ Fixed |
| ESLint warnings (143, mostly `any`) | Medium |
| No test coverage | Medium |
| Console.log in production | Low |
| 3D mesh validation (manifold checks) | Low |

### Recommended

1. ~~Fix 3D sculpture export quality~~ ✅ Done
2. Add TypeScript strict mode
3. Add unit tests for GPX parser
4. Add E2E tests for route upload
5. Add Sentry for error monitoring

---

## Monetization

### Current Model: One-Time Purchase Per Export (Stripe)

| Product | Price | Margin | Status |
| ------- | ----- | ------ | ------ |
| Adventure Print (Digital) | €19-29 | High | ✅ Live |
| Journey Sculpture (STL) | €29-49 | High | ✅ Live |
| Print Delivered | €49-89 | Medium | Planned |

### Future Options

- Premium tier (multiple exports, saved designs)
- Print partnerships (Printful, Gelato)
- Subscription for power users
- Physical 3D print fulfillment

---

## Success Metrics

| Metric | Target |
| ------ | ------ |
| Route uploads/week | Track growth |
| Upload → export conversion | >20% |
| 3D print orders/month | TBD |
| Poster → 3D upsell rate | >5% |

---

**Brand**: GridLine (gridline.eu)

**ICP**: Hikers, cyclists, trail runners, travelers, race finishers

**Focus**: Cartographic enhancements + Programmatic SEO + Print fulfillment partnerships
