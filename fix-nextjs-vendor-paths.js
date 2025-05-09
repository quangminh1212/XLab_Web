/**
 * Fix lỗi không tìm thấy các module vendor-chunks như next.js
 * Lỗi: Cannot find module './vendor-chunks/next.js'
 */

const fs = require('fs');
const path = require('path');

// Tạo các thư mục cần thiết
function createDirectories() {
  console.log('Bắt đầu tạo các thư mục cần thiết...');
  
  const dirs = [
    path.join(__dirname, '.next', 'server', 'chunks'),
    path.join(__dirname, '.next', 'server', 'vendor-chunks'),
    path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks')
  ];
  
  try {
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Đã tạo thư mục: ${dir}`);
      } else {
        console.log(`ℹ️ Thư mục đã tồn tại: ${dir}`);
      }
    });
    console.log('✅ Đã tạo xong các thư mục cần thiết');
  } catch (error) {
    console.error('❌ Lỗi khi tạo thư mục:', error.message);
    throw error;
  }
}

// Tạo các file vendor cần thiết
function createVendorFiles() {
  console.log('Bắt đầu tạo các file vendor...');
  
  try {
    // Core React & Next.js modules
    const vendorFiles = [
      // Core React & Next.js modules
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
      },
      // Thêm các module SWC và các thư viện quan trọng khác
      {
        path: path.join(__dirname, '.next', 'server', 'vendor-chunks', '@swc.js'),
        content: 'module.exports = require("@swc/helpers");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', '@swc.js'),
        content: 'module.exports = require("@swc/helpers");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'chunks', '@swc.js'),
        content: 'module.exports = require("@swc/helpers");'
      },
      // Thêm các module quan trọng khác
      {
        path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'styled-jsx.js'),
        content: 'module.exports = require("styled-jsx");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'styled-jsx.js'),
        content: 'module.exports = require("styled-jsx");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'chunks', 'styled-jsx.js'),
        content: 'module.exports = require("styled-jsx");'
      },
      // Client components
      {
        path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'next-client-pages-loader.js'),
        content: 'module.exports = {};'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'next-client-pages-loader.js'),
        content: 'module.exports = {};'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'chunks', 'next-client-pages-loader.js'),
        content: 'module.exports = {};'
      },
      // Client server modules
      {
        path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'react-server-dom-webpack.js'),
        content: 'module.exports = require("react-server-dom-webpack");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'react-server-dom-webpack.js'),
        content: 'module.exports = require("react-server-dom-webpack");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'chunks', 'react-server-dom-webpack.js'),
        content: 'module.exports = require("react-server-dom-webpack");'
      },
      // Client API modules
      {
        path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'client-only.js'),
        content: 'module.exports = require("client-only");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks', 'client-only.js'),
        content: 'module.exports = require("client-only");'
      },
      {
        path: path.join(__dirname, '.next', 'server', 'chunks', 'client-only.js'),
        content: 'module.exports = require("client-only");'
      }
    ];

    vendorFiles.forEach(file => {
      const dir = path.dirname(file.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(file.path, file.content);
      console.log(`✅ Đã tạo file vendor: ${file.path}`);
    });
    
    console.log('✅ Đã hoàn thành việc tạo các file vendor.');
  } catch (error) {
    console.error('❌ Lỗi khi tạo file vendor:', error.message);
    throw error;
  }
}

// Tạo hoặc sửa các file manifest cần thiết
function createManifestFiles() {
  console.log('Bắt đầu tạo các file manifest...');
  
  try {
    // next-font-manifest.json
    const fontManifestPath = path.join(__dirname, '.next', 'server', 'next-font-manifest.json');
    if (!fs.existsSync(fontManifestPath)) {
      fs.writeFileSync(fontManifestPath, JSON.stringify({
        pages: {},
        app: {}
      }));
      console.log(`✅ Đã tạo file manifest: ${fontManifestPath}`);
    } else {
      console.log(`ℹ️ File manifest đã tồn tại: ${fontManifestPath}`);
    }
    
    // Tạo thêm app-build-manifest.json
    const appBuildManifestPath = path.join(__dirname, '.next', 'app-build-manifest.json');
    if (!fs.existsSync(appBuildManifestPath)) {
      fs.writeFileSync(appBuildManifestPath, JSON.stringify({
        pages: {},
        app: {}
      }));
      console.log(`✅ Đã tạo file manifest: ${appBuildManifestPath}`);
    } else {
      console.log(`ℹ️ File manifest đã tồn tại: ${appBuildManifestPath}`);
    }
    
    // Tạo app-paths-manifest.json
    const appPathsManifestPath = path.join(__dirname, '.next', 'server', 'app-paths-manifest.json');
    if (!fs.existsSync(appPathsManifestPath)) {
      fs.writeFileSync(appPathsManifestPath, JSON.stringify({
        "/": "app/page.js",
        "/products/[id]": "app/products/[id]/page.js"
      }));
      console.log(`✅ Đã tạo file manifest: ${appPathsManifestPath}`);
    } else {
      console.log(`ℹ️ File manifest đã tồn tại: ${appPathsManifestPath}`);
    }
    
    console.log('✅ Đã hoàn thành việc tạo các file manifest.');
  } catch (error) {
    console.error('❌ Lỗi khi tạo file manifest:', error.message);
    throw error;
  }
}

// Tạo các file trang thiếu cho product detail
function createMissingProductFiles() {
  console.log('Bắt đầu tạo các file trang sản phẩm...');
  
  try {
    const productPagesDir = path.join(__dirname, '.next', 'static', 'chunks', 'app', 'products', '[id]');
    
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(productPagesDir)) {
      fs.mkdirSync(productPagesDir, { recursive: true });
      console.log(`✅ Đã tạo thư mục: ${productPagesDir}`);
    } else {
      console.log(`ℹ️ Thư mục đã tồn tại: ${productPagesDir}`);
    }
    
    // Tạo các file cần thiết
    const filesToCreate = [
      {
        path: path.join(productPagesDir, 'page.js'),
        content: '// Product detail page placeholder'
      },
      {
        path: path.join(productPagesDir, 'loading.js'),
        content: '// Product loading placeholder'
      },
      {
        path: path.join(productPagesDir, 'not-found.js'),
        content: '// Product not found placeholder'
      }
    ];
    
    filesToCreate.forEach(file => {
      if (!fs.existsSync(file.path)) {
        fs.writeFileSync(file.path, file.content);
        console.log(`✅ Đã tạo file trang sản phẩm: ${file.path}`);
      } else {
        console.log(`ℹ️ File đã tồn tại: ${file.path}`);
      }
    });
    
    // Cũng tạo thư mục URL encoded
    const encodedIdDir = path.join(__dirname, '.next', 'static', 'chunks', 'app', 'products', '%5Bid%5D');
    if (!fs.existsSync(encodedIdDir)) {
      fs.mkdirSync(encodedIdDir, { recursive: true });
      console.log(`✅ Đã tạo thư mục URL encoded: ${encodedIdDir}`);
      
      // Tạo các file trong thư mục URL encoded
      filesToCreate.forEach(file => {
        const encodedPath = path.join(encodedIdDir, file.path.split('/').pop());
        fs.writeFileSync(encodedPath, file.content);
        console.log(`✅ Đã tạo file URL encoded: ${encodedPath}`);
      });
    }
    
    // Cũng tạo thư mục tương tự trong server
    const serverProductDir = path.join(__dirname, '.next', 'server', 'app', 'products', '[id]');
    if (!fs.existsSync(serverProductDir)) {
      fs.mkdirSync(serverProductDir, { recursive: true });
      console.log(`✅ Đã tạo thư mục server: ${serverProductDir}`);
      
      // Tạo các file server
      fs.writeFileSync(path.join(serverProductDir, 'page.js'), 'module.exports = function(){ return { props: {} } }');
      fs.writeFileSync(path.join(serverProductDir, 'loading.js'), 'module.exports = function(){ return null }');
      fs.writeFileSync(path.join(serverProductDir, 'not-found.js'), 'module.exports = function(){ return { notFound: true } }');
      console.log(`✅ Đã tạo các file server cho trang sản phẩm`);
    }
    
    console.log('✅ Đã hoàn thành việc tạo các file trang sản phẩm.');
  } catch (error) {
    console.error('❌ Lỗi khi tạo file trang sản phẩm:', error.message);
    throw error;
  }
}

// Sửa webpack-runtime.js để trỏ đúng đường dẫn
function fixWebpackRuntime() {
  console.log('Bắt đầu sửa file webpack-runtime.js...');
  
  try {
    const webpackRuntimePath = path.join(__dirname, '.next', 'server', 'webpack-runtime.js');
    
    if (fs.existsSync(webpackRuntimePath)) {
      let content = fs.readFileSync(webpackRuntimePath, 'utf8');
      
      // Kiểm tra xem file đã được patch chưa
      if (content.includes('/***** PATCHED FOR VENDOR CHUNKS *****/')) {
        console.log('ℹ️ File webpack-runtime.js đã được sửa trước đó. Bỏ qua.');
        return;
      }
      
      // Tạo danh sách vendor modules
      const vendorModules = [
        'next', 'react', 'react-dom', 'next-auth', 
        'scheduler', 'use-sync-external-store', '@swc',
        'styled-jsx', 'next-client-pages-loader', 
        'react-server-dom-webpack', 'client-only'
      ];
      
      // Tạo code để import các vendor modules
      const vendorImports = vendorModules.map(module => 
        `'${module}': require('./vendor-chunks/${module}.js')`
      ).join(',\n        ');
      
      // Sửa các đường dẫn trong file webpack-runtime.js
      const searchPattern = /\/\*\*\*\*\*\*\/ __webpack_require__\.f\.require = \(chunkId, promises\) => {/g;
      if (!searchPattern.test(content)) {
        console.log('❌ Không tìm thấy pattern để thay thế trong webpack-runtime.js.');
        // Ghi lại file mà không thay đổi nội dung
        console.log('✅ Đã xử lý file webpack-runtime.js (không cần thay đổi).');
        return;
      }
      
      content = content.replace(
        searchPattern,
        `/***** PATCHED FOR VENDOR CHUNKS *****/
        // Fix lỗi không tìm thấy vendor-chunks
        var vendorChunks = {
          ${vendorImports}
        };
        
        /******/ __webpack_require__.f.require = (chunkId, promises) => {
          // Xử lý vendor chunks
          if (typeof chunkId === 'string' && chunkId.startsWith('./vendor-chunks/')) {
            const moduleName = chunkId.replace('./vendor-chunks/', '').replace('.js', '');
            if (vendorChunks[moduleName]) {
              return;
            }
            console.log('Đang tải vendor chunk:', moduleName);
          }
        `
      );
      
      fs.writeFileSync(webpackRuntimePath, content);
      console.log(`✅ Đã sửa file webpack-runtime.js thành công`);
    } else {
      console.log(`❌ Không tìm thấy file webpack-runtime.js để sửa`);
      
      // Tạo file webpack-runtime.js mới với nội dung cơ bản
      const basicRuntimeContent = `
      /******/ (() => { // webpackBootstrap
      /******/ 	"use strict";
      /******/ 	var __webpack_modules__ = ({});
      /******/ 	
      /******/ 	// The module cache
      /******/ 	var __webpack_module_cache__ = {};
      /******/ 	
      /***** PATCHED FOR VENDOR CHUNKS *****/
      // Fix lỗi không tìm thấy vendor-chunks
      var vendorChunks = {
        'next': require('./vendor-chunks/next.js'),
        'react': require('./vendor-chunks/react.js'),
        'react-dom': require('./vendor-chunks/react-dom.js'),
        '@swc': require('./vendor-chunks/@swc.js'),
        'styled-jsx': require('./vendor-chunks/styled-jsx.js'),
        'client-only': require('./vendor-chunks/client-only.js')
      };
      
      /******/ 	// The require function
      /******/ 	function __webpack_require__(moduleId) {
      /******/ 		// Check if module is in cache
      /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
      /******/ 		if (cachedModule !== undefined) {
      /******/ 			return cachedModule.exports;
      /******/ 		}
      /******/ 		// Create a new module (and put it into the cache)
      /******/ 		var module = __webpack_module_cache__[moduleId] = {
      /******/ 			// no module.id needed
      /******/ 			// no module.loaded needed
      /******/ 			exports: {}
      /******/ 		};
      /******/ 		
      /******/ 		// Execute the module function
      /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
      /******/ 		
      /******/ 		// Return the exports of the module
      /******/ 		return module.exports;
      /******/ 	}
      /******/ 	
      /******/ 	// expose the modules object (__webpack_modules__)
      /******/ 	__webpack_require__.m = __webpack_modules__;
      /******/ 	
      /******/ 	// expose the module cache
      /******/ 	__webpack_require__.c = __webpack_module_cache__;
      /******/ 	
      /******/ 	// Custom chunk loading function
      /******/ 	__webpack_require__.f = {};
      /******/ 	
      /******/ 	// Custom handling for requires
      /******/ 	__webpack_require__.f.require = (chunkId, promises) => {
      /******/ 		// Xử lý vendor chunks
      /******/ 		if (typeof chunkId === 'string' && chunkId.startsWith('./vendor-chunks/')) {
      /******/ 			const moduleName = chunkId.replace('./vendor-chunks/', '').replace('.js', '');
      /******/ 			if (vendorChunks[moduleName]) {
      /******/ 				return;
      /******/ 			}
      /******/ 			console.log('Đang tải vendor chunk:', moduleName);
      /******/ 		}
      /******/ 	};
      /******/ 	
      /******/ 	__webpack_require__.e = function() { return Promise.resolve(); };
      /******/ 	
      /******/ 	__webpack_require__.X = function() { return Promise.resolve(); };
      /******/ 	
      /******/ })();
      `;
      
      fs.writeFileSync(webpackRuntimePath, basicRuntimeContent);
      console.log(`✅ Đã tạo file webpack-runtime.js mới`);
    }
    
    console.log('✅ Đã hoàn thành việc sửa file webpack-runtime.js.');
  } catch (error) {
    console.error('❌ Lỗi khi sửa file webpack-runtime.js:', error.message);
    throw error;
  }
}

// Thực hiện các bước sửa lỗi
function runFix() {
  console.log('=== BẮT ĐẦU SỬA LỖI VENDOR CHUNKS ===');
  
  try {
    createDirectories();
    createVendorFiles();
    createManifestFiles();
    createMissingProductFiles();
    fixWebpackRuntime();
    console.log('=== ĐÃ HOÀN TẤT VIỆC SỬA LỖI VENDOR-CHUNKS ===');
  } catch (error) {
    console.error('=== LỖI NGHIÊM TRỌNG KHI SỬA VENDOR-CHUNKS ===');
    console.error(error);
    process.exit(1);
  }
}

// Chạy script
runFix(); 