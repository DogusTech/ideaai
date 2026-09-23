import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  const isIdeaAiSubdomain = hostname === 'ideaai.togetlink.com' || hostname.startsWith('ideaai.localhost')
  const isOldAiSubdomain = hostname === 'ai.togetlink.com' || hostname.startsWith('ai.localhost')
  const isAdsSubdomain = hostname === 'ads.togetlink.com' || hostname.startsWith('ads.localhost')
  const isOutrankSubdomain = hostname === 'outrank.togetlink.com' || hostname.startsWith('outrank.localhost')
  const isMainDomain = hostname === 'www.togetlink.com' || hostname === 'togetlink.com' || (hostname.startsWith('localhost') && !isIdeaAiSubdomain && !isOldAiSubdomain && !isAdsSubdomain && !isOutrankSubdomain)

  const isAiPath = url.pathname === '/ai' || url.pathname.startsWith('/ai/')
  const isAiLandingPath = url.pathname === '/ai-landing-page' || url.pathname.startsWith('/ai-landing-page/')
  
  const acceptHeader = request.headers.get('accept') || ''
  
  // Markdown for Agents (Content Negotiation)
  if (acceptHeader.includes('text/markdown') && url.pathname === '/') {
    const response = NextResponse.rewrite(new URL('/llms.txt', request.url))
    response.headers.set('Content-Type', 'text/markdown')
    response.headers.set('x-markdown-tokens', '150')
    return response
  }
  
  // Explicitly handle sitemap.xml for subdomains before ignoring files with extensions
  if (url.pathname === '/sitemap.xml') {
    if (isIdeaAiSubdomain) {
      return NextResponse.rewrite(new URL('/ai-landing-page/sitemap.xml', request.url))
    }
    if (isOutrankSubdomain) {
      return NextResponse.rewrite(new URL('/outrank/sitemap.xml', request.url))
    }
    if (isAdsSubdomain) {
      return NextResponse.rewrite(new URL('/ads/sitemap.xml', request.url))
    }
  }
  
  // Exclude public files and API routes from our checks/rewrites
  if (!url.pathname.includes('.') && !url.pathname.startsWith('/api')) {
    
    // 1. Redirect old subdomain
    if (isOldAiSubdomain) {
      // Only redirect in production/staging where scheme is https
      const protocol = request.url.startsWith('https') ? 'https://' : 'http://'
      return NextResponse.redirect(new URL(url.pathname, `${protocol}ideaai.togetlink.com`))
    }

    // 2. Redirect main domain /ai and /ai-landing-page to ideaai.togetlink.com
    if (isMainDomain && !request.url.includes('localhost')) {
      if (isAiPath) {
        const newPath = url.pathname.replace('/ai', '/app')
        return NextResponse.redirect(new URL(newPath, 'https://ideaai.togetlink.com'))
      }
      if (isAiLandingPath) {
        const newPath = url.pathname.replace('/ai-landing-page', '') === '' ? '/' : url.pathname.replace('/ai-landing-page', '')
        return NextResponse.redirect(new URL(newPath, 'https://ideaai.togetlink.com'))
      }
    }

    // 3. Authentication Check for AI Route
    const isAppRoute = (isIdeaAiSubdomain && (url.pathname === '/app' || url.pathname.startsWith('/app/'))) || isAiPath;
    if (isAppRoute) {
      const isPitchDeck = url.pathname === '/ai/pitch-deck' || url.pathname === '/app/pitch-deck'
      const session = request.cookies.get('session')?.value
      
      if (!session && !isPitchDeck) {
        if (isIdeaAiSubdomain) {
          return NextResponse.redirect(new URL('/login', request.url))
        } else {
          return NextResponse.redirect(new URL('/ai-landing-page/login', request.url))
        }
      }
    }

    // 4. Subdomain Rewrites
    if (isIdeaAiSubdomain) {
      // If user accesses /ai on the subdomain, redirect them to /app
      if (url.pathname === '/ai' || url.pathname.startsWith('/ai/')) {
        const newPath = url.pathname.replace('/ai', '/app')
        return NextResponse.redirect(new URL(newPath, request.url))
      }

      // Allow /app to route to the app/app folder (AI Terminal/Dashboard)
      if (url.pathname === '/app' || url.pathname.startsWith('/app/')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }

      // Allow /legal, /privacy-policy, and /redeem to route to the root app folder
      if (url.pathname.startsWith('/legal') || url.pathname.startsWith('/privacy-policy') || url.pathname.startsWith('/redeem')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }
      
      // Rewrite everything else (/, /login, /register, etc.) to /ai-landing-page/*
      const landingRewrite = `/ai-landing-page${url.pathname === '/' ? '' : url.pathname}`
      return NextResponse.rewrite(new URL(landingRewrite, request.url))
    }
    
    if (isAdsSubdomain) {
      // Rewrite ads.togetlink.com/* to /ads/*
      return NextResponse.rewrite(new URL(`/ads${url.pathname === '/' ? '' : url.pathname}`, request.url))
    }

    if (isOutrankSubdomain) {
      // Rewrite outrank.togetlink.com/* to /outrank/*
      return NextResponse.rewrite(new URL(`/outrank${url.pathname === '/' ? '' : url.pathname}`, request.url))
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

