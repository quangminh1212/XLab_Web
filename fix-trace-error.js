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

function deleteFileWithRetry(filePath, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Nếu file tồn tại, thử xóa
      if (fs.existsSync(filePath)) {
        // Đầu tiên đổi quyền file
        try {
          fs.chmodSync(filePath, 0o666);
        } catch (err) {
          // Bỏ qua lỗi đổi quyền
        }

        // Sau đó xóa file
        fs.unlinkSync(filePath);
        log(`Đã xóa file ${path.basename(filePath)} thành công`);
        return true;
      } else {
        log(`File ${path.basename(filePath)} không tồn tại`);
        return true;
      }
    } catch (err) {
      log(`Lần thử ${i+1}/${maxRetries}: Không thể xóa file ${path.basename(filePath)}: ${err.message}`);
      
      // Thử đổi tên file nếu không xóa được
      try {
        const newPath = `${filePath}.old_${Date.now()}`;
        fs.renameSync(filePath, newPath);
        log(`Đã đổi tên file ${path.basename(filePath)} thành ${path.basename(newPath)}`);
        return true;
      } catch (renameErr) {
        // Thử kill các tiến trình đang sử dụng file
        if (process.platform === 'win32') {
          try {
            // Chỉ áp dụng trên Windows
            execSync(`taskkill /F /IM node.exe`, { stdio: 'ignore' });
            log('Đã kill các tiến trình node.exe đang chạy');
          } catch (killErr) {
            // Bỏ qua lỗi kill tiến trình
          }
        }
      }
      
      // Đợi 1 giây trước khi thử lại
      if (i < maxRetries - 1) {
        log('Đợi 1 giây trước khi thử lại...');
        execSync('timeout /t 1', { stdio: 'ignore' });
      }
    }
  }
  
  log(`Không thể xóa file ${path.basename(filePath)} sau ${maxRetries} lần thử`);
  return false;
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
      
      // Lọc các file trace
      const traceFiles = files.filter(file => file.startsWith('trace') || file === 'trace');
      
      if (traceFiles.length === 0) {
        log('Không tìm thấy file trace nào, tạo file mới...');
        // Tạo file trace trống để Next.js có thể ghi vào
        try {
          fs.writeFileSync(tracePath, '', { mode: 0o666 });
          log('Đã tạo file trace trống');
        } catch (writeErr) {
          log(`Không thể tạo file trace: ${writeErr.message}`);
        }
      } else {
        log(`Tìm thấy ${traceFiles.length} file trace, đang xử lý...`);
        
        // Xử lý từng file
        for (const file of traceFiles) {
          const filePath = path.join(nextDir, file);
          
          // Xóa file với cơ chế thử lại
          const deleted = deleteFileWithRetry(filePath);
          
          if (deleted) {
            // Nếu xóa thành công, tạo file mới
            try {
              fs.writeFileSync(filePath, '', { mode: 0o666 });
              log(`Đã tạo lại file ${file} trống`);
            } catch (writeErr) {
              log(`Không thể tạo lại file ${file}: ${writeErr.message}`);
            }
          }
        }
      }
      
      // Tạo file .gitkeep để giữ thư mục
      try {
        fs.writeFileSync(path.join(nextDir, '.gitkeep'), '');
      } catch (e) {
        // Bỏ qua lỗi
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
  
  // 4. Cập nhật cài đặt .env.local để tắt tracing
  const envPath = path.join(__dirname, '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Thêm các biến môi trường cần thiết
  if (!envContent.includes('NEXT_TELEMETRY_DISABLED=1')) {
    envContent += '\nNEXT_TELEMETRY_DISABLED=1';
  }
  
  if (!envContent.includes('NODE_OPTIONS=')) {
    envContent += '\nNODE_OPTIONS="--no-warnings"';
  } else if (!envContent.includes('--no-warnings')) {
    // Thêm --no-warnings vào NODE_OPTIONS nếu chưa có
    envContent = envContent.replace(/NODE_OPTIONS="([^"]*)"/, 'NODE_OPTIONS="$1 --no-warnings"');
  }
  
  // Thêm biến để vô hiệu hóa trace
  if (!envContent.includes('NEXT_DISABLE_TRACE=1')) {
    envContent += '\nNEXT_DISABLE_TRACE=1';
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  log('Đã cập nhật file .env.local');
  
  // 5. Thêm cài đặt vào quy trình hiện tại
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --no-warnings`;
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.NEXT_DISABLE_TRACE = '1';
  
  log('Xử lý file trace hoàn tất');
} catch (error) {
  log(`Lỗi không mong muốn: ${error.message}`);
} 