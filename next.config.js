/** @type {import('next').NextConfig} */
const nextConfig = {
  // Thiết lập entry point cho trang
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Bật strict mode để phát hiện lỗi sớm
  reactStrictMode: true,
  
  // Cấu hình bảo mật và hiệu suất
  poweredByHeader: false,
  
  // Bỏ qua lỗi build TypeScript & ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Hỗ trợ styled-components
  compiler: {
    styledComponents: true,
  },
  
  // Cấu hình thử nghiệm
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  
  // Cấu hình các gói bên ngoài cho server component
  serverExternalPackages: [],
  
  // Cấu hình headers bảo mật
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin'
          }
        ]
      }
    ];
  },
  
  // Cấu hình webpack để xử lý các lỗi với RSC
  webpack: (config, { dev, isServer }) => {
    // Cấu hình watchOptions cho phát triển
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/
      };
    }
    
    // Hỗ trợ các polyfill cho browser APIs
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        fetch: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
      };
      
      // Fix for "Cannot read properties of undefined (reading 'call')" error
      config.optimization.moduleIds = 'named';
    }
    
    return config;
  },
};

module.exports = nextConfig;
