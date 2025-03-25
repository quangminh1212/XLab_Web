/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },
  experimental: {},
  env: {
    SITE_NAME: 'XLab',
    SITE_URL: 'https://xlab.vn',
    SITE_DESCRIPTION: 'XLab - Trang web bán phần mềm chất lượng cao',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        'react-dom/client': require.resolve('react-dom/client'),
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      };
    }
    
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 