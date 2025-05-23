const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    suppressHydrationWarning: true,
    optimizePackageImports: ['react-icons'],
  },
  reactStrictMode: true,
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
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
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
    return config;
  }
};

module.exports = nextConfig;
