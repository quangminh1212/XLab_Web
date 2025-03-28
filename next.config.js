/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'xlab.vn', 'lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    // Bỏ optimizeCss để tránh lỗi liên quan đến critters
  },
  // Thêm cấu hình telemetry và trace
  telemetry: {
    telemetryDisabled: true
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
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; media-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';"
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
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
