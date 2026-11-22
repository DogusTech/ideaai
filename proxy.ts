import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const rawHost = request.headers.get('host') || ''
  const hostname = rawHost.split(':')[0].toLowerCase()
  const port = rawHost.includes(':') ? `:${rawHost.split(':')[1]}` : ''

  // Primary Turaen domains (Production + Local Dev)
  const isTuraenDomain =
    hostname === 'turaen.com' ||
    hostname === 'www.turaen.com' ||
    hostname === 'turaen.com.tr' ||
    hostname === 'www.turaen.com.tr' ||
    hostname === 'turaen.localhost'

  // Legacy AI subdomains to 301-redirect to turaen.com
  const isLegacyAiSubdomain =
    hostname === 'ideaai.togetlink.com' ||
    hostname === 'ideaaai.togetlink.com' ||
    hostname === 'ai.togetlink.com' ||
    hostname === 'ideaai.localhost' ||
    hostname === 'ai.localhost'

  const isNewsSubdomain = hostname === 'news.togetlink.com' || hostname === 'news.localhost'
  const isAdsSubdomain = hostname === 'ads.togetlink.com' || hostname === 'ads.localhost'
  const isOutrankSubdomain = hostname === 'outrank.togetlink.com' || hostname === 'outrank.localhost'
  const isMainDomain =
    hostname === 'www.togetlink.com' ||
    hostname === 'togetlink.com' ||
    (hostname === 'localhost' &&
      !isTuraenDomain &&
      !isLegacyAiSubdomain &&
      !isNewsSubdomain &&
      !isAdsSubdomain &&
      !isOutrankSubdomain)

  const isAiPath = url.pathname === '/ai' || url.pathname.startsWith('/ai/')
  const isAiLandingPath = url.pathname === '/ai-landing-page' || url.pathname.startsWith('/ai-landing-page/')

  // 0. Immediate 301 Permanent Redirect from ideaai.togetlink.com & ai.togetlink.com -> turaen.com
  if (isLegacyAiSubdomain) {
    const targetOrigin = hostname.endsWith('.localhost')
      ? `http://turaen.localhost${port}`
      : 'https://turaen.com'
    const destination = new URL(`${url.pathname}${url.search}`, targetOrigin)
    return NextResponse.redirect(destination, 301)
  }

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
    if (isNewsSubdomain) {
      return NextResponse.rewrite(new URL('/news/sitemap.xml', request.url))
    }
    if (isOutrankSubdomain) {
      return NextResponse.rewrite(new URL('/outrank/sitemap.xml', request.url))
    }
    if (isAdsSubdomain) {
      return NextResponse.rewrite(new URL('/ads/sitemap.xml', request.url))
    }
  }

  // Exclude public files and API routes from checks/rewrites
  if (!url.pathname.includes('.') && !url.pathname.startsWith('/api')) {
    // 1. News Subdomain Routing (news.togetlink.com)
    if (isNewsSubdomain) {
      if (url.pathname === '/') {
        return NextResponse.rewrite(new URL('/news', request.url))
      }
      if (!url.pathname.startsWith('/news')) {
        return NextResponse.rewrite(new URL(`/news${url.pathname}`, request.url))
      }
      return NextResponse.next()
    }

    // 2. Redirect main domain /ai and /ai-landing-page to turaen.com (301 Permanent)
    if (isMainDomain && hostname !== 'localhost') {
      if (isAiPath) {
        const newPath = url.pathname.replace('/ai', '/app')
        return NextResponse.redirect(new URL(`${newPath}${url.search}`, 'https://turaen.com'), 301)
      }
      if (isAiLandingPath) {
        const stripped = url.pathname.replace('/ai-landing-page', '')
        const newPath = stripped === '' ? '/' : stripped
        return NextResponse.redirect(new URL(`${newPath}${url.search}`, 'https://turaen.com'), 301)
      }
    }

    // 3. Authentication Check for AI Route
    const isAppRoute = (isTuraenDomain && (url.pathname === '/app' || url.pathname.startsWith('/app/'))) || isAiPath
    if (isAppRoute) {
      const isPitchDeck = url.pathname === '/ai/pitch-deck' || url.pathname === '/app/pitch-deck'
      const session = request.cookies.get('session')?.value
      const isLocalhost = hostname === 'localhost' || hostname.endsWith('.localhost')

      if (!session && !isPitchDeck && !isLocalhost) {
        if (isTuraenDomain) {
          return NextResponse.redirect(new URL('/login', request.url))
        } else {
          return NextResponse.redirect(new URL('/ai-landing-page/login', request.url))
        }
      }
    }

    // 4. Turaen Domain Rewrites (turaen.com)
    if (isTuraenDomain) {
      // Redirect /ai/* on turaen.com to /app/*
      if (url.pathname === '/ai' || url.pathname.startsWith('/ai/')) {
        const newPath = url.pathname.replace('/ai', '/app')
        return NextResponse.redirect(new URL(`${newPath}${url.search}`, request.url), 301)
      }

      // Allow /app to route to the app/app folder (AI Terminal/Dashboard)
      if (url.pathname === '/app' || url.pathname.startsWith('/app/')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }

      // Allow /mac-test to route to the root mac-test folder
      if (url.pathname === '/mac-test' || url.pathname.startsWith('/mac-test/')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }

      // Allow public Turaen product, documentation, and content routes
      if (
        url.pathname === '/matrix-demo' ||
        url.pathname.startsWith('/matrix-demo/') ||
        url.pathname === '/docs' ||
        url.pathname.startsWith('/docs/') ||
        url.pathname === '/security' ||
        url.pathname.startsWith('/security/') ||
        url.pathname.startsWith('/legal') ||
        url.pathname.startsWith('/privacy-policy') ||
        url.pathname.startsWith('/redeem') ||
        url.pathname.startsWith('/blog') ||
        url.pathname.startsWith('/use-cases') ||
        url.pathname.startsWith('/tools') ||
        url.pathname.startsWith('/pitch-deck') ||
        url.pathname.startsWith('/pro')
      ) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }

      // Rewrite everything else (/, /login, /register, etc.) to /ai-landing-page/*
      const landingRewrite = `/ai-landing-page${url.pathname === '/' ? '' : url.pathname}`
      return NextResponse.rewrite(new URL(landingRewrite, request.url))
    }

    if (isAdsSubdomain) {
      return NextResponse.rewrite(new URL(`/ads${url.pathname === '/' ? '' : url.pathname}`, request.url))
    }

    if (isOutrankSubdomain) {
      return NextResponse.rewrite(new URL(`/outrank${url.pathname === '/' ? '' : url.pathname}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}