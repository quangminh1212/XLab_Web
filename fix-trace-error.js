const fs = require('fs');
const path = require('path');

// Đường dẫn đến file trace
const tracePath = path.join(__dirname, '.next', 'trace');

// Kiểm tra xem file trace có tồn tại không
console.log('🔍 Kiểm tra file trace...');
if (fs.existsSync(tracePath)) {
  try {
    // Thử xóa file trace
    console.log('⚠️ Tìm thấy file trace, đang thử xóa...');
    
    // Đặt lại quyền truy cập trước khi xóa
    try {
      fs.chmodSync(tracePath, 0o666);
      console.log('✅ Đã đặt lại quyền truy cập của file trace');
    } catch (chmodErr) {
      console.log('❌ Không thể đặt lại quyền truy cập:', chmodErr.message);
    }

    // Thử xóa file
    try {
      fs.unlinkSync(tracePath);
      console.log('✅ Đã xóa file trace thành công');
    } catch (unlinkErr) {
      console.log('❌ Không thể xóa file trace:', unlinkErr.message);
      
      // Nếu không thể xóa, tạo file .gitkeep trong thư mục .next để duy trì cấu trúc
      try {
        const gitkeepPath = path.join(__dirname, '.next', '.gitkeep');
        fs.writeFileSync(gitkeepPath, '');
        console.log('✅ Đã tạo file .gitkeep để duy trì cấu trúc thư mục');
      } catch (writeErr) {
        console.log('❌ Không thể tạo file .gitkeep:', writeErr.message);
      }
    }
  } catch (error) {
    console.error('❌ Lỗi khi xử lý file trace:', error.message);
  }
} else {
  console.log('✅ Không tìm thấy file trace, không cần xử lý');
}

console.log('🚀 Đã hoàn thành xử lý file trace');

// Tạo thư mục .next nếu không tồn tại
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir)) {
  try {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log('✅ Đã tạo thư mục .next');
  } catch (mkdirErr) {
    console.log('❌ Không thể tạo thư mục .next:', mkdirErr.message);
  }
}

// Đảm bảo các thư mục con cần thiết tồn tại
const requiredDirs = [
  path.join(nextDir, 'cache'),
  path.join(nextDir, 'server'),
  path.join(nextDir, 'static'),
  path.join(nextDir, 'static', 'chunks'),
  path.join(nextDir, 'static', 'css'),
  path.join(nextDir, 'static', 'webpack'),
  path.join(nextDir, 'server', 'chunks'),
  path.join(nextDir, 'server', 'pages'),
  path.join(nextDir, 'server', 'vendor-chunks'),
  path.join(nextDir, 'server', 'app')
];

console.log('📁 Đảm bảo các thư mục cần thiết tồn tại...');
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Đã tạo thư mục: ${dir}`);
      
      // Tạo file .gitkeep trong mỗi thư mục
      const gitkeepPath = path.join(dir, '.gitkeep');
      fs.writeFileSync(gitkeepPath, '');
    } catch (error) {
      console.log(`❌ Không thể tạo thư mục ${dir}:`, error.message);
    }
  }
}

console.log('✅ Đã hoàn thành việc xử lý tất cả các thư mục cần thiết');
console.log('🚀 Bạn có thể khởi động ứng dụng bây giờ'); 