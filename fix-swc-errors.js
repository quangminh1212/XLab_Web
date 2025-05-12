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

// Tạo thư mục .swc-disabled để đánh dấu là đã xử lý
const swcDisabledDir = path.join(__dirname, '.swc-disabled');
if (!fs.existsSync(swcDisabledDir)) {
  try {
    fs.mkdirSync(swcDisabledDir, { recursive: true });
    console.log('✅ Đã tạo thư mục .swc-disabled để vô hiệu hóa SWC native');
  } catch (err) {
    console.log('⚠️ Không thể tạo thư mục .swc-disabled:', err.message);
  }
}

// Danh sách các package SWC native gây vấn đề
const problematicPackages = [
  '@next/swc-win32-x64-msvc',
  '@next/swc-win32-ia32-msvc',
  '@next/swc-win32-arm64-msvc'
];

// Kiểm tra xem các package có tồn tại không, nhưng không xóa
problematicPackages.forEach(packageName => {
  const packageDir = path.join(nodeModulesDir, packageName);
  if (fs.existsSync(packageDir)) {
    // Tạo file đánh dấu để vô hiệu hóa
    const disableMarker = path.join(swcDisabledDir, packageName.replace(/\//g, '-') + '.disabled');
    try {
      fs.writeFileSync(disableMarker, new Date().toISOString());
      console.log(`✅ Đã đánh dấu vô hiệu hóa package ${packageName}`);
    } catch (error) {
      console.log(`⚠️ Không thể đánh dấu package ${packageName}:`, error.message);
    }
  } else {
    console.log(`ℹ️ Package ${packageName} không tồn tại, bỏ qua.`);
  }
});

// Tạo file .env.local hoặc cập nhật nếu đã tồn tại
try {
  const envPath = path.join(__dirname, '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Thêm cấu hình để sử dụng SWC-WASM
  if (!envContent.includes('NEXT_DISABLE_SWC_NATIVE=1')) {
    envContent += '\nNEXT_DISABLE_SWC_NATIVE=1';
  }
  
  if (!envContent.includes('NEXT_USE_SWC_WASM=1')) {
    envContent += '\nNEXT_USE_SWC_WASM=1';
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Đã cập nhật file .env.local để sử dụng SWC-WASM');
} catch (error) {
  console.error('❌ Lỗi khi cập nhật .env.local:', error.message);
}

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
    
    // Kiểm tra và xóa swcMinify vì không còn là tùy chọn hợp lệ trong Next.js 15+
    if (configContent.includes('swcMinify:')) {
      configContent = configContent.replace(/swcMinify:\s*(true|false)[,]?/g, '');
      configContent = configContent.replace(/,\s*,/g, ','); // Xóa dấu phẩy dư thừa
      console.log('✅ Đã xóa swcMinify không hợp lệ trong next.config.js');
    }
    
    // Thêm cấu hình WASM SWC vào next.config.js
    const customConfigText = `
// Đặt headers để sử dụng SWC-WASM
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Next-SWC-Version',
          value: 'wasm',
        },
      ],
    },
  ];
},`;
    
    // Kiểm tra xem đã có headers chưa
    if (!configContent.includes('async headers()')) {
      // Thêm vào sau module.exports = {
      configContent = configContent.replace(
        /module\.exports\s*=\s*{/,
        `module.exports = {${customConfigText}`
      );
      console.log('✅ Đã thêm cấu hình WASM SWC vào next.config.js');
    } else if (!configContent.includes('Next-SWC-Version')) {
      // Đã có headers nhưng không có Next-SWC-Version, thêm vào
      configContent = configContent.replace(
        /async headers\(\)\s*{\s*return\s*\[\s*{\s*source:\s*['"]\/\(\.\*\)['"],\s*headers:\s*\[/,
        `async headers() { return [{ source: '/(.*)', headers: [
          {
            key: 'Next-SWC-Version',
            value: 'wasm',
          },`
      );
      console.log('✅ Đã thêm Next-SWC-Version vào headers hiện có');
    }
    
    // Đảm bảo compiler không chứa swcMinify
    if (configContent.includes('compiler: {')) {
      configContent = configContent.replace(/compiler: {\s*swcMinify: (true|false),?\s*/, 'compiler: {');
      console.log('✅ Đã xóa swcMinify không đúng định dạng khỏi compiler');
    }
    
    // Lưu file
    fs.writeFileSync(nextConfigPath, configContent);
    console.log('✅ Đã cập nhật file next.config.js');
  }
} catch (error) {
  console.error('❌ Lỗi khi cập nhật next.config.js:', error.message);
}

// Thêm cấu hình vào package.json
try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Thêm script để tắt SWC native
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    if (!packageJson.scripts['dev:wasm']) {
      packageJson.scripts['dev:wasm'] = 'cross-env NEXT_DISABLE_SWC_NATIVE=1 NEXT_USE_SWC_WASM=1 next dev';
      console.log('✅ Đã thêm script dev:wasm vào package.json');
    }
    
    // Thêm dependency @next/swc-wasm-nodejs nếu chưa có
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    
    if (!packageJson.dependencies['@next/swc-wasm-nodejs']) {
      // Lấy phiên bản Next.js hiện tại
      const nextVersion = packageJson.dependencies['next'] || '';
      const nextVersionNumber = nextVersion.replace(/[^0-9.]/g, '');
      
      packageJson.dependencies['@next/swc-wasm-nodejs'] = nextVersionNumber || 'latest';
      console.log('✅ Đã thêm dependency @next/swc-wasm-nodejs vào package.json');
    }
    
    // Lưu lại package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Đã cập nhật package.json');
  }
} catch (error) {
  console.error('❌ Lỗi khi cập nhật package.json:', error.message);
}

// Cài đặt @next/swc-wasm-nodejs
try {
  console.log('🔄 Cài đặt lại các dependencies...');
  try {
    execSync('npm install @next/swc-wasm-nodejs', { stdio: 'pipe' });
    console.log('✅ Đã cài đặt @next/swc-wasm-nodejs');
  } catch (err) {
    console.log('⚠️ Không thể cài đặt @next/swc-wasm-nodejs, thử phương pháp khác...');
    try {
      execSync('npm install @next/swc-wasm-nodejs --no-save', { stdio: 'pipe' });
      console.log('✅ Đã cài đặt @next/swc-wasm-nodejs (--no-save)');
    } catch (e) {
      console.error('❌ Không thể cài đặt @next/swc-wasm-nodejs:', e.message);
    }
  }
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
      '# SWC related files',
      'node_modules/@next/swc-*',
      '.swc-disabled/',
      '.next/trace',
      '.next/trace.*',
      'dev.cmd',
      'dev.ps1',
      'powershell-dev.ps1',
      'start-dev.bat'
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
console.log('🚀 Bây giờ bạn có thể chạy "run.bat" để khởi động ứng dụng với SWC-WASM'); 