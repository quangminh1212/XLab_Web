/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

// Log function để giúp debug
function logConfig(message, data) {
  const logPath = path.resolve('./logs');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }
  
  const logFile = path.resolve(logPath, 'next-config.log');
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] ${message}\n${data ? JSON.stringify(data, null, 2) : ''}\n\n`;
  
  fs.appendFileSync(logFile, logData);
  console.log(`[NextConfig] ${message}`);
}

logConfig('Next.js config đang được khởi tạo');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'xlab.vn', 'cloudinary.com', 'res.cloudinary.com', 'images.unsplash.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: ['@next/font']
  },
  webpack: (config, { isServer, buildId }) => {
    logConfig(`Webpack config đang được xử lý. isServer: ${isServer}, buildId: ${buildId}`);
    
    // Đường dẫn đến polyfill
    const reactDomClientPolyfill = path.resolve(__dirname, 'react-dom-client.js');
    
    logConfig('Đang thiết lập polyfill', { 
      reactDomClient: reactDomClientPolyfill,
      exists: fs.existsSync(reactDomClientPolyfill)
    });
    
    // Fallback cho các module Node.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };
    
    // Thiết lập resolver cho react-dom/client
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom/client': reactDomClientPolyfill,
    };
    
    // Đảm bảo các phiên bản React được sử dụng nhất quán
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
      };
    }
    
    logConfig('Webpack alias đã được thiết lập', config.resolve.alias);
    
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'info', 'log'],
    } : false,
  },
  onDemandEntries: {
    // Giữ trang được tải trong bộ nhớ cache lâu hơn
    maxInactiveAge: 60 * 60 * 1000,
    // Tăng số lượng trang trong bộ nhớ cache
    pagesBufferLength: 5,
  },
}

logConfig('Next.js config đã được tạo', nextConfig);

module.exports = nextConfig; 