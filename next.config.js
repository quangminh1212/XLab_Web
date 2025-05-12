const path = require('path');

// Import next bundle analyzer
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  reactStrictMode: true,
  //  không còn là tùy chọn hợp lệ trong Next.js 15+
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
  // Di chuyển outputFileTracingRoot từ experimental lên cấp cao nhất
  outputFileTracingRoot: path.join(__dirname, "../"),
  // Di chuyển serverComponentsExternalPackages từ experimental thành serverExternalPackages
  serverExternalPackages: ['@swc/helpers'],
  // Tắt tính năng trace ghi lỗi
  experimental: {
    largePageDataBytes: 12800000,
    disableOptimizedLoading: true,
    swcTraceProfiling: false,
    optimizeCss: true,
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
    unoptimized: process.env.NODE_ENV === 'development',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp', 'image/avif'],
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

    // Thêm plugin để tạo file font-manifest trống nếu không tồn tại
    if (isServer) {
      const { existsSync, writeFileSync, mkdirSync } = require('fs');
      const { join, dirname } = require('path');
      
      const originalEntryPoint = config.entry;
      config.entry = async () => {
        const entries = await originalEntryPoint();
        
        // Tạo font-manifest.json khi build
        const nextFontManifestPath = join(__dirname, '.next/server/next-font-manifest.json');
        try {
          const dir = dirname(nextFontManifestPath);
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
          }
          if (!existsSync(nextFontManifestPath)) {
            writeFileSync(nextFontManifestPath, JSON.stringify({
              pages: {},
              app: {},
              appUsingSizeAdjust: false,
              pagesUsingSizeAdjust: false
            }));
            console.log('Created empty next-font-manifest.json');
          }
        } catch (err) {
          console.error('Error creating next-font-manifest.json:', err);
        }
        
        return entries;
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
    return 'build-' + Date.now();
  },
  // Cấu hình sass nằm trong mục tùy chọn hợp lệ
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async redirects() {
    return [
      // Redirect cho tất cả các file static có timestamp trong query parameter
      {
        source: '/_next/static/:path*',
        has: [
          {
            type: 'query',
            key: 'v',
          },
        ],
        destination: '/_next/static/:path*',
        permanent: true,
      },
      // Fallback redirects cho các file static cụ thể
      {
        source: '/_next/static/css/app/layout.css',
        destination: '/_next/static/css/app/layout.css',
        permanent: true,
      },
      {
        source: '/_next/static/app/not-found.:hash.js',
        destination: '/_next/static/app/not-found.js',
        permanent: true,
      },
      {
        source: '/_next/static/app-pages-internals.:hash.js',
        destination: '/_next/static/app-pages-internals.js',
        permanent: true,
      },
      {
        source: '/_next/static/main-app.:hash.js',
        destination: '/_next/static/main-app.js',
        permanent: true,
      },
      {
        source: '/_next/static/app/loading.:hash.js',
        destination: '/_next/static/app/loading.js',
        permanent: true,
      },
    ];
  },
};

// Export config with bundle analyzer wrapper
module.exports = withBundleAnalyzer(nextConfig);
