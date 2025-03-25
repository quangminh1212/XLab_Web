/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'xlab.vn', 'cloudinary.com', 'res.cloudinary.com', 'images.unsplash.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: ['@next/font']
  },
  // Cấu hình cho Turbopack
  turbo: {
    rules: {
      // Cấu hình tiêu chuẩn cho Turbopack
    }
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Đảm bảo các gói React hoạt động đúng
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Đảm bảo sử dụng cùng một phiên bản React
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
      };
    }
    
    return config;
  },
}

module.exports = nextConfig; 