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

// Danh sách các file cần tạo để tránh lỗi
const filesToCreate = [
  { 
    path: path.join(__dirname, '.next', 'server', 'next-font-manifest.json'),
    content: '{}'
  }
];

/**
 * Xóa hoàn toàn thư mục .next
 */
function deleteNextFolder() {
  try {
    // Kiểm tra nếu thư mục .next tồn tại
    if (fs.existsSync(nextDir)) {
      console.log('Đang xóa thư mục .next...');
      // Sử dụng rimraf trong môi trường Windows để xử lý các vấn đề quyền truy cập
      try {
        const rimrafPath = path.join(__dirname, 'node_modules', '.bin', 'rimraf');
        if (fs.existsSync(rimrafPath)) {
          execSync(`${rimrafPath} .next`, { stdio: 'inherit' });
        } else {
          // Fallback: dùng fs.rmSync nếu có
          if (fs.rmSync) {
            fs.rmSync(nextDir, { recursive: true, force: true });
          } else {
            // Node.js cũ hơn
            const deleteFolderRecursive = function(directoryPath) {
              if (fs.existsSync(directoryPath)) {
                fs.readdirSync(directoryPath).forEach((file) => {
                  const curPath = path.join(directoryPath, file);
                  if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                  } else {
                    try {
                      fs.unlinkSync(curPath);
                    } catch (err) {
                      console.log(`Không thể xóa file: ${curPath}. Lỗi: ${err.message}`);
                    }
                  }
                });
                try {
                  fs.rmdirSync(directoryPath);
                } catch (err) {
                  console.log(`Không thể xóa thư mục: ${directoryPath}. Lỗi: ${err.message}`);
                }
              }
            };
            deleteFolderRecursive(nextDir);
          }
        }
        console.log('Đã xóa thư mục .next thành công.');
      } catch (error) {
        console.error('Lỗi khi xóa thư mục .next:', error.message);
      }
    } else {
      console.log('Thư mục .next không tồn tại, bỏ qua.');
    }
  } catch (error) {
    console.error('Lỗi khi xóa thư mục .next:', error.message);
  }
}

/**
 * Đọc, xóa nội dung file trace và các file tạm thời khác
 */
function cleanTrace() {
  try {
    // Xóa file trace
    if (fs.existsSync(traceFile)) {
      try {
        fs.writeFileSync(traceFile, '', { encoding: 'utf8', mode: 0o666 });
        console.log('Đã xóa nội dung tệp trace thành công.');
      } catch (err) {
        console.log(`Không thể ghi file trace: ${err.message}`);
        // Nếu không thể ghi file, thử xóa nó
        try {
          fs.unlinkSync(traceFile);
          console.log('Đã xóa file trace.');
        } catch (unlinkErr) {
          console.log(`Không thể xóa file trace: ${unlinkErr.message}`);
        }
      }
    } else {
      console.log('File trace không tồn tại, bỏ qua.');
    }

    // Xóa các file cache webpack gây lỗi
    cleanWebpackCache();

    // Tạo các file cần thiết để tránh lỗi
    createRequiredFiles();

    console.log('Hoàn tất việc dọn dẹp và chuẩn bị môi trường.');
  } catch (error) {
    console.error('Lỗi khi xóa file trace:', error.message);
  }
}

/**
 * Tạo các file cần thiết để tránh lỗi ENOENT
 */
function createRequiredFiles() {
  for (const file of filesToCreate) {
    try {
      const dir = path.dirname(file.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Đã tạo thư mục: ${dir}`);
      }
      
      fs.writeFileSync(file.path, file.content);
      console.log(`Đã tạo file: ${file.path}`);
    } catch (err) {
      console.error(`Lỗi khi tạo file ${file.path}:`, err.message);
    }
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

// Ưu tiên xóa thư mục .next trước
deleteNextFolder();

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