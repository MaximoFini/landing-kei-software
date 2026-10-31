import bundleAnalyzer from '@next/bundle-analyzer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['*.ngrok-free.dev', '*.ngrok-free.app', '*.ngrok.io'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // PostHog reverse proxy: events go to our own domain so ad blockers don't
  // drop them. Region set by NEXT_PUBLIC_POSTHOG_HOST (us or eu).
  async rewrites() {
    const ingest = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
    const assets = ingest.replace('.i.posthog.com', '-assets.i.posthog.com')
    return [
      { source: '/ingest/static/:path*', destination: `${assets}/static/:path*` },
      { source: '/ingest/array/:path*', destination: `${assets}/array/:path*` },
      { source: '/ingest/:path*', destination: `${ingest}/:path*` },
    ]
  },
  // Required by the PostHog proxy: its API paths end in a trailing slash.
  skipTrailingSlashRedirect: true,
  // Compression
  compress: true,
  // Power by header removal for security
  poweredByHeader: false,
  // React strict mode for better practices
  reactStrictMode: true,
}

export default withBundleAnalyzer(nextConfig)
