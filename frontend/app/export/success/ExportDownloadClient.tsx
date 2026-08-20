'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download, Loader2, AlertCircle } from 'lucide-react';
import type { ExportProduct } from '@/lib/stripe/products';

interface ExportDownloadClientProps {
  order: {
    id: string;
    product: ExportProduct;
    downloadToken: string;
    downloadCount: number;
    maxDownloads: number;
    email: string;
    mapId?: string | null;
  };
}

export default function ExportDownloadClient({
  order,
}: ExportDownloadClientProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(order.downloadCount);
  const [error, setError] = useState<string | null>(null);

  const remainingDownloads = order.maxDownloads - downloadCount;
  const canDownload = remainingDownloads > 0;

  const productNames: Record<ExportProduct, string> = {
    'poster-small': 'Adventure Print - Small (2400×3600px)',
    'poster-medium': 'Adventure Print - Medium (3600×5400px)',
    'poster-large': 'Adventure Print - Large (4800×7200px)',
    'sculpture-stl': 'Journey Sculpture - STL File',
  };

  const handleDownload = async () => {
    if (!canDownload || isDownloading) return;

    setIsDownloading(true);
    setError(null);

    try {
      // Validate the download token and get export config
      const response = await fetch(
        `/api/export/download?token=${order.downloadToken}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Download failed');
      }

      const data = await response.json();

      // Check if we have a mapId to load
      if (!data.mapId) {
        throw new Error('Map not found. Please contact support.');
      }

      // Get the resolution key from export config
      const resolutionKey = data.exportConfig?.resolutionKey || 'MEDIUM';
      const isSculpture = order.product === 'sculpture-stl';

      // CRITICAL: Store config snapshot in sessionStorage for the editor to use
      // This ensures the user gets EXACTLY the design they paid for
      if (data.configSnapshot) {
        console.log('[PAID DOWNLOAD] ✅ Config snapshot received from order');
        console.log('[PAID DOWNLOAD] Order ID:', order.id);
        console.log('[PAID DOWNLOAD] Config hash:', data.configHash);
        console.log('[PAID DOWNLOAD] Product type:', data.productType);
        console.log('[PAID DOWNLOAD] Config location:', data.configSnapshot?.location?.name);
        console.log('[PAID DOWNLOAD] Config style:', data.configSnapshot?.style?.id);
        try {
          sessionStorage.setItem(
            'gridline_paid_export_config',
            JSON.stringify({
              configSnapshot: data.configSnapshot,
              sculptureConfigSnapshot: data.sculptureConfigSnapshot,
              productType: data.productType,
              configHash: data.configHash,
              orderId: order.id,
              timestamp: Date.now(),
            })
          );
          console.log('[PAID DOWNLOAD] ✅ Config snapshot stored in sessionStorage');
        } catch (storageError) {
          console.error('[PAID DOWNLOAD] ❌ Failed to store config snapshot:', storageError);
          // Continue anyway - will fall back to map config
        }
      } else {
        console.error('[PAID DOWNLOAD] ❌ No config snapshot received from download API!');
        console.error('[PAID DOWNLOAD] This usually means:');
        console.error('[PAID DOWNLOAD] 1. The migration 013_add_config_snapshot_to_orders.sql was not applied');
        console.error('[PAID DOWNLOAD] 2. Or there was a race condition with the webhook');
        console.error('[PAID DOWNLOAD] Order ID:', order.id);
        console.error('[PAID DOWNLOAD] MapId:', data.mapId);
        console.error('[PAID DOWNLOAD] Will fall back to loading map from database (may show wrong design!)');
      }

      // Redirect to editor with auto-export params
      // The editor will load the config snapshot from sessionStorage
      // Using hasPaidSnapshot flag to indicate we have a stored snapshot
      const exportUrl = `/create?mapId=${data.mapId}&autoExport=true&resolution=${resolutionKey}&hasPaidSnapshot=true${isSculpture ? '&mode=sculpture' : ''}`;

      // Update local download count before redirect
      setDownloadCount((prev) => prev + 1);

      // Navigate to the editor
      router.push(exportUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Payment Successful!
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Thank you for your purchase. Your download is ready.
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product</p>
        <p className="font-medium text-gray-900 dark:text-white">
          {productNames[order.product] || order.product}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {canDownload ? (
        <>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing Download...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Your File
              </>
            )}
          </button>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {remainingDownloads} download{remainingDownloads !== 1 ? 's' : ''}{' '}
            remaining
          </p>
        </>
      ) : (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-700 dark:text-yellow-400">
            You have reached the maximum number of downloads for this purchase.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-2">
            Need help? Contact support with your order ID: {order.id}
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          A receipt has been sent to {order.email}
        </p>
      </div>

      <a
        href="/create"
        className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to Editor
      </a>
    </div>
  );
}
