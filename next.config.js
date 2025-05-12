const path = require('path');

// Import next bundle analyzer
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [''],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    largePageDataBytes: 128 * 1000 * 100,
    disableOptimizedLoading: true,
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true,
  },
  output: process.env.NEXT_OUTPUT_MODE,
  pageExtensions: process.env.NEXT_OUTPUT_MODE === 'export' 
    ? ['page.tsx', 'page.jsx', 'page.js', 'page.ts'] 
    : ['page.tsx', 'page.jsx', 'page.js', 'page.ts', 'api.ts', 'api.js', 'api.tsx', 'api.jsx'],
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
  outputFileTracingRoot: path.join(__dirname, "../"),
  serverExternalPackages: ['@swc/helpers'],
  productionBrowserSourceMaps: false,
  generateEtags: false,
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

      config.output = {
        ...config.output,
        hotUpdateChunkFilename: 'static/webpack/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: 'static/webpack/[fullhash].hot-update.json',
      };
    }

    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CreateEmptyVendorChunks', () => {
          const fs = require('fs');
          const path = require('path');
          
          const vendorDir = path.join(__dirname, '.next', 'server', 'vendor-chunks');
          const serverVendorDir = path.join(__dirname, '.next', 'server', 'server', 'vendor-chunks');
          
          [vendorDir, serverVendorDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
              try {
                fs.mkdirSync(dir, { recursive: true });
              } catch (err) {
                // Xử lý lỗi nếu không thể tạo thư mục
              }
            }
          });
          
          const vendorFile = path.join(vendorDir, 'tailwind-merge.js');
          const serverVendorFile = path.join(serverVendorDir, 'tailwind-merge.js');
          
          [vendorFile, serverVendorFile].forEach(file => {
            if (!fs.existsSync(file)) {
              try {
                fs.writeFileSync(file, 'module.exports = {};', 'utf8');
              } catch (err) {
                // Xử lý lỗi nếu không thể tạo file
              }
            }
          });
        });
      }
    });

    if (process.env.NEXT_OUTPUT_MODE === 'export' && config.module) {
      config.module.rules?.push({
        test: /\/app\/api\/|\/middleware\.(js|ts)$/,
        loader: 'ignore-loader',
      });
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

    config.cache = false;

    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/,
          type: 'asset/resource',
        },
      ],
    };

    config.optimization.runtimeChunk = 'single';

    return config;
  },
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async redirects() {
    return [
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
        source: '/_next/static/app/loading.:hash.js',
        destination: '/_next/static/app/loading.js',
        permanent: true,
      },
      {
        source: '/_next/static/main-app.:hash.js',
        destination: '/_next/static/main-app.js',
        permanent: true,
      },
    ];
  },
};

// Export config with bundle analyzer wrapper
module.exports = withBundleAnalyzer(nextConfig);
