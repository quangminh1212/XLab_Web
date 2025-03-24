/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-auth'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    // Chỉnh cấu hình webpack tại đây nếu cần
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Thêm plugin để xử lý lỗi options.factory
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  onDemandEntries: {
    // Giữ trang trong bộ nhớ đệm lâu hơn trong chế độ phát triển
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig; 