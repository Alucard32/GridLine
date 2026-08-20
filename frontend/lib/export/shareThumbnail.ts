/**
 * Generate social-media-optimized share thumbnails with watermark
 */

const SHARE_SIZE = 1080; // 1080x1080 for Instagram, fits well on all platforms
const SHARE_MAX_DIMENSION = 1200; // Max dimension for full-size share images
const WATERMARK_PADDING = 24;
const WATERMARK_HEIGHT = 32;

/**
 * Generate a square social-media-ready thumbnail from an image blob
 * Crops to center and adds a subtle watermark
 */
export async function generateShareThumbnail(
  sourceBlob: Blob,
  options: {
    title?: string;
    size?: number;
    addWatermark?: boolean;
  } = {}
): Promise<Blob> {
  const { size = SHARE_SIZE, addWatermark = true } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }

      // Calculate crop to center
      const sourceWidth = img.width;
      const sourceHeight = img.height;

      let sx = 0;
      let sy = 0;
      let sWidth = sourceWidth;
      let sHeight = sourceHeight;

      // Crop to square from center
      if (sourceWidth > sourceHeight) {
        // Wider than tall - crop sides
        sx = (sourceWidth - sourceHeight) / 2;
        sWidth = sourceHeight;
      } else if (sourceHeight > sourceWidth) {
        // Taller than wide - crop top/bottom (favor top portion)
        sy = (sourceHeight - sourceWidth) * 0.3; // Offset towards top
        sHeight = sourceWidth;
      }

      // Draw the cropped image
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

      // Add watermark if enabled
      if (addWatermark) {
        await drawWatermark(ctx, size);
      }

      // Convert to PNG blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        0.95
      );
    };

    img.onerror = () => reject(new Error('Failed to load source image'));
    img.src = URL.createObjectURL(sourceBlob);
  });
}

/**
 * Draw watermark on canvas
 */
async function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasSize: number
): Promise<void> {
  const padding = WATERMARK_PADDING;
  const height = WATERMARK_HEIGHT;

  // Background pill for watermark
  const text = 'gridline.eu';
  ctx.font = `600 ${height * 0.55}px system-ui, -apple-system, sans-serif`;
  const textWidth = ctx.measureText(text).width;
  const pillWidth = textWidth + height + padding; // Extra space for logo
  const pillHeight = height;

  const x = canvasSize - pillWidth - padding;
  const y = canvasSize - pillHeight - padding;

  // Draw semi-transparent dark pill background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.roundRect(x, y, pillWidth, pillHeight, pillHeight / 2);
  ctx.fill();

  // Draw mountain icon (simplified)
  const iconSize = height * 0.5;
  const iconX = x + padding * 0.5;
  const iconY = y + (height - iconSize) / 2;

  // Simple mountain path
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.moveTo(iconX, iconY + iconSize); // Bottom left
  ctx.lineTo(iconX + iconSize * 0.35, iconY + iconSize * 0.3); // Left peak
  ctx.lineTo(iconX + iconSize * 0.5, iconY + iconSize * 0.5); // Valley
  ctx.lineTo(iconX + iconSize * 0.75, iconY); // Right peak (tallest)
  ctx.lineTo(iconX + iconSize, iconY + iconSize); // Bottom right
  ctx.closePath();
  ctx.fill();

  // Draw text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, iconX + iconSize + padding * 0.4, y + height / 2);
}

/**
 * Generate a share thumbnail from a canvas element (for sculptures)
 */
export async function generateShareThumbnailFromCanvas(
  canvas: HTMLCanvasElement,
  options: {
    title?: string;
    size?: number;
    addWatermark?: boolean;
  } = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          try {
            const shareThumbnail = await generateShareThumbnail(blob, options);
            resolve(shareThumbnail);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Generate a full-size share image that preserves aspect ratio
 * Scales down if needed and adds watermark, but NO cropping
 */
export async function generateFullShareImage(
  sourceBlob: Blob,
  options: {
    maxDimension?: number;
    addWatermark?: boolean;
  } = {}
): Promise<Blob> {
  const { maxDimension = SHARE_MAX_DIMENSION, addWatermark = true } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const sourceWidth = img.width;
      const sourceHeight = img.height;

      // Calculate scaled dimensions (preserve aspect ratio)
      let width = sourceWidth;
      let height = sourceHeight;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height / width) * maxDimension);
          width = maxDimension;
        } else {
          width = Math.round((width / height) * maxDimension);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }

      // Draw the full image (no cropping)
      ctx.drawImage(img, 0, 0, width, height);

      // Add watermark if enabled
      if (addWatermark) {
        // Scale watermark based on image size
        const scale = Math.min(width, height) / 1080;
        await drawWatermarkScaled(ctx, width, height, scale);
      }

      // Convert to PNG blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        0.95
      );
    };

    img.onerror = () => reject(new Error('Failed to load source image'));
    img.src = URL.createObjectURL(sourceBlob);
  });
}

/**
 * Draw watermark on canvas with scaling support
 */
async function drawWatermarkScaled(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  scale: number
): Promise<void> {
  const padding = Math.max(16, Math.round(WATERMARK_PADDING * scale));
  const height = Math.max(24, Math.round(WATERMARK_HEIGHT * scale));

  // Background pill for watermark
  const text = 'gridline.eu';
  ctx.font = `600 ${height * 0.55}px system-ui, -apple-system, sans-serif`;
  const textWidth = ctx.measureText(text).width;
  const pillWidth = textWidth + height + padding;
  const pillHeight = height;

  const x = canvasWidth - pillWidth - padding;
  const y = canvasHeight - pillHeight - padding;

  // Draw semi-transparent dark pill background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.roundRect(x, y, pillWidth, pillHeight, pillHeight / 2);
  ctx.fill();

  // Draw mountain icon (simplified)
  const iconSize = height * 0.5;
  const iconX = x + padding * 0.5;
  const iconY = y + (height - iconSize) / 2;

  // Simple mountain path
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.moveTo(iconX, iconY + iconSize);
  ctx.lineTo(iconX + iconSize * 0.35, iconY + iconSize * 0.3);
  ctx.lineTo(iconX + iconSize * 0.5, iconY + iconSize * 0.5);
  ctx.lineTo(iconX + iconSize * 0.75, iconY);
  ctx.lineTo(iconX + iconSize, iconY + iconSize);
  ctx.closePath();
  ctx.fill();

  // Draw text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, iconX + iconSize + padding * 0.4, y + height / 2);
}
