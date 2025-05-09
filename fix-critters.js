/**
 * Fix cho lỗi related to critters package trong Next.js
 * Script này tạo các placeholder cần thiết để ngăn lỗi khi sử dụng critters
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục css
const cssDir = path.join(__dirname, '.next', 'static', 'css');
const appCssDir = path.join(cssDir, 'app');

// Tạo các thư mục CSS
const createCssFolders = () => {
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
    console.log(`Đã tạo thư mục: ${cssDir}`);
  }
  
  if (!fs.existsSync(appCssDir)) {
    fs.mkdirSync(appCssDir, { recursive: true });
    console.log(`Đã tạo thư mục: ${appCssDir}`);
  }
};

// Tạo file CSS placeholder
const createCssPlaceholders = () => {
  const cssFiles = [
    { path: path.join(cssDir, 'app-layout.css'), content: '/* Placeholder CSS file */' },
    { path: path.join(appCssDir, 'layout.css'), content: '/* Placeholder CSS file */' }
  ];

  cssFiles.forEach(file => {
    fs.writeFileSync(file.path, file.content);
    console.log(`Đã tạo file CSS: ${file.path}`);
  });
};

// Thực hiện cấu hình critters
const runFix = () => {
  try {
    createCssFolders();
    createCssPlaceholders();
    console.log('Hoàn tất việc sửa lỗi critters.');
  } catch (error) {
    console.error('Lỗi khi thực hiện sửa lỗi critters:', error);
  }
};

runFix(); 