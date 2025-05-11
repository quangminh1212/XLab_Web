const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🛠️ Bắt đầu sửa lỗi SWC...');

// Thư mục chứa node_modules
const nodeModulesDir = path.join(__dirname, 'node_modules');
// Thư mục chứa các package SWC
const swcPackagesDir = path.join(nodeModulesDir, '@next');

// Kiểm tra xem có thư mục node_modules không
if (!fs.existsSync(nodeModulesDir)) {
  console.log('❌ Không tìm thấy thư mục node_modules!');
  process.exit(1);
}

// Kiểm tra xem có thư mục @next không
if (!fs.existsSync(swcPackagesDir)) {
  console.log('❌ Không tìm thấy thư mục @next trong node_modules!');
  process.exit(1);
}

// Tìm và xóa các package SWC native trước khi cài đặt lại
const problematicPackages = [
  '@next/swc-win32-x64-msvc',
  '@next/swc-win32-ia32-msvc',
  '@next/swc-win32-arm64-msvc'
];

let removedPackages = 0;

// Duyệt qua danh sách package cần xóa
problematicPackages.forEach(packageName => {
  const packageDir = path.join(nodeModulesDir, packageName);
  if (fs.existsSync(packageDir)) {
    try {
      // Xóa thư mục package
      fs.rmSync(packageDir, { recursive: true });
      console.log(`✅ Đã xóa package ${packageName}`);
      removedPackages++;
    } catch (error) {
      console.error(`❌ Lỗi khi xóa package ${packageName}:`, error.message);
    }
  } else {
    console.log(`ℹ️ Package ${packageName} không tồn tại, bỏ qua.`);
  }
});

// Sửa file next.config.js
try {
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    let configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Kiểm tra và thay đổi cấu hình nếu cần
    if (configContent.includes('forceSwcTransforms: true')) {
      configContent = configContent.replace('forceSwcTransforms: true', 'forceSwcTransforms: false');
      console.log('✅ Đã tắt forceSwcTransforms trong next.config.js');
    }
    
    // Loại bỏ swcPlugins nếu có
    if (configContent.includes('swcPlugins:')) {
      configContent = configContent.replace(/swcPlugins:[^,}]+[,]?/, '');
      console.log('✅ Đã xóa swcPlugins không hợp lệ trong next.config.js');
    }
    
    // Thêm swcMinify: false vào mục chính nếu chưa có
    if (!configContent.includes('swcMinify:')) {
      configContent = configContent.replace(
        'reactStrictMode: true,', 
        'reactStrictMode: true,\n  swcMinify: false, // Tắt SWC minify để tránh sử dụng SWC'
      );
      console.log('✅ Đã thêm swcMinify: false vào mục chính của next.config.js');
    }
    
    // Đảm bảo swcMinify không nằm trong compiler
    if (configContent.includes('compiler: {')) {
      configContent = configContent.replace(/compiler: {\s*swcMinify: false,?\s*/, 'compiler: {');
      console.log('✅ Đã xóa swcMinify không đúng định dạng khỏi compiler');
    }
    
    // Lưu file
    fs.writeFileSync(nextConfigPath, configContent);
    console.log('✅ Đã cập nhật file next.config.js');
  }
} catch (error) {
  console.error('❌ Lỗi khi cập nhật next.config.js:', error.message);
}

// Cài đặt lại package WASM
try {
  // Xóa .next để đảm bảo build mới
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true });
    console.log('✅ Đã xóa thư mục .next để đảm bảo build mới');
  }

  // Đảm bảo rằng chúng ta chỉ cài đặt phiên bản WASM
  console.log('🔄 Cài đặt lại các dependencies...');
  execSync('npm install @next/swc-wasm-nodejs --force', { stdio: 'inherit' });
  console.log('✅ Đã cài đặt @next/swc-wasm-nodejs');
  
} catch (error) {
  console.error('❌ Lỗi khi cài đặt lại dependencies:', error.message);
}

// Thêm vào .gitignore
try {
  const gitignorePath = path.join(__dirname, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    
    // Danh sách các mục cần thêm vào .gitignore
    const ignoreItems = [
      '# Next.js build artifacts',
      '.next/',
      '.next/cache/',
      '.next/server/',
      '.next/static/',
      
      '# SWC native packages',
      'node_modules/@next/swc-*'
    ];
    
    // Kiểm tra và thêm từng mục vào .gitignore nếu chưa có
    let updated = false;
    ignoreItems.forEach(item => {
      if (!gitignoreContent.includes(item) && !item.startsWith('#')) {
        gitignoreContent += `\n${item}`;
        updated = true;
      }
    });
    
    // Nếu có mục mới được thêm vào, lưu lại .gitignore
    if (updated) {
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ Đã cập nhật .gitignore');
    }
  }
} catch (error) {
  console.error('❌ Lỗi khi cập nhật .gitignore:', error.message);
}

console.log('✅ Đã hoàn tất việc sửa lỗi SWC');
console.log('🚀 Bây giờ bạn có thể chạy "npm run dev" để khởi động ứng dụng'); 