import { z } from 'zod';
import type { PosterConfig } from '@/types/poster';
import { LAYOUT } from '@/lib/constants/limits';

// Route schemas for GPX/GPS data persistence
// Note: Date fields use coerce to handle both Date objects and ISO strings from JSON
const RoutePointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  elevation: z.number().optional(),
  time: z.coerce.date().optional(),
});

const RouteStatsSchema = z.object({
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number(),
  minElevation: z.number(),
  maxElevation: z.number(),
  duration: z.number().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

const RouteDataSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  points: z.array(RoutePointSchema),
  stats: RouteStatsSchema,
  bounds: z.tuple([
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number()])
  ]),
  source: z.enum(['gpx', 'draw', 'strava']).optional(),
  waypoints: z.array(z.tuple([z.number(), z.number()])).optional(),
});

const RouteStyleSchema = z.object({
  color: z.string(),
  width: z.number(),
  opacity: z.number(),
  lineStyle: z.enum(['solid', 'dashed', 'dotted']),
  showStartEnd: z.boolean(),
  startColor: z.string().optional(),
  endColor: z.string().optional(),
});

const PrivacyZoneSchema = z.object({
  center: z.tuple([z.number(), z.number()]),
  radiusMeters: z.number(),
});

const RouteConfigSchema = z.object({
  data: RouteDataSchema.nullable(),
  style: RouteStyleSchema,
  privacyZones: z.array(PrivacyZoneSchema),
  showStats: z.boolean(),
  statsPosition: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
});

/**
 * Zod schema for validating PosterConfig
 * This ensures data integrity when saving/loading map configurations
 */
export const PosterConfigSchema: z.ZodType<PosterConfig> = z.object({
  location: z.object({
    name: z.string().min(1, 'Location name is required'),
    city: z.string().optional(),
    subtitle: z.string().optional(),
    center: z.tuple([z.number(), z.number()]).describe('Center must be [lng, lat]'),
    bounds: z.tuple([
      z.tuple([z.number(), z.number()]),
      z.tuple([z.number(), z.number()])
    ]).describe('Bounds must be [[SW], [NE]]'),
    zoom: z.number().min(0).max(24),
  }),
  style: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    mapStyle: z.any(), // MapLibre style spec is complex, using any for now
    defaultPalette: z.any(), // Will be validated by ColorPalette if needed
    palettes: z.array(z.any()),
    recommendedFonts: z.array(z.string()),
    layerToggles: z.array(z.object({
      id: z.string(),
      name: z.string(),
      layerIds: z.array(z.string()),
    })),
  }),
  palette: z.object({
    id: z.string(),
    name: z.string(),
    style: z.string(),
    background: z.string(),
    text: z.string(),
    border: z.string(),
    roads: z.object({
      motorway: z.string(),
      trunk: z.string(),
      primary: z.string(),
      secondary: z.string(),
      tertiary: z.string(),
      residential: z.string(),
      service: z.string(),
    }),
    water: z.string(),
    waterLine: z.string(),
    greenSpace: z.string(),
    landuse: z.string(),
    buildings: z.string(),
    accent: z.string().optional(),
    contour: z.string().optional(),
    contourIndex: z.string().optional(),
    grid: z.string().optional(),
    hillshade: z.string().optional(),
    primary: z.string().optional(),
    secondary: z.string().optional(),
    population: z.string().optional(),
    parks: z.string().optional(),
    building3D: z.object({
      colorLow: z.string(),
      colorMid: z.string(),
      colorHigh: z.string(),
      opacity: z.number(),
      lightColor: z.string().optional(),
      lightIntensity: z.number().optional(),
    }).optional(),
  }),
  typography: z.object({
    titleFont: z.string(),
    titleSize: z.number().min(LAYOUT.TITLE_SIZE_MIN).max(LAYOUT.TITLE_SIZE_MAX),
    titleWeight: z.number().min(0).max(900),
    titleLetterSpacing: z.number().optional(),
    titleAllCaps: z.boolean().optional(),
    subtitleFont: z.string(),
    subtitleSize: z.number().min(LAYOUT.SUBTITLE_SIZE_MIN).max(LAYOUT.SUBTITLE_SIZE_MAX),
    showTitle: z.boolean().optional(),
    showSubtitle: z.boolean().optional(),
    showCoordinates: z.boolean().optional(),
    position: z.enum(['top', 'bottom', 'center']),
    textBackdrop: z.enum(['none', 'subtle', 'strong', 'gradient']).optional(),
    backdropHeight: z.number().min(0).max(100).optional(),
    backdropAlpha: z.number().min(0).max(1).optional(),
    backdropSharpness: z.number().min(0).max(100).optional(),
    maxWidth: z.number().min(0).max(100).optional(),
  }),
  format: z.object({
    aspectRatio: z.enum(['2:3', '3:4', '4:5', '1:1', 'ISO', '16:9', '16:10', '9:16', '9:19.5']),
    orientation: z.enum(['portrait', 'landscape']),
    margin: z.number().min(LAYOUT.MARGIN_MIN).max(LAYOUT.MARGIN_MAX),
    borderStyle: z.enum(['none', 'thin', 'thick', 'double', 'inset']),
    maskShape: z.enum(['rectangular', 'circular']).optional(),
    compassRose: z.boolean().optional(),
    texture: z.enum(['none', 'paper', 'canvas', 'grain']).optional(),
    textureIntensity: z.number().min(0).max(100).optional(),
  }),
  layers: z.object({
    streets: z.boolean(),
    buildings: z.boolean(),
    buildingsStyle: z.enum(['fill', 'sketch', 'outline']).optional(),
    buildings3d: z.boolean().optional(),
    buildings3dPitch: z.number().min(0).max(60).optional(),
    buildings3dBearing: z.number().min(-180).max(360).optional(),
    buildings3dHeightScale: z.number().min(0.5).max(3.0).optional(),
    buildings3dDefaultHeight: z.number().min(0).max(30).optional(),
    buildings3dStyle: z.enum(['solid', 'glass', 'wireframe', 'gradient']).optional(),
    buildings3dOpacity: z.number().min(0).max(1).optional(),
    water: z.boolean(),
    parks: z.boolean(),
    terrain: z.boolean(),
    terrainUnderWater: z.boolean(),
    hillshadeExaggeration: z.number(),
    terrain3d: z.boolean().optional(),
    terrain3dExaggeration: z.number().min(0.5).max(3.0).optional(),
    contours: z.boolean(),
    contourDensity: z.number(),
    population: z.boolean(),
    pois: z.boolean().optional(),
    labels: z.boolean(),
    labelSize: z.number(),
    labelMaxWidth: z.number(),
    labelStyle: z.enum(['standard', 'elevated', 'glass', 'vintage']).optional(),
    'labels-admin': z.boolean().optional(),
    'labels-cities': z.boolean().optional(),
    boundaries: z.boolean().optional(),
    marker: z.boolean(),
    markerType: z
      .enum(['none', 'pin', 'home', 'heart', 'dot', 'crosshair', 'star', 'diamond', 'flag', 'ring'])
      .optional(),
    markerColor: z.string().optional(),
    markerScale: z.number().min(0.5).max(1.5).optional(),
    placedMarkers: z.array(z.tuple([z.number(), z.number()])).optional(),
    roadWeight: z.number(),
    showScaleBar: z.boolean().optional(),
    scaleBarPosition: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
    scaleBarColor: z.string().optional(),
  }),
  route: RouteConfigSchema.optional(),
});

/**
 * Validate a PosterConfig object
 * @throws {z.ZodError} if validation fails
 */
export function validatePosterConfig(config: unknown): PosterConfig {
  return PosterConfigSchema.parse(config);
}

/**
 * Safely validate a PosterConfig, returning a result object
 */
export function safeValidatePosterConfig(config: unknown): {
  success: boolean;
  data?: PosterConfig;
  error?: z.ZodError;
} {
  const result = PosterConfigSchema.safeParse(config);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

