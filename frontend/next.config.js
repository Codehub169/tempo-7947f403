/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone', // Consider for Docker deployments requiring minimal footprint
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:9000/api' // Backend API for local development (assuming backend on port 9000)
      : '/api',                     // Backend API for production (served from same domain or reverse proxied)
  },
  async rewrites() {
    // Proxy API requests to backend in development to avoid CORS issues
    // This assumes the frontend dev server is on a different port (e.g., 3000)
    // and the backend dev server is on port 9000.
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:9000/api/:path*', 
        },
      ];
    }
    return [];
  },
  // Example for allowing images from external domains, if needed in the future:
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'example.com',
  //       port: '',
  //       pathname: '/images/**',
  //     },
  //   ],
  // },
};

module.exports = nextConfig;
