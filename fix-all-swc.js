const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===== SỬA TRIỆT ĐỂ TẤT CẢ CÁC LỖI SWC =====');

// Xác định đường dẫn
const projectRoot = __dirname;
const nextSwcFallbackDir = path.join(projectRoot, 'node_modules', 'next', 'next-swc-fallback');
const swcNativeDir = path.join(projectRoot, 'node_modules', '@next', 'swc-win32-x64-msvc');
const nextCacheDir = path.join(projectRoot, '.next', 'cache');
const nodeModulesCacheDir = path.join(projectRoot, 'node_modules', '.cache');

// 1. Xóa các thư mục SWC native và fallback
console.log('🧹 Xóa các thư mục SWC native và fallback...');
[nextSwcFallbackDir, swcNativeDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Đã xóa thư mục: ${dir}`);
    } catch (error) {
      console.error(`❌ Lỗi khi xóa thư mục ${dir}: ${error.message}`);
    }
  }
});

// 2. Xóa cache Next.js
console.log('🧹 Xóa cache Next.js...');
[nextCacheDir, nodeModulesCacheDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Đã xóa thư mục cache: ${dir}`);
    } catch (error) {
      console.error(`❌ Lỗi khi xóa thư mục cache ${dir}: ${error.message}`);
    }
  }
});

// 3. Cài đặt các dependency cần thiết cho Babel
console.log('📦 Cài đặt các dependency cần thiết cho Babel...');
try {
  const babelDeps = [
    'babel-loader@8.3.0',
    '@babel/core@7.22.5',
    '@babel/preset-env@7.22.5',
    '@babel/preset-react@7.22.5',
    '@babel/preset-typescript@7.22.5',
    '@babel/plugin-transform-runtime@7.22.5',
    'cross-env@7.0.3'
  ];
  
  execSync(`npm install --save-dev ${babelDeps.join(' ')}`, { stdio: 'inherit' });
  console.log('✅ Đã cài đặt các dependency Babel thành công');
} catch (error) {
  console.error(`❌ Lỗi khi cài đặt Babel: ${error.message}`);
}

// 4. Xóa swc module khỏi package.json
console.log('📝 Cập nhật package.json...');
try {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.devDependencies && packageJson.devDependencies['@next/swc-win32-x64-msvc']) {
    delete packageJson.devDependencies['@next/swc-win32-x64-msvc'];
    console.log('✅ Đã xóa @next/swc-win32-x64-msvc khỏi package.json');
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies['@next/swc-wasm-nodejs']) {
    delete packageJson.devDependencies['@next/swc-wasm-nodejs'];
    console.log('✅ Đã xóa @next/swc-wasm-nodejs khỏi package.json');
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Đã cập nhật package.json');
} catch (error) {
  console.error(`❌ Lỗi khi cập nhật package.json: ${error.message}`);
}

// 5. Tạo file .env.development.local để tắt cảnh báo
console.log('📝 Tạo file .env.development.local...');
try {
  const envContent = `NODE_OPTIONS=--no-warnings
NEXT_TELEMETRY_DISABLED=1
DISABLE_SWC=true
NEXT_DISABLE_SWC=1`;
  
  fs.writeFileSync(path.join(projectRoot, '.env.development.local'), envContent);
  console.log('✅ Đã tạo file .env.development.local');
} catch (error) {
  console.error(`❌ Lỗi khi tạo file .env.development.local: ${error.message}`);
}

// 6. Gỡ cài đặt swc modules
console.log('🧹 Gỡ cài đặt SWC modules...');
try {
  execSync('npm uninstall @next/swc-win32-x64-msvc @next/swc-wasm-nodejs', { stdio: 'inherit' });
  console.log('✅ Đã gỡ cài đặt SWC modules');
} catch (error) {
  console.error(`❌ Lỗi khi gỡ cài đặt SWC modules: ${error.message}`);
}

// 7. Tạo file start không hiển thị cảnh báo
console.log('📝 Tạo file start-no-warning.bat...');
try {
  const startBatContent = `@echo off
echo ===== KHỞI ĐỘNG NEXTJS KHÔNG HIỂN THỊ CẢNH BÁO =====
set DISABLE_SWC=true
set NEXT_DISABLE_SWC=1
set NODE_OPTIONS=--no-warnings --max_old_space_size=4096

echo Cleaning cache...
if exist .next\\cache rmdir /s /q .next\\cache
if exist node_modules\\.cache rmdir /s /q node_modules\\.cache
mkdir .next\\cache

echo Cleaning SWC fallback...
if exist node_modules\\next\\next-swc-fallback rmdir /s /q node_modules\\next\\next-swc-fallback
if exist node_modules\\@next\\swc-win32-x64-msvc rmdir /s /q node_modules\\@next\\swc-win32-x64-msvc

echo Starting Next.js with Babel...
npx cross-env DISABLE_SWC=true NEXT_DISABLE_SWC=1 NODE_OPTIONS="--no-warnings" next dev
`;
  
  fs.writeFileSync(path.join(projectRoot, 'start-no-warning.bat'), startBatContent);
  console.log('✅ Đã tạo file start-no-warning.bat');
} catch (error) {
  console.error(`❌ Lỗi khi tạo file start-no-warning.bat: ${error.message}`);
}

console.log('\n===== TẤT CẢ CÁC BƯỚC ĐÃ HOÀN THÀNH =====');
console.log('🚀 Hãy chạy "start-no-warning.bat" để khởi động Next.js mà không hiển thị cảnh báo');

// Create or update .npmrc
const npmrcPath = path.join(__dirname, '.npmrc');
const npmrcContent = `legacy-peer-deps=true
node-linker=hoisted
preferred-cache-folder=.npm-cache
`;

fs.writeFileSync(npmrcPath, npmrcContent);
console.log('Updated .npmrc file');

// Fix next.config.js
const nextConfigPath = path.join(__dirname, 'next.config.js');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf-8');

// Make sure experimental section is correct
nextConfig = nextConfig.replace(
  /experimental:\s*{[^}]*}/s,
  `experimental: {
    largePageDataBytes: 12800000,
    forceSwcTransforms: true,
    appDocumentPreloading: false
  }`
);

// Remove swcMinify 
nextConfig = nextConfig.replace(/swcMinify:\s*(true|false),?\n?/g, '');

// Remove incrementalCacheHandlerPath
nextConfig = nextConfig.replace(/incrementalCacheHandlerPath:\s*['"][^'"]*['"],?\n?/g, '');

// Write back the updated config
fs.writeFileSync(nextConfigPath, nextConfig);
console.log('Updated next.config.js file');

// Move .babelrc to backup if it exists
const babelrcPath = path.join(__dirname, '.babelrc');
const babelrcBackupPath = path.join(__dirname, '.babelrc.backup');
if (fs.existsSync(babelrcPath) && !fs.existsSync(babelrcBackupPath)) {
  fs.renameSync(babelrcPath, babelrcBackupPath);
  console.log('Backed up .babelrc file to .babelrc.backup');
}

// Update package.json scripts to remove DISABLE_SWC
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Remove DISABLE_SWC=true from all scripts
Object.keys(packageJson.scripts).forEach(script => {
  packageJson.scripts[script] = packageJson.scripts[script].replace(/DISABLE_SWC=true\s*/g, '');
});

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('Updated package.json scripts');

console.log('SWC fixes applied. Run npm install and then npm run dev to start your application'); 