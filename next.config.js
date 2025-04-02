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
    // Vô hiệu hóa các alias có thể gây xung đột
    if (config.resolve && config.resolve.alias) {
      // Xóa các alias React để tránh xung đột
      delete config.resolve.alias['react'];
      delete config.resolve.alias['react-dom'];
    }
    
    // Fix cho vấn đề factory - là nguyên nhân chính gây lỗi 'call'
    config.plugins = config.plugins || [];
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }));
    
    // Vô hiệu hóa các cảnh báo và lỗi nghiêm trọng về context
    config.module = {
      ...config.module,
      exprContextCritical: false,
      unknownContextCritical: false,
      strictExportPresence: false
    };
    
    // Giảm thiểu tối ưu hóa trong môi trường phát triển
    if (dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
        sideEffects: false
      };
    }
    
    // Fix cho vấn đề JSON.parse
    const JsonpTemplatePlugin = webpack.JsonpTemplatePlugin;
    if (JsonpTemplatePlugin) {
      config.plugins.push(new JsonpTemplatePlugin({
        requireFn: '__webpack_require__'
      }));
    }
    
    // Đảm bảo fallback cho các module Node.js
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false
      }
    };
    
    return config;
  }
};

module.exports = nextConfig;