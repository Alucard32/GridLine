'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart3, Megaphone, Check } from 'lucide-react';
import Link from 'next/link';
import posthog from 'posthog-js';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'gridline_cookie_consent';
const CONSENT_VERSION = '2'; // Bumped version to re-prompt users for marketing consent

// Global function to show cookie preferences from anywhere
let showPreferencesCallback: (() => void) | null = null;

export function showCookiePreferences() {
  showPreferencesCallback?.();
}

function getStoredConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (parsed.version !== CONSENT_VERSION) return null;

    return parsed.preferences;
  } catch {
    return null;
  }
}

function storeConsent(preferences: CookiePreferences) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
    version: CONSENT_VERSION,
    preferences,
    timestamp: new Date().toISOString(),
  }));

  // Dispatch event for analytics providers to listen to
  window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
    detail: preferences,
  }));

  // Update Google Consent Mode
  updateGoogleConsent(preferences);
}

// Google Consent Mode v2 - Update consent signals
function updateGoogleConsent(preferences: CookiePreferences) {
  if (typeof window === 'undefined') return;

  // gtag might not be loaded yet, so we use the dataLayer approach
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  gtag('consent', 'update', {
    'ad_storage': preferences.marketing ? 'granted' : 'denied',
    'ad_user_data': preferences.marketing ? 'granted' : 'denied',
    'ad_personalization': preferences.marketing ? 'granted' : 'denied',
    'analytics_storage': preferences.analytics ? 'granted' : 'denied',
  });
}

// Initialize Google Consent Mode with defaults (denied)
function initGoogleConsentMode() {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  // Set default consent to denied
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500, // Wait 500ms for consent update
  });

  // Enable URL passthrough for better conversion tracking without cookies
  gtag('set', 'url_passthrough', true);

  // Enable ads data redaction when consent is denied
  gtag('set', 'ads_data_redaction', true);
}

// Declare dataLayer on window
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Initialize Google Consent Mode on mount
  useEffect(() => {
    initGoogleConsentMode();
  }, []);

  // Check for stored consent on mount
  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setPreferences(stored);
      // Apply stored consent to Google
      updateGoogleConsent(stored);
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Register global show preferences callback
  useEffect(() => {
    showPreferencesCallback = () => {
      setShowBanner(true);
      setShowPreferences(true);
    };
    return () => {
      showPreferencesCallback = null;
    };
  }, []);

  const handleAcceptAll = useCallback(() => {
    const newPrefs = { necessary: true, analytics: true, marketing: true };
    setPreferences(newPrefs);
    storeConsent(newPrefs);
    // Track cookie consent event
    posthog.capture('cookie_consent_given', {
      action: 'accept_all',
      analytics_enabled: true,
      marketing_enabled: true,
    });
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const newPrefs = { necessary: true, analytics: false, marketing: false };
    setPreferences(newPrefs);
    storeConsent(newPrefs);
    // Track cookie consent event
    posthog.capture('cookie_consent_given', {
      action: 'reject_all',
      analytics_enabled: false,
      marketing_enabled: false,
    });
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    storeConsent(preferences);
    // Track cookie consent event
    posthog.capture('cookie_consent_given', {
      action: 'save_preferences',
      analytics_enabled: preferences.analytics,
      marketing_enabled: preferences.marketing,
    });
    setShowBanner(false);
    setShowPreferences(false);
  }, [preferences]);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop for preferences modal */}
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[998]"
              onClick={() => setShowPreferences(false)}
            />
          )}

          {/* Cookie Banner / Preferences Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-[999] ${
              showPreferences
                ? 'inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full'
                : 'bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md'
            }`}
          >
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Cookie className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-semibold text-stone-900 dark:text-white">
                    {showPreferences ? 'Cookie Preferences' : 'We use cookies'}
                  </h2>
                </div>
                {showPreferences && (
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-stone-500" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {showPreferences ? (
                  <div className="space-y-3">
                    {/* Necessary Cookies */}
                    <div className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory('necessary')}
                        className="w-full flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="font-medium text-stone-900 dark:text-white text-sm">
                            Strictly Necessary
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-stone-200 dark:bg-stone-600 text-stone-600 dark:text-stone-300 rounded">
                            Always on
                          </span>
                        </div>
                        {expandedCategory === 'necessary' ? (
                          <ChevronUp className="w-4 h-4 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedCategory === 'necessary' && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 text-xs text-stone-600 dark:text-stone-400">
                              These cookies are essential for the website to function. They enable core
                              features like authentication and session management.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="border border-primary/30 dark:border-primary/40 rounded-lg overflow-hidden bg-primary/5 dark:bg-primary/10">
                      <div className="flex items-center justify-between p-3 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <button
                          onClick={() => toggleCategory('analytics')}
                          className="flex items-center gap-3 flex-1"
                        >
                          <BarChart3 className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-stone-900 dark:text-white text-sm">
                            Analytics
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded font-medium">
                            Recommended
                          </span>
                        </button>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))}
                            className={`relative w-10 h-5 rounded-full transition-colors ${
                              preferences.analytics
                                ? 'bg-primary'
                                : 'bg-stone-300 dark:bg-stone-600'
                            }`}
                            aria-label={preferences.analytics ? 'Disable analytics' : 'Enable analytics'}
                          >
                            <div
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                preferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => toggleCategory('analytics')}
                            className="p-1"
                            aria-label={expandedCategory === 'analytics' ? 'Collapse details' : 'Expand details'}
                          >
                            {expandedCategory === 'analytics' ? (
                              <ChevronUp className="w-4 h-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedCategory === 'analytics' && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 text-xs text-stone-600 dark:text-stone-400">
                              Help us make GridLine better! Analytics let us see which features you love
                              and what we can improve. We use PostHog — a privacy-friendly service that
                              doesn't sell your data.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="border border-orange-200 dark:border-orange-800/50 rounded-lg overflow-hidden bg-orange-50/50 dark:bg-orange-900/10">
                      <div className="flex items-center justify-between p-3 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-colors">
                        <button
                          onClick={() => toggleCategory('marketing')}
                          className="flex items-center gap-3 flex-1"
                        >
                          <Megaphone className="w-4 h-4 text-orange-500" />
                          <span className="font-medium text-stone-900 dark:text-white text-sm">
                            Marketing
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded font-medium">
                            Optional
                          </span>
                        </button>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPreferences((p) => ({ ...p, marketing: !p.marketing }))}
                            className={`relative w-10 h-5 rounded-full transition-colors ${
                              preferences.marketing
                                ? 'bg-primary'
                                : 'bg-stone-300 dark:bg-stone-600'
                            }`}
                            aria-label={preferences.marketing ? 'Disable marketing' : 'Enable marketing'}
                          >
                            <div
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                preferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => toggleCategory('marketing')}
                            className="p-1"
                            aria-label={expandedCategory === 'marketing' ? 'Collapse details' : 'Expand details'}
                          >
                            {expandedCategory === 'marketing' ? (
                              <ChevronUp className="w-4 h-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedCategory === 'marketing' && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 text-xs text-stone-600 dark:text-stone-400">
                              See relevant ads and help us reach more map enthusiasts! Marketing cookies help
                              us show you relevant content and measure ad effectiveness. You can always change
                              this later.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 pt-2">
                      Learn more in our{' '}
                      <Link href="/cookies" className="text-primary hover:underline">
                        Cookie Policy
                      </Link>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    We use cookies to improve your experience and analyze site usage.{' '}
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="text-primary hover:underline"
                    >
                      Manage preferences
                    </button>
                    {' '}or read our{' '}
                    <Link href="/cookies" className="text-primary hover:underline">
                      Cookie Policy
                    </Link>
                    .
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 p-4 pt-0">
                {showPreferences ? (
                  <>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 rounded-lg transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                    >
                      Accept All
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
