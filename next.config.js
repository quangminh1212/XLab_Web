/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
