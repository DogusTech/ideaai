import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Subdomain routing for ai.togetlink.com
  if (hostname === 'ai.togetlink.com' || hostname.startsWith('ai.localhost')) {
    // Exclude public files and api routes from rewrite
    if (!url.pathname.includes('.') && !url.pathname.startsWith('/api')) {
      // Rewrite to /ai route
      return NextResponse.rewrite(new URL(`/ai${url.pathname === '/' ? '' : url.pathname}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
