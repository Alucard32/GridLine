/**
 * Stripe product configuration for GridLine exports
 *
 * Products:
 * - Poster exports (digital PNG downloads): €12-18
 * - Sculpture exports (STL 3D files): €19
 */

export type ExportProduct =
  | 'poster-small'
  | 'poster-medium'
  | 'poster-large'
  | 'sculpture-stl';

export interface ProductConfig {
  priceId: string;
  name: string;
  description: string;
  amount: number; // in cents
}

/**
 * Get product configuration with price IDs from environment
 * Must be called at runtime to access env vars
 */
export function getStripeProducts(): Record<ExportProduct, ProductConfig> {
  return {
    'poster-small': {
      priceId: process.env.STRIPE_PRICE_POSTER_SMALL!,
      name: 'Adventure Print - Small',
      description: '2400×3600px print-ready poster export (300 DPI)',
      amount: 1200, // €12.00
    },
    'poster-medium': {
      priceId: process.env.STRIPE_PRICE_POSTER_MEDIUM!,
      name: 'Adventure Print - Medium',
      description: '3600×5400px print-ready poster export (300 DPI)',
      amount: 1500, // €15.00
    },
    'poster-large': {
      priceId: process.env.STRIPE_PRICE_POSTER_LARGE!,
      name: 'Adventure Print - Large',
      description: '4800×7200px print-ready poster export (300 DPI)',
      amount: 1800, // €18.00
    },
    'sculpture-stl': {
      priceId: process.env.STRIPE_PRICE_SCULPTURE_STL!,
      name: 'Journey Sculpture - STL',
      description: '3D-printable STL file of your route',
      amount: 1900, // €19.00
    },
  };
}

/**
 * Map export resolution keys to product IDs
 */
export const RESOLUTION_TO_PRODUCT: Record<string, ExportProduct | null> = {
  SMALL: 'poster-small',
  MEDIUM: 'poster-medium',
  LARGE: 'poster-large',
  // Free resolutions (no product)
  THUMBNAIL: null,
  PHONE_WALLPAPER: null,
  LAPTOP_WALLPAPER: null,
  DESKTOP_4K: null,
  MAX: null,
};

/**
 * Check if a resolution requires payment
 */
export function isPaidResolution(resolutionKey: string): boolean {
  return RESOLUTION_TO_PRODUCT[resolutionKey] !== null;
}

/**
 * Get product for a resolution key
 */
export function getProductForResolution(
  resolutionKey: string
): ExportProduct | null {
  return RESOLUTION_TO_PRODUCT[resolutionKey] ?? null;
}
