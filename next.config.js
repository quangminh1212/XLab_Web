const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  reactStrictMode: true,
  //  không còn là tùy chọn hợp lệ trong Next.js 15+
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
  // Di chuyển outputFileTracingRoot từ experimental lên cấp cao nhất
  outputFileTracingRoot: path.join(__dirname, "../"),
  // Di chuyển serverComponentsExternalPackages từ experimental thành serverExternalPackages
  serverExternalPackages: ['@swc/helpers'],
  // Cấu hình experimental
  experimental: {
    largePageDataBytes: 12800000,
    disableOptimizedLoading: true,
    swcTraceProfiling: false,
    optimizeCss: true,
    // Xóa các tùy chọn không hợp lệ
  },
  productionBrowserSourceMaps: false,
  // Không tạo file trace
  generateEtags: false,
  images: {
    domains: ['via.placeholder.com', 'placehold.co', 'i.pravatar.cc', 'images.unsplash.com'],
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
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
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
            value: 'SAMEORIGIN'
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
            key: 'Next-SWC-Version',
            value: 'wasm'
          }
        ]
      }
    ];
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
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  staticPageGenerationTimeout: 180,
  poweredByHeader: false,
  compress: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Vô hiệu hóa cảnh báo cho CSS tùy chỉnh (Tailwind CSS)
  modularizeImports: {
    'tailwindcss/utilities': {
      transform: 'tailwindcss/utilities/{{member}}',
    },
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/
      };

      // Sửa lỗi hot update 404
      config.output = {
        ...config.output,
        hotUpdateChunkFilename: 'static/webpack/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: 'static/webpack/[fullhash].hot-update.json',
      };
    }

    config.infrastructureLogging = {
      level: 'error',
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    config.performance = {
      ...config.performance,
      hints: false,
    };

    // Đảm bảo publicPath luôn được đặt đúng để tránh lỗi 404
    config.output = {
      ...config.output,
      publicPath: '/_next/',
      assetModuleFilename: 'static/[hash][ext]',
      chunkFilename: isServer ? 
        'server/chunks/[name].[contenthash].js' :
        'static/chunks/[name].[contenthash].js',
      filename: isServer ?
        'server/[name].js' :
        'static/[name].[contenthash].js',
    };

    // Ngăn chặn lỗi ENOENT
    config.cache = false;

    // Loại bỏ cảnh báo Critical dependency
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        // Loại bỏ quy tắc CSS để sử dụng hỗ trợ CSS built-in của Next.js
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/,
          type: 'asset/resource',
        },
      ],
    };

    // Enables hot module replacement
    config.optimization.runtimeChunk = 'single';

    return config;
  },
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-id'
  },
  // Cấu hình sass nằm trong mục tùy chọn hợp lệ
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async redirects() {
    return [
      // Redirect timestamp versioned CSS files to base files
      {
        source: '/_next/static/css/app/layout.css',
        has: [
          {
            type: 'query',
            key: 'v',
          },
        ],
        destination: '/_next/static/css/app/layout.css',
        permanent: true,
      },
      // Redirect timestamp versioned JS files to base files
      {
        source: '/_next/static/main-app.aef085aefcb8f66f.js',
        has: [
          {
            type: 'query',
            key: 'v',
          },
        ],
        destination: '/_next/static/main-app.aef085aefcb8f66f.js',
        permanent: true,
      },
      // Redirect for admin layout files
      {
        source: '/_next/static/app/admin/layout.bd8a9bfaca039569.js',
        destination: '/_next/static/app/admin/layout.bd8a9bfaca039569.js',
        permanent: true,
      },
      // Redirect for admin page files
      {
        source: '/_next/static/app/admin/page.20e1580ca904d554.js',
        destination: '/_next/static/app/admin/page.20e1580ca904d554.js',
        permanent: true,
      },
      // Redirect for not-found files
      {
        source: '/_next/static/app/not-found.7d3561764989b0ed.js',
        destination: '/_next/static/app/not-found.7d3561764989b0ed.js',
        permanent: true,
      },
      // Redirect for layout files
      {
        source: '/_next/static/app/layout.32d8c3be6202d9b3.js',
        destination: '/_next/static/app/layout.32d8c3be6202d9b3.js',
        permanent: true,
      },
      // Redirect for app-pages-internals files
      {
        source: '/_next/static/app-pages-internals.196c41f732d2db3f.js',
        destination: '/_next/static/app-pages-internals.196c41f732d2db3f.js',
        permanent: true,
      },
      // Redirect for loading files
      {
        source: '/_next/static/app/loading.062c877ec63579d3.js',
        destination: '/_next/static/app/loading.062c877ec63579d3.js',
        permanent: true,
      },
      // Các redirect khác nếu cần
    ]
  },
};

module.exports = nextConfig;
