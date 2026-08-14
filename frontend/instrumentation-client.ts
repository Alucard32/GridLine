import posthog from 'posthog-js';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Use 2025 defaults for best practices
    defaults: '2025-05-24',
    // Enable automatic exception capture for error tracking
    capture_exceptions: true,
    // Turn on debug in development mode
    debug: process.env.NODE_ENV === 'development',
  });
}
