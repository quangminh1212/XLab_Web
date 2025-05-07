const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const zlib = require('zlib');

// Đường dẫn đến các tệp và thư mục cần xử lý
const traceFile = path.join(__dirname, '.next', 'trace');
const nextDir = path.join(__dirname, '.next');
const cacheDirs = [
  path.join(__dirname, '.next', 'cache'),
  path.join(__dirname, '.next', 'cache', 'webpack'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'server-development'),
  path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development'),
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, '.next', 'server', 'vendor-chunks'),
  path.join(__dirname, '.next', 'static'),
  path.join(__dirname, '.next', 'static', 'chunks'),
  path.join(__dirname, '.next', 'static', 'css'),
  path.join(__dirname, '.next', 'static', 'media'),
  path.join(__dirname, '.next', 'static', 'webpack'),
  path.join(__dirname, '.next', 'static', 'development'),
  path.join(__dirname, '.next', 'types'),
  path.join(__dirname, 'node_modules', '.cache')
];

// Danh sách các file cần tạo để tránh lỗi
const filesToCreate = [
  { 
    path: path.join(__dirname, '.next', 'server', 'next-font-manifest.json'),
    content: '{"pages":{},"app":{}}'
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'app-paths-manifest.json'),
    content: '{"/_not-found":{"resolvedPagePath":"next/dist/client/components/not-found-error"},"/":{/":"app/page.js"}}'
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'webpack-runtime.js'),
    content: 'module.exports = { moduleLoading: true, loadModule: function() { return Promise.resolve({ default: {} }); } };'
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'pages', 'webpack-runtime.js'),
    content: 'module.exports = { moduleLoading: true, loadModule: function() { return Promise.resolve({ default: {} }); } };'
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
    content: '{"version":2,"sortedMiddleware":[],"middleware":{},"functions":{},"pages":{}}'
  },
  { 
    path: path.join(__dirname, '.next', 'build-manifest.json'),
    content: '{"polyfillFiles":[],"devFiles":[],"ampDevFiles":[],"lowPriorityFiles":[],"rootMainFiles":[],"pages":{"/_app":[],"/_error":[]},"ampFirstPages":[]}'
  },
  { 
    path: path.join(__dirname, '.next', 'react-loadable-manifest.json'),
    content: '{}'
  },
  { 
    path: path.join(__dirname, '.next', 'server', 'vendor-chunks', 'next.js'),
    content: 'module.exports = { createContext: () => ({}) };'
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
 * Tạo file .gz với nội dung mặc định để tránh lỗi ENOENT
 * @param {string} filePath Đường dẫn file
 */
function createGzipFile(filePath) {
  try {
    const content = Buffer.from('{"version":1,"content":{}}');
    const compressed = zlib.gzipSync(content);
    fs.writeFileSync(filePath, compressed);
    console.log(`Đã tạo file gzip: ${filePath}`);
  } catch (err) {
    console.error(`Lỗi khi tạo file gzip ${filePath}:`, err.message);
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
  
  // Tạo các file cho static directory
  createStaticPlaceholders();
}

/**
 * Tạo các static placeholders để tránh lỗi
 */
function createStaticPlaceholders() {
  const staticDirs = [
    path.join(__dirname, '.next', 'static', 'chunks', 'app'),
    path.join(__dirname, '.next', 'static', 'chunks', 'pages'),
    path.join(__dirname, '.next', 'static', 'chunks', 'webpack'),
    path.join(__dirname, '.next', 'static', 'css', 'app'),
    path.join(__dirname, '.next', 'static', 'media'),
    path.join(__dirname, '.next', 'static', 'webpack'),
  ];

  staticDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục static: ${dir}`);
    }
  });

  // Tạo file CSS placeholder
  const cssPlaceholder = path.join(__dirname, '.next', 'static', 'css', 'app', 'layout.css');
  try {
    fs.writeFileSync(cssPlaceholder, '/* Placeholder CSS */');
    console.log(`Đã tạo file static placeholder: ${cssPlaceholder}`);
  } catch (err) {
    console.error(`Lỗi khi tạo file ${cssPlaceholder}:`, err.message);
  }
  
  // Tạo file vendor-chunks/next.js
  const vendorNextJs = path.join(__dirname, '.next', 'server', 'vendor-chunks', 'next.js');
  try {
    fs.writeFileSync(vendorNextJs, 'module.exports = { createContext: () => ({}) };');
    console.log(`Đã tạo file vendor next.js: ${vendorNextJs}`);
  } catch (err) {
    console.error(`Lỗi khi tạo file ${vendorNextJs}:`, err.message);
  }
}

/**
 * Tạo các webpack cache placeholder để tránh lỗi
 */
function createWebpackPlaceholders() {
  // Tạo các tệp placeholder pack.gz để tránh lỗi
  const webpackDirs = [
    path.join(__dirname, '.next', 'cache', 'webpack', 'client-development'),
    path.join(__dirname, '.next', 'cache', 'webpack', 'server-development'),
    path.join(__dirname, '.next', 'cache', 'webpack', 'edge-server-development')
  ];

  webpackDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục cache: ${dir}`);
    }

    // Tạo 5 tệp .pack và .pack.gz placeholder để đầy đủ hơn
    for (let i = 0; i < 5; i++) {
      const packFile = path.join(dir, `${i}.pack`);
      const gzipFile = path.join(dir, `${i}.pack.gz`);
      
      try {
        fs.writeFileSync(packFile, '{"version":1,"content":{}}');
        console.log(`Đã tạo file placeholder: ${packFile}`);
        
        // Tạo file .gz tương ứng
        createGzipFile(gzipFile);
      } catch (err) {
        console.error(`Lỗi khi tạo file ${packFile}:`, err.message);
      }
    }
  });
}

/**
 * Xóa các file cache webpack gây lỗi
 */
function cleanWebpackCache() {
  const cacheDir = path.join(__dirname, '.next', 'cache', 'webpack');
  const subDirs = ['client-development', 'server-development', 'edge-server-development'];
  
  try {
    if (!fs.existsSync(cacheDir)) {
      return;
    }
    
    for (const subDir of subDirs) {
      const dirPath = path.join(cacheDir, subDir);
      
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
          if (file.endsWith('.pack.gz') || file.endsWith('.pack')) {
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

// Tạo các placeholder cho webpack cache
createWebpackPlaceholders();

// Thực thi hàm
cleanTrace();