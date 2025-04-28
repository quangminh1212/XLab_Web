/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ajv', 'ajv-keywords', 'schema-utils'],
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
    loader: 'default',
    path: '',
    disableStaticImages: false,
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      'localhost',
      'picsum.photos',
      'primefaces.org',
      'fastly.picsum.photos',
      'loremflickr.com',
      'placehold.it',
      'source.unsplash.com',
      'dummyimage.com',
      'cdn.dribbble.com',
      'ui-avatars.com',
      '*.cloudinary.com',
      'api.dicebear.com',
      'images.pexels.com',
      'cdn.pixabay.com', 
      'randomuser.me',
      'res.cloudinary.com'
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; media-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';"
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ]
      }
    ];
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
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  poweredByHeader: false,
  webpack: (config, { isServer, dev }) => {
    // Không sử dụng process polyfill thông thường
    // thay vì sử dụng ProvidePlugin, sử dụng alias để tránh lỗi
    config.resolve.alias = {
      ...config.resolve.alias,
      'process': false // Tắt process polyfill để tránh lỗi với process/browser.js
    };

    // Make process available as a global, but avoid conflicting definitions
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || ''
        }),
      })
    );

    // Add node polyfills with safe requires
    const resolveModule = (name) => {
      try {
        return require.resolve(name);
      } catch (e) {
        console.warn(`Could not resolve ${name}, using empty module fallback`);
        return false;
      }
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: resolveModule('path-browserify'),
      crypto: resolveModule('crypto-browserify'),
      stream: resolveModule('stream-browserify'),
      buffer: resolveModule('buffer'),
      util: resolveModule('util'),
      assert: resolveModule('assert'),
      http: resolveModule('stream-http'),
      https: resolveModule('https-browserify'),
      zlib: resolveModule('browserify-zlib'),
      url: resolveModule('url'),
      os: resolveModule('os-browserify/browser'),
      process: false, // Tắt process polyfill
    };

    // Add babel rule for JSON parsing with optional chaining and nullish coalescing support
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules\/(?!(ajv|ajv-keywords|schema-utils))/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ],
        },
      },
    });

    // Handle JSON files specifically
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto',
      use: ['json-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
