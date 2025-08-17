const fs = require('fs');
const path = require('path');

/**
 * Script sửa lỗi cho Next.js
 * Xử lý các lỗi phổ biến gặp phải khi phát triển Next.js
 */

// Skip when running on CI/Vercel to avoid filesystem side-effects during npm install
if (process.env.CI === 'true' || process.env.VERCEL) {
  console.log('⏭️  Skipping fix-next-errors.js on CI/Vercel environment');
  process.exit(0);
}

console.log('🔧 Đang chuẩn bị môi trường Next.js...');

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

// 2. Kiểm tra và tạo thư mục i18n nếu cần
const createI18nDirectories = () => {
  const i18nDirs = [
    'src/i18n/eng/product',
    'src/i18n/vie/product'
  ];

  i18nDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Đã tạo thư mục i18n: ${fullPath}`);
    }
  });

  // Sao chép các file sản phẩm từ tiếng Việt sang tiếng Anh nếu cần
  const vieProductDir = path.join(process.cwd(), 'src/i18n/vie/product');
  const engProductDir = path.join(process.cwd(), 'src/i18n/eng/product');

  if (fs.existsSync(vieProductDir)) {
    const files = fs.readdirSync(vieProductDir);
    files.forEach(file => {
      const sourceFile = path.join(vieProductDir, file);
      const targetFile = path.join(engProductDir, file);

      if (!fs.existsSync(targetFile) && fs.statSync(sourceFile).isFile()) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ Đã sao chép file: ${file} từ tiếng Việt sang tiếng Anh`);
      }
    });
  }
};

// 3. Kiểm tra file .env và .env.local
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

// Thực thi tất cả các bước
try {
  createI18nDirectories();
  checkEnvFiles();
  console.log('✨ Đã hoàn tất chuẩn bị môi trường Next.js!');
} catch (error) {
  console.error('❌ Lỗi khi chuẩn bị môi trường Next.js:', error);
}
