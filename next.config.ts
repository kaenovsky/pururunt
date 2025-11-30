/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },

      {
        protocol: 'https',
        hostname: 'www.cinecosmos.uba.ar',
      },

      {
        protocol: 'https',
        hostname: '**.mjt.lu',
      },

      {
        protocol: 'http',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      }
    ],
  },
};

export default nextConfig;