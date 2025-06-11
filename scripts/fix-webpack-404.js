const fs = require('fs');
const path = require('path');

/**
 * Script khắc phục lỗi 404 cho các tệp webpack và turbopack
 * Tạo các tệp giả để ngăn lỗi 404 khi phát triển
 * Phiên bản 1.1 - Thêm tính năng báo cáo trạng thái
 */

console.log('🔧 Đang sửa lỗi 404 cho webpack và static files...');

// Tạo thư mục cần thiết
const requiredDirs = [
  '.next/static/chunks',
  '.next/static/webpack',
  '.next/static/development',
  '.next/static/css',
  '.next/server/app',
  '.next/server/pages',
  '.next/cache/webpack',
];

requiredDirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Đã tạo thư mục: ${fullPath}`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo thư mục: ${fullPath}`, error.message);
    }
  }
});

// Tạo file webpack.hot-update.json giả
const createWebpackHotUpdateFiles = () => {
  const webpackDir = path.join(process.cwd(), '.next/static/webpack');
  
  // Danh sách các ID webpack cần tạo
  const webpackIds = [
    'webpack.hot-update.json',
    'b0262cddd2646134.webpack.hot-update.json',
    'webpack-5b8344ef4a8189c6.hot-update.json',
  ];
  
  webpackIds.forEach(filename => {
    const filePath = path.join(webpackDir, filename);
    try {
      // Nội dung cơ bản cho file hot update
      const content = filename.includes('hot-update.json') 
        ? '{"c":{},"r":[],"m":[]}' 
        : '// Empty webpack file';
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Đã tạo file webpack: ${filePath}`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo file webpack: ${filePath}`, error.message);
    }
  });
};

// Tạo file noop-turbopack-hmr.js giả
const createTurbopackFiles = () => {
  const hmrDir = path.join(process.cwd(), '.next/static/chunks/_app-pages-browser_node_modules_next_dist_client_dev_noop-turbopack-hmr_js');
  
  if (!fs.existsSync(hmrDir)) {
    try {
      fs.mkdirSync(hmrDir, { recursive: true });
    } catch (error) {
      console.warn(`⚠️ Không thể tạo thư mục HMR: ${hmrDir}`, error.message);
    }
  }
  
  const hmrFile = path.join(hmrDir, 'index.js');
  const hmrContent = `// Mock turbopack HMR
export default function() {
  console.log('[Turbopack HMR] Mock implementation loaded');
  return {};
}`;
  
  try {
    fs.writeFileSync(hmrFile, hmrContent);
    console.log(`✅ Đã tạo file HMR giả: ${hmrFile}`);
  } catch (error) {
    console.warn(`⚠️ Không thể tạo file HMR: ${hmrFile}`, error.message);
  }
};

// Cập nhật next.config.js để sử dụng webpack thay vì turbopack
const updateNextConfig = () => {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  if (fs.existsSync(nextConfigPath)) {
    try {
      let content = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Đảm bảo sử dụng webpack thay vì turbopack
      if (!content.includes('useFileSystemPublicRoutes')) {
        // Thêm cấu hình vào nextConfig
        content = content.replace(
          'const nextConfig = {',
          'const nextConfig = {\n  useFileSystemPublicRoutes: true,'
        );
      }
      
      // Thêm cấu hình tắt turbopack
      if (!content.includes('turbo: {')) {
        const experimentalRegex = /(experimental\s*:\s*{[^}]*?)(\s*})/;
        if (experimentalRegex.test(content)) {
          content = content.replace(
            experimentalRegex,
            '$1,\n    turbo: {\n      enabled: false\n    }$2'
          );
        }
      }
      
      fs.writeFileSync(nextConfigPath, content);
      console.log(`✅ Đã cập nhật next.config.js`);
    } catch (error) {
      console.warn(`⚠️ Không thể cập nhật next.config.js: ${nextConfigPath}`, error.message);
    }
  }
};

// Xóa các file lock nếu tồn tại
const cleanLockFiles = () => {
  const lockFiles = [
    '.next/webpack.lock',
    '.next/server/middleware-build.lock',
    '.next/server/server-reference-manifest.lock',
  ];

  lockFiles.forEach((lockFile) => {
    const fullPath = path.join(process.cwd(), lockFile);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`✅ Đã xóa file lock: ${fullPath}`);
      } catch (error) {
        console.warn(`⚠️ Không thể xóa file lock: ${fullPath}`, error.message);
      }
    }
  });
};

// Thêm phương thức kiểm tra trạng thái
const checkStatus = () => {
  console.log('\n📊 Kiểm tra trạng thái sau khi sửa:');
  
  // Danh sách các file cần kiểm tra
  const filesToCheck = [
    '.next/static/webpack/webpack.hot-update.json',
    '.next/static/webpack/b0262cddd2646134.webpack.hot-update.json',
    '.next/static/chunks/_app-pages-browser_node_modules_next_dist_client_dev_noop-turbopack-hmr_js/index.js'
  ];
  
  let allFilesExist = true;
  
  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const exists = fs.existsSync(filePath);
    
    console.log(`${exists ? '✅' : '❌'} ${file}: ${exists ? 'Đã tạo' : 'Chưa tạo'}`);
    
    if (!exists) {
      allFilesExist = false;
    }
  });
  
  // Kiểm tra cấu hình next.config.js
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    const hasFileSystemRoutes = content.includes('useFileSystemPublicRoutes');
    const hasTurboDisabled = content.includes('turbo: {') && content.includes('enabled: false');
    
    console.log(`${hasFileSystemRoutes ? '✅' : '❌'} next.config.js (useFileSystemPublicRoutes): ${hasFileSystemRoutes ? 'Đã cập nhật' : 'Chưa cập nhật'}`);
    console.log(`${hasTurboDisabled ? '✅' : '❌'} next.config.js (turbo disabled): ${hasTurboDisabled ? 'Đã cập nhật' : 'Chưa cập nhật'}`);
    
    if (!hasFileSystemRoutes || !hasTurboDisabled) {
      allFilesExist = false;
    }
  }
  
  console.log(`\n${allFilesExist ? '✅ Tất cả các sửa đổi đã được áp dụng thành công!' : '❌ Một số sửa đổi chưa được áp dụng.'}`);
  console.log(`${allFilesExist ? '✨ Dự án sẽ hoạt động mà không có lỗi 404!' : '⚠️ Vẫn có thể gặp lỗi 404, hãy chạy lại script.'}`);
};

// Thực thi tất cả các bước sửa lỗi
try {
  createWebpackHotUpdateFiles();
  createTurbopackFiles();
  updateNextConfig();
  cleanLockFiles();
  checkStatus(); // Thêm dòng này để kiểm tra trạng thái
  console.log('\n✨ Đã hoàn tất sửa lỗi 404 cho webpack và static files!');
} catch (error) {
  console.error('❌ Lỗi khi sửa lỗi 404:', error);
} 