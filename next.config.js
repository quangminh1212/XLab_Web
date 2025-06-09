const path = require('path');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002'],
    },
    memoryBasedWorkersCount: true,
  },
  outputFileTracingRoot: path.resolve(__dirname),
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
  images: {
    domains: [
      'via.placeholder.com',
      'placehold.co',
      'i.pravatar.cc',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
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
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  serverRuntimeConfig: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };

    // Xử lý các node: URI
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:events': 'events',
      'node:fs': 'fs',
      'node:path': 'path',
      'node:stream': 'stream-browserify',
      'node:util': 'util',
      'node:buffer': 'buffer',
      'node:crypto': 'crypto-browserify',
      'node:http': 'stream-http',
      'node:https': 'https-browserify',
      'node:zlib': 'browserify-zlib',
      'node:assert': 'assert',
      'node:os': 'os-browserify',
    };

    if (!isServer) {
      // Configure optimization to avoid CSS 404 errors
      const optimization = config.optimization;
      if (optimization && optimization.splitChunks) {
        const splitChunks = optimization.splitChunks;

        optimization.splitChunks = {
          ...splitChunks,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            // Disable CSS splitting
            styles: false,
          },
        };
      }

      // Thay thế các module chỉ dành cho Node.js bằng 'empty' module trong môi trường client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
        module: false,
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        assert: require.resolve('assert'),
        events: require.resolve('events'),
      };

      // Thêm plugins cho polyfill
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
