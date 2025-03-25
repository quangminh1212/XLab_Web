// Polyfill cho react-dom/client
console.log('Cung cấp polyfill cho react-dom/client');

// Tạo polyfill cho createRoot
const createRoot = function(container) {
  console.log('Polyfill createRoot được gọi');
  return {
    render: function(element) {
      console.log('Polyfill render được gọi');
      // Cố gắng sử dụng ReactDOM.render cũ nếu có thể
      try {
        const ReactDOM = require('react-dom');
        if (typeof ReactDOM.render === 'function') {
          ReactDOM.render(element, container);
        }
      } catch (e) {
        console.error('Không thể sử dụng ReactDOM.render:', e);
      }
    },
    unmount: function() {
      console.log('Polyfill unmount được gọi');
      try {
        const ReactDOM = require('react-dom');
        if (typeof ReactDOM.unmountComponentAtNode === 'function') {
          ReactDOM.unmountComponentAtNode(container);
        }
      } catch (e) {
        console.error('Không thể sử dụng ReactDOM.unmountComponentAtNode:', e);
      }
    }
  };
};

// Tạo polyfill cho hydrateRoot
const hydrateRoot = function(container, element) {
  console.log('Polyfill hydrateRoot được gọi');
  try {
    const ReactDOM = require('react-dom');
    if (typeof ReactDOM.hydrate === 'function') {
      ReactDOM.hydrate(element, container);
    }
  } catch (e) {
    console.error('Không thể sử dụng ReactDOM.hydrate:', e);
  }
  
  return {
    unmount: function() {
      console.log('Polyfill hydrate unmount được gọi');
      try {
        const ReactDOM = require('react-dom');
        if (typeof ReactDOM.unmountComponentAtNode === 'function') {
          ReactDOM.unmountComponentAtNode(container);
        }
      } catch (e) {
        console.error('Không thể sử dụng ReactDOM.unmountComponentAtNode:', e);
      }
    }
  };
};

module.exports = {
  createRoot,
  hydrateRoot
}; 