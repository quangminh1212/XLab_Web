const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['react-icons'],
    suppressHydrationWarning: true,
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
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev, isServer }) => {
    config.cache = false;
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    // Suppress warnings
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Suppress console warnings in production
    if (!dev) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
    
    return config;
  }
};

module.exports = nextConfig;
