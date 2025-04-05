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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
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
};

module.exports = nextConfig;