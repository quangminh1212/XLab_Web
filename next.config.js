/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    GOOGLE_CLIENT_ID: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    NEXTAUTH_SECRET: "your_random_string_here",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SIGNIN_URL: "http://localhost:3000/api/auth/signin/google",
    NEXTAUTH_CALLBACK_URL: "http://localhost:3000/api/auth/callback/google"
  },
  images: {
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
    loader: 'default',
    path: '',
    disableStaticImages: false,
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.optimization = {
      ...config.optimization,
      minimize: false,
      minimizer: [],
      splitChunks: false,
      runtimeChunk: false,
      flagIncludedChunks: false,
      concatenateModules: false,
      usedExports: false,
      sideEffects: false,
      providedExports: false,
      innerGraph: false,
      mangleExports: false,
    };
    
    if (dev) {
      config.mode = 'none';
    }
    
    if (!isServer) {
      config.output.libraryTarget = 'var';
    }
    
    return config;
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
