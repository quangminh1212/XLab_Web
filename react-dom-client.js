// react-dom/client polyfill cho Next.js 13
console.log('[Polyfill] react-dom/client được sử dụng');

const ReactDOM = require('react-dom');

// Tạo phiên bản giả lập của createRoot API
function createRoot(container) {
  console.log('[Polyfill] createRoot được gọi với container:', container?.nodeName || 'unknown');
  
  return {
    render(element) {
      console.log('[Polyfill] render được gọi với element:', 
        element?.type?.name || element?.type || 'unknown component');
      try {
        ReactDOM.render(element, container);
      } catch (error) {
        console.error('[Polyfill] Lỗi khi render:', error);
      }
    },
    unmount() {
      console.log('[Polyfill] unmount được gọi');
      try {
        ReactDOM.unmountComponentAtNode(container);
      } catch (error) {
        console.error('[Polyfill] Lỗi khi unmount:', error);
      }
    }
  };
}

// Tạo phiên bản giả lập của hydrateRoot API
function hydrateRoot(container, element) {
  console.log('[Polyfill] hydrateRoot được gọi với container:', container?.nodeName || 'unknown');
  
  try {
    ReactDOM.hydrate(element, container);
  } catch (error) {
    console.error('[Polyfill] Lỗi khi hydrate:', error);
    // Fallback to normal render if hydrate fails
    console.log('[Polyfill] Thử fallback sang render thông thường');
    try {
      ReactDOM.render(element, container);
    } catch (renderError) {
      console.error('[Polyfill] Lỗi khi fallback render:', renderError);
    }
  }
  
  return {
    unmount() {
      console.log('[Polyfill] unmount sau hydrateRoot được gọi');
      try {
        ReactDOM.unmountComponentAtNode(container);
      } catch (error) {
        console.error('[Polyfill] Lỗi khi unmount sau hydrate:', error);
      }
    }
  };
}

module.exports = {
  createRoot,
  hydrateRoot
}; 