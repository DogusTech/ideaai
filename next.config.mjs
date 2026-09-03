/** @type {import('next').NextConfig} */
const isDesktop = process.env.BUILD_TARGET === 'desktop';

const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isDesktop ? { output: 'export' } : {}),

  // Sadece web derlemesinde rewrite ve redirect yap. Statik (Masaüstü) derlemede bunlar desteklenmez.
  ...( !isDesktop && {
    async rewrites() {
      const baseUrl = (process.env.TOGETLINK_BACKEND_URL || 'https://togetlink-ui-production.up.railway.app').replace(/\/$/, '');
      return {
        fallback: [
          {
            source: '/api/:path*',
            destination: `${baseUrl}/api/:path*`,
          },
          {
            source: '/landing',
            destination: '/landing/index.html',
          },
        ]
      }
    },
    async redirects() {
      return [
        {
          source: '/en',
          destination: '/',
          permanent: true,
        },
        {
          source: '/en/:path*',
          destination: '/',
          permanent: true,
        },
      ]
    }
  })
}

export default nextConfig