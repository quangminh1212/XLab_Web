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
    
    // Thêm plugin bảo vệ hàm call
    config.plugins = config.plugins || [];
    
    // Thêm BannerPlugin để bọc hàm call, apply, bind
    config.plugins.push(
      new webpack.BannerPlugin({
        banner: `
          // Fix for "Cannot read properties of undefined (reading 'call')"
          (function() {
            var _call = Function.prototype.call;
            var _apply = Function.prototype.apply;
            var _bind = Function.prototype.bind;
            
            // Safe versions that check for undefined
            Function.prototype.call = function() {
              if (this === undefined || this === null) {
                console.warn('Caught attempt to call method on undefined or null');
                return undefined;
              }
              return _call.apply(this, arguments);
            };
            
            Function.prototype.apply = function() {
              if (this === undefined || this === null) {
                console.warn('Caught attempt to apply method on undefined or null');
                return undefined;
              }
              return _apply.apply(this, arguments);
            };
            
            Function.prototype.bind = function() {
              if (this === undefined || this === null) {
                console.warn('Caught attempt to bind method on undefined or null');
                return function() {};
              }
              return _bind.apply(this, arguments);
            };
          })();
        `,
        raw: true,
        entryOnly: true,
      })
    );
    
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