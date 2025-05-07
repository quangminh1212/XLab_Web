const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Đường dẫn tới các thư mục webpack cache
const webpackCacheDirs = [
  path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'server-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development')
];

// Hàm tạo thư mục nếu chưa tồn tại
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Tạo thư mục: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Đảm bảo các thư mục webpack cache tồn tại
webpackCacheDirs.forEach(dir => ensureDir(dir));

// Tạo nội dung mặc định cho file pack
const packContent = Buffer.from('// Next.js webpack cache placeholder file');
const gzipContent = zlib.gzipSync(packContent);

// Tạo file webpack cache nếu chưa tồn tại
function createCacheFiles() {
  webpackCacheDirs.forEach(dir => {
    console.log(`Đang tạo file cache trong: ${dir}`);
    
    for (let i = 0; i < 10; i++) {
      const packFile = path.join(dir, `${i}.pack`);
      const gzipFile = path.join(dir, `${i}.pack.gz`);
      
      try {
        // Tạo file .pack
        if (!fs.existsSync(packFile)) {
          fs.writeFileSync(packFile, packContent, { flag: 'w' });
          console.log(`Đã tạo file: ${packFile}`);
        } else {
          // Đảm bảo file có quyền truy cập
          fs.accessSync(packFile, fs.constants.R_OK | fs.constants.W_OK);
        }
        
        // Tạo file .pack.gz
        if (!fs.existsSync(gzipFile)) {
          fs.writeFileSync(gzipFile, gzipContent, { flag: 'w' });
          console.log(`Đã tạo file: ${gzipFile}`);
        } else {
          // Đảm bảo file có quyền truy cập
          fs.accessSync(gzipFile, fs.constants.R_OK | fs.constants.W_OK);
        }
      } catch (err) {
        console.error(`Lỗi khi tạo file ${i}.pack trong ${dir}:`, err.message);
        
        // Thử xóa và tạo lại nếu gặp lỗi
        try {
          if (fs.existsSync(packFile)) fs.unlinkSync(packFile);
          if (fs.existsSync(gzipFile)) fs.unlinkSync(gzipFile);
          
          fs.writeFileSync(packFile, packContent, { flag: 'w' });
          fs.writeFileSync(gzipFile, gzipContent, { flag: 'w' });
          console.log(`Đã tạo lại file sau lỗi: ${packFile} và ${gzipFile}`);
        } catch (retryErr) {
          console.error(`Không thể tạo lại file sau lỗi:`, retryErr.message);
        }
      }
    }
  });
}

// Tạo thêm các file cần thiết cho Next.js
function createExtraFiles() {
  const extraDirs = [
    path.join(__dirname, '.next', 'server'),
    path.join(__dirname, '.next', 'static', 'chunks', 'pages'),
    path.join(__dirname, '.next', 'static', 'chunks', 'app'),
    path.join(__dirname, '.next', 'static', 'css', 'app'),
  ];
  
  extraDirs.forEach(dir => ensureDir(dir));
  
  // Tạo file next-font-manifest.json nếu chưa tồn tại
  const fontManifestFile = path.join(__dirname, '.next', 'server', 'next-font-manifest.json');
  if (!fs.existsSync(fontManifestFile)) {
    fs.writeFileSync(fontManifestFile, JSON.stringify({pages:{}, app:{}}), 'utf8');
    console.log(`Đã tạo file: ${fontManifestFile}`);
  }
  
  // Tạo file CSS layout
  const cssLayoutFile = path.join(__dirname, '.next', 'static', 'css', 'app', 'layout.css');
  if (!fs.existsSync(cssLayoutFile)) {
    fs.writeFileSync(cssLayoutFile, '/* Auto-generated CSS file */', 'utf8');
    console.log(`Đã tạo file: ${cssLayoutFile}`);
  }
}

console.log('===== Bắt đầu sửa lỗi ENOENT với webpack cache =====');

try {
  createCacheFiles();
  createExtraFiles();
  console.log('===== Hoàn tất sửa lỗi ENOENT với webpack cache =====');
} catch (err) {
  console.error('Lỗi:', err);
  process.exit(1);
} 