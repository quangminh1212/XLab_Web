/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Cấu hình cơ bản cho Next.js
  images: {
    domains: ['*'],
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
  // Bỏ qua lỗi TypeScript và ESLint trong quá trình build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  // Hỗ trợ styled-components
  compiler: {
    styledComponents: true,
  },
  // Tắt header powered by Next.js
  poweredByHeader: false,
  // Webpack cơ bản nhất có thể
  webpack: (config) => {
    // Đảm bảo có fallback cho các module Node.js
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
      }
    };
    
    return config;
  }
};

module.exports = nextConfig; 