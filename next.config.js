/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // Removed as it's causing warnings
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Cấu hình tối giản
  experimental: {},

  // Tắt source maps và minification trong development
  productionBrowserSourceMaps: false,
  swcMinify: false,

  // Cấu hình webpack đơn giản
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
        minimizer: [],
      }
    }
    return config;
  },
  
  // Cấu hình cơ bản
  staticPageGenerationTimeout: 120,
  
  // Thư mục build
  distDir: '.next',
};

module.exports = nextConfig; 
