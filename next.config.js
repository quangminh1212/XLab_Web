const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don’t block production builds on ESLint errors
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // Keep dev assets around longer to avoid 404 on /_next/static after recompiles
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 50,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002'],
    },
    // Chỉ tắt tối ưu CSS trong development để tránh lỗi 404 CSS chunk
    optimizeCss: process.env.NODE_ENV === 'development' ? false : true,
    optimisticClientCache: true,
  },
  output: 'standalone',
  images: {
    domains: [
      'via.placeholder.com',
      'placehold.co',
      'i.pravatar.cc',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/webp', 'image/avif'],
    // Bật unoptimized toàn cục để tránh mọi vấn đề tối ưu ảnh trên host (Vercel)
    // và đảm bảo ảnh public/ và ảnh từ URL hiển thị đúng ở mọi nơi.
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  poweredByHeader: false,
  compress: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // Ensure assets are served from root; in production you can set ASSET_PREFIX
  assetPrefix: process.env.ASSET_PREFIX || '',
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== 'production',
    },
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };

    if (!isServer) {
      const optimization = config.optimization;
      if (optimization && optimization.splitChunks) {
        const splitChunks = optimization.splitChunks;

        optimization.splitChunks = {
          ...splitChunks,
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true,
            },
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: -5,
              reuseExistingChunk: true,
            },
            styles: false,
          },
        };
      }
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production'
              ? "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https:;"
              : "",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ].filter(header => header.value !== ""),
      },

    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
