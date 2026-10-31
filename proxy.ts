import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  
  // Optimize caching for static assets
  const url = request.nextUrl
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|otf)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - ingest (PostHog proxy)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|ingest|_next/static|_next/image|favicon.ico).*)',
  ],
}
