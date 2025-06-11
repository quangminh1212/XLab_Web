const path = require('path');
const fs = require('fs');

// Tạo thư mục .next nếu chưa tồn tại
if (!fs.existsSync('.next')) {
  fs.mkdirSync('.next', { recursive: true });
}

// Tạo thư mục .next/trace với quyền truy cập đầy đủ
const tracePath = path.join(__dirname, '.next', 'trace');
try {
  if (!fs.existsSync(tracePath)) {
    fs.mkdirSync(tracePath, { recursive: true, mode: 0o777 });
  } else {
    fs.chmodSync(tracePath, 0o777);
  }
} catch (error) {
  console.warn('Warning: Could not create or set permissions for .next/trace directory');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  useFileSystemPublicRoutes: true,
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002'],
    },
    turbo: {
      enabled: false
    },
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
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
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
    }

    // Thêm cấu hình để tránh lỗi permission
    if (config.watchOptions) {
      config.watchOptions = {
        ...config.watchOptions,
        followSymlinks: false,
        ignored: ['**/node_modules', '**/.next/cache/**'],
      };
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
