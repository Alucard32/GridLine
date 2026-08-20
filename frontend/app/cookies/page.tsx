/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowLeft, Cookie, Shield, BarChart3, Megaphone, Settings, Globe, RefreshCw, Scale, Mail } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { CookiePreferencesButton } from './CookiePreferencesButton';

export const metadata: Metadata = {
  title: 'Cookie Policy | GridLine',
  description: 'Cookie Policy for GridLine - Learn about how we use cookies and how to manage your preferences.',
};

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="bg-white dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="p-5 text-stone-600 dark:text-stone-400 space-y-4">
        {children}
      </div>
    </div>
  );
}

interface CookieTableProps {
  cookies: Array<{
    name: string;
    provider: string;
    purpose: string;
    expiration: string;
  }>;
}

function CookieTable({ cookies }: CookieTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700">
      <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
        <thead className="bg-stone-100 dark:bg-stone-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide">Cookie</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide">Provider</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide">Purpose</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide">Expiry</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-800/30">
          {cookies.map((cookie, index) => (
            <tr key={index}>
              <td className="px-4 py-3 text-sm font-mono text-stone-700 dark:text-stone-300">{cookie.name}</td>
              <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">{cookie.provider}</td>
              <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">{cookie.purpose}</td>
              <td className="px-4 py-3 text-sm text-stone-500 dark:text-stone-400">{cookie.expiration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  const lastUpdated = 'January 8, 2026';

  const essentialCookies = [
    { name: 'sb-*-auth-token', provider: 'Supabase', purpose: 'Authentication session management', expiration: 'Session / 1 year' },
    { name: 'gridline_cookie_consent', provider: 'GridLine', purpose: 'Stores your cookie consent preferences', expiration: 'Persistent' },
  ];

  const analyticsCookies = [
    { name: '_ph_*', provider: 'PostHog', purpose: 'Stores a unique user ID for analytics', expiration: '1 year' },
    { name: 'ph_*', provider: 'PostHog', purpose: 'Tracks page views and user interactions', expiration: '1 year' },
  ];

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-stone-900 dark:text-white">
              GridLine
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-16 bg-gradient-to-b from-white to-stone-50 dark:from-stone-800/50 dark:to-stone-900 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          {/* Quick summary */}
          <div className="mb-8 p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
            <h3 className="font-semibold text-stone-900 dark:text-white mb-2">Quick Summary</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
              We use essential cookies to make GridLine work. With your consent, we also use
              analytics cookies to understand how you use our site and improve your experience.
              You can change your preferences anytime.
            </p>
            <CookiePreferencesButton />
          </div>

          <div className="space-y-6">
            <Section icon={<Cookie className="w-5 h-5" />} title="1. What Are Cookies?">
              <p>
                Cookies are small text files that are placed on your device (computer, tablet, or mobile phone)
                when you visit a website. They are widely used to make websites work more efficiently and to
                provide information to website owners.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device
                after you close your browser, while session cookies are deleted when you close your browser.
              </p>
            </Section>

            <Section icon={<BarChart3 className="w-5 h-5" />} title="2. How We Use Cookies">
              <p>GridLine uses cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-stone-900 dark:text-white">Essential functionality:</strong> To enable core features like authentication and security</li>
                <li><strong className="text-stone-900 dark:text-white">Analytics:</strong> To understand how visitors interact with our website (with your consent)</li>
                <li><strong className="text-stone-900 dark:text-white">Preferences:</strong> To remember your choices and personalize your experience</li>
              </ul>
            </Section>

            <Section icon={<Shield className="w-5 h-5" />} title="3. Strictly Necessary Cookies">
              <p>
                These cookies are essential for the website to function properly. They enable core functionality
                such as security, account access, and session management. You cannot opt out of these cookies
                as the website cannot function without them.
              </p>
              <CookieTable cookies={essentialCookies} />
            </Section>

            <Section icon={<BarChart3 className="w-5 h-5" />} title="4. Analytics Cookies">
              <p>
                These cookies help us understand how visitors interact with our website by collecting and
                reporting information anonymously. This helps us improve our website and your experience.
                <strong className="text-stone-900 dark:text-white"> These cookies are only set if you give your consent.</strong>
              </p>
              <CookieTable cookies={analyticsCookies} />
            </Section>

            <Section icon={<Megaphone className="w-5 h-5" />} title="5. Marketing Cookies">
              <p>
                Marketing cookies are used to track visitors across websites to display relevant
                advertisements. These cookies help measure the effectiveness of advertising campaigns.
                <strong className="text-stone-900 dark:text-white"> These cookies are only set if you give your consent.</strong>
              </p>
              <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
                <h4 className="font-semibold text-stone-900 dark:text-white mb-2">Google Consent Mode v2</h4>
                <p className="text-sm mb-3">
                  We use Google Consent Mode v2 to manage advertising consent. When you accept marketing cookies,
                  the following consent signals are enabled:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li><strong className="text-stone-900 dark:text-white">ad_storage:</strong> Enables storage for advertising</li>
                  <li><strong className="text-stone-900 dark:text-white">ad_user_data:</strong> Enables sending user data to Google for advertising</li>
                  <li><strong className="text-stone-900 dark:text-white">ad_personalization:</strong> Enables personalized advertising</li>
                </ul>
              </div>
              <p className="text-sm italic">
                When marketing cookies are rejected, we enable URL passthrough and ads data redaction
                to maintain basic conversion measurement while respecting your privacy.
              </p>
            </Section>

            <Section icon={<Globe className="w-5 h-5" />} title="6. Third-Party Cookies">
              <p>
                Some cookies are placed by third-party services that appear on our pages. We do not control
                these third-party cookies. The third parties who set these cookies include:
              </p>
              <div className="space-y-3 mt-4">
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <p className="font-semibold text-stone-900 dark:text-white">Supabase</p>
                  <p className="text-sm">For authentication and session management.{' '}
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <p className="font-semibold text-stone-900 dark:text-white">PostHog</p>
                  <p className="text-sm">For analytics (with your consent).{' '}
                    <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <p className="font-semibold text-stone-900 dark:text-white">Strava</p>
                  <p className="text-sm">For activity imports (when you connect your account).{' '}
                    <a href="https://www.strava.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </Section>

            <Section icon={<Settings className="w-5 h-5" />} title="7. Managing Your Cookie Preferences">
              <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-stone-900 dark:text-white mb-2">Using Our Cookie Banner</h4>
                <p className="text-sm mb-3">When you first visit our website, you will see a cookie consent banner. You can:</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li><strong className="text-stone-900 dark:text-white">Accept all:</strong> Enable all cookie categories</li>
                  <li><strong className="text-stone-900 dark:text-white">Reject all:</strong> Only enable strictly necessary cookies</li>
                  <li><strong className="text-stone-900 dark:text-white">Manage preferences:</strong> Choose which categories to enable or disable</li>
                </ul>
              </div>

              <h4 className="font-semibold text-stone-900 dark:text-white mb-2">Browser Settings</h4>
              <p className="text-sm mb-2">Most web browsers allow you to control cookies through their settings:</p>
              <div className="flex flex-wrap gap-2">
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer"
                   className="inline-block px-3 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:text-primary transition-colors">
                  Chrome
                </a>
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer"
                   className="inline-block px-3 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:text-primary transition-colors">
                  Firefox
                </a>
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer"
                   className="inline-block px-3 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:text-primary transition-colors">
                  Safari
                </a>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer"
                   className="inline-block px-3 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:text-primary transition-colors">
                  Edge
                </a>
              </div>
              <p className="text-sm mt-3 italic">
                Note: Blocking certain cookies may affect the functionality of our website.
              </p>
            </Section>

            <Section icon={<RefreshCw className="w-5 h-5" />} title="8. Do Not Track & Policy Updates">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-stone-900 dark:text-white mb-1">Do Not Track</h4>
                  <p className="text-sm">
                    Some browsers have a "Do Not Track" (DNT) feature that signals to websites that you do not
                    want your online activity tracked. Our website respects DNT signals by treating them as a
                    rejection of analytics cookies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 dark:text-white mb-1">Policy Changes</h4>
                  <p className="text-sm">
                    We may update this Cookie Policy from time to time. When we make changes, we will update the
                    "Last updated" date at the top. For significant changes, we may show a new cookie consent banner.
                  </p>
                </div>
              </div>
            </Section>

            <Section icon={<Scale className="w-5 h-5" />} title="9. Legal Basis">
              <p>Our use of cookies is governed by:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>The ePrivacy Directive (Directive 2002/58/EC)</li>
                <li>The Danish Cookie Order (Cookiebekendtgørelsen)</li>
                <li>The General Data Protection Regulation (GDPR) for personal data collected via cookies</li>
              </ul>
              <p className="mt-4 text-sm italic">
                For strictly necessary cookies, we rely on our legitimate interest in providing a functional
                website. For all other cookies, we rely on your consent.
              </p>
            </Section>

            <Section icon={<Mail className="w-5 h-5" />} title="10. Contact Us">
              <p>If you have any questions about our use of cookies, please contact us:</p>
              <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mt-4">
                <p className="font-semibold text-stone-900 dark:text-white">Rosbech Media Consult ApS</p>
                <p className="text-sm">CVR: 39337975</p>
                <p className="text-sm">
                  Email: <a href="mailto:joceprod@gmail.com" className="text-primary hover:underline">joceprod@gmail.com</a>
                </p>
              </div>
            </Section>

            {/* Related Policies */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/privacy"
                className="flex-1 p-4 bg-white dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-primary transition-colors group"
              >
                <span className="text-sm text-stone-500 dark:text-stone-400">Also read</span>
                <span className="block font-semibold text-stone-900 dark:text-white group-hover:text-primary transition-colors">
                  Privacy Policy
                </span>
              </Link>
              <Link
                href="/terms"
                className="flex-1 p-4 bg-white dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-primary transition-colors group"
              >
                <span className="text-sm text-stone-500 dark:text-stone-400">Also read</span>
                <span className="block font-semibold text-stone-900 dark:text-white group-hover:text-primary transition-colors">
                  Terms of Service
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
