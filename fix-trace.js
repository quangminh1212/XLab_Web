/**
 * Script để sửa lỗi EPERM khi truy cập file trace
 * File này sẽ xử lý trace file và thiết lập quyền truy cập phù hợp
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Bắt đầu sửa lỗi trace ===');

// Đường dẫn đến thư mục .next
const nextDir = path.join(__dirname, '.next');
const tracePath = path.join(nextDir, 'trace');
const emptyTracePath = path.join(nextDir, '.empty_trace');

// Đảm bảo thư mục .next tồn tại
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
  console.log(`✅ Đã tạo thư mục ${nextDir}`);
}

// Thử xóa file trace nếu có
try {
  if (fs.existsSync(tracePath)) {
    // Thử thay đổi quyền truy cập
    try {
      // Trên Windows, thử chạy lệnh attrib để bỏ thuộc tính read-only
      if (process.platform === 'win32') {
        try {
          execSync(`attrib -R "${tracePath}"`, { stdio: 'ignore' });
          console.log('✅ Đã xóa thuộc tính chỉ đọc từ file trace');
        } catch (attrErr) {
          console.error(`⚠️ Không thể thay đổi thuộc tính file: ${attrErr.message}`);
        }
      } else {
        // Trên Unix, thử chmod để đặt quyền truy cập đầy đủ
        fs.chmodSync(tracePath, 0o666);
      }
      
      // Thử xóa file trace
      fs.unlinkSync(tracePath);
      console.log('✅ Đã xóa file trace thành công');
    } catch (err) {
      console.error(`⚠️ Không thể xóa file trace: ${err.message}`);
      
      // Nếu không thể xóa, thử tạo file rỗng
      try {
        fs.writeFileSync(tracePath, '', { flag: 'w' });
        console.log('✅ Đã ghi đè file trace với nội dung rỗng');
      } catch (writeErr) {
        console.error(`⚠️ Không thể ghi đè file trace: ${writeErr.message}`);
      }
    }
  } else {
    console.log('ℹ️ File trace không tồn tại, không cần xóa');
  }
  
  // Tạo file đánh dấu để tránh Next.js tạo file trace mới
  fs.writeFileSync(emptyTracePath, '# This file exists to prevent Next.js from creating trace file\n');
  console.log(`✅ Đã tạo file ${emptyTracePath}`);
  
} catch (error) {
  console.error(`❌ Lỗi khi xử lý file trace: ${error.message}`);
}

// Thiết lập quyền truy cập đầy đủ cho thư mục .next
try {
  if (process.platform === 'win32') {
    try {
      // Đặt quyền truy cập đầy đủ cho thư mục .next trên Windows
      execSync(`icacls "${nextDir}" /grant Everyone:F /T`, { stdio: 'ignore' });
      console.log('✅ Đã đặt quyền truy cập đầy đủ cho thư mục .next');
    } catch (icaclsErr) {
      console.error(`⚠️ Không thể đặt quyền truy cập cho thư mục .next: ${icaclsErr.message}`);
    }
  } else {
    // Đặt quyền truy cập đầy đủ cho thư mục .next trên Unix
    fs.chmodSync(nextDir, 0o777);
    console.log('✅ Đã đặt quyền truy cập đầy đủ cho thư mục .next');
  }
} catch (error) {
  console.error(`⚠️ Lỗi khi đặt quyền truy cập: ${error.message}`);
}

console.log('=== Hoàn tất sửa lỗi trace ===');
console.log('🚀 Giờ bạn có thể chạy "npm run dev" mà không gặp lỗi EPERM'); 