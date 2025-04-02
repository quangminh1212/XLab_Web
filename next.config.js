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
    return config; 
  }, 
  compiler: { 
    styledComponents: true 
  } 
} 
 
module.exports = nextConfig 
