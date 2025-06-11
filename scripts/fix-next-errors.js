const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Script sửa lỗi cho Next.js
 * Xử lý các lỗi phổ biến gặp phải khi phát triển Next.js
 * Phiên bản 2.0 - Cập nhật và tối ưu
 */

console.log('🔧 Đang sửa lỗi Next.js...');

// 1. Tạo thư mục cache và static nếu chưa tồn tại
const requiredDirs = [
  '.next/cache/webpack/client-development',
  '.next/cache/webpack/server-development',
  '.next/cache/webpack/edge-server-development',
  '.next/static/chunks',
  '.next/static/css',
  '.next/server/app',
  '.next/server/chunks',
  '.next/server/pages',
  '.next/trace',
];

requiredDirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true, mode: 0o777 });
      console.log(`✅ Đã tạo thư mục: ${fullPath}`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo thư mục: ${fullPath}`, error.message);
    }
  }
});

// 2. Tạo các file .pack giả để tránh lỗi ENOENT
const createEmptyPackFiles = () => {
  const webpackDirs = [
    '.next/cache/webpack/client-development',
    '.next/cache/webpack/server-development',
    '.next/cache/webpack/edge-server-development',
  ];

  webpackDirs.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      for (let i = 0; i <= 5; i++) {
        const packFile = path.join(fullPath, `${i}.pack`);
        const packGzFile = path.join(fullPath, `${i}.pack.gz`);

        if (!fs.existsSync(packFile)) {
          try {
            fs.writeFileSync(packFile, '', { mode: 0o666 });
            console.log(`✅ Đã tạo file trống: ${packFile}`);
          } catch (error) {
            console.warn(`⚠️ Không thể tạo file: ${packFile}`, error.message);
          }
        }

        if (!fs.existsSync(packGzFile)) {
          try {
            fs.writeFileSync(packGzFile, '', { mode: 0o666 });
            console.log(`✅ Đã tạo file trống: ${packGzFile}`);
          } catch (error) {
            console.warn(`⚠️ Không thể tạo file: ${packGzFile}`, error.message);
          }
        }
      }
    }
  });
};

// 3. Tạo file CSS giả để tránh lỗi 404
const createPlaceholderFiles = () => {
  const cssDir = path.join(process.cwd(), '.next/static/css');
  const cssFile = path.join(cssDir, 'app-layout.css');

  if (!fs.existsSync(cssFile)) {
    try {
      fs.writeFileSync(cssFile, '/* Placeholder CSS */', { mode: 0o666 });
      console.log(`✅ Đã tạo file CSS giả: ${cssFile}`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo file CSS: ${cssFile}`, error.message);
    }
  }

  // Tạo file route.js giả cho NextAuth
  const nextAuthDir = path.join(process.cwd(), '.next/server/app/api/auth/[...nextauth]');
  if (!fs.existsSync(nextAuthDir)) {
    try {
      fs.mkdirSync(nextAuthDir, { recursive: true, mode: 0o777 });
    } catch (error) {
      console.warn(`⚠️ Không thể tạo thư mục NextAuth: ${nextAuthDir}`, error.message);
    }
  }

  const routeFile = path.join(nextAuthDir, 'route.js');
  if (!fs.existsSync(routeFile)) {
    try {
      fs.writeFileSync(routeFile, '// Placeholder NextAuth route file', { mode: 0o666 });
      console.log(`✅ Đã tạo file route giả cho NextAuth: ${routeFile}`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo file route NextAuth: ${routeFile}`, error.message);
    }
  }
};

// 4. Kiểm tra file .env và .env.local
const checkEnvFiles = () => {
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    try {
      fs.writeFileSync(envPath, 'NODE_ENV=development\nNEXTAUTH_URL=http://localhost:3000\n', { mode: 0o600 });
      console.log(`✅ Đã tạo file .env`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo file .env: ${envPath}`, error.message);
    }
  }

  if (!fs.existsSync(envLocalPath)) {
    try {
      fs.writeFileSync(
        envLocalPath,
        'NEXTAUTH_URL=http://localhost:3000\nNEXTAUTH_SECRET=voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=\n',
        { mode: 0o600 }
      );
      console.log(`✅ Đã tạo file .env.local`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo file .env.local: ${envLocalPath}`, error.message);
    }
  }
};

// 5. Kiểm tra quyền thư mục .next
const checkNextPermissions = () => {
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    try {
      const isWindows = os.platform() === 'win32';
      if (!isWindows) {
        // Chỉ thực hiện trên Linux/macOS
        fs.chmodSync(nextDir, 0o777);
        fs.chmodSync(path.join(nextDir, 'trace'), 0o777);
      }
      console.log(`✅ Đã cập nhật quyền cho thư mục .next`);
    } catch (error) {
      console.warn(`⚠️ Không thể cập nhật quyền cho thư mục .next: ${nextDir}`, error.message);
    }
  }
};

// 6. Xóa các file lock nếu tồn tại
const cleanLockFiles = () => {
  const lockFiles = [
    '.next/trace.lock',
    '.next/cache.lock',
    '.next/webpack.lock',
  ];

  lockFiles.forEach((lockFile) => {
    const fullPath = path.join(process.cwd(), lockFile);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`✅ Đã xóa file lock: ${fullPath}`);
      } catch (error) {
        console.warn(`⚠️ Không thể xóa file lock: ${fullPath}`, error.message);
      }
    }
  });
};

// 7. Tạo thư mục dữ liệu nếu chưa tồn tại
const ensureDataDirs = () => {
  const dataDirs = [
    'data',
    'data/backups',
    'public/images/products',
    'public/images/categories',
    'public/images/placeholder',
  ];

  dataDirs.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      try {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Đã tạo thư mục dữ liệu: ${fullPath}`);
      } catch (error) {
        console.warn(`⚠️ Không thể tạo thư mục dữ liệu: ${fullPath}`, error.message);
      }
    }
  });
  
  // Tạo file placeholder nếu cần
  const placeholderImg = path.join(process.cwd(), 'public/images/placeholder/product-placeholder.jpg');
  if (!fs.existsSync(placeholderImg)) {
    try {
      // Nếu không có, tạo file rỗng
      const sampleImg = path.join(process.cwd(), 'public/images/placeholder.jpg');
      if (fs.existsSync(sampleImg)) {
        fs.copyFileSync(sampleImg, placeholderImg);
      } else {
        fs.writeFileSync(placeholderImg, '');
      }
      console.log(`✅ Đã tạo file placeholder: ${placeholderImg}`);
    } catch (error) {
      console.warn(`⚠️ Không thể tạo file placeholder: ${placeholderImg}`, error.message);
    }
  }
};

// Thực thi tất cả các bước sửa lỗi
try {
  createEmptyPackFiles();
  createPlaceholderFiles();
  checkEnvFiles();
  checkNextPermissions();
  cleanLockFiles();
  ensureDataDirs();
  console.log('✨ Đã hoàn tất sửa lỗi Next.js!');
} catch (error) {
  console.error('❌ Lỗi khi sửa Next.js:', error);
}
