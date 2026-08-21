import type { ColorPalette, PosterConfig, PosterStyle } from '@/types/poster';
import { isColorDark } from '@/lib/utils';
import { getContourTileJsonUrl, getTerrainRgbTileJsonUrl } from '@/lib/styles/tileUrl';
import { createBuilding3DLayer, createBuilding3DLight } from '@/lib/styles/layers/buildings3d';
import { building2DStylePresets, type Building2DStyle } from '@/lib/styles/layers/buildings2d';

/**
 * Helper to scale a value that might be a number or a zoom interpolation expression
 */
function scaleExpression(expr: any, factor: number): any {
  if (typeof expr === 'number') return expr * factor;
  
  // Handle modern interpolate expression
  if (Array.isArray(expr) && expr[0] === 'interpolate') {
    return expr.map((val: any, i: number) => {
      // Output values are at even indices starting from 4 (0: interpolate, 1: type, 2: input, 3: first stop input, 4: first stop output...)
      if (i >= 4 && i % 2 === 0 && typeof val === 'number') {
        return val * factor;
      }
      return val;
    });
  }
  
  // Handle legacy stops format
  if (expr && typeof expr === 'object' && expr.stops) {
    return {
      ...expr,
      stops: expr.stops.map((stop: [number, number]) => [stop[0], stop[1] * factor])
    };
  }
  
  return expr;
}

/**
 * Applies a color palette and layer visibility to a MapLibre style
 */
export function applyPaletteToStyle(
  style: any, 
  palette: ColorPalette, 
  layers?: PosterConfig['layers'],
  layerToggles?: PosterStyle['layerToggles']
): any {
  // Use a faster/cleaner deep clone if possible, but JSON is safe for Mapbox styles
  const updatedStyle = JSON.parse(JSON.stringify(style));

  if (!updatedStyle.layers) {
    return updatedStyle;
  }

  handleContourSource(updatedStyle, layers);
  
  // Ensure water layers always come after hillshade to hide terrain under water
  reorderLayersForWater(updatedStyle.layers);
  
  if (layers && layerToggles) {
    applyVisibilityToggles(updatedStyle.layers, layers, layerToggles);
  } else if (layers) {
    // Even without layerToggles, we should still handle terrainUnderWater for bathymetry layers
    updatedStyle.layers.forEach((layer: any) => {
      if (layer.id.includes('bathymetry')) {
        if (!layer.layout) {
          layer.layout = {};
        }
        const terrainUnderWaterEnabled = layers.terrainUnderWater ?? false;
        layer.layout.visibility = terrainUnderWaterEnabled ? 'visible' : 'none';
      }
    });
  }

  const roadWeightMultiplier = (layers?.roadWeight ?? 1.0) * (layers?.labels ? 0.8 : 1.0);
  const labelAdjustment = layers?.labels ? 0.7 : 1.0;

  updatedStyle.layers.forEach((layer: any) => {
    updateLayerPaint(layer, palette, layers, labelAdjustment, roadWeightMultiplier);
    updateLayerLayout(layer, layers);
  });

  // Inject 3D buildings layer if enabled
  if (layers?.buildings3d) {
    const buildings3DLayer = createBuilding3DLayer(palette, {
      heightScale: layers.buildings3dHeightScale ?? 1.0,
      opacity: layers.buildings3dOpacity,
      minZoom: 8, // Low minZoom so buildings appear early and animate in
      defaultHeight: layers.buildings3dDefaultHeight ?? 6,
      style: layers.buildings3dStyle ?? 'solid',
    });

    // Find the right position to insert 3D buildings (after 2D buildings, before labels)
    const labelIndex = updatedStyle.layers.findIndex((layer: any) =>
      layer.id.includes('label') && layer.type === 'symbol'
    );

    if (labelIndex !== -1) {
      // Insert before labels
      updatedStyle.layers.splice(labelIndex, 0, buildings3DLayer);
    } else {
      // Append at the end if no labels found
      updatedStyle.layers.push(buildings3DLayer);
    }

    // Add light source for 3D buildings shadows and depth
    updatedStyle.light = createBuilding3DLight(palette);
  }

  // Inject 2D building outline layer for sketch/outline styles
  const buildingsStyle = (layers?.buildingsStyle ?? 'fill') as Building2DStyle;
  if (layers?.buildings && (buildingsStyle === 'sketch' || buildingsStyle === 'outline')) {
    const preset = building2DStylePresets[buildingsStyle];
    const buildingColor = palette.buildings || palette.primary || palette.text;
    const isDark = isColorDark(palette.background);
    const strokeColor = isDark ? (palette.text || '#ffffff') : buildingColor;

    const outlineLayer = {
      id: 'buildings-outline',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'building',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': strokeColor,
        'line-width': [
          'interpolate', ['linear'], ['zoom'],
          10, preset.strokeWidth * 0.3,
          12, preset.strokeWidth * 0.5,
          14, preset.strokeWidth * 0.8,
          16, preset.strokeWidth,
          18, preset.strokeWidth * 1.2,
        ],
        'line-opacity': [
          'interpolate', ['linear'], ['zoom'],
          10, preset.strokeOpacity * 0.3,
          12, preset.strokeOpacity * 0.6,
          14, preset.strokeOpacity * 0.8,
          16, preset.strokeOpacity,
        ],
      },
    };

    // Find the building fill layer and insert outline right after it
    const buildingFillIndex = updatedStyle.layers.findIndex((layer: any) =>
      layer.id === 'building' || (layer.id.includes('building') && layer.type === 'fill' && !layer.id.includes('3d'))
    );

    if (buildingFillIndex !== -1) {
      updatedStyle.layers.splice(buildingFillIndex + 1, 0, outlineLayer);
    } else {
      // Fallback: insert before labels if building layer not found
      const labelIndex = updatedStyle.layers.findIndex((layer: any) =>
        layer.id.includes('label') && layer.type === 'symbol'
      );
      if (labelIndex !== -1) {
        updatedStyle.layers.splice(labelIndex, 0, outlineLayer);
      } else {
        updatedStyle.layers.push(outlineLayer);
      }
    }
  }

  // Inject 3D terrain if enabled
  if (layers?.terrain3d) {
    const terrainUrl = getTerrainRgbTileJsonUrl();

    if (terrainUrl) {
      // Initialize sources if not present
      if (!updatedStyle.sources) {
        updatedStyle.sources = {};
      }

      // Add terrain-rgb source for elevation data
      updatedStyle.sources['terrain-rgb'] = {
        type: 'raster-dem',
        url: terrainUrl,
        tileSize: 256,
      };

      // Add terrain configuration with user-controlled exaggeration
      updatedStyle.terrain = {
        source: 'terrain-rgb',
        exaggeration: layers.terrain3dExaggeration ?? 1.0,
      };
    }
  } else {
    // Explicitly remove terrain config when disabled
    // This ensures save/load correctly toggles 3D terrain off
    if (updatedStyle.terrain) {
      delete updatedStyle.terrain;
    }
  }

  return updatedStyle;
}

function removeContourLayers(style: any) {
  style.layers = style.layers.filter((layer: any) =>
    layer.id !== 'contours' &&
    !layer.id.includes('contour') &&
    !layer.id.includes('bathymetry')
  );
  if (style.sources?.contours) {
    delete style.sources.contours;
  }
}

function handleContourSource(style: any, layers?: PosterConfig['layers']) {
  // Contours are optional (MapTiler). Omit the source when disabled so MapLibre
  // does not fetch TileJSON — a domain-restricted key 403 would otherwise
  // surface as a full-page "Map Loading Error" even though the base map works.
  if (layers && layers.contours === false) {
    removeContourLayers(style);
    return;
  }

  const contourSource = style.sources?.contours;

  // If source doesn't exist at all, filter out layers
  if (!contourSource) {
    removeContourLayers(style);
    return;
  }

  // If source exists but URL is empty, try to regenerate it at runtime
  // This handles cases where getBaseUrl() returned empty at module load time
  if (!contourSource.url || contourSource.url === '') {
    const url = getContourTileJsonUrl();

    if (url) {
      // Set the URL if we can get it now (browser context has window.location)
      contourSource.url = url;
    } else {
      removeContourLayers(style);
    }
  }
  // If URL exists (even if relative), don't filter - let MapLibre handle it
}

function reorderLayersForWater(layers: any[]) {
  // Find indices of hillshade and water layers
  const hillshadeIndex = layers.findIndex((layer: any) => layer.id === 'hillshade' && layer.type === 'hillshade');
  const waterIndices: number[] = [];
  
  layers.forEach((layer: any, index: number) => {
    if (layer.id === 'water' && layer.type === 'fill') {
      waterIndices.push(index);
    }
  });
  
  // If hillshade exists and comes after any water layer, we need to reorder
  if (hillshadeIndex !== -1 && waterIndices.length > 0) {
    const firstWaterIndex = waterIndices[0];
    
    // If hillshade comes after water, move it before water
    if (hillshadeIndex > firstWaterIndex) {
      const hillshadeLayer = layers[hillshadeIndex];
      layers.splice(hillshadeIndex, 1); // Remove hillshade from its current position
      layers.splice(firstWaterIndex, 0, hillshadeLayer); // Insert it before the first water layer
    }
  }
}

function applyVisibilityToggles(
  styleLayers: any[], 
  configLayers: PosterConfig['layers'], 
  layerToggles: PosterStyle['layerToggles']
) {
  styleLayers.forEach((layer) => {
    // Initialize layout if it doesn't exist
    if (!layer.layout) {
      layer.layout = {};
    }

    // Special handling for bathymetry/terrain under water
    if (layer.id.includes('bathymetry')) {
      // If terrainUnderWater is disabled or undefined, hide the layer and skip further processing
      const terrainUnderWaterEnabled = configLayers.terrainUnderWater ?? false;
      if (!terrainUnderWaterEnabled) {
        layer.layout.visibility = 'none';
        return; // Early return - don't process this layer further
      }
      // If enabled, set to visible initially (may be overridden by toggle check below)
      layer.layout.visibility = 'visible';
    }

    const toggle = layerToggles.find(t => t.layerIds.includes(layer.id));
    if (toggle) {
      const toggleValue = configLayers[toggle.id as keyof PosterConfig['layers']];
      const isVisible = Boolean(toggleValue);
      
      // For bathymetry layers, we already set visibility above based on terrainUnderWater
      // Only override if this is a different toggle (not terrainUnderWater) that's disabled
      if (layer.id.includes('bathymetry')) {
        // If this is the terrainUnderWater toggle itself, we've already handled it above
        // If this is a different toggle (shouldn't happen now, but handle it), respect it
        if (toggle.id !== 'terrainUnderWater' && !isVisible) {
          layer.layout.visibility = 'none';
        }
        // Otherwise, keep the visibility we set above (visible if terrainUnderWater is enabled)
      } else {
        // For non-bathymetry layers, use the toggle's visibility
        layer.layout.visibility = isVisible ? 'visible' : 'none';
      }
    } else if (!layer.id.includes('bathymetry')) {
      // For layers not in any toggle and not bathymetry, ensure visibility is set
      // (default to visible if not specified)
      if (layer.layout.visibility === undefined) {
        layer.layout.visibility = 'visible';
      }
    } else {
      // Bathymetry layer not in any toggle (shouldn't happen, but handle it)
      // If terrainUnderWater is enabled, show it; otherwise hide it
      const terrainUnderWaterEnabled = configLayers.terrainUnderWater ?? false;
      layer.layout.visibility = terrainUnderWaterEnabled ? 'visible' : 'none';
    }
  });
}

function updateLayerPaint(
  layer: any, 
  palette: ColorPalette, 
  layers: PosterConfig['layers'] | undefined, 
  labelAdjustment: number,
  roadWeightMultiplier: number
) {
  const { id, type } = layer;

  // Background
  if (id === 'background' && type === 'background') {
    layer.paint = { 'background-color': palette.background };
    return;
  }

  // Hillshade
  if (id === 'hillshade' && type === 'hillshade') {
    const isDark = isColorDark(palette.background);
    
    // Add exaggeration from config if available, clamped between 0 and 1
    const exaggeration = Math.min(Math.max(layers?.hillshadeExaggeration ?? 0.5, 0), 1);
    
    if (palette.hillshade) {
      layer.paint = {
        ...layer.paint,
        'hillshade-shadow-color': palette.hillshade,
        'hillshade-highlight-color': palette.background,
        'hillshade-accent-color': palette.hillshade,
        'hillshade-exaggeration': exaggeration,
      };
    } else {
      layer.paint = {
        ...layer.paint,
        'hillshade-shadow-color': isDark ? '#000000' : (palette.secondary || palette.text),
        'hillshade-highlight-color': isDark ? (palette.secondary || palette.text) : palette.background,
        'hillshade-accent-color': isDark ? '#000000' : (palette.secondary || palette.text),
        'hillshade-exaggeration': exaggeration,
      };
    }
    return;
  }

  // Water
  if (id === 'water' && type === 'fill') {
    // Always ensure water is fully opaque to hide hillshade underneath
    // When terrainUnderWater is disabled, we definitely want full opacity
    // When enabled, we can allow some transparency if the style wants it
    const terrainUnderWaterEnabled = layers?.terrainUnderWater ?? false;
    const baseOpacity = layer.paint?.['fill-opacity'] ?? 1;
    // If terrainUnderWater is disabled, force full opacity to hide hillshade
    // Otherwise, use the style's opacity (but ensure it's at least 0.95 to mostly hide hillshade)
    const waterOpacity = terrainUnderWaterEnabled 
      ? Math.max(baseOpacity, 0.95) // Allow slight transparency only when underwater terrain is enabled
      : 1.0; // Full opacity when disabled to completely hide hillshade
    
    layer.paint = { 
      ...layer.paint, 
      'fill-color': palette.water,
      'fill-opacity': waterOpacity
    };
    return;
  }

  // Bathymetry Gradient / Detail
  if (id === 'bathymetry-gradient' || id.includes('bathymetry-detail')) {
    const isDark = isColorDark(palette.background);
    const depthColor = isDark ? '#FFFFFF' : '#001a33';
    layer.paint = {
      ...layer.paint,
      'line-color': depthColor,
      'line-opacity': isDark ? 0.05 : 0.1,
    };
    return;
  }

  // Disable any water outline/border/casing layers that create halos
  // This catches layers from the base tile data that we don't explicitly create
  if (type === 'line' && 
      (id.includes('water-outline') || 
       id.includes('water-border') || 
       id.includes('water-casing') ||
       (id.includes('water-line') && id !== 'waterway'))) {
    layer.paint = {
      ...layer.paint,
      'line-opacity': 0,
    };
    return;
  }

  // Parks
  if (id === 'park' && type === 'fill') {
    layer.paint = { ...layer.paint, 'fill-color': palette.parks || palette.greenSpace };
    return;
  }

  // Contours
  if (id.includes('contour') || id.includes('topo')) {
    if (type === 'line') {
      const color = id.includes('index')
        ? (palette.contourIndex || palette.contour || palette.secondary || palette.roads.secondary)
        : (palette.contour || palette.secondary || palette.roads.secondary);

      layer.paint = {
        ...layer.paint,
        'line-color': color,
        'line-opacity': layer.paint?.['line-opacity'] ?? 0.4,
      };
    } else if (type === 'symbol' && id.includes('label')) {
      // Contour labels - update text color and halo
      const textColor = palette.contourIndex || palette.text || palette.secondary;
      const haloColor = palette.background;

      layer.paint = {
        ...layer.paint,
        'text-color': textColor,
        'text-halo-color': haloColor,
      };
    }
    applyContourDensity(layer, layers?.contourDensity);
    return;
  }

  // Population
  if (id.includes('population') && type === 'fill') {
    const existingOpacity = layer.paint?.['fill-opacity'];
    layer.paint = {
      ...layer.paint,
      'fill-color': palette.population || palette.accent || palette.primary || palette.roads.motorway,
      'fill-opacity': Array.isArray(existingOpacity) ? existingOpacity : (existingOpacity ?? 0.6),
    };
    return;
  }

  // Roads & Bridges
  if (id.startsWith('road-') || id.startsWith('bridge-') || id.startsWith('tunnel-')) {
    updateRoadLayer(layer, palette, labelAdjustment);
    
    // Apply road weight multiplier correctly to interpolation arrays or numbers
    if (layer.paint?.['line-width']) {
      layer.paint['line-width'] = scaleExpression(layer.paint['line-width'], roadWeightMultiplier);
    }
    return;
  }

  // Buildings (2D) - apply style presets
  if (id.includes('building') && !id.includes('3d')) {
    const buildingsStyle = (layers?.buildingsStyle ?? 'fill') as Building2DStyle;
    const preset = building2DStylePresets[buildingsStyle];
    const buildingColor = palette.buildings || palette.primary || palette.text;

    if (type === 'fill') {
      layer.paint = {
        ...layer.paint,
        'fill-color': buildingColor,
        'fill-opacity': preset.fillOpacity,
      };
    } else if (type === 'line') {
      // Handle existing outline layers (from the injected 'buildings-outline' layer)
      const isDark = isColorDark(palette.background);
      const strokeColor = isDark ? (palette.text || '#ffffff') : buildingColor;
      layer.paint = {
        ...layer.paint,
        'line-color': strokeColor,
      };
    }
    return;
  }

  // Boundaries
  if (id.startsWith('boundaries-')) {
    layer.paint = {
      ...layer.paint,
      'line-color': palette.border || palette.text,
    };
    return;
  }

  // Labels
  if (id.includes('label') && type === 'symbol') {
    // Determine label type and set appropriate halo settings for fade-out effect
    let haloWidth: number;
    let haloBlur: number;
    
    if (id === 'labels-country') {
      // Country labels: largest halos for maximum legibility
      haloWidth = 3.5;
      haloBlur = 2.5;
    } else if (id === 'labels-state') {
      // State labels: medium halos
      haloWidth = 2.75;
      haloBlur = 1.75;
    } else if (id === 'labels-city') {
      // City labels: smaller halos
      haloWidth = 2.25;
      haloBlur = 1.25;
    } else {
      // Unknown label type: use city label defaults as fallback
      haloWidth = 2.25;
      haloBlur = 1.25;
    }
    
    // Preserve existing text-opacity if set, otherwise default to 0.9
    const textOpacity = layer.paint?.['text-opacity'] ?? 0.9;
    
    layer.paint = {
      ...layer.paint,
      'text-color': palette.text,
      'text-halo-color': palette.background,
      'text-halo-width': haloWidth,
      'text-halo-blur': haloBlur,
      'text-opacity': textOpacity,
    };
    return;
  }

  // Grid
  if (id === 'grid' && palette.grid) {
    layer.paint = {
      ...layer.paint,
      'line-color': palette.grid,
      'line-opacity': layer.paint?.['line-opacity'] ?? 0.2,
    };
  }
}

function applyContourDensity(layer: any, density: number | undefined) {
  if (!density || layer['source-layer'] !== 'contour') {
    return;
  }

  // MapTiler contours-v2 uses 'height' property (not 'ele' or 'elevation')
  const hasEle = ['has', 'height'];
  const getEle = ['get', 'height'];

  // Zoom-aware filters: At low zoom, show whatever data is available
  // At high zoom (13+), use user's density setting for fine control

  if (layer.id.includes('label')) {
    // Labels: Zoom-adaptive intervals
    layer.filter = [
      'all',
      hasEle,
      ['>', getEle, 0],
      [
        'any',
        // High zoom: user's 5x density (e.g., 50m if density=10m)
        [
          'all',
          ['>=', ['zoom'], 13],
          ['==', ['%', getEle, density * 5], 0]
        ],
        // Medium zoom: 500m intervals
        [
          'all',
          ['<', ['zoom'], 13],
          ['>=', ['zoom'], 11],
          ['==', ['%', getEle, 500], 0]
        ],
        // Low zoom: 1000m intervals
        [
          'all',
          ['<', ['zoom'], 11],
          ['==', ['%', getEle, 1000], 0]
        ]
      ]
    ];
  } else if (layer.id.includes('index')) {
    // Index contours: Zoom-adaptive major intervals
    layer.filter = [
      'all',
      hasEle,
      ['>', getEle, 0],
      [
        'any',
        // High zoom (13+): user's 5x density (e.g., 50m if density=10m)
        [
          'all',
          ['>=', ['zoom'], 13],
          ['==', ['%', getEle, density * 5], 0]
        ],
        // Medium zoom (11-13): 500m intervals
        [
          'all',
          ['<', ['zoom'], 13],
          ['>=', ['zoom'], 11],
          ['==', ['%', getEle, 500], 0]
        ],
        // Low zoom (<11): 1000m intervals
        [
          'all',
          ['<', ['zoom'], 11],
          ['==', ['%', getEle, 1000], 0]
        ]
      ]
    ];
  } else if (layer.id.includes('regular')) {
    // Regular contours: Zoom-adaptive intermediate intervals
    layer.filter = [
      'all',
      hasEle,
      ['>', getEle, 0],
      [
        'any',
        // High zoom (13+): user's density, excluding index intervals
        [
          'all',
          ['>=', ['zoom'], 13],
          ['==', ['%', getEle, density], 0],
          ['!=', ['%', getEle, density * 5], 0]
        ],
        // Medium zoom (11-13): show all non-500m intervals (200m, 300m, 400m, 600m, etc.)
        [
          'all',
          ['<', ['zoom'], 13],
          ['>=', ['zoom'], 11],
          ['!=', ['%', getEle, 500], 0]
        ],
        // Low zoom (<11): show 200m intervals (excluding 1000m)
        [
          'all',
          ['<', ['zoom'], 11],
          ['==', ['%', getEle, 200], 0],
          ['!=', ['%', getEle, 1000], 0]
        ]
      ]
    ];
  } else {
    // Simple contours: Just user's density
    layer.filter = [
      'all',
      hasEle,
      ['==', ['%', getEle, density], 0]
    ];
  }
}

function updateRoadLayer(layer: any, palette: ColorPalette, labelAdjustment: number) {
  if (layer.type !== 'line') return;

  // Handle bridge casings - they usually take the background color
  if (layer.id.includes('bridge') && layer.id.includes('casing')) {
    layer.paint['line-color'] = palette.background;
    return;
  }

  // Handle specific road classes
  const classes = ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'residential', 'service'];
  const matchedClass = classes.find(cls => layer.id.includes(cls));
  
  if (matchedClass) {
    const roadColor = (palette.roads as any)[matchedClass];
    if (roadColor) {
      layer.paint['line-color'] = roadColor;
      // Special handling for glow layers - keep their blur and reduce opacity
      if (layer.id.includes('glow')) {
        layer.paint['line-opacity'] = (layer.paint?.['line-opacity'] ?? 0.4) * labelAdjustment;
      } else {
        layer.paint['line-opacity'] = (layer.paint?.['line-opacity'] ?? 1.0) * labelAdjustment;
      }
      return;
    }
  }

  // Special handling for road-glow if it didn't match a class above
  if (layer.id.includes('glow')) {
    layer.paint = {
      ...layer.paint,
      'line-color': palette.roads.motorway,
      'line-opacity': (layer.paint?.['line-opacity'] ?? 0.4) * labelAdjustment,
    };
    return;
  }

  // Fallback for any other line layers starting with 'road-'
  const isSecondary = ['road-street', 'road-residential', 'road-tertiary', 'road-service'].includes(layer.id);
  const fallbackColor = isSecondary 
    ? (palette.secondary || palette.roads.secondary) 
    : (palette.primary || palette.roads.primary);

  layer.paint = {
    ...layer.paint,
    'line-color': fallbackColor,
    'line-opacity': (layer.paint?.['line-opacity'] ?? (isSecondary ? 0.8 : 1.0)) * labelAdjustment,
  };
}

function updateLayerLayout(layer: any, layers: PosterConfig['layers'] | undefined) {
  const { type, id } = layer;

  if (type === 'symbol') {
    // Don't override spaceport label settings - they need special collision handling
    if (id === 'spaceport-label') {
      return; // Skip this layer to preserve its custom layout settings
    }

    if (layers?.labelMaxWidth) {
      layer.layout = {
        ...layer.layout,
        'text-max-width': layers.labelMaxWidth,
      };
    }

    if (layers?.labelSize && layers.labelSize !== 1.0) {
      const existingSize = layer.layout?.['text-size'];
      if (existingSize) {
        layer.layout['text-size'] = scaleExpression(existingSize, layers.labelSize);
      }
    }

    // Add standard label layout optimizations
    layer.layout = {
      ...layer.layout,
      'text-padding': 10,
      'text-allow-overlap': false,
      'text-ignore-placement': false,
    };
  }
}
