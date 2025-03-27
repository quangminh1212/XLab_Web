/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer, dev }) => {
    // Vô hiệu hóa Hot Module Reloading khi dev để tránh lỗi Fast Refresh
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 800, // Kiểm tra thay đổi mỗi 800ms
        aggregateTimeout: 300, // Đặt thời gian chờ cập nhật
      };
    }
    return config;
  },
}

module.exports = nextConfig 