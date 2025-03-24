/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-auth'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'xlab.vn', 'cloudinary.com', 'res.cloudinary.com', 'images.unsplash.com', 'api.example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  swcMinify: false,
  compiler: {
    // Tắt SWC để tránh lỗi module không tìm thấy
    styledComponents: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Cấu hình webpack
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Thêm source maps trong chế độ dev
    if (dev) {
      config.devtool = 'source-map';
    }

    // Tăng debug chi tiết
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'verbose',
      debug: /webpack/,
    };

    // Thêm thông tin chi tiết về lỗi
    config.stats = {
      ...config.stats, 
      errors: true,
      warnings: true,
      moduleTrace: true,
      errorDetails: true,
      logging: 'verbose'
    };

    // Chỉnh cấu hình webpack tại đây nếu cần
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  onDemandEntries: {
    // Giữ trang trong bộ nhớ đệm lâu hơn trong chế độ phát triển
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig; 