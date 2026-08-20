import type MapLibreGL from 'maplibre-gl';
import type { PosterConfig } from '@/types/poster';
import { DEFAULT_EXPORT_RESOLUTION, type BaseExportResolution } from './constants';
import { calculateTargetResolution } from './resolution';
import { drawMarker, applyTexture, drawCompassRose, drawScaleBar } from './drawing';
import { drawTextOverlay } from './text-overlay';
import { logger } from '@/lib/logger';
import { createError } from '@/lib/errors/ServerActionError';

interface ExportOptions {
  map: MapLibreGL.Map;
  config: PosterConfig;
  resolution?: BaseExportResolution;
  /** Hide watermark for paid exports */
  hideWatermark?: boolean;
}

/**
 * Wait for the map to be in a stable state for export.
 * This waits for idle (or timeout), then waits additional frames to ensure
 * no render is in progress (prevents "already running" errors with 3D terrain).
 */
async function waitForMapStable(map: MapLibreGL.Map, timeoutMs = 5000): Promise<void> {
  // First wait for idle - but don't fail if timeout (3D terrain may never fully idle)
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      logger.warn('Map stability timeout - proceeding with export anyway');
      resolve();
    }, timeoutMs);

    if (map.isStyleLoaded() && !map.isMoving()) {
      clearTimeout(timeout);
      resolve();
    } else {
      map.once('idle', () => {
        clearTimeout(timeout);
        resolve();
      });
    }
  });

  // Wait multiple animation frames to ensure render cycle is complete
  // This is especially important for 3D terrain which has async tile loading
  for (let i = 0; i < 3; i++) {
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => resolve());
    });
  }
}

/**
 * Wait for map to become idle after a state change, with timeout.
 */
async function waitForIdle(map: MapLibreGL.Map, timeoutMs = 15000): Promise<void> {
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      // Don't reject, just resolve - the map might be stable enough
      logger.warn('Map idle wait timed out, proceeding anyway');
      resolve();
    }, timeoutMs);

    map.once('idle', () => {
      clearTimeout(timeout);
      resolve();
    });
  });

  // Additional frame wait for safety
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export async function exportMapToPNG(options: ExportOptions): Promise<Blob> {
  const { map, config, resolution = DEFAULT_EXPORT_RESOLUTION, hideWatermark = false } = options;

  // Wait for map to be stable before starting export
  await waitForMapStable(map);

  // 1. CALCULATE ACTUAL RESOLUTION
  const exportResolution = calculateTargetResolution(
    resolution,
    config.format.aspectRatio,
    config.format.orientation
  );

  // Wait for fonts
  try {
    const fontsToLoad = [
      `${config.typography.titleWeight} 10px "${config.typography.titleFont}"`,
      `400 10px "${config.typography.subtitleFont}"`
    ];
    await Promise.all(fontsToLoad.map(font => document.fonts.load(font)));
  } catch (e) {
    logger.warn('Failed to load fonts for export, falling back to system fonts:', e);
  }

  // 2. GATHER DIMENSIONS & SCALING
  const container = map.getContainer();
  const posterElement = container.closest('[style*="aspect-ratio"]');
  const rect = (posterElement || container).getBoundingClientRect();
  const logicalWidth = rect.width;
  
  const exportScale = exportResolution.width / logicalWidth;
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  const featureScale = exportResolution.width / (logicalWidth * dpr);
  const zoomOffset = Math.log2(featureScale);

  const originalWidth = map.getCanvas().width;
  const originalHeight = map.getCanvas().height;
  const originalZoom = map.getZoom();
  const originalMaxZoom = (map as any).getMaxZoom?.();

  try {
    const marginPx = Math.round(exportResolution.width * (config.format.margin / 100));
    const drawWidth = exportResolution.width - (marginPx * 2);
    const drawHeight = exportResolution.height - (marginPx * 2);

    // 3. APPLY HIGH-RES SCALING TO MAP
    // Do this in a single requestAnimationFrame to batch changes
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        if (typeof (map as any).setMaxZoom === 'function') {
          (map as any).setMaxZoom(24); // Temporarily allow higher zoom for export
        }

        // Set canvas dimensions first (doesn't trigger render)
        map.getCanvas().width = drawWidth;
        map.getCanvas().height = drawHeight;

        // Apply zoom and center in a single jumpTo call (triggers one render)
        map.jumpTo({
          center: config.location.center,
          zoom: originalZoom + zoomOffset
        });

        // Resize triggers another render but now we're at frame boundary
        map.resize();
        resolve();
      });
    });

    // Wait for map to become idle, but with timeout for slow terrain tiles
    await waitForIdle(map, 15000);

    const mapCanvas = map.getCanvas();
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportResolution.width;
    exportCanvas.height = exportResolution.height;
    const exportCtx = exportCanvas.getContext('2d');
    
    if (!exportCtx) throw createError.internalError('Could not create export canvas context');

    // Background
    exportCtx.fillStyle = config.palette.background;
    exportCtx.fillRect(0, 0, exportResolution.width, exportResolution.height);

    // 4. DRAW MAP
    exportCtx.save();
    exportCtx.beginPath();
    const maskShape = config.format.maskShape || 'rectangular';
    if (maskShape === 'circular') {
      const radius = Math.min(drawWidth, drawHeight) / 2;
      const centerX = marginPx + drawWidth / 2;
      const centerY = marginPx + drawHeight / 2;
      exportCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    } else {
      exportCtx.rect(marginPx, marginPx, drawWidth, drawHeight);
    }
    exportCtx.clip();
    exportCtx.drawImage(mapCanvas, marginPx, marginPx, drawWidth, drawHeight);
    exportCtx.restore();

    // 5. DRAW MARKERS
    if (config.layers.marker) {
      const markerSize = exportResolution.width * 0.045 * (config.layers.markerScale ?? 1);
      const markerColor = config.layers.markerColor || config.palette.primary || config.palette.accent || config.palette.text;
      const markerType = config.layers.markerType || 'crosshair';
      const placedMarkers = config.layers.placedMarkers ?? [];

      if (placedMarkers.length > 0) {
        const canvas = map.getCanvas();
        const cssWidth = canvas.clientWidth || canvas.width;
        const cssHeight = canvas.clientHeight || canvas.height;

        for (const coords of placedMarkers) {
          const point = map.project(coords);
          if (cssWidth <= 0 || cssHeight <= 0) continue;
          if (point.x < -markerSize || point.x > cssWidth + markerSize) continue;
          if (point.y < -markerSize || point.y > cssHeight + markerSize) continue;

          const markerX = marginPx + (point.x / cssWidth) * drawWidth;
          const markerY = marginPx + (point.y / cssHeight) * drawHeight;
          drawMarker(exportCtx, markerX, markerY, markerSize, markerColor, markerType);
        }
      } else if (!config.route?.data) {
        // Fallback: center viewfinder icon when no geographic pins have been placed
        const markerX = marginPx + drawWidth / 2;
        const markerY = marginPx + drawHeight / 2;
        drawMarker(exportCtx, markerX, markerY, markerSize, markerColor, markerType);
      }
    }

    // 6. TEXT OVERLAY
    drawTextOverlay(exportCtx, config, exportResolution.width, exportResolution.height, exportScale);

    // 7. BORDER
    if (config.format.borderStyle !== 'none') {
      exportCtx.save();
      exportCtx.strokeStyle = config.palette.accent || config.palette.text;
      exportCtx.lineWidth = exportResolution.width * 0.005;
      
      const { borderStyle } = config.format;
      const maskShape = config.format.maskShape || 'rectangular';
      
      if (maskShape === 'circular') {
        const radius = Math.min(drawWidth, drawHeight) / 2;
        const centerX = marginPx + drawWidth / 2;
        const centerY = marginPx + drawHeight / 2;
        
        if (borderStyle === 'thin') {
          exportCtx.lineWidth = exportResolution.width * 0.005;
          exportCtx.beginPath();
          exportCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          exportCtx.stroke();
        } else if (borderStyle === 'thick') {
          exportCtx.lineWidth = exportResolution.width * 0.015;
          exportCtx.beginPath();
          exportCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          exportCtx.stroke();
        } else if (borderStyle === 'inset') {
          const inset = exportResolution.width * 0.02;
          exportCtx.lineWidth = exportResolution.width * 0.005;
          exportCtx.beginPath();
          exportCtx.arc(centerX, centerY, radius - inset, 0, Math.PI * 2);
          exportCtx.stroke();
        } else {
          // Default fallback for 'double' or any other border style
          exportCtx.lineWidth = exportResolution.width * 0.005;
          exportCtx.beginPath();
          exportCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          exportCtx.stroke();
        }
        
        // Draw compass rose if enabled and mask is circular
        if (config.format.compassRose) {
          const compassColor = config.palette.accent || config.palette.text;
          const compassLineWidth = Math.max(1, exportResolution.width * 0.002);
          const compassFontSize = exportResolution.width * 0.018;
          
          // Calculate the outer edge of the border
          let borderOuterRadius = radius;
          if (borderStyle === 'thin') {
            borderOuterRadius = radius + (exportResolution.width * 0.005) / 2;
          } else if (borderStyle === 'thick') {
            borderOuterRadius = radius + (exportResolution.width * 0.015) / 2;
          } else if (borderStyle === 'inset') {
            borderOuterRadius = (radius - exportResolution.width * 0.02) + (exportResolution.width * 0.005) / 2;
          } else {
            borderOuterRadius = radius + (exportResolution.width * 0.005) / 2;
          }
          
          drawCompassRose(
            exportCtx,
            centerX,
            centerY,
            borderOuterRadius,
            compassColor,
            compassLineWidth,
            compassFontSize
          );
        }
      } else {
        if (borderStyle === 'thin') {
          exportCtx.strokeRect(marginPx, marginPx, drawWidth, drawHeight);
        } else if (borderStyle === 'thick') {
          exportCtx.lineWidth = exportResolution.width * 0.015;
          exportCtx.strokeRect(marginPx, marginPx, drawWidth, drawHeight);
        } else if (borderStyle === 'inset') {
          const inset = exportResolution.width * 0.02;
          exportCtx.strokeRect(marginPx + inset, marginPx + inset, drawWidth - (inset * 2), drawHeight - (inset * 2));
        }
      }
      exportCtx.restore();
    }

    // 8. TEXTURE
    const { texture, textureIntensity = 20 } = config.format;
    if (texture && texture !== 'none') {
      applyTexture(exportCtx, exportResolution.width, exportResolution.height, texture, textureIntensity);
    }

    // 9. SCALE BAR
    if (config.layers.showScaleBar) {
      const scaleBarColor = config.layers.scaleBarColor || 'rgba(255, 255, 255, 0.9)';
      const scaleBarPosition = config.layers.scaleBarPosition || 'bottom-left';
      // Use the export zoom level (originalZoom + zoomOffset) for accurate distance calculation
      // The export canvas is rendered at this higher zoom, so meters-per-pixel matches
      drawScaleBar(
        exportCtx,
        exportResolution.width,
        exportResolution.height,
        marginPx,
        scaleBarPosition,
        scaleBarColor,
        originalZoom + zoomOffset,
        config.location.center[1] // latitude
      );
    }

    // 10. WATERMARK (only for free/digital exports)
    if (!hideWatermark) {
      drawWatermark(exportCtx, exportResolution.width, exportResolution.height);
    }

    return new Promise<Blob>((resolve, reject) => {
      exportCanvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob from canvas'));
      }, 'image/png');
    });
  } finally {
    // Restore map state in a single requestAnimationFrame to batch changes
    requestAnimationFrame(() => {
      try {
        map.getCanvas().width = originalWidth;
        map.getCanvas().height = originalHeight;

        map.jumpTo({
          center: config.location.center,
          zoom: originalZoom
        });

        if (typeof (map as any).setMaxZoom === 'function' && originalMaxZoom !== undefined) {
          (map as any).setMaxZoom(originalMaxZoom);
        }

        map.resize();
      } catch (e) {
        logger.warn('Error restoring map state after export:', e);
      }
    });
  }
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const watermarkText = 'https://www.gridline.eu';
  
  // Calculate font size as a percentage of canvas width (small and subtle)
  const fontSize = Math.max(12, Math.round(width * 0.015));
  const padding = Math.max(20, Math.round(width * 0.02));
  
  ctx.save();
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.globalAlpha = 0.5; // Semi-transparent
  
  // Use a color that contrasts with both light and dark backgrounds
  // Using a gray that should be visible on most backgrounds
  ctx.fillStyle = '#666666';
  
  const x = width - padding;
  const y = height - padding;
  
  ctx.fillText(watermarkText, x, y);
  ctx.restore();
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
