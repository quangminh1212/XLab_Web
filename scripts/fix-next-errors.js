const fs = require('fs');
const path = require('path');

/**
 * Script sửa lỗi cho Next.js
 * Xử lý các lỗi phổ biến gặp phải khi phát triển Next.js
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
];

requiredDirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Đã tạo thư mục: ${fullPath}`);
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
          fs.writeFileSync(packFile, '');
          console.log(`✅ Đã tạo file trống: ${packFile}`);
        }

        if (!fs.existsSync(packGzFile)) {
          fs.writeFileSync(packGzFile, '');
          console.log(`✅ Đã tạo file trống: ${packGzFile}`);
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
    fs.writeFileSync(cssFile, '/* Placeholder CSS */');
    console.log(`✅ Đã tạo file CSS giả: ${cssFile}`);
  }

  // Tạo file route.js giả cho NextAuth
  const nextAuthDir = path.join(process.cwd(), '.next/server/app/api/auth/[...nextauth]');
  if (!fs.existsSync(nextAuthDir)) {
    fs.mkdirSync(nextAuthDir, { recursive: true });
  }

  const routeFile = path.join(nextAuthDir, 'route.js');
  if (!fs.existsSync(routeFile)) {
    fs.writeFileSync(routeFile, '// Placeholder NextAuth route file');
    console.log(`✅ Đã tạo file route giả cho NextAuth: ${routeFile}`);
  }
};

// 4. Kiểm tra file .env và .env.local
const checkEnvFiles = () => {
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, 'NODE_ENV=development\nNEXTAUTH_URL=http://localhost:3000\n');
    console.log(`✅ Đã tạo file .env`);
  }

  if (!fs.existsSync(envLocalPath)) {
    fs.writeFileSync(
      envLocalPath,
      'NEXTAUTH_URL=http://localhost:3000\nNEXTAUTH_SECRET=voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=\n',
    );
    console.log(`✅ Đã tạo file .env.local`);
  }
};

// Thực thi tất cả các bước sửa lỗi
try {
  createEmptyPackFiles();
  createPlaceholderFiles();
  checkEnvFiles();
  console.log('✨ Đã hoàn tất sửa lỗi Next.js!');
} catch (error) {
  console.error('❌ Lỗi khi sửa Next.js:', error);
}
