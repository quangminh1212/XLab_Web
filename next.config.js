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
    
    // Fix cho vấn đề module resolution
    if (config.resolve && config.resolve.alias) {
      // Xóa các alias có thể gây xung đột
      delete config.resolve.alias['react'];
      delete config.resolve.alias['react-dom'];
    }
    
    // Fix cho vấn đề context trong module
    config.module = {
      ...config.module,
      exprContextCritical: false,
      unknownContextCritical: false,
      strictExportPresence: false
    };
    
    // Cài đặt DefinePlugin để đảm bảo môi trường
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      })
    );
    
    // Fix cho tác động của JSON.parse
    if (webpack.ids) {
      config.plugins.push(
        new webpack.ids.DeterministicModuleIdsPlugin({
          maxLength: 5
        })
      );
    }
    
    // Đảm bảo các fallback cho module Node.js core
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
        util: false,
        stream: false,
        buffer: false
      }
    };
    
    // Tối ưu trong môi trường development
    if (dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;