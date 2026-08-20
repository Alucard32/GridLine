'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { showCookiePreferences } from '@/components/CookieConsent';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-lg text-stone-900 dark:text-white">
                GridLine
              </span>
            </Link>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
              Turn your adventures into beautiful art. Create stunning prints from your hiking trails, runs, and travels.
            </p>
            {/* EU Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <span className="text-lg">🇪🇺</span>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Made in the EU
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/create"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Create Print
                </Link>
              </li>
              <li>
                <Link
                  href="/feed"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#styles"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Map Styles
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:joceprod@gmail.com"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <button
                  onClick={showCookiePreferences}
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-stone-500 dark:text-stone-500">
              © {currentYear} GridLine. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-600">
              <span>🇩🇰</span>
              <span>Designed in Denmark · Rosbech Media Consult ApS · CVR 39337975</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
