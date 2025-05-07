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

/**
 * Đọc, xóa nội dung file trace và các file tạm thời khác
 */
function cleanTrace() {
  const traceFilePath = path.join(__dirname, '.next', 'trace');
  
  try {
    // Xóa file trace
    if (fs.existsSync(traceFilePath)) {
      fs.writeFileSync(traceFilePath, '', 'utf8');
      console.log('Đã xóa nội dung tệp trace thành công.');
    } else {
      console.log('File trace không tồn tại, bỏ qua.');
    }

    // Xóa các file cache webpack gây lỗi
    cleanWebpackCache();

    console.log('Hoàn tất việc dọn dẹp và chuẩn bị môi trường.');
  } catch (error) {
    console.error('Lỗi khi xóa file trace:', error.message);
  }
}

/**
 * Xóa các file cache webpack gây lỗi
 */
function cleanWebpackCache() {
  const cacheDir = path.join(__dirname, '.next', 'cache', 'webpack');
  const subDirs = ['client-development', 'server-development'];
  
  try {
    if (!fs.existsSync(cacheDir)) {
      return;
    }
    
    for (const subDir of subDirs) {
      const dirPath = path.join(cacheDir, subDir);
      
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
          if (file.endsWith('.pack.gz')) {
            const filePath = path.join(dirPath, file);
            try {
              fs.unlinkSync(filePath);
              console.log(`Đã xóa file: ${filePath}`);
            } catch (err) {
              // Bỏ qua lỗi nếu file không tồn tại hoặc không thể xóa
              console.log(`Không thể xóa file: ${filePath}. Lỗi: ${err.message}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Lỗi khi xóa cache webpack:', error.message);
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

// Thực thi hàm
cleanTrace();