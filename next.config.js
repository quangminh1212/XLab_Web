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
  // Moved from experimental.serverComponentsExternalPackages
  serverExternalPackages: [],
  webpack: (config, { isServer, nextRuntime }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Đảm bảo các phiên bản React được sử dụng nhất quán
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      };
    }
    
    // Fix cho lỗi next-auth với Next.js 15
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        'react/jsx-runtime': require.resolve('react/jsx-runtime')
      };
    }

    // Fix đặc biệt cho next-auth trong Next.js 15+
    if (isServer && nextRuntime === 'nodejs') {
      config.resolve.mainFields = ['main', 'module'];
    }

    // Tối ưu hóa bundle và ưu tiên ESM
    if (!isServer) {
      config.resolve.mainFields = ['browser', 'module', 'main'];
    }
    
    return config;
  },
  // Cấu hình bổ sung cho Next.js 15
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  }
}

module.exports = nextConfig; 