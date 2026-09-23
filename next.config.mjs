/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // İsmi Vercel'in otomatik kurallarla ezemeyeceği bir kelimeye çevirdik
    const baseUrl = (process.env.TOGETLINK_BACKEND_URL || 'https://togetlink-ui-production.up.railway.app').replace(/\/$/, '');

    return {
      fallback: [
        {
          source: '/.well-known/api-catalog',
          destination: '/api/api-catalog',
        },
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value: '</llms.txt>; rel="api-catalog", </AGENTS.md>; rel="service-doc"'
          }
        ]
      }
    ];
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
  },
}

export default nextConfig