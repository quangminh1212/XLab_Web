/**
 * Script để xử lý lỗi EPERM với file .next/trace
 * - Đặt quyền truy cập thích hợp cho file trace
 * - Xóa file trace nếu tồn tại để tránh lỗi
 */

const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`[fix-trace] ${message}`);
}

try {
  const tracePath = path.join(__dirname, '.next', 'trace');
  
  if (fs.existsSync(tracePath)) {
    log(`File trace tồn tại tại ${tracePath}, đang xử lý...`);
    
    try {
      // Thử thay đổi quyền truy cập
      fs.chmodSync(tracePath, 0o666);
      log('Đã thay đổi quyền truy cập cho file trace');
    } catch (chmodError) {
      log(`Không thể thay đổi quyền truy cập: ${chmodError.message}`);
    }
    
    try {
      // Xóa file trace
      fs.unlinkSync(tracePath);
      log('Đã xóa file trace thành công');
    } catch (unlinkError) {
      log(`Không thể xóa file trace: ${unlinkError.message}`);
      
      try {
        // Nếu không xóa được, ghi đè bằng file trống
        fs.writeFileSync(tracePath, '', { flag: 'w' });
        log('Đã ghi đè file trace bằng nội dung trống');
      } catch (writeError) {
        log(`Không thể ghi đè file trace: ${writeError.message}`);
      }
    }
  } else {
    log('File trace không tồn tại, không cần xử lý');
    
    // Tạo thư mục .next nếu chưa tồn tại
    const nextDir = path.join(__dirname, '.next');
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true });
      log('Đã tạo thư mục .next');
    }
    
    // Tạo file trace trống với quyền truy cập đầy đủ
    fs.writeFileSync(tracePath, '', { flag: 'w', mode: 0o666 });
    log('Đã tạo file trace trống với quyền truy cập đầy đủ');
  }
  
  log('Xử lý file trace hoàn tất');
} catch (error) {
  log(`Lỗi không mong muốn: ${error.message}`);
} 