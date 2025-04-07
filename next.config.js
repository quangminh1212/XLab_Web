/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  // Cấu hình webpack tối thiểu
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
    };
    return config;
  }
};

module.exports = nextConfig; 