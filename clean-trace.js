const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đường dẫn đến các tệp và thư mục cần xử lý
const traceFile = path.join(__dirname, '.next', 'trace');
const nextDir = path.join(__dirname, '.next');
const cacheDirs = [
  path.join(__dirname, '.next', 'cache'),
  path.join(__dirname, '.next', 'cache', 'webpack'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'server-development'),
  path.join(__dirname, 'node_modules', '.cache')
];

// Xóa tất cả các file .pack.gz
function deletePackGzFiles() {
  const directories = [
    path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
    path.join(__dirname, '.next', 'cache', 'webpack', 'server-development')
  ];

  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          if (file.endsWith('.pack.gz')) {
            const filePath = path.join(dir, file);
            try {
              fs.unlinkSync(filePath);
              console.log(`Đã xóa file: ${filePath}`);
            } catch (err) {
              console.error(`Không thể xóa file ${filePath}:`, err.message);
            }
          }
        });
      } catch (err) {
        console.error(`Không thể đọc thư mục ${dir}:`, err.message);
      }
    }
  });
}

// Xử lý tệp trace - sử dụng cả fs và các lệnh hệ thống
try {
  if (fs.existsSync(traceFile)) {
    try {
      // Thử phương pháp 1: Sử dụng fs.writeFile
      fs.writeFileSync(traceFile, '', { flag: 'w' });
      console.log('Đã xóa nội dung tệp trace thành công.');
    } catch (err) {
      if (err.code === 'EPERM') {
        console.log('Không có quyền ghi tệp trace bằng fs, thử phương pháp khác...');
        // Thử phương pháp 2: Sử dụng các lệnh hệ thống
        try {
          // Trên Windows, sử dụng lệnh type nul để xóa nội dung
          execSync(`type nul > "${traceFile}"`, { stdio: 'pipe' });
          console.log('Đã xóa nội dung tệp trace bằng lệnh hệ thống.');
        } catch (cmdErr) {
          console.error('Không thể xóa nội dung tệp trace bằng lệnh hệ thống:', cmdErr.message);
        }
      } else {
        console.error('Lỗi khi xử lý tệp trace:', err.message);
      }
    }
  } else {
    // Đảm bảo thư mục .next tồn tại
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true });
      console.log('Đã tạo thư mục .next');
    }
    console.log('Tệp trace không tồn tại, sẽ được tạo khi cần.');
  }
} catch (err) {
  console.error('Lỗi khi kiểm tra tệp trace:', err.message);
}

// Đảm bảo các thư mục cache tồn tại
cacheDirs.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục cache: ${dir}`);
    }
  } catch (err) {
    console.error(`Lỗi khi tạo thư mục cache ${dir}:`, err.message);
  }
});

// Xóa các file .pack.gz gây lỗi
deletePackGzFiles();

console.log('Hoàn tất việc dọn dẹp và chuẩn bị môi trường.');