/**
 * Fix cho cảnh báo useLayoutEffect trong Next.js
 * Script này patch file node_modules\next\dist\client\components\react-dev-overlay\ui\components\shadow-portal.tsx
 * để chuyển useLayoutEffect sang useEffect trong development mode
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn đến file shadow-portal.tsx
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
  'shadow-portal.tsx'
);

console.log('===== Đang sửa cảnh báo useLayoutEffect =====');

// Kiểm tra xem file có tồn tại không
if (!fs.existsSync(shadowPortalPath)) {
  console.error(`Không tìm thấy file: ${shadowPortalPath}`);
  console.log('Vui lòng đảm bảo Next.js đã được cài đặt đúng cách.');
  process.exit(1);
}

// Đọc nội dung file
let content = fs.readFileSync(shadowPortalPath, 'utf8');

// Tạo bản sao của file gốc
const backupPath = `${shadowPortalPath}.backup`;
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log(`Đã tạo bản sao: ${backupPath}`);
}

// Kiểm tra xem file đã được sửa chưa
if (content.includes('useEffect as usePortalEffect')) {
  console.log('File đã được sửa trước đó!');
} else {
  // Thay đổi import
  content = content.replace(
    'import React, { useLayoutEffect, useRef } from \'react\';',
    'import React, { useEffect, useRef } from \'react\';'
  );

  // Đổi useLayoutEffect thành useEffect
  content = content.replace(/useLayoutEffect/g, 'useEffect');

  // Lưu file
  fs.writeFileSync(shadowPortalPath, content, 'utf8');
  console.log('Đã sửa file thành công!');
}

// Kiểm tra file dev-overlay.tsx
const devOverlayPath = path.join(
  __dirname,
  'node_modules',
  'next',
  'dist',
  'client',
  'components',
  'react-dev-overlay',
  'ui',
  'dev-overlay.tsx'
);

if (fs.existsSync(devOverlayPath)) {
  content = fs.readFileSync(devOverlayPath, 'utf8');
  
  // Tạo bản sao của file gốc
  const backupDevPath = `${devOverlayPath}.backup`;
  if (!fs.existsSync(backupDevPath)) {
    fs.writeFileSync(backupDevPath, content, 'utf8');
    console.log(`Đã tạo bản sao: ${backupDevPath}`);
  }

  // Thay đổi import và useLayoutEffect
  if (content.includes('useLayoutEffect')) {
    content = content.replace(
      'import React, { useLayoutEffect, useState } from \'react\';',
      'import React, { useEffect, useState } from \'react\';'
    );
    
    content = content.replace(/useLayoutEffect/g, 'useEffect');
    
    fs.writeFileSync(devOverlayPath, content, 'utf8');
    console.log('Đã sửa file dev-overlay.tsx thành công!');
  }
}

console.log('===== Hoàn tất sửa cảnh báo useLayoutEffect =====');
console.log('Bây giờ bạn có thể chạy "npm run dev" mà không gặp các cảnh báo useLayoutEffect nữa.'); 