/** @type {import('next').NextConfig} */
const nextConfig = {
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
          source: '/api/:path*',
          destination: `${baseUrl}/api/:path*`,
        },
      ]
    }
  },
}

export default nextConfig