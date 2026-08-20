/**
 * Stripe-related type definitions for GridLine
 */

import type { ExportProduct } from '@/lib/stripe/products';

/**
 * Order status enum
 */
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/**
 * Order record stored in database
 */
export interface Order {
  id: string;
  user_id: string | null;
  email: string;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  product: ExportProduct;
  amount: number;
  currency: string;
  status: OrderStatus;
  map_id: string | null;
  export_config: ExportConfig | null;
  download_count: number;
  max_downloads: number;
  download_token: string;
  created_at: string;
  completed_at: string | null;
}

/**
 * Export configuration stored with order
 */
export interface ExportConfig {
  resolutionKey?: string;
  format?: string;
  productType?: 'poster' | 'sculpture';
  // Map config snapshot for re-generation
  mapConfig?: Record<string, unknown>;
}

/**
 * Checkout session creation request
 */
export interface CreateCheckoutRequest {
  product: ExportProduct;
  mapId?: string;
  exportConfig?: ExportConfig;
}

/**
 * Checkout session creation response
 */
export interface CreateCheckoutResponse {
  url: string | null;
  error?: string;
}

/**
 * Download request with token
 */
export interface DownloadRequest {
  token: string;
}

/**
 * Download response
 */
export interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  remainingDownloads?: number;
  error?: string;
}
