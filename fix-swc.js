const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Bắt đầu sửa lỗi SWC ===');

// Kiểm tra phiên bản Node.js
console.log('Phiên bản Node.js:', process.version);

// Kiểm tra phiên bản Next.js
try {
  const nextPkg = require('./node_modules/next/package.json');
  console.log('Phiên bản Next.js:', nextPkg.version);
} catch (err) {
  console.error('Không thể đọc phiên bản Next.js:', err.message);
}

// Đường dẫn tới file SWC native
const swcPath = path.join(__dirname, 'node_modules', '@next', 'swc-win32-x64-msvc');
const swcNodePath = path.join(swcPath, 'next-swc.win32-x64-msvc.node');

// Xóa module SWC hiện tại
console.log('Đang xóa module SWC hiện tại...');
try {
  if (fs.existsSync(swcPath)) {
    fs.rmSync(swcPath, { recursive: true, force: true });
    console.log('✅ Đã xóa module SWC hiện tại');
  } else {
    console.log('⚠️ Không tìm thấy module SWC');
  }
} catch (err) {
  console.error('❌ Lỗi khi xóa module SWC:', err.message);
}

// Cài đặt lại module SWC
console.log('Đang cài đặt lại module SWC...');
try {
  execSync('npm i -D @next/swc-win32-x64-msvc@latest', { stdio: 'inherit' });
  console.log('✅ Đã cài đặt lại module SWC');
} catch (err) {
  console.error('❌ Lỗi khi cài đặt lại module SWC:', err.message);
}

// Kiểm tra xem file SWC đã được cài đặt hay chưa
console.log('Kiểm tra file SWC...');
if (fs.existsSync(swcNodePath)) {
  const stats = fs.statSync(swcNodePath);
  const fileSizeInKB = Math.round(stats.size / 1024);
  console.log('✅ File SWC đã được cài đặt thành công');
  console.log(`Kích thước file: ${fileSizeInKB} KB`);
  console.log(`Ngày tạo file: ${stats.birthtime}`);
  console.log(`Ngày sửa đổi cuối: ${stats.mtime}`);
} else {
  console.error('❌ File SWC không tồn tại sau khi cài đặt');
}

// Cập nhật cấu hình Next.js
console.log('Đang cập nhật cấu hình Next.js...');
try {
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Xóa swcMinify nếu tồn tại
  nextConfig = nextConfig.replace(/,\s*swcMinify:\s*false/g, '');
  
  // Cập nhật cấu hình compiler
  nextConfig = nextConfig.replace(
    /compiler:\s*{[^}]*}/g,
    `compiler: {
    styledComponents: true
  }`
  );
  
  // Cập nhật cấu hình experimental
  nextConfig = nextConfig.replace(
    /experimental:\s*{[^}]*}/g,
    `experimental: {
    largePageDataBytes: 12800000,
    forceSwcTransforms: false,
    appDocumentPreloading: false,
    disableOptimizedLoading: true,
    disablePostcssPresetEnv: true
  }`
  );
  
  fs.writeFileSync(nextConfigPath, nextConfig);
  console.log('✅ Đã cập nhật cấu hình Next.js');
} catch (err) {
  console.error('❌ Lỗi khi cập nhật cấu hình Next.js:', err.message);
}

// Tạo file .swcrc
console.log('Đang tạo file .swcrc...');
try {
  const swcrcPath = path.join(__dirname, '.swcrc');
  const swcrcContent = JSON.stringify({
    jsc: {
      parser: {
        syntax: "ecmascript",
        jsx: true,
        dynamicImport: true,
        privateMethod: true,
        functionBind: true,
        exportDefaultFrom: true,
        exportNamespaceFrom: true,
        decorators: true,
        decoratorsBeforeExport: true,
        topLevelAwait: true,
        importMeta: true
      },
      transform: {
        react: {
          runtime: "automatic",
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
          throwIfNamespace: true,
          development: false,
          useBuiltins: false
        }
      },
      target: "es2021",
      loose: false,
      externalHelpers: false,
      keepClassNames: true
    },
    minify: false,
    isModule: true
  }, null, 2);
  
  fs.writeFileSync(swcrcPath, swcrcContent);
  console.log('✅ Đã tạo file .swcrc');
} catch (err) {
  console.error('❌ Lỗi khi tạo file .swcrc:', err.message);
}

console.log('=== Hoàn tất sửa lỗi SWC ===');
console.log('🚀 Bạn có thể chạy "npm run dev" để kiểm tra kết quả'); 