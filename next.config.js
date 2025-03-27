/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true, 
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
