/**
 * FIX TRACE ERROR
 * Sửa lỗi file trace trong Next.js
 * Tạo các file cần thiết để tránh lỗi middleware-manifest.json
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục .next
const nextDir = path.join(__dirname, '.next');

console.log('[fix-trace-error] Bắt đầu sửa lỗi file trace...');

// Kiểm tra xem thư mục .next có tồn tại không
if (!fs.existsSync(nextDir)) {
  try {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log(`[fix-trace-error] Đã tạo thư mục .next`);
  } catch (err) {
    console.log(`[fix-trace-error] Không thể tạo thư mục .next: ${err.message}`);
  }
}

// Tạo .env.local nếu chưa tồn tại để tắt trace
const envLocalPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envLocalPath)) {
  try {
    const envContent = `# Tự động tạo bởi fix-trace-error.js
NEXT_TELEMETRY_DISABLED=1
NEXT_DISABLE_SOURCEMAPS=1
NODE_OPTIONS=--no-warnings
`;
    fs.writeFileSync(envLocalPath, envContent);
    console.log('[fix-trace-error] Đã tạo file .env.local để tắt telemetry và sourcemaps');
  } catch (err) {
    console.log(`[fix-trace-error] Không thể tạo file .env.local: ${err.message}`);
  }
} else {
  try {
    // Kiểm tra và bổ sung cấu hình nếu chưa có
    let envContent = fs.readFileSync(envLocalPath, 'utf8');
    let needsUpdate = false;
    
    if (!envContent.includes('NEXT_TELEMETRY_DISABLED=1')) {
      envContent += '\nNEXT_TELEMETRY_DISABLED=1';
      needsUpdate = true;
    }
    
    if (!envContent.includes('NEXT_DISABLE_SOURCEMAPS=1')) {
      envContent += '\nNEXT_DISABLE_SOURCEMAPS=1';
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      fs.writeFileSync(envLocalPath, envContent);
      console.log('[fix-trace-error] Đã cập nhật file .env.local');
    }
  } catch (err) {
    console.log(`[fix-trace-error] Không thể cập nhật file .env.local: ${err.message}`);
  }
}

// Thêm cấu hình tắt trace vào package.json
try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    let modified = false;
    
    // Đảm bảo scripts dev có tùy chọn --no-trace
    if (packageJson.scripts && packageJson.scripts.dev && !packageJson.scripts.dev.includes('--no-trace')) {
      packageJson.scripts.dev = 'next dev --no-trace';
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('[fix-trace-error] Đã cập nhật package.json để thêm flag --no-trace');
    }
  }
} catch (err) {
  console.log(`[fix-trace-error] Không thể cập nhật package.json: ${err.message}`);
}

// Tạo các file cấu hình JSON cần thiết
const requiredFiles = [
  { path: path.join(nextDir, 'server', 'middleware-manifest.json'), content: '{"version":1,"sortedMiddleware":[],"middleware":{},"functions":{},"matchers":{}}' },
  { path: path.join(nextDir, 'server', 'pages-manifest.json'), content: '{}' },
  { path: path.join(nextDir, 'server', 'vendor-chunks.json'), content: '{}' },
  { path: path.join(nextDir, 'server', 'webpack-runtime.json'), content: '{}' },
  { path: path.join(nextDir, 'build-manifest.json'), content: '{"polyfillFiles":[],"rootMainFiles":[],"pages":{},"devFiles":[]}' }
];

// Tạo các file cần thiết
for (const file of requiredFiles) {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Chỉ ghi file nếu nó không tồn tại hoặc rỗng
    if (!fs.existsSync(file.path) || fs.statSync(file.path).size === 0) {
      fs.writeFileSync(file.path, file.content);
      console.log(`[fix-trace-error] Đã tạo file: ${file.path}`);
    }
  } catch (err) {
    console.log(`[fix-trace-error] Không thể tạo file ${file.path}: ${err.message}`);
  }
}

console.log('[fix-trace-error] Hoàn tất sửa lỗi file trace'); 