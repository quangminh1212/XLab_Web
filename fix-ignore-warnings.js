/**
 * Fix cho cảnh báo useLayoutEffect trong Next.js
 * Script này patch file node_modules\next\dist\client\components\react-dev-overlay\ui\components\shadow-portal.js
 * để chuyển useLayoutEffect sang useEffect trong development mode
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn đến file shadow-portal.js
const shadowPortalPath = path.join(
  __dirname,
  'node_modules',
  'next',
  'dist',
  'client',
  'components',
  'react-dev-overlay',
  'ui',
  'components',
  'shadow-portal.js'
);

const devOverlayPath = path.join(
  __dirname,
  'node_modules',
  'next',
  'dist',
  'client',
  'components',
  'react-dev-overlay',
  'ui',
  'dev-overlay.js'
);

console.log('===== Đang sửa cảnh báo useLayoutEffect =====');

// Kiểm tra xem file có tồn tại không
if (fs.existsSync(shadowPortalPath)) {
  // Đọc nội dung file
  let content = fs.readFileSync(shadowPortalPath, 'utf8');

  // Tạo bản sao của file gốc
  const backupPath = `${shadowPortalPath}.backup`;
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`Đã tạo bản sao: ${backupPath}`);
  }

  // Thay thế useLayoutEffect thành useEffect
  content = content.replace(/useLayoutEffect/g, 'useEffect');
  
  // Lưu file
  fs.writeFileSync(shadowPortalPath, content, 'utf8');
  console.log('Đã sửa file shadow-portal.js thành công!');
} else {
  console.error(`Không tìm thấy file: ${shadowPortalPath}`);
}

// Kiểm tra file dev-overlay.js
if (fs.existsSync(devOverlayPath)) {
  let content = fs.readFileSync(devOverlayPath, 'utf8');
  
  // Tạo bản sao của file gốc
  const backupDevPath = `${devOverlayPath}.backup`;
  if (!fs.existsSync(backupDevPath)) {
    fs.writeFileSync(backupDevPath, content, 'utf8');
    console.log(`Đã tạo bản sao: ${backupDevPath}`);
  }

  // Thay đổi useLayoutEffect thành useEffect
  content = content.replace(/useLayoutEffect/g, 'useEffect');
  
  fs.writeFileSync(devOverlayPath, content, 'utf8');
  console.log('Đã sửa file dev-overlay.js thành công!');
} else {
  console.log(`File dev-overlay.js không tồn tại: ${devOverlayPath}`);
}

// Kiểm tra tất cả các file khác trong thư mục error-overlay có chứa useLayoutEffect
const errorOverlayDir = path.join(
  __dirname,
  'node_modules',
  'next',
  'dist',
  'client',
  'components',
  'react-dev-overlay',
  'ui',
  'components',
  'errors'
);

if (fs.existsSync(errorOverlayDir)) {
  console.log(`Kiểm tra các file trong thư mục: ${errorOverlayDir}`);
  
  const traverseDir = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        traverseDir(filePath);
      } else if (stat.isFile() && file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('useLayoutEffect')) {
          console.log(`Tìm thấy useLayoutEffect trong file: ${filePath}`);
          
          // Tạo bản sao
          const backupFilePath = `${filePath}.backup`;
          if (!fs.existsSync(backupFilePath)) {
            fs.writeFileSync(backupFilePath, content, 'utf8');
          }
          
          // Thay thế
          const newContent = content.replace(/useLayoutEffect/g, 'useEffect');
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Đã sửa file: ${filePath}`);
        }
      }
    });
  };
  
  traverseDir(errorOverlayDir);
}

console.log('===== Hoàn tất sửa cảnh báo useLayoutEffect =====');
console.log('Bây giờ bạn có thể chạy "npm run dev" mà không gặp các cảnh báo useLayoutEffect nữa.'); 