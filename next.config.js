/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ['image/webp', 'image/avif'],
    domains: ['example.com', 'images.unsplash.com', 'img.icons8.com'],
  },
  experimental: {
    scrollRestoration: true,
    instrumentationHook: true,
    optimizeCss: {
      enabled: true,
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  staticPageGenerationTimeout: 120, // Increases timeout for static page generation
  headers: async () => {
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for images
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for static assets
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for fonts
          },
        ],
      },
    ];
  },
  // Config for webpack analysis - only runs when ANALYZE=true
  webpack: (config, { dev, isServer }) => {
    // Only when ANALYZE=true
    if (process.env.ANALYZE === 'true') {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: false,
          })
        );
      } catch (error) {
        console.warn('webpack-bundle-analyzer not found. Skipping bundle analysis.');
      }
    }

    // Add debugging for potential call errors
    if (dev) {
      config.plugins.push(
        new config.webpack.DefinePlugin({
          'process.env.DEBUG_CALLS': JSON.stringify(true),
        })
      );
    }

    // Optimize CSS loading
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true,
        },
      };
    }

    return config;
  },
  
  // Optimize builds for production
  productionBrowserSourceMaps: false,
  compress: true,
  output: 'standalone',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', // Separate dev and prod builds
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig; 