import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['www.google.com'],
  },
  async redirects() {
    return [
      {
        source: '/media-guide',
        destination: 'https://runway.1zero9.com/',
        permanent: true,
      },
      {
        source: '/media-guide/login',
        destination: 'https://runway.1zero9.com/login',
        permanent: true,
      },
      {
        source: '/media-guide/:path*',
        destination: 'https://runway.1zero9.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
