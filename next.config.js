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