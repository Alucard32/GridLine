'use client';

import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import Map, { Source, Layer, Marker, type MapRef } from 'react-map-gl/maplibre';
import { Loader2 } from 'lucide-react';
import type { PosterLocation, PosterConfig, RouteConfig } from '@/types/poster';
import { cn } from '@/lib/utils';
import { MarkerIcon } from './MarkerIcon';
import { CustomScaleControl } from './CustomScaleControl';
import { MAP, TIMEOUTS, TEXTURE } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { routeToGeoJSON, routeEndpointsToGeoJSON } from '@/lib/route';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapPreviewProps {
  mapStyle: any;
  location: PosterLocation;
  format?: PosterConfig['format'];
  showMarker?: boolean;
  markerColor?: string;
  onMapLoad?: (map: any) => void;
  onMove?: (center: [number, number], zoom: number) => void;
  layers?: PosterConfig['layers'];
  /** Route configuration for displaying GPX tracks */
  route?: RouteConfig;
  /** When false, disables all map interactions (zoom, pan, rotate) for view-only mode */
  interactive?: boolean;
  /** Draw mode: when true, map clicks add waypoints instead of panning */
  drawMode?: boolean;
  /** Called when map is clicked in draw mode with [lat, lng] */
  onMapClick?: (lat: number, lng: number) => void;
  /** Waypoints to show as numbered markers on the map */
  drawWaypoints?: [number, number][]; // [lat, lng][]
}

export function MapPreview({
  mapStyle,
  location,
  format,
  showMarker = true,
  markerColor,
  onMapLoad,
  onMove,
  layers,
  route,
  interactive = true,
  drawMode = false,
  onMapClick,
  drawWaypoints,
}: MapPreviewProps) {
  const mapRef = useRef<MapRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Store event handler references and timeout IDs for cleanup
  const loadingHandlerRef = useRef<(() => void) | null>(null);
  const idleHandlerRef = useRef<(() => void) | null>(null);
  const timeoutHandlerRef = useRef<(() => void) | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Suppress harmless AbortErrors from MapLibre during rapid prop changes
  // These occur when tile requests are cancelled but are caught by window.onerror
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.error?.name === 'AbortError' ||
        event.message?.includes('aborted') ||
        event.message?.includes('signal is aborted')
      ) {
        // Prevent the error from appearing in console
        event.preventDefault();
        return true;
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  // Local viewState for smooth interaction without triggering full app re-renders on every frame
  // Pitch/bearing: Use manual value if set, else default to 45° if 3D buildings enabled, else 0
  const [viewState, setViewState] = useState({
    longitude: location.center[0],
    latitude: location.center[1],
    zoom: location.zoom,
    pitch: layers?.buildings3dPitch ?? (layers?.buildings3d ? 45 : 0),
    bearing: layers?.buildings3dBearing ?? 0,
  });

  // Sync with external location changes (e.g. search, button clicks)
  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      longitude: location.center[0],
      latitude: location.center[1],
      zoom: location.zoom,
    }));
  }, [location.center, location.zoom]);

  // Sync pitch/bearing with layer settings
  // Use manual value if set, else default to 45° when 3D buildings enabled, else 0
  // Important: Also depend on `layers` reference to handle project loading (when setConfig replaces entire config)
  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      pitch: layers?.buildings3dPitch ?? (layers?.buildings3d ? 45 : 0),
      bearing: layers?.buildings3dBearing ?? 0,
    }));
  }, [layers, layers?.buildings3d, layers?.buildings3dPitch, layers?.buildings3dBearing]);

  // Fit map to route bounds when GPX is uploaded
  useEffect(() => {
    if (route?.data?.bounds && mapRef.current) {
      const map = mapRef.current.getMap();
      const [[west, south], [east, north]] = route.data.bounds;
      map.fitBounds([[west, south], [east, north]], {
        padding: 60,
        duration: 1000,
      });
    }
  }, [route?.data?.bounds]);


  const handleLoad = useCallback(() => {
    if (mapRef.current && onMapLoad) {
      const map = mapRef.current.getMap();
      onMapLoad(map);

      // Create named handler functions for proper cleanup
      // Use setTimeout to defer state updates and avoid "setState during render" warnings
      const loadingHandler = () => setTimeout(() => setIsLoading(true), 0);
      const idleHandler = () => {
        setTimeout(() => setIsLoading(false), 0);
        // Clear any pending timeout when map becomes idle
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }
      };
      
      // Safety timeout: if we're still "loading" after 10 seconds, clear it
      // This prevents being stuck on "Loading Tiles" if some tiles fail silently
      const timeoutHandler = () => {
        // Clear any existing timeout
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        // Set new timeout
        timeoutIdRef.current = setTimeout(() => setIsLoading(false), TIMEOUTS.MAP_LOADING);
        // Clear timeout when map becomes idle
        map.once('idle', () => {
          if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
          }
        });
      };

      // Store handler references
      loadingHandlerRef.current = loadingHandler;
      idleHandlerRef.current = idleHandler;
      timeoutHandlerRef.current = timeoutHandler;

      // Setup loading listeners
      map.on('dataloading', loadingHandler);
      map.on('idle', idleHandler);
      map.on('dataloading', timeoutHandler);
    }
  }, [onMapLoad]);

  // Cleanup event listeners and timeouts when component unmounts or map changes
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        
        // Remove event listeners
        if (loadingHandlerRef.current) {
          map.off('dataloading', loadingHandlerRef.current);
          loadingHandlerRef.current = null;
        }
        if (idleHandlerRef.current) {
          map.off('idle', idleHandlerRef.current);
          idleHandlerRef.current = null;
        }
        if (timeoutHandlerRef.current) {
          map.off('dataloading', timeoutHandlerRef.current);
          timeoutHandlerRef.current = null;
        }
        
        // Clear any pending timeouts
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }
      }
    };
  }, [mapStyle]); // Re-run cleanup when map style changes (new map instance)

  const handleMove = useCallback((evt: any) => {
    setViewState(evt.viewState);
    if (onMove) {
      onMove([evt.viewState.longitude, evt.viewState.latitude], evt.viewState.zoom);
    }
  }, [onMove]);

  // Handle map click for draw mode
  const handleClick = useCallback((evt: any) => {
    if (!drawMode || !onMapClick) return;
    const { lat, lng } = evt.lngLat;
    onMapClick(lat, lng);
  }, [drawMode, onMapClick]);

  // Build GeoJSON for waypoint markers
  const waypointMarkersGeoJSON = useMemo(() => {
    if (!drawWaypoints || drawWaypoints.length === 0) return null;
    return {
      type: 'FeatureCollection' as const,
      features: drawWaypoints.map(([lat, lng], index) => ({
        type: 'Feature' as const,
        properties: {
          index: index + 1,
          isFirst: index === 0,
          isLast: index === drawWaypoints.length - 1,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [lng, lat],
        },
      })),
    };
  }, [drawWaypoints]);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = useCallback((e: any) => {
    const errorMessage = e.error?.message || e.message || '';
    const errorName = e.error?.name || '';

    // Ignore AbortErrors - these are harmless and occur when tile requests are
    // cancelled due to rapid style/prop changes (e.g., user tweaking colors)
    if (errorName === 'AbortError' || errorMessage.includes('aborted')) {
      logger.debug('MapLibre tile request aborted (harmless):', errorMessage);
      return;
    }

    logger.error('MapLibre error details:', {
      message: errorMessage || 'Unknown map error',
      error: e.error,
      originalEvent: e
    });
    setHasError(true);
    const msg = errorMessage || 'Unable to load map data';
    setErrorMessage(msg);
  }, []);

  // Check for edge cases (Antarctica, very remote locations)
  const isEdgeCase = location.center[1] < -60 || Math.abs(location.center[0]) > 170;

  // Memoize GeoJSON data to prevent recreating objects on every render
  // This fixes the "Cannot update a component while rendering" warning
  const routeLineGeoJSON = useMemo(() => {
    if (!route?.data) return null;
    return routeToGeoJSON(route.data);
  }, [route?.data]);

  const routeEndpointsGeoJSON = useMemo(() => {
    if (!route?.data) return null;
    return routeEndpointsToGeoJSON(route.data);
  }, [route?.data]);

  return (
    <div className="relative w-full h-full">
      {hasError || isEdgeCase ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
          <div className="text-center p-8 max-w-md">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {hasError ? 'Map Loading Error' : 'Limited Map Data'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {hasError 
                ? errorMessage || 'Unable to load map data for this location. Try a different area or zoom level.'
                : 'Map data may be limited for this remote location. Try adjusting the zoom level or selecting a different area.'
              }
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setErrorMessage(null);
                if (mapRef.current) {
                  const map = mapRef.current.getMap();
                  map.resize();
                }
              }}
              className="text-sm text-primary dark:text-primary hover:underline"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : null}
        <Map
        ref={mapRef}
        key={`${format?.aspectRatio}-${format?.orientation}`}
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        attributionControl={false}
        preserveDrawingBuffer={true}
        onLoad={handleLoad}
        onMove={interactive ? handleMove : undefined}
        onMoveEnd={interactive ? handleMove : undefined}
        onClick={drawMode ? handleClick : undefined}
        onError={handleError}
        antialias={true}
        pixelRatio={MAP.PIXEL_RATIO}
        maxZoom={MAP.MAX_ZOOM}
        minZoom={MAP.MIN_ZOOM}
        cursor={drawMode ? 'crosshair' : undefined}
        scrollZoom={interactive}
        dragPan={interactive}
        dragRotate={interactive}
        doubleClickZoom={drawMode ? false : interactive}
        touchZoomRotate={interactive}
        keyboard={interactive}
      >
      {/* Center viewfinder — stays in the middle of the screen */}
      {showMarker && !route?.data && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-20 flex items-center justify-center',
            (layers?.placedMarkers?.length ?? 0) > 0 && 'opacity-40'
          )}
        >
          <MarkerIcon
            type={layers?.markerType || 'crosshair'}
            color={markerColor}
            size={40 * (layers?.markerScale ?? 1)}
          />
        </div>
      )}

      {/* Geographic pins placed via "Mark location" */}
      {showMarker &&
        layers?.placedMarkers?.map(([lng, lat], index) => {
          const markerType = layers.markerType || 'crosshair';
          return (
            <Marker
              key={`${lng}-${lat}-${index}`}
              longitude={lng}
              latitude={lat}
              anchor={markerType === 'pin' ? 'bottom' : 'center'}
              style={{ pointerEvents: 'none' }}
            >
              <MarkerIcon
                type={markerType}
                color={markerColor}
                size={40 * (layers.markerScale ?? 1)}
              />
            </Marker>
          );
        })}

      {/* Route Layer */}
      {routeLineGeoJSON && (
        <>
          <Source
            id="route-line"
            type="geojson"
            data={routeLineGeoJSON}
          >
            <Layer
              id="route-line-layer"
              type="line"
              paint={{
                'line-color': route?.style?.color || '#FF4444',
                'line-width': route?.style?.width || 3,
                'line-opacity': route?.style?.opacity || 0.9,
                ...(route?.style?.lineStyle === 'dashed' && {
                  'line-dasharray': [2, 2],
                }),
                ...(route?.style?.lineStyle === 'dotted' && {
                  'line-dasharray': [0.5, 2],
                }),
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
          </Source>

          {/* Start/End Markers */}
          {route?.style?.showStartEnd && routeEndpointsGeoJSON && (
            <Source
              id="route-endpoints"
              type="geojson"
              data={routeEndpointsGeoJSON}
            >
              <Layer
                id="route-start-layer"
                type="circle"
                filter={['==', ['get', 'type'], 'start']}
                paint={{
                  'circle-radius': 6,
                  'circle-color': route?.style?.startColor || '#22C55E',
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#FFFFFF',
                }}
              />
              <Layer
                id="route-end-layer"
                type="circle"
                filter={['==', ['get', 'type'], 'end']}
                paint={{
                  'circle-radius': 6,
                  'circle-color': route?.style?.endColor || '#EF4444',
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#FFFFFF',
                }}
              />
            </Source>
          )}
        </>
      )}

      {/* Draw mode waypoint markers */}
      {waypointMarkersGeoJSON && drawMode && (
        <Source
          id="draw-waypoints"
          type="geojson"
          data={waypointMarkersGeoJSON}
        >
          {/* Waypoint circles */}
          <Layer
            id="draw-waypoints-circle"
            type="circle"
            paint={{
              'circle-radius': 7,
              'circle-color': '#6366F1',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF',
            }}
          />
          {/* Waypoint numbers */}
          <Layer
            id="draw-waypoints-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'index'],
              'text-size': 10,
              'text-font': ['Open Sans Bold'],
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            }}
            paint={{
              'text-color': '#FFFFFF',
            }}
          />
        </Source>
      )}

      {/* Scale Bar */}
      {layers?.showScaleBar && (
        <CustomScaleControl
          position={layers?.scaleBarPosition || 'bottom-left'}
          color={layers?.scaleBarColor}
        />
      )}
      </Map>

      {/* Tile Loading Indicator */}
      <div 
        className={cn(
          "absolute top-4 left-4 z-30 transition-opacity duration-300 pointer-events-none",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 flex items-center gap-2 shadow-sm">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Loading Tiles...
          </span>
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 right-4 z-30 pointer-events-none">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Zoom: {viewState.zoom.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Texture Overlay */}
      {format?.texture && format.texture !== 'none' && (
        <div 
          className="absolute inset-0 pointer-events-none z-20 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: (format.textureIntensity || TEXTURE.DEFAULT_INTENSITY) / 100,
            filter: format.texture === 'canvas' ? 'contrast(120%) brightness(110%)' : 'none'
          }}
        />
      )}
    </div>
  );
}

