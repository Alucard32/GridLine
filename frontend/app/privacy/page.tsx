/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | GridLine',
  description: 'Privacy Policy for GridLine - How we collect, use, and protect your personal data in compliance with GDPR and Danish data protection laws.',
};

export default function PrivacyPolicyPage() {
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
      <section className="py-12 bg-white dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-stone dark:prose-invert prose-lg max-w-none">

            {/* Introduction */}
            <h2>1. Introduction</h2>
            <p>
              Welcome to GridLine. We are committed to protecting your personal data and respecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
              visit our website and use our services.
            </p>
            <p>
              GridLine is operated by <strong>Rosbech Media Consult ApS</strong> (CVR: 39337975), a company
              registered in Denmark. We comply with the General Data Protection Regulation (GDPR), the Danish
              Data Protection Act (Databeskyttelsesloven), and other applicable data protection laws.
            </p>

            {/* Data Controller */}
            <h2>2. Data Controller</h2>
            <p>The data controller responsible for your personal data is:</p>
            <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg not-prose mb-6">
              <p className="font-semibold text-stone-900 dark:text-white">Rosbech Media Consult ApS</p>
              <p className="text-stone-600 dark:text-stone-400">CVR: 39337975</p>
              <p className="text-stone-600 dark:text-stone-400">
                Email: <a href="mailto:hello@gridline.eu" className="text-primary hover:underline">hello@gridline.eu</a>
              </p>
            </div>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at the
              email address above.
            </p>

            {/* Data We Collect */}
            <h2>3. Personal Data We Collect</h2>
            <p>We collect and process the following categories of personal data:</p>

            <h3>3.1 Account Information</h3>
            <ul>
              <li><strong>Full name</strong> - To personalize your experience</li>
              <li><strong>Email address</strong> - For account authentication and communication</li>
              <li><strong>Password</strong> - Securely hashed and stored for account access</li>
              <li><strong>Profile picture</strong> - If you sign in with Google</li>
            </ul>

            <h3>3.2 Connected Services Data</h3>
            <p>
              When you connect your Strava account to GridLine, we access:
            </p>
            <ul>
              <li><strong>Strava athlete ID</strong> - To identify your account</li>
              <li><strong>Activity data</strong> - GPS routes, names, dates, distances, and elevation data</li>
              <li><strong>OAuth tokens</strong> - Securely stored to maintain your connection</li>
            </ul>
            <p>
              We only request read access to your activities. We never post, modify, or delete anything on your Strava account.
              For more information about how Strava processes your data, please see{' '}
              <a href="https://www.strava.com/legal/privacy" target="_blank" rel="noopener noreferrer">
                Strava's Privacy Policy
              </a>.
            </p>

            <h3>3.3 Usage Data (Analytics)</h3>
            <p>
              With your consent, we collect analytics data using <strong>PostHog</strong> to understand how
              visitors use our website. This may include:
            </p>
            <ul>
              <li>Pages visited and interactions</li>
              <li>Device type and browser information</li>
              <li>Approximate location (country/region level)</li>
              <li>Referral source</li>
              <li>Session duration</li>
            </ul>
            <p>
              Analytics data is only collected if you consent via our cookie banner. You can withdraw consent
              at any time by clicking "Cookie Preferences" in our website footer.
            </p>

            <h3>3.4 Technical Data</h3>
            <p>We automatically collect certain technical data necessary for the operation of our service:</p>
            <ul>
              <li>IP address (for security and fraud prevention)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
            </ul>

            <h3>3.5 User-Generated Content</h3>
            <p>When you use GridLine, you may create and share:</p>
            <ul>
              <li>Map designs and poster configurations</li>
              <li>Route data from GPX uploads</li>
              <li>Published maps with titles and descriptions</li>
              <li>Comments and interactions on shared maps</li>
            </ul>

            {/* Legal Basis */}
            <h2>4. Legal Basis for Processing</h2>
            <p>
              Under GDPR, we must have a legal basis for processing your personal data. We rely on the
              following legal bases:
            </p>

            <h3>4.1 Contract Performance (Article 6(1)(b) GDPR)</h3>
            <p>We process your account and service data to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Provide the map creation and export services</li>
              <li>Enable Strava integration when you connect your account</li>
              <li>Provide customer support</li>
            </ul>

            <h3>4.2 Legitimate Interests (Article 6(1)(f) GDPR)</h3>
            <p>We process certain data based on our legitimate business interests:</p>
            <ul>
              <li>Fraud prevention and security monitoring</li>
              <li>Improving our services and user experience</li>
              <li>Administrative purposes and record-keeping</li>
            </ul>

            <h3>4.3 Consent (Article 6(1)(a) GDPR)</h3>
            <p>We only process certain data with your explicit consent:</p>
            <ul>
              <li>Analytics cookies (PostHog)</li>
              <li>Marketing communications (if you opt-in)</li>
            </ul>
            <p>
              You can withdraw consent at any time without affecting the lawfulness of processing based on
              consent before its withdrawal.
            </p>

            <h3>4.4 Legal Obligations (Article 6(1)(c) GDPR)</h3>
            <p>We may process your data to comply with legal obligations such as:</p>
            <ul>
              <li>Tax and accounting requirements</li>
              <li>Responding to lawful requests from authorities</li>
            </ul>

            {/* How We Use Data */}
            <h2>5. How We Use Your Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul>
              <li><strong>Account Management:</strong> Creating and managing your GridLine account</li>
              <li><strong>Service Delivery:</strong> Providing map creation, Strava import, and export functionality</li>
              <li><strong>Communication:</strong> Sending transactional emails, responding to inquiries</li>
              <li><strong>Analytics:</strong> Understanding how our service is used to make improvements (with consent)</li>
              <li><strong>Security:</strong> Protecting against fraud, abuse, and unauthorized access</li>
              <li><strong>Community Features:</strong> Enabling map sharing, comments, and social interactions</li>
            </ul>

            {/* Third Party Processors */}
            <h2>6. Third-Party Service Providers</h2>
            <p>
              We use trusted third-party service providers to help operate our business. These providers
              process personal data on our behalf under Data Processing Agreements (DPAs):
            </p>

            <div className="overflow-x-auto not-prose mb-6">
              <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                <thead className="bg-stone-100 dark:bg-stone-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900 dark:text-white">Provider</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900 dark:text-white">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-900 dark:text-white">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-800/50">
                  <tr>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Supabase</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Database hosting, authentication</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">USA (with SCCs)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">PostHog</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Analytics (with consent)</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">USA (with SCCs)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Vercel</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Website hosting</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">USA (with SCCs)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">MapTiler</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Map tile services</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Switzerland</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Strava</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">Activity import (when connected)</td>
                    <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">USA</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <strong>SCCs</strong> = Standard Contractual Clauses, which provide appropriate safeguards for
              international data transfers as required by GDPR.
            </p>

            {/* International Transfers */}
            <h2>7. International Data Transfers</h2>
            <p>
              Some of our service providers are located outside the European Economic Area (EEA), primarily
              in the United States. When we transfer personal data outside the EEA, we ensure appropriate
              safeguards are in place:
            </p>
            <ul>
              <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contractual terms that require the recipient to protect your data</li>
              <li><strong>EU-US Data Privacy Framework:</strong> Where applicable, certified under the framework</li>
            </ul>

            {/* Data Retention */}
            <h2>8. Data Retention</h2>
            <p>We retain your personal data only for as long as necessary:</p>
            <ul>
              <li><strong>Account data:</strong> For as long as your account is active, plus up to 5 years after deletion for legal/accounting purposes</li>
              <li><strong>Published maps:</strong> Until you delete them or your account is closed</li>
              <li><strong>Strava connection:</strong> Tokens are retained while connected; deleted when you disconnect</li>
              <li><strong>Analytics data:</strong> Anonymized or deleted within 24 months</li>
              <li><strong>Communication records:</strong> Up to 3 years for support and quality purposes</li>
            </ul>

            {/* Your Rights */}
            <h2>9. Your Rights Under GDPR</h2>
            <p>As a data subject, you have the following rights:</p>
            <ul>
              <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to Restriction:</strong> Request limited processing of your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:hello@gridline.eu">hello@gridline.eu</a>. We will respond to your request
              within one month.
            </p>

            {/* Complaints */}
            <h2>10. Complaints</h2>
            <p>
              If you believe we have not handled your personal data properly, you have the right to lodge a
              complaint with the Danish Data Protection Agency (Datatilsynet):
            </p>
            <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg not-prose mb-6">
              <p className="font-semibold text-stone-900 dark:text-white">Datatilsynet</p>
              <p className="text-stone-600 dark:text-stone-400">Carl Jacobsens Vej 35</p>
              <p className="text-stone-600 dark:text-stone-400">2500 Valby, Denmark</p>
              <p className="text-stone-600 dark:text-stone-400">
                Website: <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.datatilsynet.dk</a>
              </p>
            </div>

            {/* Cookies */}
            <h2>11. Cookies</h2>
            <p>
              We use cookies and similar technologies on our website. For detailed information about the
              cookies we use and how to manage them, please see our{' '}
              <Link href="/cookies">Cookie Policy</Link>.
            </p>

            {/* Security */}
            <h2>12. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data,
              including:
            </p>
            <ul>
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Secure password hashing</li>
              <li>Access controls and authentication</li>
              <li>Regular security reviews</li>
              <li>Secure storage of OAuth tokens</li>
            </ul>
            <p>
              While we strive to protect your personal data, no method of transmission over the Internet
              is 100% secure. We cannot guarantee absolute security.
            </p>

            {/* Children */}
            <h2>13. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16. We do not knowingly collect
              personal data from children. If you believe we have collected data from a child, please contact
              us immediately.
            </p>

            {/* Changes */}
            <h2>14. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage
              you to review this Privacy Policy periodically.
            </p>

            {/* Contact */}
            <h2>15. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg not-prose">
              <p className="font-semibold text-stone-900 dark:text-white">Rosbech Media Consult ApS</p>
              <p className="text-stone-600 dark:text-stone-400">CVR: 39337975</p>
              <p className="text-stone-600 dark:text-stone-400">
                Email: <a href="mailto:hello@gridline.eu" className="text-primary hover:underline">hello@gridline.eu</a>
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
