const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing SWC (Rust Compiler) issues completely...');

// Đường dẫn đến thư mục dự án
const projectRoot = __dirname;

// 1. Cập nhật next.config.js để tắt SWC
const nextConfigPath = path.join(projectRoot, 'next.config.js');
let nextConfig = '';

if (fs.existsSync(nextConfigPath)) {
  nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Sao lưu file cấu hình
  fs.writeFileSync(`${nextConfigPath}.backup`, nextConfig);
  console.log(`✅ Backed up next.config.js to next.config.js.backup`);
  
  // Kiểm tra cấu trúc file và thêm cấu hình mới
  if (nextConfig.includes('module.exports')) {
    // Nếu file có định dạng module.exports = {...}
    if (nextConfig.includes('experimental:')) {
      // Nếu đã có experimental, thêm cấu hình vào
      nextConfig = nextConfig.replace(
        /experimental\s*:\s*{/,
        'experimental: {\n    swcTraceProfiling: false,\n    forceSwcTransforms: true,\n    incrementalCacheHandlerPath: false,\n    useWasmBinary: true,\n    '
      );
    } else {
      // Nếu chưa có experimental, thêm mới
      nextConfig = nextConfig.replace(
        /module\.exports\s*=\s*{/,
        'module.exports = {\n  experimental: {\n    swcTraceProfiling: false,\n    forceSwcTransforms: true,\n    incrementalCacheHandlerPath: false,\n    useWasmBinary: true,\n  },'
      );
    }
    
    // Thay thế cấu hình swcMinify nếu có
    if (nextConfig.includes('swcMinify')) {
      nextConfig = nextConfig.replace(/swcMinify\s*:\s*true/, 'swcMinify: false');
    } else {
      // Thêm swcMinify nếu chưa có
      nextConfig = nextConfig.replace(
        /module\.exports\s*=\s*{/,
        'module.exports = {\n  swcMinify: false,'
      );
    }
  } else {
    // Nếu file không theo định dạng standard, tạo file mới
    nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  experimental: {
    swcTraceProfiling: false,
    forceSwcTransforms: true,
    incrementalCacheHandlerPath: false,
    useWasmBinary: true,
  }
};

module.exports = nextConfig;
`;
  }
  
  // Lưu cấu hình mới
  fs.writeFileSync(nextConfigPath, nextConfig);
  console.log('✅ Updated next.config.js with optimized SWC settings');
} else {
  console.log('❌ next.config.js not found, creating new one...');
  
  // Tạo file cấu hình mới
  nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  experimental: {
    swcTraceProfiling: false,
    forceSwcTransforms: true,
    incrementalCacheHandlerPath: false,
    useWasmBinary: true,
  }
};

module.exports = nextConfig;
`;
  fs.writeFileSync(nextConfigPath, nextConfig);
  console.log('✅ Created new next.config.js with optimized SWC settings');
}

// 2. Cập nhật .npmrc để sử dụng WASM thay vì native
const npmrcPath = path.join(projectRoot, '.npmrc');
let npmrcContent = '';

if (fs.existsSync(npmrcPath)) {
  npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
  
  if (!npmrcContent.includes('next_use_wasm=1')) {
    npmrcContent += '\nnext_use_wasm=1\nnext-swc-wasm=true\n';
    fs.writeFileSync(npmrcPath, npmrcContent);
    console.log('✅ Updated .npmrc to use WASM');
  } else {
    console.log('ℹ️ .npmrc already configured to use WASM');
  }
} else {
  npmrcContent = 'next_use_wasm=1\nnext-swc-wasm=true\n';
  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('✅ Created .npmrc to use WASM');
}

// 3. Cài đặt các gói SWC-WASM cần thiết
console.log('📦 Installing SWC WASM packages...');
try {
  execSync('npm install --save-dev @next/swc-wasm-nodejs', { stdio: 'inherit' });
  console.log('✅ Installed @next/swc-wasm-nodejs successfully');
} catch (error) {
  console.log(`❌ Error installing SWC WASM packages: ${error.message}`);
}

// 4. Xóa thư mục cache của Next.js
const cachePaths = [
  path.join(projectRoot, '.next', 'cache'),
  path.join(projectRoot, 'node_modules', '.cache')
];

cachePaths.forEach(cachePath => {
  if (fs.existsSync(cachePath)) {
    try {
      // Sử dụng fs.rmSync thay vì rimraf
      fs.rmSync(cachePath, { recursive: true, force: true });
      console.log(`✅ Cleared cache: ${cachePath}`);
    } catch (error) {
      console.log(`❌ Error clearing cache ${cachePath}: ${error.message}`);
    }
  }
});

// Tạo lại thư mục cache
cachePaths.forEach(cachePath => {
  try {
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
      console.log(`✅ Created directory: ${cachePath}`);
    }
  } catch (error) {
    console.log(`❌ Error creating directory ${cachePath}: ${error.message}`);
  }
});

// 5. Tạo biến môi trường nếu cần
const envLocalPath = path.join(projectRoot, '.env.local');
let envLocalContent = '';

if (fs.existsSync(envLocalPath)) {
  envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  
  if (!envLocalContent.includes('NEXT_TELEMETRY_DISABLED=1')) {
    envLocalContent += '\nNEXT_TELEMETRY_DISABLED=1\n';
    fs.writeFileSync(envLocalPath, envLocalContent);
    console.log('✅ Updated .env.local with telemetry disabled');
  }
} else {
  envLocalContent = 'NEXT_TELEMETRY_DISABLED=1\n';
  fs.writeFileSync(envLocalPath, envLocalContent);
  console.log('✅ Created .env.local with telemetry disabled');
}

console.log('\n🚀 SWC fixes applied successfully. Please restart your Next.js application with:');
console.log('npm run dev'); 