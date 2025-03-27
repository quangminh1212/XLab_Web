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
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days for better caching
  },
  
  // Tắt tất cả tính năng thực nghiệm
  experimental: {
    optimizePackageImports: false,
    optimizeCss: false,
    optimizeServerReact: false,
    serverActions: false,
  },

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
  
  // Cấu hình server components
  serverExternalPackages: [],
  
  // Cấu hình cơ bản
  staticPageGenerationTimeout: 120,
  
  // Thư mục build riêng cho dev và prod
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};

module.exports = nextConfig; 
