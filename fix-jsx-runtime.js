// File này giúp patching React/JSX runtime cho các thư viện như next-auth
// với Next.js 15
const React = require('react');

if (!global.React) {
  global.React = React;
}

// Thử load JSX runtime từ React
try {
  const runtime = require('react/jsx-runtime');
  
  if (!global.runtime) {
    global.runtime = runtime;
  }
  
  // Đảm bảo module là khả dụng khi next-auth tìm kiếm
  module.exports = runtime;
} catch (e) {
  console.warn('Không thể load react/jsx-runtime, sử dụng polyfill');
  const runtimePolyfill = {
    jsx: (type, props) => ({ type, props }),
    jsxs: (type, props) => ({ type, props }),
    Fragment: Symbol.for('react.fragment')
  };
  
  global.runtime = runtimePolyfill;
  module.exports = runtimePolyfill;
}