'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/control-components';
import { Mountain, Mail } from 'lucide-react';
import posthog from 'posthog-js';
import { submitMarketingConsent } from '@/lib/actions/consent';

interface MarketingConsentModalProps {
  email: string;
  redirectTo: string;
}

export function MarketingConsentModal({ email, redirectTo }: MarketingConsentModalProps) {
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update Brevo and user metadata
      const result = await submitMarketingConsent(email, marketingConsent);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save preference');
      }

      // Track signup event (same as email signup)
      posthog.capture('user_signed_up', {
        auth_method: 'google',
        marketing_consent: marketingConsent,
      });

      // Navigate to intended destination
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-trail-light to-background dark:from-background dark:to-card">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center shadow-lg">
              <Mountain className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Welcome to GridLine!
            </h1>
            <p className="text-muted-foreground">
              One quick thing before you start creating
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Marketing consent card */}
            <div
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                marketingConsent
                  ? 'border-forest bg-forest/5'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => setMarketingConsent(!marketingConsent)}
            >
              <label className="flex items-start gap-4 cursor-pointer">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    marketingConsent
                      ? 'bg-forest text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">Keep me on the trail</span>
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="h-5 w-5 rounded border-input text-forest focus:ring-forest focus:ring-offset-0 cursor-pointer accent-forest"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Route inspiration, new styles, and stories from explorers. 2x/month, unsubscribe anytime.
                  </p>
                </div>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-press"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Continue'
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You can change this anytime in your account settings
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
