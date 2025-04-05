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
  // Tắt telemetry, tracing và các tính năng không cần thiết
  experimental: {
    serverComponentsExternalPackages: [], // Đảm bảo không có xung đột với packages
    optimizePackageImports: false, // Tắt tạm để cải thiện ổn định
    esmExternals: "loose" // Linh hoạt hơn với việc import module
  },
  // Cấu hình webpack cơ bản và ổn định
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      tls: false,
      child_process: false
    };

    // Bỏ qua cảnh báo webpack common
    config.ignoreWarnings = [
      { module: /node_modules/ }
    ];

    return config;
  }
};

module.exports = nextConfig; 