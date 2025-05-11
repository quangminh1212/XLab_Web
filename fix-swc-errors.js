/**
 * Script để sửa lỗi SWC (Rust Compiler) trong Next.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Bắt đầu sửa lỗi SWC cho Next.js ===');

// Kiểm tra xem có thư mục SWC không
const swcDir = path.join(__dirname, 'node_modules', '@next', 'swc-win32-x64-msvc');
if (fs.existsSync(swcDir)) {
  console.log(`🔍 Đã tìm thấy thư mục SWC tại: ${swcDir}`);
  
  // Kiểm tra tệp binary
  const swcBinary = path.join(swcDir, 'next-swc.win32-x64-msvc.node');
  if (fs.existsSync(swcBinary)) {
    console.log(`📄 Tìm thấy tệp binary SWC: ${swcBinary}`);
    console.log('🔄 Sao lưu tệp binary SWC hiện tại...');
    
    try {
      fs.renameSync(swcBinary, `${swcBinary}.backup`);
      console.log(`✅ Đã sao lưu tệp binary SWC thành: ${swcBinary}.backup`);
    } catch (error) {
      console.error(`❌ Không thể sao lưu tệp binary SWC: ${error.message}`);
    }
  } else {
    console.log(`⚠️ Không tìm thấy tệp binary SWC tại: ${swcBinary}`);
  }
  
  // Cài đặt phiên bản WASM của SWC
  console.log('📦 Cài đặt @next/swc-wasm-nodejs...');
  try {
    execSync('npm i @next/swc-wasm-nodejs --no-save', { stdio: 'inherit' });
    console.log('✅ Đã cài đặt @next/swc-wasm-nodejs thành công');
    
    // Cập nhật .npmrc để sử dụng WASM
    const npmrcPath = path.join(__dirname, '.npmrc');
    let npmrcContent = '';
    
    if (fs.existsSync(npmrcPath)) {
      npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
      if (!npmrcContent.includes('next-swc-wasm=true')) {
        npmrcContent += '\nnext-swc-wasm=true\n';
      }
    } else {
      npmrcContent = 'next-swc-wasm=true\n';
    }
    
    fs.writeFileSync(npmrcPath, npmrcContent);
    console.log('✅ Đã cập nhật .npmrc để sử dụng SWC WASM');
    
  } catch (error) {
    console.error(`❌ Không thể cài đặt @next/swc-wasm-nodejs: ${error.message}`);
  }
}

// Sửa lỗi next.config.js
console.log('📝 Kiểm tra và sửa next.config.js...');
const nextConfigPath = path.join(__dirname, 'next.config.js');

if (fs.existsSync(nextConfigPath)) {
  let configContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Kiểm tra xem có swcMinify hoặc swcLoader không
  const hasSwcMinify = configContent.includes('swcMinify');
  const hasSwcLoader = configContent.includes('swcLoader');
  
  if (hasSwcMinify || hasSwcLoader) {
    console.log(`⚠️ Tìm thấy tùy chọn không hợp lệ trong next.config.js: ${hasSwcMinify ? 'swcMinify' : ''} ${hasSwcLoader ? 'swcLoader' : ''}`);
    
    // Thay thế các tùy chọn không hợp lệ
    if (hasSwcMinify) {
      configContent = configContent.replace(/swcMinify\s*:\s*[^,}]+/g, '// swcMinify removed');
    }
    
    if (hasSwcLoader) {
      configContent = configContent.replace(/swcLoader\s*:\s*[^,}]+/g, '// swcLoader removed');
    }
    
    fs.writeFileSync(nextConfigPath, configContent);
    console.log('✅ Đã xóa các tùy chọn không hợp lệ trong next.config.js');
  } else {
    console.log('✅ Không tìm thấy tùy chọn không hợp lệ trong next.config.js');
  }
} else {
  console.log(`❌ Không tìm thấy tệp next.config.js tại: ${nextConfigPath}`);
}

console.log('🔍 Sửa lỗi app-paths-manifest.json...');
const appPathsManifestPath = path.join(__dirname, '.next', 'server', 'app-paths-manifest.json');
const serverDir = path.join(__dirname, '.next', 'server');

if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
  console.log(`✅ Đã tạo thư mục: ${serverDir}`);
}

if (!fs.existsSync(appPathsManifestPath)) {
  const defaultManifest = {
    "/": "app/page.js",
    "/products": "app/products/page.js",
    "/products/[id]": "app/products/[id]/page.js"
  };
  
  fs.writeFileSync(appPathsManifestPath, JSON.stringify(defaultManifest, null, 2));
  console.log(`✅ Đã tạo tệp: ${appPathsManifestPath}`);
}

console.log('=== Đã hoàn tất sửa lỗi SWC ===');
console.log('🚀 Vui lòng khởi động lại ứng dụng bằng lệnh: npm run dev'); 