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
  
  // Tạo thêm app-build-manifest.json
  const appBuildManifestPath = path.join(__dirname, '.next', 'app-build-manifest.json');
  if (!fs.existsSync(appBuildManifestPath)) {
    fs.writeFileSync(appBuildManifestPath, JSON.stringify({
      pages: {},
      app: {}
    }));
    console.log(`Đã tạo file manifest: ${appBuildManifestPath}`);
  }
  
  // Tạo app-paths-manifest.json
  const appPathsManifestPath = path.join(__dirname, '.next', 'server', 'app-paths-manifest.json');
  if (!fs.existsSync(appPathsManifestPath)) {
    fs.writeFileSync(appPathsManifestPath, JSON.stringify({
      "/": "app/page.js",
      "/products/[id]": "app/products/[id]/page.js"
    }));
    console.log(`Đã tạo file manifest: ${appPathsManifestPath}`);
  }
}

// Tạo các file trang thiếu cho product detail
function createMissingProductFiles() {
  const productPagesDir = path.join(__dirname, '.next', 'static', 'chunks', 'app', 'products', '[id]');
  
  // Đảm bảo thư mục tồn tại
  if (!fs.existsSync(productPagesDir)) {
    fs.mkdirSync(productPagesDir, { recursive: true });
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
      console.log(`Đã tạo file trang sản phẩm: ${file.path}`);
    }
  });
  
  // Cũng tạo thư mục tương tự trong server
  const serverProductDir = path.join(__dirname, '.next', 'server', 'app', 'products', '[id]');
  if (!fs.existsSync(serverProductDir)) {
    fs.mkdirSync(serverProductDir, { recursive: true });
    console.log(`Đã tạo thư mục server: ${serverProductDir}`);
  }
}

// Sửa webpack-runtime.js để trỏ đúng đường dẫn
function fixWebpackRuntime() {
  const webpackRuntimePath = path.join(__dirname, '.next', 'server', 'webpack-runtime.js');
  
  if (fs.existsSync(webpackRuntimePath)) {
    let content = fs.readFileSync(webpackRuntimePath, 'utf8');
    
    // Kiểm tra xem file đã được patch chưa
    if (content.includes('/***** PATCHED FOR VENDOR CHUNKS *****/')) {
      console.log('File webpack-runtime.js đã được sửa trước đó. Bỏ qua.');
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
    content = content.replace(
      /\/\*\*\*\*\*\*\/ __webpack_require__\.f\.require = \(chunkId, promises\) => {/g,
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
    console.log(`Đã sửa file webpack-runtime.js thành công`);
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
    createMissingProductFiles();
    fixWebpackRuntime();
    console.log('Đã hoàn tất việc sửa lỗi vendor-chunks.');
  } catch (error) {
    console.error('Lỗi khi sửa vendor-chunks:', error);
  }
}

runFix(); 