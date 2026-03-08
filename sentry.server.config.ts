// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

// Temporarily disabled for build issues
// Sentry.init({
//   dsn: SENTRY_DSN,
//   // Adjust this value in production, or use tracesSampler for greater control
//   tracesSampleRate: 1.0,
//   // ...
//   // Note: if you want to override the automatic release value, do not set a
//   // `release` value here - use the environment variable `SENTRY_RELEASE`, so
//   // that it will also be attached to your source maps
//   environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
//   
//   // Performance monitoring
//   integrations: [
//     new Sentry.Integrations.Http({ tracing: true }),
//     new Sentry.Integrations.Functions(),
//   ],
//   
//   // Error monitoring
//   beforeSend(event) {
//     // Filter out certain errors
//     if (event.exception) {
//       const error = event.exception.values?.[0]
//       if (error?.type === 'ChunkLoadError') {
//         return null // Don't send chunk load errors
//       }
//     }
//     return event
//   },
//   
//   // Performance settings
//   maxBreadcrumbs: 50,
//   debug: process.env.NODE_ENV === 'development',
// })
