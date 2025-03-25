
// Combined loader cho cả React JSX Runtime và React DOM Client
console.log('Đang cung cấp polyfill cho Next.js 15');

// Nạp polyfill cho cả hai module
const originalRequire = module.constructor.prototype.require;

module.constructor.prototype.require = function patchedRequire(path) {
  // Xử lý react/jsx-runtime
  if (path === 'react/jsx-runtime') {
    console.log('Polyfill được sử dụng cho: react/jsx-runtime');
    return {
      jsx: function jsx(type, props) { return { type: type, props: props }; },
      jsxs: function jsxs(type, props) { return { type: type, props: props }; },
      Fragment: Symbol.for('react.fragment')
    };
  }
  
  // Xử lý react-dom/client
  if (path === 'react-dom/client') {
    console.log('Polyfill được sử dụng cho: react-dom/client');
    return {
      createRoot: function(container) {
        console.log('Polyfill createRoot được gọi');
        try {
          const ReactDOM = require('react-dom');
          return {
            render: function(element) {
              console.log('Polyfill render gọi ReactDOM.render');
              ReactDOM.render(element, container);
            },
            unmount: function() {
              console.log('Polyfill unmount gọi ReactDOM.unmountComponentAtNode');
              ReactDOM.unmountComponentAtNode(container);
            }
          };
        } catch (e) {
          console.error('Lỗi polyfill client:', e);
          return { 
            render: function() {},
            unmount: function() {}
          };
        }
      },
      hydrateRoot: function(container, element) {
        console.log('Polyfill hydrateRoot được gọi');
        try {
          const ReactDOM = require('react-dom');
          ReactDOM.hydrate(element, container);
        } catch (e) {
          console.error('Lỗi polyfill hydrate:', e);
        }
        return { unmount: function() {} };
      }
    };
  }
  
  // Chuyển các module khác đến require gốc
  return originalRequire.apply(this, arguments);
};

module.exports = {};
