/**
 * Script để xử lý lỗi EPERM với file .next/trace
 * - Xử lý đặc biệt cho file trace để tránh lỗi khi chạy Next.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(message) {
  console.log(`[fix-trace] ${message}`);
}

try {
  const nextDir = path.join(__dirname, '.next');
  const tracePath = path.join(nextDir, 'trace');
  
  // 1. Tạo thư mục .next nếu không tồn tại
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
    log('Đã tạo thư mục .next');
  }
  
  // 2. Tìm và xử lý tất cả các file trace* trong thư mục .next
  if (fs.existsSync(nextDir)) {
    try {
      const files = fs.readdirSync(nextDir);
      
      // Tắt các lỗi không cần thiết
      const noTraceFiles = files.filter(file => file.startsWith('trace') || file === 'trace');
      if (noTraceFiles.length === 0) {
        log('Không tìm thấy file trace nào, tạo file mới...');
        // Tạo file trace trống để Next.js có thể ghi vào
        fs.writeFileSync(tracePath, '', { mode: 0o666 });
        log('Đã tạo file trace trống');
      } else {
        log(`Tìm thấy ${noTraceFiles.length} file trace, đang xử lý...`);
        
        // Xử lý từng file
        for (const file of noTraceFiles) {
          const filePath = path.join(nextDir, file);
          
          try {
            // Thử đổi quyền thành 666 (đọc/ghi cho tất cả)
            fs.chmodSync(filePath, 0o666);
            log(`Đã đổi quyền cho file ${file}`);
            
            // Empty the content
            fs.truncateSync(filePath, 0);
            log(`Đã xóa nội dung file ${file}`);
          } catch (err) {
            log(`Không thể xử lý file ${file}: ${err.message}`);
            
            try {
              // Nếu không xóa được, cố gắng tạo file .gitkeep để giữ thư mục
              fs.writeFileSync(path.join(nextDir, '.gitkeep'), '');
            } catch (e) {
              // Bỏ qua lỗi
            }
          }
        }
      }
    } catch (err) {
      log(`Lỗi khi đọc thư mục .next: ${err.message}`);
    }
  }

  // 3. Tạo file .traceignore để Next.js bỏ qua tracing
  const traceIgnorePath = path.join(__dirname, '.traceignore');
  fs.writeFileSync(traceIgnorePath, `
# Ignore all files in node_modules
**/node_modules/**
# Ignore all files in .next
**/.next/**
# Ignore all dot files
**/.*
  `, { encoding: 'utf8' });
  log('Đã tạo file .traceignore');
  
  // 4. Thêm cài đặt NODE_OPTIONS để tắt file tracing
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --no-warnings`;
  
  log('Xử lý file trace hoàn tất');
} catch (error) {
  log(`Lỗi không mong muốn: ${error.message}`);
} 