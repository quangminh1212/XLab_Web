const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  reactStrictMode: true,
  //  không còn là tùy chọn hợp lệ trong Next.js 15+
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
  // Di chuyển serverComponentsExternalPackages từ experimental thành serverExternalPackages
  serverExternalPackages: ['@swc/helpers'],
  // Cấu hình experimental
  experimental: {
    largePageDataBytes: 12800000,
    disableOptimizedLoading: false,
    swcTraceProfiling: false,
    // Tắt optimizeCss để tránh lỗi critters
    optimizeCss: false,
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
      // Sử dụng tên file cố định không có hash
      chunkFilename: isServer ? 
        'server/chunks/[name].js' :
        'static/chunks/[name].js',
      filename: isServer ?
        'server/[name].js' :
        'static/[name].js',
    };

    // Vô hiệu hóa hoàn toàn việc tạo vendor chunks
    config.optimization = {
      ...config.optimization,
      minimize: false,
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false
        }
      },
      runtimeChunk: false
    };

    // Sửa lỗi cache
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

    return config;
  },
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-id-' + Date.now();
  },
  // Cấu hình sass nằm trong mục tùy chọn hợp lệ
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async redirects() {
    return [
      // Tạo các redirect cơ bản để xử lý các file CSS/JS không tìm thấy
      {
        source: '/_next/static/:path*',
        destination: '/_next/static/:path*',
        permanent: true,
      }
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        // === CẢI TIẾN: Xử lý tất cả các file CSS không tìm thấy với tham số phiên bản ===
        {
          source: '/_next/static/css/app/layout.css',
          destination: '/_next/static/css/empty.css'
        },
        {
          source: '/_next/static/css/app/layout.css:v(.*)',
          destination: '/_next/static/css/empty.css'
        },
        // === CẢI TIẾN: Regex cụ thể hơn để bắt các query params ===
        {
          source: '/_next/static/css/:path*',
          has: [{ type: 'query', key: 'v' }],
          destination: '/_next/static/css/empty.css'
        },
        {
          source: '/_next/static/css/:path*',
          destination: '/_next/static/css/empty.css'
        },
        // === CẢI TIẾN: Xử lý file main-app.js với và không có hash ===
        {
          source: '/_next/static/main-app.:hash*.js',
          destination: '/_next/static/main-app.js'
        },
        {
          source: '/_next/static/main-app.js',
          destination: '/_next/static/main-app.js'
        },
        // === CẢI TIẾN: Xử lý các file JS trong thư mục app ===
        {
          source: '/_next/static/app/page.:hash*.js',
          destination: '/_next/static/app/page.js'
        },
        {
          source: '/_next/static/app/layout.:hash*.js',
          destination: '/_next/static/app/layout.js'
        },
        {
          source: '/_next/static/app/not-found.:hash*.js',
          destination: '/_next/static/app/not-found.js'
        },
        {
          source: '/_next/static/app/loading.:hash*.js',
          destination: '/_next/static/app/loading.js'
        },
        {
          source: '/_next/static/app/admin/layout.:hash*.js',
          destination: '/_next/static/app/admin/layout.js'
        },
        {
          source: '/_next/static/app/admin/page.:hash*.js',
          destination: '/_next/static/app/admin/page.js'
        },
        // === CẢI TIẾN: Xử lý app-pages-internals.js ===
        {
          source: '/_next/static/app-pages-internals.:hash*.js',
          destination: '/_next/static/app-pages-internals.js'
        },
        // === CẢI TIẾN: Xử lý file turbopack-hmr ===
        {
          source: '/_next/static/chunks/_app-pages-browser_node_modules_next_dist_client_dev_noop-turbopack-hmr_js.js',
          destination: '/_next/static/chunks/empty.js'
        },
        // Xử lý các file không tìm thấy của app
        {
          source: '/_next/static/app/:path*',
          destination: '/_next/static/app/empty.js'
        },
        // Xử lý các file JS không tìm thấy
        {
          source: '/_next/static/chunks/:path*',
          destination: '/_next/static/chunks/empty.js'
        },
        // Xử lý webpack hot-update
        {
          source: '/_next/static/webpack/:hash*.hot-update.json',
          destination: '/_next/static/webpack/empty-hot-update.json'
        }
      ],
      fallback: [
        {
          source: '/_next/static/:path*',
          destination: '/_next/static/:path*'
        }
      ]
    };
  },
};

module.exports = nextConfig;
