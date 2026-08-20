'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Instagram,
  Twitter,
  Facebook,
  Sparkles,
  Globe,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GridLineLogo } from '@/components/ui/GridLineLogo';
import { generateFullShareImage } from '@/lib/export/shareThumbnail';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The image blob to share (poster or sculpture thumbnail) */
  imageBlob?: Blob | null;
  /** Title of the adventure (location name or route name) */
  title?: string;
  /** Type of export: poster or sculpture */
  type?: 'poster' | 'sculpture';
  /** Whether user is logged in */
  isAuthenticated?: boolean;
  /** Whether the current map is already published */
  isPublished?: boolean;
  /** Whether map is saved (required for publishing) */
  isSaved?: boolean;
  /** Callback to publish to feed */
  onPublish?: () => Promise<void>;
}

export function ShareModal({
  isOpen,
  onClose,
  imageBlob,
  title = 'My Adventure',
  type = 'poster',
  isAuthenticated = false,
  isPublished = false,
  isSaved = false,
  onPublish,
}: ShareModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create object URL for the image
  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
    }
  }, [imageBlob]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Download image for sharing (generates watermarked version)
  const handleDownload = useCallback(async () => {
    if (!imageBlob) return;

    try {
      // Generate full-size watermarked image for sharing
      const shareImage = await generateFullShareImage(imageBlob, {
        addWatermark: true,
      });

      const url = URL.createObjectURL(shareImage);
      const link = document.createElement('a');
      link.href = url;
      const safeName = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      link.download = `${safeName}-gridline-share.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      console.error('Failed to generate share image:', error);
      // Fallback to original blob
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      link.download = `${safeName}-gridline.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [imageBlob, title]);

  // Copy image to clipboard
  const handleCopyImage = useCallback(async () => {
    if (!imageBlob) return;

    try {
      // Try using the Clipboard API with ClipboardItem
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [imageBlob.type]: imageBlob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback: download the image
        handleDownload();
      }
    } catch (error) {
      console.error('Failed to copy image:', error);
      // Fallback to download
      handleDownload();
    }
  }, [imageBlob, handleDownload]);

  // Native share (mobile)
  const handleNativeShare = useCallback(async () => {
    if (!imageBlob) return;

    const shareData: ShareData = {
      title: `${title} - Created with GridLine`,
      text: `Check out my ${type === 'sculpture' ? 'Journey Sculpture' : 'Adventure Print'} of ${title}! 🏔️\n\nCreate your own at gridline.eu`,
    };

    // Try sharing with file if supported
    if (navigator.canShare && 'files' in shareData) {
      const file = new File([imageBlob], `${title}-gridline.png`, {
        type: 'image/png',
      });
      const dataWithFile = { ...shareData, files: [file] };

      if (navigator.canShare(dataWithFile)) {
        try {
          await navigator.share(dataWithFile);
          return;
        } catch (error) {
          // User cancelled or error - try without file
        }
      }
    }

    // Fallback: share without file
    try {
      await navigator.share({
        ...shareData,
        url: 'https://gridline.eu',
      });
    } catch (error) {
      // User cancelled - that's okay
    }
  }, [imageBlob, title, type]);

  // Handle publish to feed
  const handlePublish = useCallback(async () => {
    if (!onPublish || isPublishing) return;

    setIsPublishing(true);
    try {
      await onPublish();
      setPublishSuccess(true);
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setIsPublishing(false);
    }
  }, [onPublish, isPublishing]);

  // Open social platform
  const openSocialShare = useCallback(
    (platform: 'twitter' | 'facebook') => {
      const text = encodeURIComponent(
        `Check out my ${type === 'sculpture' ? 'Journey Sculpture' : 'Adventure Print'} of ${title}! 🏔️ Created with @gridline_eu`
      );
      const url = encodeURIComponent('https://gridline.eu');

      let shareUrl = '';
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
          break;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');
    },
    [title, type]
  );

  if (!isOpen) return null;

  const productName = type === 'sculpture' ? 'Journey Sculpture' : 'Adventure Print';

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'animate-in fade-in duration-200',
        isMobile ? 'p-0' : 'p-4'
      )}
      style={isMobile ? { height: '100dvh' } : undefined}
      onClick={(e) => {
        if (!isMobile && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" />

      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full flex flex-col z-10',
          'bg-gradient-to-b from-card to-card/95 backdrop-blur-xl',
          'shadow-2xl shadow-primary/10',
          'border border-border/50',
          'animate-in fade-in zoom-in-95 duration-300',
          isMobile
            ? 'h-full max-h-[100dvh] rounded-none'
            : 'max-w-lg max-h-[90vh] rounded-2xl'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between flex-shrink-0',
            'border-b border-border/50',
            isMobile ? 'px-4 py-4' : 'px-6 py-5'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={cn(
                  'font-semibold tracking-tight text-foreground',
                  isMobile ? 'text-lg' : 'text-xl'
                )}
              >
                Share Your Adventure
              </h2>
              <p className="text-xs text-muted-foreground">
                Show the world where you&apos;ve been
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'rounded-lg hover:bg-secondary/80',
              'text-muted-foreground hover:text-foreground',
              'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50',
              isMobile ? 'p-3' : 'p-2'
            )}
            aria-label="Close"
          >
            <X className={cn(isMobile ? 'h-6 w-6' : 'h-5 w-5')} />
          </button>
        </div>

        {/* Content */}
        <div
          className={cn(
            'flex-1 overflow-auto',
            isMobile ? 'p-4' : 'p-6'
          )}
        >
          {/* Preview Image */}
          {imageUrl && (
            <div className="relative mb-6">
              <div className="relative rounded-xl overflow-hidden bg-stone-900 shadow-lg ring-1 ring-border/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`${title} - ${productName}`}
                  className="w-full h-auto block"
                />
                {/* Watermark overlay */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                  <GridLineLogo size="xs" />
                  <span className="text-[10px] font-medium text-white/90">
                    gridline.eu
                  </span>
                </div>
              </div>

              {/* Adventure name badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium shadow-lg shadow-primary/25 max-w-[90%] truncate">
                {title}
              </div>
            </div>
          )}

          {/* No image fallback */}
          {!imageUrl && (
            <div className="aspect-square rounded-xl bg-secondary/30 flex items-center justify-center mb-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Your {productName} is ready!
                </p>
              </div>
            </div>
          )}

          {/* Motivational text */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              🎉 Your <span className="font-medium text-foreground">{productName}</span> is complete!
              <br />
              <span className="text-xs">
                Share your adventure and inspire others to explore.
              </span>
            </p>
          </div>

          {/* Share Actions */}
          <div className="space-y-3">
            {/* Primary: Native Share (Mobile) or Copy Image (Desktop) */}
            {isMobile && 'share' in navigator ? (
              <button
                onClick={handleNativeShare}
                className={cn(
                  'w-full flex items-center justify-center gap-2.5',
                  'px-4 py-3.5 rounded-xl font-semibold',
                  'bg-gradient-to-r from-primary to-primary/80 text-white',
                  'hover:shadow-lg hover:shadow-primary/25',
                  'active:scale-[0.98] transition-all'
                )}
              >
                <Share2 className="w-5 h-5" />
                Share Adventure
              </button>
            ) : (
              <button
                onClick={handleCopyImage}
                disabled={!imageBlob}
                className={cn(
                  'w-full flex items-center justify-center gap-2.5',
                  'px-4 py-3.5 rounded-xl font-semibold',
                  'bg-gradient-to-r from-primary to-primary/80 text-white',
                  'hover:shadow-lg hover:shadow-primary/25',
                  'active:scale-[0.98] transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Image
                  </>
                )}
              </button>
            )}

            {/* Secondary: Download */}
            <button
              onClick={handleDownload}
              disabled={!imageBlob}
              className={cn(
                'w-full flex items-center justify-center gap-2.5',
                'px-4 py-3 rounded-xl font-medium',
                'bg-secondary hover:bg-secondary/80 text-foreground',
                'border border-border/50',
                'active:scale-[0.98] transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-primary" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download for Sharing
                </>
              )}
            </button>

            {/* Social Share Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => openSocialShare('twitter')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2',
                  'px-3 py-2.5 rounded-lg font-medium text-sm',
                  'bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2]',
                  'transition-colors'
                )}
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              <button
                onClick={() => openSocialShare('facebook')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2',
                  'px-3 py-2.5 rounded-lg font-medium text-sm',
                  'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2]',
                  'transition-colors'
                )}
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={() => {
                  // Instagram doesn't have a share URL, so we copy the image for them
                  handleDownload();
                }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2',
                  'px-3 py-2.5 rounded-lg font-medium text-sm',
                  'bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10',
                  'hover:from-[#F58529]/20 hover:via-[#DD2A7B]/20 hover:to-[#8134AF]/20',
                  'text-[#DD2A7B]',
                  'transition-colors'
                )}
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </button>
            </div>

            {/* Inspire Others Section */}
            {onPublish && (
              <div className="pt-4 mt-4 border-t border-border/50">
                {!isAuthenticated ? (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground mb-2">
                      💡 Want to inspire fellow adventurers?
                    </p>
                    <a
                      href="/login"
                      className={cn(
                        'inline-flex items-center justify-center gap-1.5',
                        'px-3 py-2 rounded-lg font-medium text-xs',
                        'text-primary hover:bg-primary/10',
                        'transition-colors'
                      )}
                    >
                      Sign in to share with the community →
                    </a>
                  </div>
                ) : !isSaved ? (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">
                      💡 Save your map to share it with the GridLine community
                    </p>
                  </div>
                ) : isPublished || publishSuccess ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Shared with the community!
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      💡 Inspire fellow adventurers
                    </p>
                    <button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className={cn(
                        'inline-flex items-center justify-center gap-1.5',
                        'px-4 py-2 rounded-lg font-medium text-sm',
                        'text-primary hover:bg-primary/10',
                        'border border-primary/20 hover:border-primary/40',
                        'transition-all',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Share with the Community
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            'flex-shrink-0 border-t border-border/50',
            'bg-secondary/30',
            isMobile ? 'px-4 py-4' : 'px-6 py-4'
          )}
        >
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Created with</span>
            <GridLineLogo size="xs" showText />
            <span>•</span>
            <a
              href="https://gridline.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              gridline.eu
            </a>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/70 mt-2">
            Tag us @gridline_eu and we&apos;ll feature your adventure! 🌄
          </p>
        </div>
      </div>
    </div>
  );
}
