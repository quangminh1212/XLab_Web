/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  poweredByHeader: false,
  // Cấu hình webpack an toàn
  webpack: (config, { dev, isServer }) => {
    // Vô hiệu hóa các alias có thể gây xung đột
    if (!isServer && config.resolve && config.resolve.alias) {
      delete config.resolve.alias['react'];
      delete config.resolve.alias['react-dom'];
    }
    
    // Điều chỉnh cấu hình webpack
    config.infrastructureLogging = { level: 'error' };
    
    // Giảm thiểu tối ưu hóa trong môi trường phát triển
    if (dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
        sideEffects: false
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;