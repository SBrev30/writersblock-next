import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://860af12faa8be14403ecc39f9d2edf8d@o4509534714658816.ingest.us.sentry.io/4509534724816896",
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    // Add extra debugging info for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry event:', event);
    }
    return event;
  },
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});

console.log('✅ Sentry initialized for WritersBlock Canvas testing');