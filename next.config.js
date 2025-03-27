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

  // Tắt source maps trong production
  productionBrowserSourceMaps: false,

  // Cấu hình webpack đơn giản với điều chỉnh để tránh lỗi
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
        minimizer: [],
      };
    }

    // Giải quyết lỗi "Cannot read properties of undefined (reading 'call')"
    // Tham khảo: https://github.com/webpack/webpack/issues/15582
    if (!isServer) {
      // Tắt chức năng splitChunks để tránh lỗi
      config.optimization.splitChunks = {
        cacheGroups: {
          default: false,
        }
      };
      
      // Đảm bảo hành vi nhất quán cho webpack
      config.output = {
        ...config.output,
        chunkLoadingGlobal: `webpackChunk_${require('./package.json').name}`,
      };

      // Thêm cấu hình để tránh prefetch và lỗi liên quan
      config.output.chunkLoading = 'jsonp';
      
      // Vô hiệu hóa các tối ưu hóa có thể gây ra lỗi
      config.optimization.concatenateModules = false;
      config.optimization.providedExports = false;
      config.optimization.usedExports = false;
    }
    
    return config;
  },
  
  // Cấu hình cơ bản
  staticPageGenerationTimeout: 120,
  
  // Thư mục build
  distDir: '.next',
};

module.exports = nextConfig; 
