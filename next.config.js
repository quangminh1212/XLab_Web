/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Disable traces
  tracing: {
    ignoreRootSpans: true,
  },
  
  // Modify output directory to avoid permission issues
  distDir: process.env.NODE_ENV !== 'production' ? '.next-dev' : '.next',
};

module.exports = nextConfig;
