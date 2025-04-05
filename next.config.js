/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
    unoptimized: true,
    domains: []
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  poweredByHeader: false,
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './**/.next/trace',
        'node_modules/**/*',
        '.git/**/*',
        'dist/**/*',
        '.next/trace',
        '.next/cache/**/*'
      ],
    },
    outputFileTracingIgnores: [
      'node_modules/**',
      '.git/**',
      '.next/trace',
      '.next/cache/**'
    ],
    tracingIgnores: [
      '.next/trace',
      'node_modules/**',
      '.git/**'
    ],
  },
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  webpack: (config, { dev, isServer, webpack }) => {
    if (config.output) {
      config.output.strictModuleExceptionHandling = true;
    }
    
    config.plugins.push(
      new webpack.ProvidePlugin({
        global: 'globalThis',
        exports: 'globalThis.exports = globalThis.exports || {};',
        require: 'globalThis.require || (()=>{})',
        process: 'globalThis.process || {env:{}}',
        Buffer: ['buffer', 'Buffer'],
      })
    );
    
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'global': 'globalThis',
      })
    );
    
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
        util: false,
        stream: false,
        buffer: false,
        crypto: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
        async_hooks: false,
        console: false,
        vm: false,
        module: false,
        dns: false,
        dgram: false,
        child_process: false,
        cluster: false,
        tty: false,
        readline: false,
        repl: false,
        worker_threads: false,
      },
      symlinks: false,
      preferRelative: true
    };
    
    config.plugins = config.plugins || [];
    
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    
    config.module = {
      ...config.module,
      exprContextCritical: false,
      unknownContextCritical: false,
      strictExportPresence: false
    };
    
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Can't resolve '.*' in/,
      /Critical dependency/,
      /Can't redefine property/
    ];
    
    if (webpack.ids) {
      config.plugins.push(
        new webpack.ids.DeterministicModuleIdsPlugin({
          maxLength: 5
        })
      );
    }
    
    config.optimization = {
      ...config.optimization,
      checkWasmTypes: false,
      ...(dev ? { minimize: false } : {}),
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              try {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `npm.${packageName.replace('@', '')}`;
              } catch (error) {
                return 'vendor';
              }
            },
          },
        },
      },
    };
    
    config.node = {
      ...config.node,
      global: false,
      __filename: false,
      __dirname: false,
    };
    
    config.performance = {
      ...config.performance,
      hints: dev ? false : 'warning',
      maxAssetSize: 500000,
      maxEntrypointSize: 500000
    };
    
    return config;
  }
};

module.exports = nextConfig;