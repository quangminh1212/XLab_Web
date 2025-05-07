const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Đường dẫn tới các thư mục webpack cache
const webpackCacheDirs = [
  path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'server-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development')
];

// Hàm tạo file placeholder và file gzip
function createPlaceholderFiles(directory) {
  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Đã tạo thư mục: ${directory}`);
  }

  // Tạo các file placeholder từ 0.pack đến 9.pack và file gzip tương ứng
  for (let i = 0; i < 10; i++) {
    const packFile = path.join(directory, `${i}.pack`);
    const gzipFile = path.join(directory, `${i}.pack.gz`);

    // Tạo file pack trống
    if (!fs.existsSync(packFile)) {
      fs.writeFileSync(packFile, Buffer.alloc(1024), { flag: 'w' });
      console.log(`Đã tạo file placeholder: ${packFile}`);
    }

    // Tạo file gzip
    if (!fs.existsSync(gzipFile)) {
      const input = fs.readFileSync(packFile);
      const gzipped = zlib.gzipSync(input);
      fs.writeFileSync(gzipFile, gzipped, { flag: 'w' });
      console.log(`Đã tạo file gzip: ${gzipFile}`);
    }
  }
}

// Hàm xóa bỏ file trong webpack cache
function clearWebpackCache() {
  webpackCacheDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        console.log(`Đang xóa ${files.length} file trong ${dir}`);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          fs.unlinkSync(filePath);
          console.log(`Đã xóa file: ${filePath}`);
        });
      } catch (err) {
        console.error(`Lỗi khi xóa cache trong ${dir}: ${err.message}`);
      }
    }
  });
}

console.log('===== Đang sửa lỗi ENOENT với file webpack cache =====');

// Xóa cache webpack
clearWebpackCache();

// Tạo lại các file placeholder trong tất cả các thư mục webpack cache
webpackCacheDirs.forEach(dir => {
  createPlaceholderFiles(dir);
});

console.log('===== Hoàn tất sửa lỗi =====');
console.log('Bây giờ bạn có thể chạy "npm run dev" để khởi động lại server.'); 