/**
 * Fix Middleware Manifest Script
 * Tạo file middleware-manifest.json cần thiết cho Next.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Bắt đầu sửa lỗi middleware-manifest.json...');

// Đường dẫn đến thư mục .next
const nextDir = path.join(process.cwd(), '.next');
const serverDir = path.join(nextDir, 'server');

// Nội dung mặc định của file middleware-manifest.json
const manifestContent = JSON.stringify({
  version: 2,
  middleware: {},
  sortedMiddleware: [],
  functions: {},
  pages: {}
}, null, 2);

// Đảm bảo thư mục tồn tại
try {
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log(`✅ Đã tạo thư mục .next`);
  }
  
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
    console.log(`✅ Đã tạo thư mục .next/server`);
  }
  
  // Tạo file middleware-manifest.json
  const manifestPath = path.join(serverDir, 'middleware-manifest.json');
  fs.writeFileSync(manifestPath, manifestContent, { encoding: 'utf8' });
  console.log(`✅ Đã tạo file middleware-manifest.json`);
  
  // Đảm bảo quyền truy cập đúng
  try {
    fs.chmodSync(manifestPath, 0o666);
    console.log(`✅ Đã đặt quyền truy cập cho file middleware-manifest.json`);
  } catch (error) {
    console.log(`⚠️ Không thể đặt quyền truy cập: ${error.message}`);
  }
  
  console.log('✅ Đã hoàn thành sửa lỗi middleware-manifest.json');
} catch (error) {
  console.error(`❌ Lỗi: ${error.message}`);
  process.exit(1);
} 