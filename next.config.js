// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static optimization to avoid prerendering errors
  output: 'standalone',
  
  webpack: (config) => {
    // Simple fix for "Cannot read properties of undefined (reading 'call')" error
    
    // Ensure webpack can properly handle module resolution
    config.resolve = {
      ...config.resolve,
      // Explicitly set modules to include node_modules
      modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
      // Add stable extensions resolution
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    };
    
    // Prevent webpack from trying to process certain modules
    config.module = {
      ...config.module,
      exprContextCritical: false
    };
    
    return config;
  },
  compiler: {
    styledComponents: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig; 
