// Xử lý cấu hình Next.js để tránh lỗi "Cannot read properties of undefined (reading 'call')"

function createSafeConfig(config) {
  // Bảo vệ chế độ Fast Refresh
  if (typeof process.env.FAST_REFRESH === 'undefined') {
    process.env.FAST_REFRESH = 'false';
  }

  const safeConfig = {
    ...config,
    onDemandEntries: {
      // Tăng thời gian giữ các trang trong bộ nhớ cache
      maxInactiveAge: 60 * 60 * 1000,
      // Thay đổi số lượng trang được giữ trong bộ nhớ đệm
      pagesBufferLength: 5,
    },
    webpack: (webpackConfig, options) => {
      const { dev, isServer } = options;
      
      // Fix TypeError: Cannot read properties of undefined (reading 'call')
      if (!isServer) {
        webpackConfig.optimization.moduleIds = 'named';
      }
      
      // Áp dụng các cấu hình webpack từ config gốc
      if (typeof config.webpack === 'function') {
        return config.webpack(webpackConfig, options);
      }
      
      return webpackConfig;
    }
  };
  
  return safeConfig;
}

module.exports = createSafeConfig; 