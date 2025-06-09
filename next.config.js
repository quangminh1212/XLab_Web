const path = require('path');

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
    optimizePackageImports: ['react-icons'],
    optimizeCss: true,
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
    unoptimized: process.env.NODE_ENV === 'development',
  },
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production',
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
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };

    // Thêm các biện pháp bảo mật cho webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Tối ưu hóa bundle size
    if (!dev) {
      config.optimization.minimize = true;
    }

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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://i.pravatar.cc https://images.unsplash.com https://lh3.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none';"
          }
        ],
      },
    ];
  },
  // Thêm cấu hình CSP
  async rewrites() {
    return {
      beforeFiles: [
        // Chuyển hướng các yêu cầu API đến endpoint thực
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
