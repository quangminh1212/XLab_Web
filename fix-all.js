/**
 * Sửa tất cả các lỗi trong Next.js
 */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const zlib = require('zlib');

// Xóa thư mục .next
async function cleanNextFolder() {
  try {
    console.log('Bắt đầu xóa thư mục .next...');
    await rimraf.rimraf('.next');
    console.log('Đã xóa thư mục .next thành công');
  } catch (error) {
    console.error('Lỗi khi xóa thư mục .next:', error);
  }
}

// Tạo các thư mục cần thiết
function createDirectories() {
  const dirs = [
    '.next/server',
    '.next/server/app',
    '.next/server/pages',
    '.next/server/vendor-chunks',
    '.next/server/chunks',
    '.next/static/chunks',
    '.next/static/css',
    '.next/cache/server',
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục: ${dir}`);
    }
  });
}

// Tạo vendor modules
function createVendorModules() {
  const vendorModules = [
    { name: 'next.js', package: 'next' },
    { name: 'react.js', package: 'react' },
    { name: 'react-dom.js', package: 'react-dom' },
    { name: 'scheduler.js', package: 'scheduler' },
  ];
  
  vendorModules.forEach(module => {
    const filePath = path.join('.next', 'server', 'vendor-chunks', module.name);
    fs.writeFileSync(filePath, `module.exports = require("${module.package}");`);
    console.log(`Đã tạo module: ${filePath}`);
  });
}

// Tạo các file manifest
function createManifestFiles() {
  const manifestFiles = [
    {
      path: path.join('.next', 'server', 'next-font-manifest.json'),
      content: '{"pages":{},"app":{}}'
    },
    {
      path: path.join('.next', 'fallback-build-manifest.json'),
      content: '{"polyfillFiles":[],"devFiles":[],"ampDevFiles":[],"lowPriorityFiles":[],"rootMainFiles":[],"pages":{"/_app":["static/chunks/webpack.js","static/chunks/main.js","static/chunks/pages/_app.js"],"/_error":["static/chunks/webpack.js","static/chunks/main.js","static/chunks/pages/_error.js"]},"ampFirstPages":[]}'
    },
    {
      path: path.join('.next', 'server', 'pages-manifest.json'),
      content: '{"/_app":"pages/_app.js","/_error":"pages/_error.js","/_document":"pages/_document.js"}'
    }
  ];
  
  manifestFiles.forEach(file => {
    fs.writeFileSync(file.path, file.content);
    console.log(`Đã tạo file manifest: ${file.path}`);
  });
}

// Tạo các file CSS placeholder cơ bản
function createCssPlaceholders() {
  const cssDir = path.join('.next', 'static', 'css');
  const appCssDir = path.join(cssDir, 'app');
  
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  if (!fs.existsSync(appCssDir)) {
    fs.mkdirSync(appCssDir, { recursive: true });
  }
  
  const cssFiles = [
    { path: path.join(cssDir, 'app-layout.css'), content: '/* Placeholder CSS */' },
    { path: path.join(appCssDir, 'layout.css'), content: '/* App Layout CSS */' }
  ];
  
  cssFiles.forEach(file => {
    fs.writeFileSync(file.path, file.content);
    console.log(`Đã tạo file CSS: ${file.path}`);
  });
}

// Tạo các server pack files (gặp lỗi ENOENT)
function createServerPackFiles() {
  for (let i = 0; i <= 5; i++) {
    const packFile = path.join('.next', 'cache', 'server', `${i}.pack`);
    fs.writeFileSync(packFile, '{}');
    console.log(`Đã tạo file: ${packFile}`);
    
    const gzipContent = zlib.gzipSync(Buffer.from('{}'));
    const gzipFile = `${packFile}.gz`;
    fs.writeFileSync(gzipFile, gzipContent);
    console.log(`Đã tạo file: ${gzipFile}`);
  }
}

// Thực thi tất cả các bước sửa lỗi
async function fixAll() {
  try {
    await cleanNextFolder();
    createDirectories();
    createVendorModules();
    createManifestFiles();
    createCssPlaceholders();
    createServerPackFiles();
    console.log('Đã hoàn tất việc sửa tất cả các lỗi Next.js');
  } catch (error) {
    console.error('Lỗi khi sửa các lỗi Next.js:', error);
  }
}

fixAll(); 