const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tắt tracing để tránh lỗi EPERM trên Windows
  experimental: {
    instrumentationHook: false,
  },
  // Tắt telemetry và tracing
  telemetry: false,
  images: {
    domains: ['via.placeholder.com', 'placehold.co', 'i.pravatar.cc', 'images.unsplash.com', 'lh3.googleusercontent.com'],
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
  poweredByHeader: false,
  compress: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  assetPrefix: '',
  webpack: (config, { dev, isServer }) => {
    config.cache = false;
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    // Tắt hoàn toàn code splitting để tránh ChunkLoadError
    if (dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        runtimeChunk: false
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;
