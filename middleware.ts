import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  const isAiSubdomain = hostname === 'ai.togetlink.com' || hostname.startsWith('ai.localhost')
  const isAiPath = url.pathname === '/ai' || url.pathname.startsWith('/ai/')
  
  // Exclude public files and API routes from our checks/rewrites
  if (!url.pathname.includes('.') && !url.pathname.startsWith('/api')) {
    // 1. Authentication Check for AI Route
    if (isAiSubdomain || isAiPath) {
      const session = request.cookies.get('session')?.value
      
      if (!session) {
        // Not authenticated, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // 2. Subdomain Rewrite
    if (isAiSubdomain) {
      // Rewrite ai.togetlink.com/* to /ai/*
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

