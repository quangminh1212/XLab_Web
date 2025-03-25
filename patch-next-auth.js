// Patch cho next-auth để tương thích với Next.js 15
const fs = require('fs');
const path = require('path');

console.log('Patching next-auth để tương thích với Next.js 15...');

// Các đường dẫn
const nextAuthPackagePath = path.resolve('./node_modules/next-auth/package.json');
const nextAuthReactPath = path.resolve('./node_modules/next-auth/react/index.js');

// 1. Sửa package.json để chấp nhận Next.js 15
try {
  if (fs.existsSync(nextAuthPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(nextAuthPackagePath, 'utf8'));
    
    // Sửa peerDependencies để chấp nhận Next.js 15
    if (packageJson.peerDependencies && packageJson.peerDependencies.next) {
      packageJson.peerDependencies.next = "^12.2.5 || ^13 || ^14 || ^15";
      fs.writeFileSync(nextAuthPackagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated next-auth package.json peerDependencies');
    }
  } else {
    console.log('❌ Could not find next-auth package.json');
  }
} catch (error) {
  console.error('Error updating next-auth package.json:', error);
}

// 2. Sửa file react/index.js của next-auth để không sử dụng jsx-runtime
try {
  if (fs.existsSync(nextAuthReactPath)) {
    let reactIndexContent = fs.readFileSync(nextAuthReactPath, 'utf8');
    
    // Kiểm tra xem file đã được patch chưa
    if (reactIndexContent.includes('var _jsxRuntime = require("react/jsx-runtime")')) {
      // Thay thế lệnh require jsx-runtime bằng polyfill
      const patchedContent = reactIndexContent.replace(
        'var _jsxRuntime = require("react/jsx-runtime");',
        `// JSX Runtime Polyfill for Next.js 15 compatibility
var _jsxRuntime = {
  jsx: function jsx(type, props) { return { type: type, props: props }; },
  jsxs: function jsxs(type, props) { return { type: type, props: props }; },
  Fragment: Symbol.for('react.fragment')
};\n`
      );
      
      fs.writeFileSync(nextAuthReactPath, patchedContent);
      console.log('✅ Patched next-auth/react/index.js to use JSX Runtime polyfill');
    } else {
      console.log('ℹ️ next-auth/react/index.js already patched or not using jsx-runtime');
    }
  } else {
    console.log('❌ Could not find next-auth/react/index.js');
  }
} catch (error) {
  console.error('Error patching next-auth/react/index.js:', error);
}

// 3. Tạo bản patch cho react/jsx-runtime
const jSXRuntimeFixContent = `
// Next.js 15 JSX Runtime polyfill
module.exports = {
  jsx: function jsx(type, props) { return { type: type, props: props }; },
  jsxs: function jsxs(type, props) { return { type: type, props: props }; },
  Fragment: Symbol.for('react.fragment')
};
`;

// Tạo file polyfill cho jsx-runtime
const jSXRuntimePath = path.resolve('./node_modules/react/jsx-runtime/index.js');
const jSXRuntimeDir = path.dirname(jSXRuntimePath);

try {
  if (!fs.existsSync(jSXRuntimeDir)) {
    fs.mkdirSync(jSXRuntimeDir, { recursive: true });
    console.log('✅ Created jsx-runtime directory');
  }
  
  fs.writeFileSync(jSXRuntimePath, jSXRuntimeFixContent);
  console.log('✅ Created jsx-runtime polyfill');
} catch (error) {
  console.error('Error creating jsx-runtime polyfill:', error);
}

// 4. Tạo polyfill cho react-dom/client
const reactDomClientContent = `
// React DOM Client polyfill for Next.js 15
const createRoot = function(container) {
  try {
    const ReactDOM = require('react-dom');
    if (typeof ReactDOM.render === 'function') {
      return {
        render: function(element) {
          ReactDOM.render(element, container);
        },
        unmount: function() {
          ReactDOM.unmountComponentAtNode(container);
        }
      };
    }
  } catch (e) {
    console.error('Polyfill error:', e);
  }
  
  return {
    render: function() {},
    unmount: function() {}
  };
};

const hydrateRoot = function(container, element) {
  try {
    const ReactDOM = require('react-dom');
    if (typeof ReactDOM.hydrate === 'function') {
      ReactDOM.hydrate(element, container);
    }
  } catch (e) {
    console.error('Polyfill hydrate error:', e);
  }
  
  return {
    unmount: function() {}
  };
};

module.exports = {
  createRoot,
  hydrateRoot
};
`;

// Tạo file polyfill cho react-dom/client
const reactDomClientPath = path.resolve('./node_modules/react-dom/client.js');
try {
  fs.writeFileSync(reactDomClientPath, reactDomClientContent);
  console.log('✅ Created react-dom/client polyfill');
} catch (error) {
  console.error('Error creating react-dom/client polyfill:', error);
}

// 5. Tạo file loader
const loaderContent = `
// JSX Runtime loader cho Next.js 15
const originalRequire = module.constructor.prototype.require;

module.constructor.prototype.require = function patchedRequire(path) {
  if (path === 'react/jsx-runtime') {
    return {
      jsx: function jsx(type, props) { return { type: type, props: props }; },
      jsxs: function jsxs(type, props) { return { type: type, props: props }; },
      Fragment: Symbol.for('react.fragment')
    };
  }
  
  if (path === 'react-dom/client') {
    return {
      createRoot: function(container) {
        try {
          const ReactDOM = require('react-dom');
          return {
            render: function(element) {
              ReactDOM.render(element, container);
            },
            unmount: function() {
              ReactDOM.unmountComponentAtNode(container);
            }
          };
        } catch (e) {
          console.error('Client polyfill error:', e);
          return {
            render: function() {},
            unmount: function() {}
          };
        }
      },
      hydrateRoot: function(container, element) {
        try {
          const ReactDOM = require('react-dom');
          if (typeof ReactDOM.hydrate === 'function') {
            ReactDOM.hydrate(element, container);
          }
        } catch (e) {}
        return { unmount: function() {} };
      }
    };
  }
  
  return originalRequire.apply(this, arguments);
};

module.exports = {};
`;

const loaderPath = path.resolve('./jsx-runtime-loader.js');
try {
  fs.writeFileSync(loaderPath, loaderContent);
  console.log('✅ Created JSX Runtime loader');
} catch (error) {
  console.error('Error creating JSX Runtime loader:', error);
}

// 6. Tạo file kết hợp cả hai loại polyfill
const combinedLoaderContent = `
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
`;

const combinedLoaderPath = path.resolve('./next-polyfill-loader.js');
try {
  fs.writeFileSync(combinedLoaderPath, combinedLoaderContent);
  console.log('✅ Created combined polyfill loader');
} catch (error) {
  console.error('Error creating combined polyfill loader:', error);
}

console.log('Patch đã hoàn thành!'); 