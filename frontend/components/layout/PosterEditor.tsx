'use client';

import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { usePosterConfig } from '@/hooks/usePosterConfig';
import { useSavedProjects } from '@/hooks/useSavedProjects';
import { useMapExport } from '@/hooks/useMapExport';
import { useSculptureConfig } from '@/hooks/useSculptureConfig';
import { useElevationGrid } from '@/hooks/useElevationGrid';
import { usePrintValidation } from '@/hooks/usePrintValidation';
import { useRouteDrawing } from '@/hooks/useRouteDrawing';
import type { ProductMode } from '@/types/sculpture';
import { Maximize, Plus, Minus, Undo2, Redo2, RotateCcw, Compass } from 'lucide-react';
import { MapPreview } from '@/components/map/MapPreview';
import { TextOverlay } from '@/components/map/TextOverlay';
import { SculpturePreview, type SculpturePreviewHandle } from '@/components/sculpture';
import { ExportButton } from '@/components/controls/ExportButton';
import { captureSculptureThumbnail } from '@/lib/export/sculptureThumbnail';
import { SaveButton } from '@/components/controls/SaveButton';
import { applyPaletteToStyle } from '@/lib/styles/applyPalette';
import { getStyleById } from '@/lib/styles';
import { throttle, cn } from '@/lib/utils';
import { THROTTLE } from '@/lib/constants';
import { getNumericRatio, getAspectRatioCSS } from '@/lib/styles/dimensions';
import { TabNavigation, type Tab } from './TabNavigation';
import { ControlDrawer } from './ControlDrawer';
import { ExploreDrawer } from './ExploreDrawer';
import { ErrorToastContainer } from '@/components/ui/ErrorToast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import Link from 'next/link';
import { GridLineLogo } from '@/components/ui/GridLineLogo';
import type MapLibreGL from 'maplibre-gl';
import { getMapById, getFeaturedRouteBySlug, publishMap } from '@/lib/actions/maps';
import { isConfigEqual, cloneConfig } from '@/lib/utils/configComparison';
import type { SavedProject, PosterConfig } from '@/types/poster';
import { generateThumbnail } from '@/lib/export/thumbnail';
import { DEFAULT_CONFIG } from '@/lib/config/defaults';

export function PosterEditor() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('location');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [productMode, setProductMode] = useState<ProductMode>('poster');
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  // Track pending auto-export from paid download flow
  const [pendingAutoExport, setPendingAutoExport] = useState<{
    resolution: import('@/lib/export/constants').ExportResolutionKey;
    mode: ProductMode;
    isPaid?: boolean; // Hide watermark for paid exports
  } | null>(null);

  // Track if we've already processed a paid download to prevent infinite loops
  const paidDownloadProcessedRef = useRef<string | null>(null);

  // Sculpture configuration (separate from poster config)
  const {
    config: sculptureConfig,
    updateConfig: updateSculptureConfig,
    resetConfig: resetSculptureConfig,
  } = useSculptureConfig();

  // Print validation for sculpture mode (config-based quick check)
  const {
    validation: printValidation,
    isValidating: isPrintValidating,
  } = usePrintValidation(sculptureConfig);

  // Get poster config first so we can use route data
  const {
    config,
    updateLocation,
    updateStyle,
    updatePalette,
    updateTypography,
    updateFormat,
    updateLayers,
    updateRoute,
    setConfig,
    undo,
    redo,
    canUndo,
    canRedo,
    useMyLocation,
    isLocating,
    locationError,
  } = usePosterConfig();

  // Route drawing mode (multi-point with OSRM road snapping)
  const {
    drawMode,
    setDrawMode: setDrawModeChange,
    waypoints: drawWaypoints,
    profile: drawProfile,
    setProfile: setDrawProfile,
    isSnapping,
    snapError,
    addWaypoint,
    undoWaypoint,
    clearWaypoints,
  } = useRouteDrawing({ onRouteChange: updateRoute, existingRoute: config.route });

  const {
    projects,
    saveProject,
    updateProject,
    deleteProject,
    renameProject,
    isAuthenticated
  } = useSavedProjects();

  const { errors, handleError, clearError } = useErrorHandler();

  // Elevation grid for sculpture mode STL export
  // IMPORTANT: Must pass sculptureConfig settings to get full terrain data
  const { grid: elevationGrid, loading: elevationGridLoading } = useElevationGrid(
    config.route?.data ?? null,
    sculptureConfig.terrainResolution,
    sculptureConfig.terrainMode
  );

  // Track currently loaded saved map
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [currentMapName, setCurrentMapName] = useState<string | null>(null);
  const [originalConfig, setOriginalConfig] = useState<PosterConfig | null>(null);
  const [currentMapStatus, setCurrentMapStatus] = useState<{
    isSaved: boolean;
    isPublished: boolean;
    hasUnsavedChanges: boolean;
  } | null>(null);

  const { isExporting, exportToPNG, lastExportResult, clearLastExport, setMapRef, fitToLocation, zoomIn, zoomOut } = useMapExport(config);

  // Keep a reference to the map instance for thumbnail generation
  const mapInstanceRef = useRef<MapLibreGL.Map | null>(null);

  // Reference to sculpture preview for thumbnail capture
  const sculpturePreviewRef = useRef<SculpturePreviewHandle>(null);

  // Sculpture thumbnail for sharing
  const [sculptureThumbnail, setSculptureThumbnail] = useState<Blob | null>(null);

  // Track if map is idle (fully rendered) for safe export
  const [mapIsIdle, setMapIsIdle] = useState(false);

  // Capture sculpture thumbnail when in sculpture mode (for share modal)
  useEffect(() => {
    if (productMode === 'sculpture' && sculpturePreviewRef.current) {
      // Small delay to ensure render is complete
      const captureTimeout = setTimeout(async () => {
        try {
          const canvas = sculpturePreviewRef.current?.captureCanvas();
          if (canvas) {
            const blob = await captureSculptureThumbnail(canvas);
            setSculptureThumbnail(blob);
          }
        } catch (error) {
          console.error('Failed to capture sculpture thumbnail:', error);
        }
      }, 500);
      return () => clearTimeout(captureTimeout);
    } else {
      setSculptureThumbnail(null);
    }
  }, [productMode, sculptureConfig, config.route?.data]);

  // Wrap exportToPNG to handle errors
  const handleExport = useCallback(async (resolutionKey: import('@/lib/export/constants').ExportResolutionKey, hideWatermark = false) => {
    try {
      await exportToPNG(resolutionKey, undefined, hideWatermark);
    } catch (error) {
      handleError(error);
    }
  }, [exportToPNG, handleError]);

  // Handle loading a saved project
  const handleLoadProject = useCallback(async (project: SavedProject) => {
    // Regenerate style with current domain URLs to fix projects saved on different environments
    // (e.g., projects saved on localhost would have localhost tile URLs baked in)
    const freshStyle = getStyleById(project.config.style.id);
    const configWithFreshStyle: PosterConfig = freshStyle
      ? {
          ...project.config,
          style: {
            ...project.config.style,
            mapStyle: freshStyle.mapStyle,
          },
        }
      : project.config;

    setConfig(configWithFreshStyle);
    setCurrentMapId(project.id);
    setCurrentMapName(project.name);
    setOriginalConfig(cloneConfig(configWithFreshStyle));

    // Load sculpture config and set product mode if this is a sculpture
    if (project.productType === 'sculpture' && project.sculptureConfig) {
      updateSculptureConfig(project.sculptureConfig);
      setProductMode('sculpture');
    } else {
      // Reset to poster mode for poster projects
      setProductMode('poster');
    }

    // Fetch full metadata if authenticated
    if (isAuthenticated) {
      try {
        const fullMap = await getMapById(project.id);
        if (fullMap) {
          setCurrentMapStatus({
            isSaved: true,
            isPublished: fullMap.is_published,
            hasUnsavedChanges: false
          });
          return;
        }
      } catch (error) {
        console.error('Failed to fetch map metadata:', error);
      }
    }

    // Fallback
    setCurrentMapStatus({
      isSaved: true,
      isPublished: false,
      hasUnsavedChanges: false
    });
  }, [setConfig, isAuthenticated, updateSculptureConfig]);

  // Load map from URL param on mount (for edit/duplicate links and paid download flow)
  useEffect(() => {
    const mapId = searchParams.get('mapId');
    const autoExport = searchParams.get('autoExport');
    const resolution = searchParams.get('resolution');
    const mode = searchParams.get('mode');
    const hasPaidSnapshot = searchParams.get('hasPaidSnapshot');

    // CRITICAL: Paid downloads must ALWAYS load the config snapshot from sessionStorage
    // even if we already have the same mapId loaded (user may have edited since purchasing)
    const isPaidDownload = hasPaidSnapshot === 'true' && autoExport === 'true';

    // Skip if no mapId
    if (!mapId) return;

    // Skip if already loading
    if (isLoadingMap) return;

    // For paid downloads: check if we've already processed this download
    // Just return early - URL params were already cleared in the main flow
    if (isPaidDownload && paidDownloadProcessedRef.current) {
      return;
    }

    // For non-paid downloads: skip if already loaded this map
    if (!isPaidDownload && currentMapId === mapId) return;

    const loadMapFromUrl = async () => {
      setIsLoadingMap(true);
      try {
        // CRITICAL: For paid downloads, use the config snapshot from sessionStorage
        // This ensures the customer gets EXACTLY the design they paid for
        let configToLoad: PosterConfig | null = null;
        let sculptureConfigToLoad: import('@/types/sculpture').SculptureConfig | undefined;
        let productTypeToLoad: 'poster' | 'sculpture' = 'poster';

        if (hasPaidSnapshot === 'true' && autoExport === 'true') {
          console.log('[PAID DOWNLOAD] Attempting to load config from sessionStorage');
          try {
            const storedData = sessionStorage.getItem('gridline_paid_export_config');
            if (storedData) {
              const parsed = JSON.parse(storedData);
              console.log('[PAID DOWNLOAD] Found stored config, orderId:', parsed.orderId, 'timestamp:', parsed.timestamp);
              // Verify the snapshot is recent (within 5 minutes) and valid
              if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
                if (parsed.configSnapshot) {
                  configToLoad = parsed.configSnapshot as PosterConfig;
                  sculptureConfigToLoad = parsed.sculptureConfigSnapshot;
                  productTypeToLoad = parsed.productType || 'poster';
                  console.log('[PAID DOWNLOAD] Using config snapshot from order:', parsed.orderId);
                } else {
                  console.warn('[PAID DOWNLOAD] Config snapshot is empty in stored data');
                }
              } else {
                console.warn('[PAID DOWNLOAD] Stored config is too old, age:', Date.now() - parsed.timestamp, 'ms');
              }
              // Clear the snapshot after use
              sessionStorage.removeItem('gridline_paid_export_config');
            } else {
              console.warn('[PAID DOWNLOAD] No config found in sessionStorage');
            }
          } catch (e) {
            console.warn('[PAID DOWNLOAD] Failed to load config snapshot:', e);
          }
        }

        // If no paid snapshot, load from database (normal edit flow)
        if (!configToLoad) {
          const map = await getMapById(mapId);
          if (map) {
            configToLoad = map.config;
            sculptureConfigToLoad = map.sculpture_config ?? undefined;
            productTypeToLoad = map.product_type;
          }
        }

        if (configToLoad) {
          // Regenerate style with current domain URLs
          const freshStyle = getStyleById(configToLoad.style.id);
          const configWithFreshStyle: PosterConfig = freshStyle
            ? {
                ...configToLoad,
                style: {
                  ...configToLoad.style,
                  mapStyle: freshStyle.mapStyle,
                },
              }
            : configToLoad;

          // Apply the config
          setConfig(configWithFreshStyle);
          setCurrentMapId(mapId);
          setOriginalConfig(cloneConfig(configWithFreshStyle));

          // Load sculpture config if applicable
          if (productTypeToLoad === 'sculpture' && sculptureConfigToLoad) {
            updateSculptureConfig(sculptureConfigToLoad);
            setProductMode('sculpture');
          } else {
            setProductMode('poster');
          }

          // Fetch map name if authenticated (for display purposes)
          if (isAuthenticated) {
            try {
              const map = await getMapById(mapId);
              if (map) {
                setCurrentMapName(map.title);
                setCurrentMapStatus({
                  isSaved: true,
                  isPublished: map.is_published,
                  hasUnsavedChanges: false,
                });
              }
            } catch (e) {
              console.warn('Failed to fetch map metadata:', e);
            }
          }

          // Clear URL params to prevent reloading
          const params = new URLSearchParams(searchParams.toString());
          params.delete('mapId');
          params.delete('autoExport');
          params.delete('resolution');
          params.delete('mode');
          params.delete('hasPaidSnapshot');
          const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
          router.replace(newUrl, { scroll: false });

          // If auto-export is requested (from paid download flow), set pending state
          if (autoExport === 'true' && resolution) {
            const exportMode: ProductMode = mode === 'sculpture' ? 'sculpture' : 'poster';
            setPendingAutoExport({
              resolution: resolution as import('@/lib/export/constants').ExportResolutionKey,
              mode: exportMode,
              isPaid: isPaidDownload, // Hide watermark for paid exports
            });

            // Mark this paid download as processed to prevent infinite loops
            if (isPaidDownload) {
              paidDownloadProcessedRef.current = mapId;
              console.log('[PAID DOWNLOAD] Marked as processed, mapId:', mapId);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load map from URL:', error);
      } finally {
        setIsLoadingMap(false);
      }
    };

    // For paid downloads, immediately mark as processing to prevent re-runs
    if (isPaidDownload) {
      paidDownloadProcessedRef.current = mapId;
    }

    loadMapFromUrl();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname, router, setConfig, updateSculptureConfig, isAuthenticated]);

  // Load featured route from SEO page (e.g., /race/boston-marathon CTA)
  // Track processed route slug to prevent re-loading
  const processedRouteSeoRef = useRef<string | null>(null);

  useEffect(() => {
    const routeSlug = searchParams.get('route');
    const source = searchParams.get('source');

    // Only handle SEO page redirects with route param
    if (!routeSlug || source !== 'seo') return;

    // Skip if already processed this route
    if (processedRouteSeoRef.current === routeSlug) return;

    // Skip if already loading
    if (isLoadingMap) return;

    const loadFeaturedRoute = async () => {
      setIsLoadingMap(true);
      processedRouteSeoRef.current = routeSlug;

      try {
        console.log('[SEO ROUTE] Loading featured route:', routeSlug);
        const featuredMap = await getFeaturedRouteBySlug(routeSlug);

        if (featuredMap) {
          console.log('[SEO ROUTE] Found featured map:', featuredMap.title);

          // Regenerate style with current domain URLs
          const freshStyle = getStyleById(featuredMap.config.style.id);
          const configWithFreshStyle: PosterConfig = freshStyle
            ? {
                ...featuredMap.config,
                style: {
                  ...featuredMap.config.style,
                  mapStyle: freshStyle.mapStyle,
                },
              }
            : featuredMap.config;

          // Apply the config - user starts with fresh design based on route
          setConfig(configWithFreshStyle);

          // Don't set currentMapId since this is a new design, not editing existing
          // User can save as their own map later
          setCurrentMapId(null);
          setCurrentMapName(null);
          setOriginalConfig(null);
          setCurrentMapStatus(null);

          // Set product mode based on map type
          if (featuredMap.product_type === 'sculpture' && featuredMap.sculpture_config) {
            updateSculptureConfig(featuredMap.sculpture_config);
            setProductMode('sculpture');
          } else {
            setProductMode('poster');
          }
        } else {
          console.warn('[SEO ROUTE] Featured route not found:', routeSlug);
        }

        // Clear URL params to prevent reloading
        const params = new URLSearchParams(searchParams.toString());
        params.delete('route');
        params.delete('source');
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });

      } catch (error) {
        console.error('[SEO ROUTE] Failed to load featured route:', error);
      } finally {
        setIsLoadingMap(false);
      }
    };

    loadFeaturedRoute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname, router, setConfig, updateSculptureConfig]);

  // Restore route data from sessionStorage after auth redirect
  // This handles the case where user clicks Save without being logged in,
  // then logs in and is redirected back - the route data is preserved in sessionStorage
  // because routes are too large to encode in the URL
  const DRAFT_ROUTE_KEY = 'gridline_draft_route';
  const draftRouteProcessedRef = useRef(false);

  useEffect(() => {
    // Only process once per component mount
    if (draftRouteProcessedRef.current) return;

    // Don't restore if we're loading from URL or already have route data
    if (isLoadingMap || config.route?.data) return;

    try {
      const storedData = sessionStorage.getItem(DRAFT_ROUTE_KEY);
      if (!storedData) return;

      const parsed = JSON.parse(storedData);
      const timestamp = parsed.timestamp;

      // Verify the snapshot is recent (within 5 minutes)
      if (timestamp && Date.now() - timestamp < 5 * 60 * 1000) {
        console.log('[DRAFT RESTORE] Restoring route data from sessionStorage');
        if (parsed.route) {
          updateRoute(parsed.route);
        }
      } else {
        console.log('[DRAFT RESTORE] Stored route data is too old, discarding');
      }

      // Clear the snapshot after processing (whether used or not)
      sessionStorage.removeItem(DRAFT_ROUTE_KEY);
      draftRouteProcessedRef.current = true;
    } catch (e) {
      console.warn('[DRAFT RESTORE] Failed to restore route data:', e);
      sessionStorage.removeItem(DRAFT_ROUTE_KEY);
      draftRouteProcessedRef.current = true;
    }
  }, [isLoadingMap, config.route?.data, updateRoute]);

  // Trigger auto-export when pending and map is ready (from paid download flow)
  // For posters: directly trigger PNG export
  // For sculptures: set flag to auto-open modal and trigger STL export
  const [autoTriggerSculptureExport, setAutoTriggerSculptureExport] = useState(false);
  // Flag to show share modal after poster auto-export completes
  const [showShareModalAfterAutoExport, setShowShareModalAfterAutoExport] = useState(false);
  // Track auto-export timeout start time for fallback
  const autoExportStartTimeRef = useRef<number | null>(null);
  // Maximum time to wait for map idle before forcing export (15 seconds)
  const AUTO_EXPORT_TIMEOUT_MS = 15000;

  useEffect(() => {
    if (!pendingAutoExport || !currentMapId || isLoadingMap || isExporting) return;

    if (pendingAutoExport.mode === 'sculpture') {
      // For sculptures, use a small delay since they use 3D canvas (not MapLibre)
      const sculptureTimeout = setTimeout(() => {
        setAutoTriggerSculptureExport(true);
        setPendingAutoExport(null);
      }, 1000);
      return () => clearTimeout(sculptureTimeout);
    } else {
      // Track when we started waiting for the map to be idle
      if (autoExportStartTimeRef.current === null) {
        autoExportStartTimeRef.current = Date.now();
      }

      // For posters, wait for map to be idle (fully rendered) before exporting
      // This prevents "already running" errors with 3D terrain
      // But add a timeout fallback to prevent infinite waiting
      const timeWaiting = Date.now() - autoExportStartTimeRef.current;
      const shouldForceExport = timeWaiting >= AUTO_EXPORT_TIMEOUT_MS;

      if (!mapIsIdle && !shouldForceExport) {
        // Check again in 500ms
        const checkTimeout = setTimeout(() => {
          // Force re-evaluation by updating state
        }, 500);
        return () => clearTimeout(checkTimeout);
      }

      if (shouldForceExport && !mapIsIdle) {
        console.warn('Auto-export timeout: forcing export even though map is not idle');
        handleError(new Error('Map tiles may not be fully loaded. If the export looks incomplete, please try downloading again.'));
      }

      // Additional small delay after idle/timeout to ensure stability
      const posterTimeout = setTimeout(() => {
        setShowShareModalAfterAutoExport(true);
        setPendingAutoExport(null);
        autoExportStartTimeRef.current = null;
        // Pass isPaid flag to hide watermark for paid exports
        handleExport(pendingAutoExport.resolution, pendingAutoExport.isPaid ?? false);
      }, mapIsIdle ? 500 : 1000);
      return () => clearTimeout(posterTimeout);
    }
  }, [pendingAutoExport, currentMapId, isLoadingMap, isExporting, mapIsIdle, handleExport, handleError]);

  // Handle saving a project (wraps saveProject to track currentMapId)
  const handleSaveProject = useCallback(async (name: string, posterConfig: PosterConfig) => {
    // Generate thumbnail based on product mode
    let thumbnailBlob: Blob | undefined;
    let sculptureThumbnailBlob: Blob | undefined;

    if (isAuthenticated) {
      try {
        if (productMode === 'sculpture') {
          // Capture sculpture 3D canvas thumbnail
          const sculptureCanvas = sculpturePreviewRef.current?.captureCanvas();
          if (sculptureCanvas) {
            sculptureThumbnailBlob = await captureSculptureThumbnail(sculptureCanvas);
          }
        } else if (mapInstanceRef.current) {
          // Capture map thumbnail for poster mode
          thumbnailBlob = await generateThumbnail(mapInstanceRef.current, posterConfig);
        }
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
        // Continue without thumbnail
      }
    }

    // Save the project with sculpture options if in sculpture mode
    const savedProject = await saveProject(name, posterConfig, thumbnailBlob, {
      productType: productMode,
      sculptureConfig: productMode === 'sculpture' ? sculptureConfig : undefined,
      sculptureThumbnailBlob: sculptureThumbnailBlob,
    });

    // Automatically load the saved project
    await handleLoadProject(savedProject);
  }, [saveProject, handleLoadProject, isAuthenticated, productMode, sculptureConfig]);

  // Wrapper for SaveButton that passes current config
  const handleSaveClick = useCallback(async (name: string) => {
    await handleSaveProject(name, config);
  }, [handleSaveProject, config]);

  // Auto-save map for paid exports (returns mapId or null)
  // Always creates a NEW copy - so the purchased version is a snapshot
  // This prevents confusion between "what was purchased" and "current edits"
  const handleAutoSaveForExport = useCallback(async (): Promise<string | null> => {
    // Can't save if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    // Generate a name from location or use default
    const baseName = config.location?.name || config.route?.data?.name || 'Untitled Map';
    // Add suffix to indicate this is a purchased export copy
    const mapName = currentMapId ? `${baseName} (Export Copy)` : baseName;

    try {
      // Always create a NEW save (don't reuse existing mapId)
      // This is important for paid exports so the purchased version is preserved
      const savedProject = await saveProject(mapName, config, undefined, {
        productType: productMode,
        sculptureConfig: productMode === 'sculpture' ? sculptureConfig : undefined,
      });

      // Note: We intentionally DON'T call handleLoadProject here
      // because we want to keep the user's current editing context
      // The new save is just for the purchase/download

      return savedProject.id;
    } catch (error) {
      console.error('Failed to auto-save map for export:', error);
      return null;
    }
  }, [isAuthenticated, config, saveProject, productMode, sculptureConfig, currentMapId]);

  // Handler for updating existing project (overwrite)
  const handleUpdateProject = useCallback(async () => {
    if (!currentMapId || !isAuthenticated) return;

    // Generate thumbnail based on product mode
    let thumbnailBlob: Blob | undefined;
    let sculptureThumbnailBlob: Blob | undefined;

    try {
      if (productMode === 'sculpture') {
        // Capture sculpture 3D canvas thumbnail
        const sculptureCanvas = sculpturePreviewRef.current?.captureCanvas();
        if (sculptureCanvas) {
          sculptureThumbnailBlob = await captureSculptureThumbnail(sculptureCanvas);
        }
      } else if (mapInstanceRef.current) {
        // Capture map thumbnail for poster mode
        const { generateThumbnail } = await import('@/lib/export/thumbnail');
        thumbnailBlob = await generateThumbnail(mapInstanceRef.current, config);
      }
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      // Continue without thumbnail
    }

    // Update the project with sculpture options if in sculpture mode
    await updateProject(currentMapId, config, thumbnailBlob, {
      productType: productMode,
      sculptureConfig: productMode === 'sculpture' ? sculptureConfig : undefined,
      sculptureThumbnailBlob: sculptureThumbnailBlob,
    });

    // Update the original config to reflect the saved state
    setOriginalConfig(config);
    setCurrentMapStatus(prev => prev ? { ...prev, hasUnsavedChanges: false } : null);
  }, [currentMapId, isAuthenticated, config, updateProject, productMode, sculptureConfig]);

  // Handle publish success - refetch map status to get latest published state
  const handlePublishSuccess = useCallback(async () => {
    if (!currentMapId || !isAuthenticated) return;

    try {
      const fullMap = await getMapById(currentMapId);
      if (fullMap) {
        setCurrentMapStatus(prev => prev ? { ...prev, isPublished: fullMap.is_published } : null);
      }
    } catch (error) {
      console.error('Failed to refresh map status:', error);
    }
  }, [currentMapId, isAuthenticated]);

  // Handle publishing from share modal
  const handlePublishFromShareModal = useCallback(async () => {
    if (!currentMapId || !isAuthenticated) {
      throw new Error('Must save map first before publishing');
    }

    try {
      await publishMap(currentMapId);
      // Refresh map status after publishing
      await handlePublishSuccess();
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [currentMapId, isAuthenticated, handlePublishSuccess, handleError]);

  // Detect unsaved changes
  useEffect(() => {
    if (currentMapId && originalConfig) {
      const hasChanges = !isConfigEqual(config, originalConfig);
      setCurrentMapStatus(prev => prev ? { ...prev, hasUnsavedChanges: hasChanges } : null);
    }
  }, [config, originalConfig, currentMapId]);

  const numericRatio = useMemo(() => {
    return getNumericRatio(config.format.aspectRatio, config.format.orientation);
  }, [config.format.aspectRatio, config.format.orientation]);

  // Apply palette colors and visibility to the current map style
  const mapStyle = useMemo(() => {
    return applyPaletteToStyle(
      config.style.mapStyle, 
      config.palette, 
      config.layers, 
      config.style.layerToggles
    );
  }, [config.style.mapStyle, config.palette, config.layers, config.style.layerToggles]);

  const handleMapLoad = useCallback((map: MapLibreGL.Map) => {
    setMapRef(map);
    mapInstanceRef.current = map;

    // Track when map becomes idle (fully rendered) for safe export
    setMapIsIdle(false);
    map.on('idle', () => {
      setMapIsIdle(true);
    });
  }, [setMapRef]);

  // Throttle the location update to prevent excessive style re-renders
  const throttledUpdateLocation = useMemo(
    () => throttle((center: [number, number], zoom: number) => {
      updateLocation({ center, zoom });
    }, THROTTLE.MAP_MOVE),
    [updateLocation]
  );

  const handleMapMove = useCallback((center: [number, number], zoom: number) => {
    throttledUpdateLocation(center, zoom);
  }, [throttledUpdateLocation]);

  // Handle reset - clears saved map state and resets to default config
  const handleReset = useCallback(() => {
    // Clear saved map state
    setCurrentMapId(null);
    setCurrentMapName(null);
    setOriginalConfig(null);
    setCurrentMapStatus(null);

    // Reset config to default
    setConfig(DEFAULT_CONFIG);

    // Reset sculpture config and mode
    resetSculptureConfig();
    setProductMode('poster');

    // Clear URL state parameter by navigating to clean URL
    router.replace(pathname, { scroll: false });
  }, [setConfig, router, pathname, resetSculptureConfig]);

  // Handle mode change - clears saved map state since poster/sculpture are different designs
  const handleModeChange = useCallback((newMode: ProductMode) => {
    if (newMode !== productMode) {
      // Clear saved map state when switching modes - treat as new design
      setCurrentMapId(null);
      setCurrentMapName(null);
      setOriginalConfig(null);
      setCurrentMapStatus(null);
      // Clear URL mapId parameter
      router.replace(pathname, { scroll: false });
    }
    setProductMode(newMode);
  }, [productMode, router, pathname]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <ErrorToastContainer errors={errors} onDismiss={clearError} />
      {/* Mobile Header */}
      <div className="md:hidden h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-40 shadow-sm">
        <Link href="/create">
          <GridLineLogo size="md" showText />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExploreOpen(true)}
            className="p-2 rounded-md transition-colors text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary dark:hover:bg-gray-700"
            title="Explore Community Maps"
          >
            <Compass className="w-4 h-4" />
          </button>
          <SaveButton
            onSave={handleSaveClick}
            onUpdate={handleUpdateProject}
            currentMapId={currentMapId}
            currentMapName={currentMapName}
            hasUnsavedChanges={currentMapStatus?.hasUnsavedChanges}
            isAuthenticated={isAuthenticated}
            disabled={isExporting}
            getCurrentConfig={() => config}
          />
          <button
            onClick={handleReset}
            className="p-2 rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            title={currentMapId ? "Exit saved map and start new" : "Reset to default"}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <ExportButton
            onExport={handleExport}
            isExporting={isExporting}
            format={config.format}
            productMode={productMode}
            sculptureConfig={sculptureConfig}
            routeData={config.route?.data}
            elevationGrid={elevationGrid ?? undefined}
            routeName={config.route?.data?.name || config.location?.name}
            sculptureThumbnail={sculptureThumbnail}
            lastExportResult={lastExportResult}
            onClearExport={clearLastExport}
            isAuthenticated={isAuthenticated}
            isPublished={currentMapStatus?.isPublished}
            isSaved={!!currentMapId}
            onPublish={currentMapId ? handlePublishFromShareModal : undefined}
            mapId={currentMapId}
            onSaveMap={handleAutoSaveForExport}
            autoTriggerSculptureExport={autoTriggerSculptureExport}
            onAutoExportTriggered={() => setAutoTriggerSculptureExport(false)}
            autoShowShareModal={showShareModalAfterAutoExport}
            onShareModalShown={() => setShowShareModalAfterAutoExport(false)}
            getCurrentConfig={() => config}
            getSculptureConfig={() => sculptureConfig}
          />
        </div>
      </div>

      <TabNavigation
        activeTab={activeTab}
        isDrawerOpen={isDrawerOpen}
        onTabChange={setActiveTab}
        onToggleDrawer={setIsDrawerOpen}
        onOpenExplore={() => setIsExploreOpen(true)}
        productMode={productMode}
        onModeChange={handleModeChange}
        hasRoute={!!config.route?.data}
      />

      <ExploreDrawer
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
      />

      <ControlDrawer
        activeTab={activeTab}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        config={config}
        updateLocation={updateLocation}
        updateStyle={updateStyle}
        updatePalette={updatePalette}
        updateTypography={updateTypography}
        updateFormat={updateFormat}
        updateLayers={updateLayers}
        updateRoute={updateRoute}
        setConfig={setConfig}
        savedProjects={projects}
        deleteProject={deleteProject}
        renameProject={renameProject}
        currentMapId={currentMapId}
        currentMapName={currentMapName}
        currentMapStatus={currentMapStatus}
        onLoadProject={handleLoadProject}
        onPublishSuccess={handlePublishSuccess}
        productMode={productMode}
        sculptureConfig={sculptureConfig}
        updateSculptureConfig={updateSculptureConfig}
        printValidation={printValidation}
        isPrintValidating={isPrintValidating}
        useMyLocation={useMyLocation}
        isLocating={isLocating}
        locationError={locationError}
        drawMode={drawMode}
        onDrawModeChange={setDrawModeChange}
        drawWaypoints={drawWaypoints}
        drawProfile={drawProfile}
        onDrawProfileChange={setDrawProfile}
        isSnapping={isSnapping}
        snapError={snapError}
        onUndoWaypoint={undoWaypoint}
        onClearWaypoints={clearWaypoints}
      />

      {/* Main Content */}
      <main 
        className="flex-1 relative bg-gray-100 dark:bg-gray-950 flex flex-col overflow-hidden pb-16 md:pb-0"
        style={{ containerType: 'size' }}
      >
        {/* Top Actions Overlay - Desktop Only */}
        <div className="absolute top-6 right-8 z-50 pointer-events-auto hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={cn(
                "p-2 rounded-md transition-colors",
                canUndo
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                  : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              )}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={cn(
                "p-2 rounded-md transition-colors",
                canRedo
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                  : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              )}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              title={currentMapId ? "Exit saved map and start new" : "Reset to default"}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <SaveButton
            onSave={handleSaveClick}
            onUpdate={handleUpdateProject}
            currentMapId={currentMapId}
            currentMapName={currentMapName}
            hasUnsavedChanges={currentMapStatus?.hasUnsavedChanges}
            isAuthenticated={isAuthenticated}
            disabled={isExporting}
            getCurrentConfig={() => config}
          />
          <ExportButton
            onExport={handleExport}
            isExporting={isExporting}
            format={config.format}
            productMode={productMode}
            sculptureConfig={sculptureConfig}
            routeData={config.route?.data}
            elevationGrid={elevationGrid ?? undefined}
            routeName={config.route?.data?.name || config.location?.name}
            sculptureThumbnail={sculptureThumbnail}
            lastExportResult={lastExportResult}
            onClearExport={clearLastExport}
            isAuthenticated={isAuthenticated}
            isPublished={currentMapStatus?.isPublished}
            isSaved={!!currentMapId}
            onPublish={currentMapId ? handlePublishFromShareModal : undefined}
            mapId={currentMapId}
            onSaveMap={handleAutoSaveForExport}
            autoTriggerSculptureExport={autoTriggerSculptureExport}
            onAutoExportTriggered={() => setAutoTriggerSculptureExport(false)}
            autoShowShareModal={showShareModalAfterAutoExport}
            onShareModalShown={() => setShowShareModalAfterAutoExport(false)}
            getCurrentConfig={() => config}
            getSculptureConfig={() => sculptureConfig}
          />
        </div>

        {/* Preview Area - Poster or Sculpture based on mode */}
        <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
          {productMode === 'poster' ? (
            /* Poster Mode - Map Canvas */
            <div
              className="relative shadow-2xl bg-white flex flex-col transition-all duration-300 ease-in-out ring-1 ring-black/5"
              style={{
                aspectRatio: getAspectRatioCSS(config.format.aspectRatio, config.format.orientation),
                backgroundColor: config.palette.background,
                width: `min(calc(100% - 2rem), calc((100cqh - 2rem) * ${numericRatio}))`,
                height: 'auto',
                maxHeight: 'calc(100cqh - 2rem)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                containerType: 'size',
              }}
            >
              {/* The Map Window */}
              <div
                className="absolute overflow-hidden min-h-0 min-w-0"
                style={{
                  top: `${config.format.margin}cqw`,
                  left: `${config.format.margin}cqw`,
                  right: `${config.format.margin}cqw`,
                  bottom: `${config.format.margin}cqw`,
                  borderRadius: (config.format.maskShape || 'rectangular') === 'circular' ? '50%' : '0',
                }}
              >
                <MapPreview
                  mapStyle={mapStyle}
                  location={config.location}
                  format={config.format}
                  showMarker={config.layers.marker}
                  markerColor={config.layers.markerColor || config.palette.primary || config.palette.accent || config.palette.text}
                  onMapLoad={handleMapLoad}
                  onMove={handleMapMove}
                  layers={config.layers}
                  route={config.route}
                  drawMode={drawMode}
                  onMapClick={addWaypoint}
                  drawWaypoints={drawWaypoints}
                />

                {/* Floating Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-row gap-2 z-10">
                  <button
                    onClick={zoomOut}
                    className="p-2 bg-white/90 hover:bg-white border border-gray-200 rounded-md shadow-sm transition-colors text-gray-600 hover:text-primary pointer-events-auto"
                    title="Zoom Out"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={zoomIn}
                    className="p-2 bg-white/90 hover:bg-white border border-gray-200 rounded-md shadow-sm transition-colors text-gray-600 hover:text-primary pointer-events-auto"
                    title="Zoom In"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={fitToLocation}
                    className="p-2 bg-white/90 hover:bg-white border border-gray-200 rounded-md shadow-sm transition-colors text-gray-600 hover:text-primary pointer-events-auto"
                    title="Snap map to original bounds"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Text Overlay */}
              <TextOverlay config={config} />

            {/* Border Overlay - Now drawn AFTER TextOverlay to stay on top of gradients */}
            {config.format.borderStyle !== 'none' && (
              <div 
                className="absolute pointer-events-none z-30"
                style={{
                  top: `${config.format.margin}cqw`,
                  left: `${config.format.margin}cqw`,
                  right: `${config.format.margin}cqw`,
                  bottom: `${config.format.margin}cqw`,
                  padding: config.format.borderStyle === 'inset' ? '2cqw' : '0',
                }}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    border: `${
                      config.format.borderStyle === 'thick' ? '1.5cqw' : '0.5cqw'
                    } solid ${config.palette.accent || config.palette.text}`,
                    borderRadius: (config.format.maskShape || 'rectangular') === 'circular' ? '50%' : '0',
                  }}
                />
                
                {/* Compass Rose Preview (SVG) */}
                {(config.format.maskShape || 'rectangular') === 'circular' && config.format.compassRose && (
                  <svg 
                    className="absolute"
                    style={{ 
                      pointerEvents: 'none', 
                      overflow: 'visible',
                      top: '-4cqw',
                      left: '-4cqw',
                      right: '-4cqw',
                      bottom: '-4cqw',
                      width: 'calc(100% + 8cqw)',
                      height: 'calc(100% + 8cqw)',
                    }}
                    viewBox="0 0 100 100"
                  >
                    <g
                      stroke={config.palette.accent || config.palette.text}
                      fill={config.palette.accent || config.palette.text}
                      strokeWidth="0.15"
                      opacity="0.8"
                    >
                      {/* Draw 8 main directions */}
                      {[
                        { angle: 0, label: 'N' },
                        { angle: 45, label: 'NE' },
                        { angle: 90, label: 'E' },
                        { angle: 135, label: 'SE' },
                        { angle: 180, label: 'S' },
                        { angle: 225, label: 'SW' },
                        { angle: 270, label: 'W' },
                        { angle: 315, label: 'NW' },
                      ].map(({ angle, label }) => {
                        const rad = ((angle - 90) * Math.PI) / 180;
                        const centerX = 50;
                        const centerY = 50;
                        // Border is at the edge of the original 100x100 viewBox
                        // Position ticks starting at the border edge
                        const borderOuterRadius = 49.5; // Outer edge of border in 100x100 coordinate system
                        const tickLen = label === 'N' || label === 'S' || label === 'E' || label === 'W' ? 1.2 : 0.6;
                        // Ticks start at the border edge and extend outward
                        const tickStartRadius = borderOuterRadius;
                        const tickEndRadius = borderOuterRadius + tickLen;
                        
                        const x1 = centerX + Math.cos(rad) * tickStartRadius;
                        const y1 = centerY + Math.sin(rad) * tickStartRadius;
                        const x2 = centerX + Math.cos(rad) * tickEndRadius;
                        const y2 = centerY + Math.sin(rad) * tickEndRadius;
                        
                        // Position labels further out from the border
                        const labelRadius = borderOuterRadius + tickLen + 1.0;
                        const labelX = centerX + Math.cos(rad) * labelRadius;
                        const labelY = centerY + Math.sin(rad) * labelRadius;
                        
                        return (
                          <g key={angle}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} />
                            <text
                              x={labelX}
                              y={labelY}
                              fontSize="1.2"
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              opacity={label === 'N' || label === 'S' || label === 'E' || label === 'W' ? 1 : 0.7}
                            >
                              {label}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Draw intermediate ticks */}
                      {Array.from({ length: 24 }, (_, i) => {
                        if (i % 3 === 0) return null; // Skip positions where we have main directions
                        const angle = (i * 15 - 90) * (Math.PI / 180);
                        const centerX = 50;
                        const centerY = 50;
                        const borderOuterRadius = 49.5;
                        const tickLen = 0.4;
                        // Ticks start at the border edge and extend outward
                        const tickStartRadius = borderOuterRadius;
                        const tickEndRadius = borderOuterRadius + tickLen;
                        
                        const x1 = centerX + Math.cos(angle) * tickStartRadius;
                        const y1 = centerY + Math.sin(angle) * tickStartRadius;
                        const x2 = centerX + Math.cos(angle) * tickEndRadius;
                        const y2 = centerY + Math.sin(angle) * tickEndRadius;
                        
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.6" />;
                      })}
                    </g>
                  </svg>
                )}
              </div>
            )}
            </div>
          ) : (
            /* Sculpture Mode - 3D Preview */
            <div className="w-full h-full max-w-4xl max-h-[80vh] aspect-square">
              <SculpturePreview
                ref={sculpturePreviewRef}
                routeData={config.route?.data ?? null}
                config={sculptureConfig}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


