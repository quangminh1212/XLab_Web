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
  
  // Cấu hình webpack để xử lý lỗi route loading
  webpack: (config, { isServer }) => {
    // Tắt một số tính năng webpack có thể gây lỗi
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Tắt source maps trong development để tăng tốc độ
    if (!isServer) {
      config.devtool = false;
      config.optimization.minimize = true;
    }

    return config;
  },
  
  // Cấu hình server components
  serverExternalPackages: [],
  
  // Tắt một số tính năng thực nghiệm
  experimental: {
    optimizeCss: false,
    optimizeServerReact: false,
  },
  
  // Cấu hình cơ bản
  staticPageGenerationTimeout: 120,
  
  // Thư mục build
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};

module.exports = nextConfig; 
