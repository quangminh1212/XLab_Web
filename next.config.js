/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_DEBUG: 'true',
  },
  webpack: (config, { isServer, dev }) => {
    // Log cấu hình webpack trong quá trình build
    if (dev) {
      console.log('Webpack config mode:', config.mode);
    }
    
    // Cấu hình fallback cho các module có thể gây lỗi
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    // Thêm plugin để khởi tạo window.JSON nếu không tồn tại
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
            plugins: [
              // Plugin an toàn cho JSON và các global objects
              ['transform-define', {
                'process.env.BROWSER': true
              }]
            ]
          }
        }
      ]
    });
    
    return config;
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
          }
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
<<<<<<< HEAD
  poweredByHeader: false,
  // Fix cho lỗi "Cannot read properties of undefined (reading 'call')"
  webpack: (config, { dev, isServer, webpack }) => {
    // Fix cho options.factory - nguyên nhân chính của lỗi "Cannot read properties of undefined (reading 'call')"
    if (config.output) {
      // Đảm bảo factory không bị undefined
      config.output.strictModuleExceptionHandling = true;
    }
    
    // Cấu hình resolve
    config.resolve = {
      ...config.resolve,
      // Đảm bảo các fallback cho module Node.js core
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
        util: false,
        stream: false,
        buffer: false,
        crypto: false,
        http: false,
        https: false,
        zlib: false,
      }
    };
    
    // Thêm các plugins để tránh lỗi
    config.plugins = config.plugins || [];
    
    // Thêm NoEmitOnErrorsPlugin để tránh emit code khi có lỗi
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    
    // Cài đặt DefinePlugin để đảm bảo môi trường
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      })
    );
    
    // Fix cho vấn đề context trong module
    config.module = {
      ...config.module,
      exprContextCritical: false,
      unknownContextCritical: false,
      strictExportPresence: false
    };
    
    // Fix cho tác động của JSON.parse
    if (webpack.ids) {
      config.plugins.push(
        new webpack.ids.DeterministicModuleIdsPlugin({
          maxLength: 5
        })
      );
    }
    
    // Thêm cấu hình để tối ưu và tránh lỗi vòng lặp đệ quy
    config.optimization = {
      ...config.optimization,
      // Tránh circular dependencies
      checkWasmTypes: false,
      // Tắt các tối ưu có thể gây lỗi trong môi trường development
      ...(dev ? { minimize: false } : {}),
      // Đảm bảo cung cấp tên cho các modules
      moduleIds: 'deterministic'
    };
    
    // Thêm cấu hình strict mode cho node
    config.node = {
      ...config.node,
      global: false,
      __filename: false,
      __dirname: false,
    };
    
    return config;
  },
  // Tắt experimental features có thể gây lỗi
  experimental: {
    esmExternals: false
  }
=======
  poweredByHeader: false
>>>>>>> b2c5a0f4d856fe5443ef3a806c1251de14c04a65
};

module.exports = nextConfig;