/** @type {import('next').NextConfig} */
module.exports = {
  // Tắt App Router để chỉ sử dụng Pages Router
  experimental: {
    appDir: false,
    serverComponentsExternalPackages: [],
  },
  
  // Thiết lập entry point cho trang
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Bật strict mode để phát hiện lỗi sớm
  reactStrictMode: true,
  
  // Đường dẫn bắt đầu cho các trang
  basePath: '',

  // Cấu hình webpack để xử lý các lỗi với RSC
  webpack: (config, { isServer }) => {
    // Hỗ trợ các polyfill cho browser APIs
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
      };
    }
    
    return config;
  },
}
