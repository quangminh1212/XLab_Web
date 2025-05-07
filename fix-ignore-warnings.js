/**
 * Fix cho cảnh báo useLayoutEffect trong Next.js
 * Script này patch file node_modules\next\dist\client\components\react-dev-overlay\ui\components\shadow-portal.tsx
 * và dev-overlay.tsx để chuyển useLayoutEffect sang useEffect trong development mode
 */

const fs = require('fs');
const path = require('path');

const files = [
  {
    path: path.join(
      __dirname,
      'node_modules',
      'next',
      'dist',
      'client',
      'components',
      'react-dev-overlay',
      'ui',
      'components',
      'shadow-portal.tsx'
    ),
    original: 'useLayoutEffect',
    replacement: 'useEffect'
  },
  {
    path: path.join(
      __dirname,
      'node_modules',
      'next',
      'dist',
      'client',
      'components',
      'react-dev-overlay',
      'ui',
      'dev-overlay.tsx'
    ),
    original: 'useLayoutEffect',
    replacement: 'useEffect'
  },
  {
    path: path.join(
      __dirname,
      'node_modules',
      'next',
      'dist',
      'compiled',
      '@next',
      'react-dev-overlay',
      'dist',
      'client.js'
    ),
    original: 'useLayoutEffect',
    replacement: 'useEffect'
  }
];

console.log('===== Đang sửa cảnh báo useLayoutEffect =====');

// Hàm tìm và thay thế trong nội dung file
function findAndReplace(content, original, replacement) {
  const regex = new RegExp(original, 'g');
  return content.replace(regex, replacement);
}

// Hàm tìm import useLayoutEffect và thay thế
function replaceImport(content) {
  // Thay thế trong phần import
  return content.replace(
    /import React, { useLayoutEffect/g, 
    'import React, { useEffect'
  ).replace(
    /import(\s+){(\s*[^}]*,)?\s*useLayoutEffect(\s*,|\s*})/g,
    (match, p1, p2, p3) => {
      const prefix = p2 ? p2 : '';
      const suffix = p3 ? p3 : '';
      return `import${p1}{${prefix} useEffect${suffix}`;
    }
  );
}

// Xử lý từng file
for (const file of files) {
  try {
    if (!fs.existsSync(file.path)) {
      console.log(`File không tồn tại: ${file.path}`);
      continue;
    }

    // Đọc nội dung file
    let content = fs.readFileSync(file.path, 'utf8');
    
    // Tạo bản sao file gốc nếu chưa có
    const backupPath = `${file.path}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content, 'utf8');
      console.log(`Đã tạo bản sao: ${backupPath}`);
    }

    // Kiểm tra xem file đã được sửa chưa
    if (content.includes(file.replacement) && !content.includes(file.original)) {
      console.log(`File đã được sửa trước đó: ${file.path}`);
      continue;
    }

    // Thay thế nội dung
    let modifiedContent = replaceImport(content);
    modifiedContent = findAndReplace(modifiedContent, file.original, file.replacement);

    // Ghi lại file
    fs.writeFileSync(file.path, modifiedContent, 'utf8');
    console.log(`Đã sửa thành công: ${file.path}`);
  } catch (error) {
    console.error(`Lỗi khi xử lý file ${file.path}:`, error.message);
  }
}

// Tạo file .next/server/next-font-manifest.json nếu chưa tồn tại 
try {
  const fontManifestDir = path.join(__dirname, '.next', 'server');
  const fontManifestPath = path.join(fontManifestDir, 'next-font-manifest.json');
  
  if (!fs.existsSync(fontManifestDir)) {
    fs.mkdirSync(fontManifestDir, { recursive: true });
  }
  
  if (!fs.existsSync(fontManifestPath)) {
    fs.writeFileSync(fontManifestPath, JSON.stringify({ pages: {}, app: {} }), 'utf8');
    console.log(`Đã tạo file: ${fontManifestPath}`);
  }
} catch (error) {
  console.error('Lỗi khi tạo file font manifest:', error.message);
}

// Tạo file .next/static/css/app/layout.css nếu chưa tồn tại
try {
  const cssDir = path.join(__dirname, '.next', 'static', 'css', 'app');
  const cssPath = path.join(cssDir, 'layout.css');
  
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, '/* Placeholder CSS file */', 'utf8');
    console.log(`Đã tạo file: ${cssPath}`);
  }
} catch (error) {
  console.error('Lỗi khi tạo file CSS:', error.message);
}

console.log('===== Hoàn tất sửa cảnh báo useLayoutEffect =====');
console.log('Bây giờ bạn có thể chạy "npm run dev" mà không gặp các cảnh báo useLayoutEffect nữa.'); 