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

console.log('[fix-trace-error] Bắt đầu sửa lỗi file trace...');

// Kiểm tra xem thư mục .next có tồn tại không
if (fs.existsSync(nextDir)) {
  // Nếu file trace tồn tại, xóa nó
  if (fs.existsSync(traceFile)) {
    try {
      fs.unlinkSync(traceFile);
      console.log('[fix-trace-error] Đã xóa file trace');
    } catch (err) {
      console.log(`[fix-trace-error] Không thể xóa file trace: ${err.message}`);
      
      // Thử giải pháp thay thế: tạo thư mục trace
      try {
        fs.mkdirSync(traceFile, { recursive: true });
        console.log('[fix-trace-error] Đã tạo thư mục trace thay vì file');
      } catch (dirErr) {
        console.log(`[fix-trace-error] Không thể tạo thư mục trace: ${dirErr.message}`);
      }
    }
  } else {
    // Nếu file trace không tồn tại, tạo một thư mục trace
    try {
      fs.mkdirSync(traceFile, { recursive: true });
      console.log('[fix-trace-error] Đã tạo thư mục trace');
    } catch (err) {
      console.log(`[fix-trace-error] Không thể tạo thư mục trace: ${err.message}`);
    }
  }

  // Tạo các file cấu hình JSON cần thiết nếu chúng không tồn tại
  const requiredFiles = [
    { path: path.join(nextDir, 'server', 'middleware-manifest.json'), content: '{}' },
    { path: path.join(nextDir, 'server', 'pages-manifest.json'), content: '{}' },
    { path: path.join(nextDir, 'server', 'vendor-chunks.json'), content: '{}' },
    { path: path.join(nextDir, 'server', 'webpack-runtime.json'), content: '{}' }
  ];

  for (const file of requiredFiles) {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(file.path)) {
      fs.writeFileSync(file.path, file.content);
      console.log(`[fix-trace-error] Đã tạo file: ${file.path}`);
    }
  }
}

console.log('[fix-trace-error] Hoàn tất sửa lỗi file trace'); 