import type { PosterConfig, PosterLocation } from '@/types/poster';
import { getDefaultStyle } from '@/lib/styles';

export const DEFAULT_LOCATION: PosterLocation = {
  name: 'Greater London',
  city: 'London',
  subtitle: 'England, United Kingdom',
  center: [-0.1277653, 51.5074456],
  bounds: [
    [-0.5103751, 51.2867601], // SW corner
    [0.3340155, 51.6918741], // NE corner
  ],
  zoom: 9,
};

const defaultStyle = getDefaultStyle();

export const DEFAULT_CONFIG: PosterConfig = {
  location: DEFAULT_LOCATION,
  style: defaultStyle,
  palette: defaultStyle.defaultPalette,
  typography: {
    titleFont: defaultStyle.recommendedFonts[0] || 'Inter',
    titleSize: 5,
    titleWeight: 800,
    titleLetterSpacing: 0.08,
    titleAllCaps: true,
    subtitleFont: defaultStyle.recommendedFonts[0] || 'Inter',
    subtitleSize: 2.5,
    showTitle: true,
    showSubtitle: true,
    showCoordinates: true,
    position: 'bottom',
    textBackdrop: 'gradient',
    backdropHeight: 35,
    backdropAlpha: 1.0,
    backdropSharpness: 50,
    maxWidth: 80,
  },
  format: {
    aspectRatio: '2:3',
    orientation: 'portrait',
    margin: 5,
    borderStyle: 'inset',
    maskShape: 'rectangular',
    compassRose: false,
    texture: 'none',
    textureIntensity: 20,
  },
  layers: {
    streets: true,
    buildings: false,
    water: true,
    parks: true,
    terrain: true,
    terrainUnderWater: false,
    hillshadeExaggeration: 0.5,
    terrain3d: false, // 3D terrain off by default
    terrain3dExaggeration: 1.0, // Default exaggeration (1.0 = realistic)
    contours: false,
    contourDensity: 50,
    population: false,
    pois: true, // Points of Interest (airports, monuments, etc.)
    labels: false,
    labelSize: 1,
    labelMaxWidth: 10,
    labelStyle: 'elevated',
    boundaries: false,
    marker: true,
    markerType: 'none',
    markerColor: undefined, // Default to palette primary
    markerScale: 1,
    roadWeight: 1.0,
  },
};

