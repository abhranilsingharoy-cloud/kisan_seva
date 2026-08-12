import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  // ─── Performance ──────────────────────────────────────────
  reactStrictMode: true,
  poweredByHeader: false,

  // ─── Images ───────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
    minimumCacheTTL: 3600,
  },

  // ─── Headers ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ]
  },

  // ─── Rewrites (API proxy) ─────────────────────────────────
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/:path*`,
      },
    ]
  },

  // ─── Redirects ─────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/app', destination: '/dashboard', permanent: false },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  // ─── Sentry build-time options ────────────────────────────
  org:     'na-w3p',
  project: 'javascript-nextjs',

  // Source map upload (requires SENTRY_AUTH_TOKEN in CI)
  silent:         !process.env.CI,
  hideSourceMaps: true,

  // Auto-instrument all API routes
  autoInstrumentServerFunctions: true,
  autoInstrumentMiddleware:      true,
  autoInstrumentAppDirectory:    true,

  // Tree-shake Sentry debug code in production
  disableLogger: true,

  // Tunnels Sentry requests through /monitoring to bypass ad-blockers
  tunnelRoute: '/monitoring',

  // Automatically wrap pages with error boundaries
  widenClientFileUpload: true,
})

