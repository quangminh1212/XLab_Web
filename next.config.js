/** @type {import('next').NextConfig} */
const nextConfig = {
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

    // Tắt tối ưu hóa và sử dụng các tùy chọn tương thích
    config.optimization = {
      ...config.optimization,
      minimize: false,
      minimizer: []
    };

    // Xử lý lỗi webpack trên Windows
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000, // Kiểm tra thay đổi mỗi giây
      aggregateTimeout: 300, // Trì hoãn rebuild sau thay đổi
      ignored: ['node_modules/**', '.git/**', '.next/**']
    };

    // Tắt cảnh báo không cần thiết
    config.ignoreWarnings = [
      { module: /node_modules/ },
      /Can't resolve/,
      /Critical dependency/,
      /Module not found/
    ];

    // Sửa lỗi cache
    if (dev) {
      config.cache = {
        type: 'filesystem',
        allowCollectingMemory: true,
        compression: false,
        profile: false
      };
    }

    // Cấu hình webpack tối ưu cho Windows
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'error',
    };

    // Giới hạn các workers để tránh lỗi memory
    if (!isServer) {
      config.parallelism = 1;
    }

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
  },
  // Hỗ trợ môi trường Windows
  experimental: {
    esmExternals: false,
    externalDir: true,
    cpus: 1,
    forceSwcTransforms: true
  },
  poweredByHeader: false
};

module.exports = nextConfig; 