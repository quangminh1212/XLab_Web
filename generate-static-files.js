/**
 * Script tạo các file tĩnh cần thiết cho Next.js
 * Chạy script này để giải quyết các lỗi 404 khi tải tài nguyên tĩnh
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Bắt đầu tạo các file static cho Next.js...');

// Đảm bảo thư mục tồn tại
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Đã tạo thư mục: ${dir}`);
  }
}

// Tạo tất cả các thư mục static cần thiết
function createStaticDirectories() {
  const directories = [
    '.next/static',
    '.next/static/css',
    '.next/static/css/app',
    '.next/static/app',
    '.next/static/app/admin',
    '.next/static/app/admin/products',
    '.next/static/app/admin/users',
    '.next/static/app/admin/orders',
    '.next/static/app/admin/settings',
    '.next/static/chunks',
    '.next/static/webpack',
    '.next/server',
    '.next/server/app',
    '.next/server/chunks',
    '.next/server/vendor-chunks',
    '.next/server/pages',
  ];

  directories.forEach(dir => {
    ensureDirectoryExists(path.join(process.cwd(), dir));
  });

  console.log('✅ Đã tạo tất cả các thư mục static');
}

// Tạo các file static cơ bản
function createBasicStaticFiles() {
  const staticFiles = [
    // CSS files
    { path: '.next/static/css/empty.css', content: '/* Empty CSS file */' },
    { path: '.next/static/css/app/layout.css', content: '/* Empty CSS file */' },
    
    // App JS files
    { path: '.next/static/app/page.js', content: '/* Empty page JS file */' },
    { path: '.next/static/app/layout.js', content: '/* Empty layout JS file */' },
    { path: '.next/static/app/not-found.js', content: '/* Empty not found JS file */' },
    { path: '.next/static/app/loading.js', content: '/* Empty loading JS file */' },
    { path: '.next/static/app/empty.js', content: '/* Empty generic JS file */' },
    
    // Admin JS files
    { path: '.next/static/app/admin/page.js', content: '/* Empty admin page JS file */' },
    { path: '.next/static/app/admin/layout.js', content: '/* Empty admin layout JS file */' },
    
    // Special JS files
    { path: '.next/static/main-app.js', content: '/* Empty main-app JS file */' },
    { path: '.next/static/app-pages-internals.js', content: '/* Empty app-pages-internals JS file */' },
    
    // Chunk files
    { path: '.next/static/chunks/empty.js', content: '/* Empty chunk JS file */' },
    { path: '.next/static/chunks/_app-pages-browser_node_modules_next_dist_client_dev_noop-turbopack-hmr_js.js', content: '/* Empty turbopack file */' },
    
    // Webpack files
    { path: '.next/static/webpack/empty-hot-update.json', content: '{}' },
    
    // Server files
    { path: '.next/server/app-paths-manifest.json', content: '{}' },
    { path: '.next/server/server-reference-manifest.json', content: '{}' },
    { path: '.next/server/vendor-chunks/next.js', content: 'module.exports = require("next");' },
    { path: '.next/server/vendor-chunks/tailwind-merge.js', content: 'module.exports = require("tailwind-merge");' },
  ];

  staticFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file.path);
    ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, file.content);
    console.log(`📄 Đã tạo file: ${file.path}`);
  });

  console.log('✅ Đã tạo tất cả các file static cơ bản');
}

// Tạo các file với hash để xử lý các request với hash
function createHashedFiles() {
  const timestamp = Date.now();
  const hexTimestamp = timestamp.toString(16);
  
  // Tạo các file fake với hash để đảm bảo rewrites hoạt động
  const hashedFiles = [
    { path: `.next/static/app/page.${hexTimestamp}.js`, content: '/* Hashed page JS file */' },
    { path: `.next/static/app/layout.${hexTimestamp}.js`, content: '/* Hashed layout JS file */' },
    { path: `.next/static/app/not-found.${hexTimestamp}.js`, content: '/* Hashed not found JS file */' },
    { path: `.next/static/app/loading.${hexTimestamp}.js`, content: '/* Hashed loading JS file */' },
    { path: `.next/static/app/admin/page.${hexTimestamp}.js`, content: '/* Hashed admin page JS file */' },
    { path: `.next/static/app/admin/layout.${hexTimestamp}.js`, content: '/* Hashed admin layout JS file */' },
    { path: `.next/static/main-app.${hexTimestamp}.js`, content: '/* Hashed main-app JS file */' },
    { path: `.next/static/app-pages-internals.${hexTimestamp}.js`, content: '/* Hashed app-pages-internals JS file */' },
    { path: `.next/static/webpack/${hexTimestamp}.hot-update.json`, content: '{}' },
  ];

  hashedFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file.path);
    ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, file.content);
    console.log(`📄 Đã tạo file với hash: ${file.path}`);
  });

  // Tạo thêm file layout CSS với query param
  const layoutCssWithParam = path.join(process.cwd(), `.next/static/css/app/layout.css?v=${timestamp}`);
  // Không thể tạo file với ký tự ? nên chỉ log ra
  console.log(`⚠️ File CSS với query param sẽ được xử lý qua rewrites: .next/static/css/app/layout.css?v=${timestamp}`);

  console.log('✅ Đã tạo tất cả các file với hash');
}

// Cập nhật server-info.json
function updateServerInfo() {
  const serverInfoPath = path.join(process.cwd(), '.next/server/server-info.json');
  const buildId = 'build-id-' + Date.now();
  
  const serverInfo = {
    version: '15.2.4',
    requiresSSL: false,
    buildId: buildId,
    env: [],
    staticFiles: {
      '/favicon.ico': {
        type: 'static',
        etag: '"favicon-etag"'
      }
    },
    rsc: {
      header: 'RSC',
      contentTypeHeader: 'text/x-component',
      prefetchHeader: 'prefetch',
      enableAtPrefetch: true,
      metadataHeader: 'Next-Metadata',
      encodingHeader: 'Next-RSC-Encoding',
      suffixHeader: 'Next-RSC-Suffix'
    }
  };

  ensureDirectoryExists(path.dirname(serverInfoPath));
  fs.writeFileSync(serverInfoPath, JSON.stringify(serverInfo, null, 2));
  console.log(`📄 Đã cập nhật server-info.json với buildId: ${buildId}`);
}

// Xóa file trace để tránh lỗi
function removeTraceFile() {
  try {
    const traceFilePath = path.join(process.cwd(), '.next/trace');
    if (fs.existsSync(traceFilePath)) {
      fs.unlinkSync(traceFilePath);
      console.log('🗑️ Đã xóa file trace');
    }
  } catch (error) {
    console.log('⚠️ Không thể xóa file trace:', error.message);
    
    // Thử lại với PowerShell nếu đang chạy trên Windows
    try {
      execSync('powershell -Command "Remove-Item -Path .next\\trace -Force -ErrorAction SilentlyContinue"', {
        stdio: 'inherit'
      });
      console.log('🗑️ Đã xóa file trace bằng PowerShell');
    } catch (psError) {
      console.log('⚠️ Cũng không thể xóa file trace bằng PowerShell');
    }
  }
}

// Tạo file .traceignore để tránh lỗi trace
function createTraceIgnore() {
  const traceIgnorePath = path.join(process.cwd(), '.traceignore');
  const content = `
# Ignore patterns for Next.js trace
.next/**
node_modules/**
public/**
  `;
  
  fs.writeFileSync(traceIgnorePath, content.trim());
  console.log('📄 Đã tạo file .traceignore');
}

// Chạy tất cả các hàm
async function main() {
  try {
    // Xóa file trace trước tiên
    removeTraceFile();
    
    // Tạo file .traceignore
    createTraceIgnore();
    
    // Tạo các thư mục
    createStaticDirectories();
    
    // Tạo các file static cơ bản
    createBasicStaticFiles();
    
    // Tạo các file với hash
    createHashedFiles();
    
    // Cập nhật server-info.json
    updateServerInfo();
    
    console.log('✅ Đã hoàn thành việc tạo các file static cho Next.js');
    console.log('🚀 Bây giờ bạn có thể chạy "npm run dev" hoặc "run.bat" để khởi động server');
  } catch (error) {
    console.error('❌ Có lỗi xảy ra:', error);
  }
}

// Chạy chương trình
main(); 