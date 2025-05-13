/**
 * FIX TRACE ERROR
 * Sửa lỗi file trace trong Next.js
 * Tạo các file cần thiết để tránh lỗi middleware-manifest.json
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục .next
const nextDir = path.join(__dirname, '.next');
const traceFile = path.join(nextDir, 'trace');
const traceDir = path.join(nextDir, 'trace');

console.log('[fix-trace-error] Bắt đầu sửa lỗi file trace...');

// Kiểm tra xem thư mục .next có tồn tại không
if (!fs.existsSync(nextDir)) {
  try {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log(`[fix-trace-error] Đã tạo thư mục .next`);
  } catch (err) {
    console.log(`[fix-trace-error] Không thể tạo thư mục .next: ${err.message}`);
  }
}

// Nếu file trace tồn tại, xóa nó và tạo thư mục trace
try {
  if (fs.existsSync(traceFile)) {
    // Kiểm tra xem trace là file hay thư mục
    const stats = fs.statSync(traceFile);
    if (stats.isFile()) {
      // Nếu là file, xóa nó
      fs.unlinkSync(traceFile);
      console.log('[fix-trace-error] Đã xóa file trace');
      
      // Tạo thư mục trace
      fs.mkdirSync(traceDir, { recursive: true });
      console.log('[fix-trace-error] Đã tạo thư mục trace');
    } else if (stats.isDirectory()) {
      // Nếu đã là thư mục, chỉ cần thông báo
      console.log('[fix-trace-error] Đã có sẵn thư mục trace');
    }
  } else {
    // Nếu không tồn tại, tạo thư mục trace
    fs.mkdirSync(traceDir, { recursive: true });
    console.log('[fix-trace-error] Đã tạo thư mục trace');
  }
} catch (err) {
  console.log(`[fix-trace-error] Lỗi khi xử lý trace: ${err.message}`);
}

// Tạo các file cấu hình JSON cần thiết
const requiredFiles = [
  { path: path.join(nextDir, 'server', 'middleware-manifest.json'), content: '{"version":1,"sortedMiddleware":[],"middleware":{},"functions":{},"matchers":{}}' },
  { path: path.join(nextDir, 'server', 'pages-manifest.json'), content: '{}' },
  { path: path.join(nextDir, 'server', 'vendor-chunks.json'), content: '{}' },
  { path: path.join(nextDir, 'server', 'webpack-runtime.json'), content: '{}' },
  { path: path.join(nextDir, 'build-manifest.json'), content: '{"polyfillFiles":[],"rootMainFiles":[],"pages":{},"devFiles":[]}' }
];

// Tạo các file cần thiết
for (const file of requiredFiles) {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Chỉ ghi file nếu nó không tồn tại hoặc rỗng
    if (!fs.existsSync(file.path) || fs.statSync(file.path).size === 0) {
      fs.writeFileSync(file.path, file.content);
      console.log(`[fix-trace-error] Đã tạo file: ${file.path}`);
    }
  } catch (err) {
    console.log(`[fix-trace-error] Không thể tạo file ${file.path}: ${err.message}`);
  }
}

console.log('[fix-trace-error] Hoàn tất sửa lỗi file trace'); 