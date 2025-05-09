/**
 * Fix lỗi không tìm thấy các module vendor-chunks như next.js
 * Lỗi: Cannot find module './vendor-chunks/next.js'
 */

const fs = require('fs');
const path = require('path');

// Tạo các thư mục cần thiết
function createDirectories() {
  const dirs = [
    path.join(__dirname, '.next', 'server', 'chunks'),
    path.join(__dirname, '.next', 'server', 'vendor-chunks'),
    path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục: ${dir}`);
    }
  });
}

// Tạo các file vendor cần thiết
function createVendorFiles() {
  const vendorFiles = [
    {
      path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'next.js'),
      content: 'module.exports = require("next");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'next.js'),
      content: 'module.exports = require("next");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'chunks', 'next.js'),
      content: 'module.exports = require("next");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'react.js'),
      content: 'module.exports = require("react");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'react.js'),
      content: 'module.exports = require("react");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'chunks', 'react.js'),
      content: 'module.exports = require("react");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'react-dom.js'),
      content: 'module.exports = require("react-dom");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'react-dom.js'),
      content: 'module.exports = require("react-dom");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'chunks', 'react-dom.js'),
      content: 'module.exports = require("react-dom");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'next-auth.js'),
      content: 'module.exports = require("next-auth");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'next-auth.js'),
      content: 'module.exports = require("next-auth");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'chunks', 'next-auth.js'),
      content: 'module.exports = require("next-auth");'
    },
    // Thêm các module thường sử dụng khác
    {
      path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'scheduler.js'),
      content: 'module.exports = require("scheduler");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'scheduler.js'),
      content: 'module.exports = require("scheduler");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'chunks', 'scheduler.js'),
      content: 'module.exports = require("scheduler");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'use-sync-external-store.js'),
      content: 'module.exports = require("use-sync-external-store");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'use-sync-external-store.js'),
      content: 'module.exports = require("use-sync-external-store");'
    },
    {
      path: path.join(__dirname, '.next', 'server', 'chunks', 'use-sync-external-store.js'),
      content: 'module.exports = require("use-sync-external-store");'
    }
  ];

  vendorFiles.forEach(file => {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(file.path, file.content);
    console.log(`Đã tạo file vendor: ${file.path}`);
  });
}

// Tạo hoặc sửa các file manifest cần thiết
function createManifestFiles() {
  // next-font-manifest.json
  const fontManifestPath = path.join(__dirname, '.next', 'server', 'next-font-manifest.json');
  if (!fs.existsSync(fontManifestPath)) {
    fs.writeFileSync(fontManifestPath, JSON.stringify({
      pages: {},
      app: {}
    }));
    console.log(`Đã tạo file manifest: ${fontManifestPath}`);
  }
}

// Sửa webpack-runtime.js để trỏ đúng đường dẫn
function fixWebpackRuntime() {
  const webpackRuntimePath = path.join(__dirname, '.next', 'server', 'webpack-runtime.js');
  
  if (fs.existsSync(webpackRuntimePath)) {
    let content = fs.readFileSync(webpackRuntimePath, 'utf8');
    
    // Sửa các đường dẫn trong file webpack-runtime.js
    content = content.replace(
      /\/\*\*\*\*\*\*\/ __webpack_require__\.f\.require = \(chunkId, promises\) => {/g,
      `/***** PATCHED FOR VENDOR CHUNKS *****/
      // Fix lỗi không tìm thấy vendor-chunks
      var vendorChunks = {
        'next': require('./vendor-chunks/next.js'),
        'react': require('./vendor-chunks/react.js'),
        'react-dom': require('./vendor-chunks/react-dom.js'),
        'next-auth': require('./vendor-chunks/next-auth.js'),
        'scheduler': require('./vendor-chunks/scheduler.js'),
        'use-sync-external-store': require('./vendor-chunks/use-sync-external-store.js')
      };
      
      /******/ __webpack_require__.f.require = (chunkId, promises) => {
        // Đối với vendor chunks, sử dụng các file đã tạo sẵn
        if (chunkId.startsWith('./vendor-chunks/')) {
          const moduleName = chunkId.replace('./vendor-chunks/', '').replace('.js', '');
          if (vendorChunks[moduleName]) {
            return vendorChunks[moduleName];
          }
        }
      `
    );
    
    fs.writeFileSync(webpackRuntimePath, content);
    console.log(`Đã sửa file webpack-runtime.js`);
  } else {
    console.log(`Không tìm thấy file webpack-runtime.js để sửa`);
  }
}

// Thực hiện các bước sửa lỗi
function runFix() {
  try {
    createDirectories();
    createVendorFiles();
    createManifestFiles();
    fixWebpackRuntime();
    console.log('Đã hoàn tất việc sửa lỗi vendor-chunks.');
  } catch (error) {
    console.error('Lỗi khi sửa vendor-chunks:', error);
  }
}

runFix(); 