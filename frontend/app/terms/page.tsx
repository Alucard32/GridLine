/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowLeft, FileText, User, Shield, Palette, Globe, AlertTriangle, Scale, Mail } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | GridLine',
  description: 'Terms of Service for GridLine - Read our terms and conditions for using our map creation platform.',
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

export default function TermsOfServicePage() {
  const lastUpdated = 'January 8, 2026';

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
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-4">
            Terms of Service
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
            <p className="text-sm text-stone-600 dark:text-stone-400">
              By using GridLine, you agree to use our service responsibly, respect others' content,
              and understand that while we do our best to provide a great experience, the service is
              provided "as is". Read below for the full details.
            </p>
          </div>

          <div className="space-y-6">
            <Section icon={<FileText className="w-5 h-5" />} title="1. Introduction">
              <p>
                Welcome to GridLine. These Terms of Service ("Terms") govern your access to and use of the GridLine
                platform, website, and services (collectively, the "Service"). By accessing or using the Service,
                you agree to be bound by these Terms.
              </p>
              <p>
                GridLine is operated by <strong className="text-stone-900 dark:text-white">Rosbech Media Consult ApS</strong> (CVR: 39337975), a company
                registered in Denmark ("we", "us", or "our").
              </p>
            </Section>

            <Section icon={<Palette className="w-5 h-5" />} title="2. Service Description">
              <p>GridLine is a map creation platform that allows you to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Create customized map posters from any location</li>
                <li>Upload GPX files to visualize hiking, running, and cycling routes</li>
                <li>Import activities directly from Strava</li>
                <li>Choose from multiple map styles, color palettes, and typography options</li>
                <li>Enable 3D terrain and building visualization</li>
                <li>Export high-resolution images for printing</li>
                <li>Share your creations with the community</li>
              </ul>
              <p className="text-sm italic">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time
                with reasonable notice.
              </p>
            </Section>

            <Section icon={<User className="w-5 h-5" />} title="3. User Eligibility & Accounts">
              <p>To use the Service, you must:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Be at least 16 years of age</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be prohibited from using the Service under applicable laws</li>
              </ul>
              <p className="mt-4">When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </Section>

            <Section icon={<Globe className="w-5 h-5" />} title="4. Third-Party Integrations">
              <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-stone-900 dark:text-white mb-2">Strava Integration</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>We access your activity data with read-only permissions</li>
                  <li>We never post, modify, or delete anything on your Strava account</li>
                  <li>You can disconnect at any time from your account settings</li>
                  <li>Your use of Strava is subject to <a href="https://www.strava.com/legal/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Strava's Terms of Service</a></li>
                </ul>
              </div>
              <p className="text-sm">
                GridLine also uses third-party map tile services including OpenFreeMap and MapTiler.
                Your use of these services through our platform is subject to their respective terms.
              </p>
            </Section>

            <Section icon={<Shield className="w-5 h-5" />} title="5. Acceptable Use">
              <p>When using the Service, you agree not to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Share your account credentials with others</li>
                <li>Use automated tools to scrape content from the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Upload malicious files or code</li>
                <li>Share offensive, defamatory, or harmful content</li>
              </ul>
              <p className="mt-4 text-sm italic">
                We reserve the right to remove content and terminate accounts that violate this policy.
              </p>
            </Section>

            <Section icon={<Palette className="w-5 h-5" />} title="6. User Content & Intellectual Property">
              <p>
                When you create content on GridLine, you retain ownership of your content. By publishing,
                you grant us a license to display and promote your work.
              </p>
              <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-stone-900 dark:text-white mb-2">Your Use Rights</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Access and use the Service for personal, non-commercial purposes</li>
                  <li>Export and print maps you create for personal use</li>
                  <li>Share your creations on social media with attribution to GridLine</li>
                </ul>
              </div>
              <p className="mt-4 text-sm">
                For commercial use, please contact us at <a href="mailto:joceprod@gmail.com" className="text-primary hover:underline">joceprod@gmail.com</a>.
              </p>
            </Section>

            <Section icon={<AlertTriangle className="w-5 h-5" />} title="7. Limitation of Liability">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  The Service is provided "as is" without warranties of any kind. We shall not be liable
                  for any indirect, incidental, special, or consequential damages. Our maximum liability
                  shall not exceed €100 or the amount you paid us in the preceding 12 months.
                </p>
              </div>
              <p className="mt-4 text-sm">
                These limitations do not affect your statutory rights as a consumer under Danish or EU law.
              </p>
            </Section>

            <Section icon={<Scale className="w-5 h-5" />} title="8. Dispute Resolution">
              <p>
                These Terms shall be governed by the laws of Denmark. Before initiating formal proceedings,
                we encourage you to contact us to resolve disputes informally.
              </p>
              <p className="mt-4 text-sm">
                If you are an EU consumer, you may access the EU Online Dispute Resolution platform at{' '}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  ec.europa.eu/consumers/odr
                </a>.
              </p>
            </Section>

            <Section icon={<Mail className="w-5 h-5" />} title="9. Contact Us">
              <p>If you have any questions about these Terms, please contact us:</p>
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
                href="/cookies"
                className="flex-1 p-4 bg-white dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-primary transition-colors group"
              >
                <span className="text-sm text-stone-500 dark:text-stone-400">Also read</span>
                <span className="block font-semibold text-stone-900 dark:text-white group-hover:text-primary transition-colors">
                  Cookie Policy
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
