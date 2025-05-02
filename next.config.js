/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ajv', 'ajv-keywords', 'schema-utils'],
  images: {
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
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  poweredByHeader: false,
  webpack: (config, { isServer, dev }) => {
    // Tắt process polyfill để tránh lỗi
    config.resolve.alias = {
      ...config.resolve.alias,
      'process': false
    };

    // Make process available as a global
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || ''
        }),
      })
    );

    // Add node polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      buffer: false,
      util: false,
      assert: false,
      http: false,
      https: false,
      zlib: false,
      url: false,
      os: false,
      process: false,
    };

    return config;
  },
};

module.exports = nextConfig;
