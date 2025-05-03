/** @type {import('next').NextConfig} */
module.exports = {
  // Tắt App Router để chỉ sử dụng Pages Router
  experimental: {
    appDir: false
  },
  
  // Thiết lập entry point cho trang
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Bật strict mode để phát hiện lỗi sớm
  reactStrictMode: true,
  
  // Đường dẫn bắt đầu cho các trang
  basePath: '',
};
