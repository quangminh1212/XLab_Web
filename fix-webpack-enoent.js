const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Fix cho lỗi webpack ENOENT khi Next.js cố gắng đọc file .pack hoặc .pack.gz
 * trong thư mục cache mà đã bị xóa
 */

// Tạo thư mục cache nếu chưa tồn tại
const createCacheFolders = () => {
  const cacheDirs = [
    '.next/cache/webpack/client-development',
    '.next/cache/webpack/server-development',
    '.next/cache/webpack/edge-server-development',
    '.next/static/chunks',
    '.next/server/app',
    '.next/server/chunks',
    '.next/static/css'
  ];

  cacheDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Đã tạo thư mục: ${fullPath}`);
    }
  });
};

// Xóa hết các file .pack và .pack.gz
const cleanupPackFiles = () => {
  const cacheRoot = path.join(process.cwd(), '.next/cache/webpack');
  if (!fs.existsSync(cacheRoot)) return;

  const dirs = ['client-development', 'server-development', 'edge-server-development'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(cacheRoot, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (file.endsWith('.pack') || file.endsWith('.pack.gz')) {
          const filePath = path.join(dirPath, file);
          fs.unlinkSync(filePath);
          console.log(`Đã xóa file: ${filePath}`);
        }
      });
    }
  });
};

// Tạo các file .pack trống để ngăn lỗi ENOENT
const createEmptyPackFiles = () => {
  const cacheRoot = path.join(process.cwd(), '.next/cache/webpack');
  if (!fs.existsSync(cacheRoot)) return;

  const dirs = ['client-development', 'server-development', 'edge-server-development'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(cacheRoot, dir);
    if (fs.existsSync(dirPath)) {
      for (let i = 0; i <= 5; i++) {
        const packFile = path.join(dirPath, `${i}.pack`);
        fs.writeFileSync(packFile, '{}');
        console.log(`Đã tạo file: ${packFile}`);
        
        const packGzFile = path.join(dirPath, `${i}.pack.gz`);
        // Tạo file gzip hợp lệ thay vì file trống
        const gzipData = zlib.gzipSync(Buffer.from('{}'));
        fs.writeFileSync(packGzFile, gzipData);
        console.log(`Đã tạo file gzip: ${packGzFile}`);
      }
    }
  });
};

// Tạo CSS file để ngăn lỗi 404
const createPlaceholderCssFile = () => {
  const cssDir = path.join(process.cwd(), '.next/static/css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  const cssFile = path.join(cssDir, 'app-layout.css');
  fs.writeFileSync(cssFile, '/* Placeholder CSS file */');
  console.log(`Đã tạo file CSS placeholder: ${cssFile}`);
};

// Tạo file static placeholder
const createStaticPlaceholders = () => {
  const staticChunksDir = path.join(process.cwd(), '.next/static/chunks');
  if (!fs.existsSync(staticChunksDir)) {
    fs.mkdirSync(staticChunksDir, { recursive: true });
  }
  
  const files = [
    'main-app.js',
    'app-pages-internals.js',
    'app/not-found.js',
    'app/page.js',
    'app/loading.js'
  ];
  
  files.forEach(file => {
    const filePath = path.join(staticChunksDir, file);
    const dirPath = path.dirname(filePath);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, '// Placeholder file');
    console.log(`Đã tạo file tĩnh: ${filePath}`);
  });
};

// Thực hiện dọn dẹp và sửa lỗi
const runFix = () => {
  try {
    createCacheFolders();
    cleanupPackFiles();
    createEmptyPackFiles();
    createPlaceholderCssFile();
    createStaticPlaceholders();
    console.log('Hoàn tất việc dọn dẹp và chuẩn bị môi trường.');
  } catch (error) {
    console.error('Lỗi khi thực hiện sửa lỗi webpack:', error);
  }
};

runFix(); 