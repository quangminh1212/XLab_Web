/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  reactStrictMode: false,
  images: {
    domains: ['*'],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Hỗ trợ Windows path
  webpack: (config, { dev, isServer }) => {
    // Sửa lỗi trên Windows platform
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      tls: false,
      child_process: false,
      path: false,
      crypto: false,
      os: false,
      http: false,
      https: false,
      stream: false,
      zlib: false
    };

    // Xử lý lỗi webpack trên Windows
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000, // Kiểm tra thay đổi mỗi giây
      aggregateTimeout: 300, // Trì hoãn rebuild sau thay đổi
    };

    // Tắt cảnh báo không cần thiết
    config.ignoreWarnings = [
      { module: /node_modules/ },
      /Can't resolve/,
      /Critical dependency/
    ];

    return config;
  },
  // Đảm bảo đường dẫn tương thích Windows
  trailingSlash: false,
  // Cấu hình ngăn chặn lỗi webpack
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  }
};

module.exports = nextConfig; 