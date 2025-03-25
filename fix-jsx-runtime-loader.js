// Bộ loader module mới để đảm bảo jsx-runtime luôn được tìm thấy

// Lưu lại hàm require gốc
const originalRequire = module.require;

// Patch hàm require để xử lý 'react/jsx-runtime'
module.require = function patchedRequire(path) {
  // Nếu path là 'react/jsx-runtime', cung cấp polyfill
  if (path === 'react/jsx-runtime') {
    try {
      // Trước tiên thử sử dụng require gốc
      return originalRequire(path);
    } catch (e) {
      console.log('Providing JSX Runtime polyfill for:', path);
      
      // Nếu không tìm thấy, cung cấp polyfill
      return {
        jsx: (type, props) => ({ type, props }),
        jsxs: (type, props) => ({ type, props }),
        Fragment: Symbol.for('react.fragment')
      };
    }
  }
  
  // Sử dụng require gốc cho các module khác
  return originalRequire.apply(this, arguments);
};

console.log('JSX Runtime loader đã được cài đặt');

// Export noop để module.require.resolve hoạt động đúng
module.exports = {}; 