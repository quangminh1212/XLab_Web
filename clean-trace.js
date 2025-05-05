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

// Xử lý tệp trace
function handleTraceFile() {
  try {
    // Kiểm tra sự tồn tại của file trace 
    if (fs.existsSync(traceFile)) {
      try {
        // Kiểm tra quyền ghi file
        const stats = fs.statSync(traceFile);
        const isWritable = stats.mode & fs.constants.S_IWUSR;
        
        if (isWritable) {
          // Nếu có quyền ghi, xóa nội dung file
          fs.writeFileSync(traceFile, '', { flag: 'w' });
          console.log('Đã xóa nội dung tệp trace thành công.');
        } else {
          // Nếu không có quyền ghi, thử đổi quyền truy cập
          try {
            fs.chmodSync(traceFile, 0o666);
            fs.writeFileSync(traceFile, '', { flag: 'w' });
            console.log('Đã thay đổi quyền và xóa nội dung tệp trace thành công.');
          } catch (chmodErr) {
            console.error('Không thể thay đổi quyền cho tệp trace:', chmodErr.message);
            
            // Thử cách khác: tạo file mới thay thế
            try {
              fs.unlinkSync(traceFile);
              fs.writeFileSync(traceFile, '', { flag: 'w' });
              console.log('Đã xóa và tạo lại tệp trace thành công.');
            } catch (unlinkErr) {
              console.error('Không thể xóa tệp trace hiện tại:', unlinkErr.message);
              
              // Thử phương pháp cuối cùng: dùng lệnh hệ thống
              try {
                execSync(`type nul > "${traceFile}"`, { stdio: 'pipe' });
                console.log('Đã xóa nội dung tệp trace bằng lệnh hệ thống.');
              } catch (cmdErr) {
                console.error('Không thể xóa nội dung tệp trace bằng lệnh hệ thống:', cmdErr.message);
              }
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khi xử lý tệp trace:', err.message);
      }
    } else {
      // Đảm bảo thư mục .next tồn tại
      if (!fs.existsSync(nextDir)) {
        fs.mkdirSync(nextDir, { recursive: true });
        console.log('Đã tạo thư mục .next');
      }
      
      // Tạo file trace trống
      try {
        fs.writeFileSync(traceFile, '', { flag: 'w' });
        console.log('Đã tạo tệp trace mới.');
      } catch (createErr) {
        console.error('Không thể tạo tệp trace mới:', createErr.message);
      }
    }
  } catch (err) {
    console.error('Lỗi khi kiểm tra tệp trace:', err.message);
  }
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

// Xử lý tệp trace để tránh lỗi EPERM
handleTraceFile();

// Xóa các file .pack.gz gây lỗi
deletePackGzFiles();

console.log('Hoàn tất việc dọn dẹp và chuẩn bị môi trường.');