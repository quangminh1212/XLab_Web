/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'xlab.vn'],
    formats: ['image/webp', 'image/avif'],
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
    // SVG support
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: ['@svgr/webpack']
    });

    // Thêm loaders cho SVG khi sử dụng trong CSS
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(css|scss)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    });

    // Fallbacks khi không ở trong môi trường server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "react-dom/client": require.resolve("react-dom/client"),
        "react/jsx-runtime": require.resolve("react/jsx-runtime"),
        "react/jsx-dev-runtime": require.resolve("react/jsx-dev-runtime"),
      };
    }

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
            value: 'SAMEORIGIN',
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