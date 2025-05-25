const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // External packages for server components (Next.js 15 syntax)
  serverExternalPackages: ['@opentelemetry/api'],
  // Image optimization
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
  // Build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Compiler options
  compiler: {
    styledComponents: true,
  },
  // Performance settings
  poweredByHeader: false,
  compress: true,
  // Sass configuration
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Disable caching for development
    config.cache = false;
    
    // Set up path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    // Disable code splitting in development to avoid chunk errors
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
