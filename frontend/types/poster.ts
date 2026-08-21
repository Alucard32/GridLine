// Core type definitions for the Map Poster Generator

// Import sculpture types for SavedProject
import type { SculptureConfig, ProductMode } from './sculpture';

export interface PosterLocation {
  name: string;
  city?: string; // New: specific city/municipality field
  subtitle?: string;
  center: [number, number]; // [lng, lat]
  bounds: [[number, number], [number, number]]; // SW, NE corners
  zoom: number;
}

export interface ColorPalette {
  id: string;
  name: string;
  style: string;                    // Parent style ID
  
  // Core colors
  background: string;
  text: string;
  border: string;
  
  // Road hierarchy (7 levels)
  roads: {
    motorway: string;
    trunk: string;
    primary: string;
    secondary: string;
    tertiary: string;
    residential: string;
    service: string;
  };
  
  // Land features
  water: string;
  waterLine: string;                // Rivers, streams
  greenSpace: string;
  landuse: string;                  // General land tint
  buildings: string;
  
  // Optional/style-specific
  accent?: string;
  contour?: string;
  contourIndex?: string;
  grid?: string;
  hillshade?: string;
  
  // Keep for backward compatibility/internal use
  primary?: string; // Main streets/features
  secondary?: string; // Minor streets/features
  population?: string; // Color for population density
  parks?: string; // Alias for greenSpace

  // 3D Buildings configuration
  building3D?: {
    colorLow: string;      // Color for low buildings
    colorMid: string;      // Color for medium buildings
    colorHigh: string;     // Color for tall buildings
    opacity: number;       // Overall opacity
    lightColor?: string;   // Light source color
    lightIntensity?: number; // Light intensity
  };
}

export interface LayerToggle {
  id: string;
  name: string;
  layerIds: string[]; // MapLibre layer IDs this toggle affects
}

export interface PosterStyle {
  id: string;
  name: string;
  description: string;
  mapStyle: any; // MapLibre style spec (using any for now as the spec is complex)
  defaultPalette: ColorPalette;
  palettes: ColorPalette[];
  recommendedFonts: string[];
  layerToggles: LayerToggle[];
}

export interface PosterConfig {
  location: PosterLocation;
  style: PosterStyle;
  palette: ColorPalette;
  route?: RouteConfig; // Optional route/journey data
  typography: {
    titleFont: string;
    titleSize: number;
    titleWeight: number;
    titleLetterSpacing?: number; // Added tracking
    titleAllCaps?: boolean;      // Added all-caps support
    subtitleFont: string;
    subtitleSize: number;
    showTitle?: boolean;      // New: toggle title visibility
    showSubtitle?: boolean;   // New: toggle subtitle visibility
    showCoordinates?: boolean; // New: toggle coordinates visibility
    position: 'top' | 'bottom' | 'center';
    textBackdrop?: 'none' | 'subtle' | 'strong' | 'gradient'; // Added gradient type
    backdropHeight?: number; // percentage (0-100)
    backdropAlpha?: number;  // opacity (0-1)
    backdropSharpness?: number; // New: 0-100 (soft to abrupt)
    maxWidth?: number; // New: max width percentage (0-100)
  };
  format: {
    aspectRatio: '2:3' | '3:4' | '4:5' | '1:1' | 'ISO' | '16:9' | '16:10' | '9:16' | '9:19.5';
    orientation: 'portrait' | 'landscape';
    margin: number; // 0-100 (percentage based)
    borderStyle: 'none' | 'thin' | 'thick' | 'double' | 'inset';
    maskShape?: 'rectangular' | 'circular';
    compassRose?: boolean; // Show compass rose around circular mask
    texture?: 'none' | 'paper' | 'canvas' | 'grain'; // Added texture support
    textureIntensity?: number; // 0-100
  };
  layers: {
    streets: boolean;
    buildings: boolean;
    buildingsStyle?: 'fill' | 'sketch' | 'outline'; // 2D building rendering style
    // 3D Buildings
    buildings3d?: boolean; // Toggle for 3D extruded buildings
    buildings3dPitch?: number; // Camera pitch/tilt angle (0-60°)
    buildings3dBearing?: number; // Camera bearing/rotation (0-360°)
    buildings3dHeightScale?: number; // Height exaggeration multiplier (0.5-3.0)
    buildings3dDefaultHeight?: number; // Fallback height for buildings without data (0-30m)
    buildings3dStyle?: 'solid' | 'glass' | 'wireframe' | 'gradient'; // Artistic rendering style
    buildings3dOpacity?: number; // Overall opacity (0-1)
    water: boolean;
    parks: boolean;
    terrain: boolean;
    terrainUnderWater: boolean; // New: toggle bathymetry/terrain under water
    hillshadeExaggeration: number; // New: control hillshade intensity
    // 3D Terrain
    terrain3d?: boolean; // Toggle for 3D terrain elevation extrusion
    terrain3dExaggeration?: number; // Terrain height multiplier (0.5-3.0)
    contours: boolean;
    contourDensity: number; // New: control contour line density (interval)
    population: boolean;
    pois?: boolean; // Toggle for points of interest (airports, monuments, etc.)
    labels: boolean;
    labelSize: number; // New: control map label size
    labelMaxWidth: number; // New: control map label wrap width
    labelStyle?: 'standard' | 'elevated' | 'glass' | 'vintage'; // New: control map label visual style
    'labels-admin'?: boolean; // Toggle for state & country names
    'labels-cities'?: boolean; // Toggle for city names
    boundaries?: boolean; // Toggle for administrative boundaries (country/state/county)
    marker: boolean;
    /** Icon style for location markers. `ring` kept for legacy saved configs. */
    markerType?: 'none' | 'pin' | 'home' | 'heart' | 'dot' | 'crosshair' | 'star' | 'diamond' | 'flag' | 'ring';
    markerColor?: string;
    /** Icon size multiplier (0.5–1.5, default 1 = 100%) */
    markerScale?: number;
    /** Geographic pins placed on the map as [lng, lat] */
    placedMarkers?: [number, number][];
    roadWeight: number; // New: control road line thickness
    // Scale bar for showing distances
    showScaleBar?: boolean;
    scaleBarPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    scaleBarColor?: string;
  };
}

export interface SavedProject {
  id: string;
  name: string;
  config: PosterConfig;
  updatedAt: number;
  // Sculpture-related fields (Phase 4.6)
  productType?: ProductMode;
  sculptureConfig?: SculptureConfig | null;
  sculptureThumbnailUrl?: string | null;
}

// Route/Journey Types for GPX/GPS data
export interface RoutePoint {
  lat: number;
  lng: number;
  elevation?: number;
  time?: Date;
}

export interface RouteStats {
  distance: number; // in meters
  elevationGain: number; // in meters
  elevationLoss: number; // in meters
  minElevation: number; // in meters
  maxElevation: number; // in meters
  duration?: number; // in seconds (if time data available)
  startTime?: Date;
  endTime?: Date;
}

export type RouteSource = 'gpx' | 'draw' | 'strava';

export interface RouteData {
  name?: string;
  description?: string;
  points: RoutePoint[];
  stats: RouteStats;
  bounds: [[number, number], [number, number]]; // SW, NE corners [lng, lat]
  source?: RouteSource; // How this route was created
  waypoints?: [number, number][]; // Original draw-mode waypoints [lng, lat] for re-editing
}

export interface RouteStyle {
  color: string;
  width: number; // in pixels
  opacity: number; // 0-1
  lineStyle: 'solid' | 'dashed' | 'dotted';
  showStartEnd: boolean; // Show start/end markers
  startColor?: string;
  endColor?: string;
}

export interface PrivacyZone {
  center: [number, number]; // [lng, lat]
  radiusMeters: number;
}

export interface RouteConfig {
  data: RouteData | null;
  style: RouteStyle;
  privacyZones: PrivacyZone[];
  showStats: boolean;
  statsPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

