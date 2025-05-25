const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Completely disable tracing to prevent EPERM errors on Windows
  tracing: false,
  experimental: {
    // Disable OpenTelemetry tracing
    serverComponentsExternalPackages: ['@opentelemetry/api'],
    // Disable other experimental features that might cause file conflicts
    optimizeCss: false,
  },
  // Disable Next.js telemetry
  telemetry: false,
  // Disable webpack logging that might cause file access issues
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
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
