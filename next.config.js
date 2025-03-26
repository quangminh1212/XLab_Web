/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'xlab.vn', 'lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
  serverExternalPackages: ['sharp'],
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

    // Tối ưu hóa build
    if (process.env.NODE_ENV === 'production') {
      // Tối ưu minification
      config.optimization.minimize = true;

      // Thêm các plugin tối ưu hóa nếu cần
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  // Tối ưu trang tĩnh
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig; 