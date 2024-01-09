import * as Sentry from '@sentry/nextjs'
import { ProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  ignoreErrors: ['AbortError'],
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0
})
