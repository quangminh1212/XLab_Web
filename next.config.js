/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // Cấu hình đơn giản hơn cho webpack
  webpack: (config) => {
    // Fallback cơ bản
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      tls: false,
      child_process: false,
    };

    return config;
  },
  // Vô hiệu hóa tracing để tránh lỗi EPERM
  experimental: {
    disableOptimizedLoading: true,
    disablePostcssPresetEnv: true
  }
};

module.exports = nextConfig; 