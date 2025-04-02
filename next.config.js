// next.config.js 
const nextConfig = { 
  reactStrictMode: true, 
  webpack: function(config) { 
    // Fix for "Cannot read properties of undefined (reading 'call')" error 
    if (config.resolve && config.resolve.alias) { 
      // Remove problematic aliases 
      delete config.resolve.alias["react"]; 
      delete config.resolve.alias["react-dom"]; 
    } 
    // Prevent context critical errors 
    config.module = { 
      ...config.module, 
      exprContextCritical: false 
    }; 
    
    // Ensure required properties exist 
    if (!config.optimization) { 
      config.optimization = {}; 
    } 
    
    // Modify the optimization settings to be more resilient to undefined properties 
    config.optimization.providedExports = true; 
    config.optimization.usedExports = true; 
    
    return config; 
  }, 
  typescript: { 
    // !! WARN !! 
    // Dangerously allow production builds to successfully complete even if 
    // your project has type errors. 
    ignoreBuildErrors: true, 
  }, 
  eslint: { 
    // Warning: This allows production builds to successfully complete even if 
    // your project has ESLint errors. 
    ignoreDuringBuilds: true, 
  }, 
  compiler: { 
    styledComponents: true 
  } 
} 
 
module.exports = nextConfig 
