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
  // Đơn giản hóa các tùy chọn webpack
  webpack: (config, { dev, isServer, webpack }) => {
    // Thêm plugin để xử lý các biến toàn cục
    config.plugins.push(
      new webpack.ProvidePlugin({
        global: 'globalThis',
      })
    );
    
    // Thêm các fallback cần thiết
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
      }
    };
    
    // Bỏ qua các cảnh báo không cần thiết
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Can't resolve '.*' in/,
      /Critical dependency/,
    ];
    
    return config;
  }
};

module.exports = nextConfig; 