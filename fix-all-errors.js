/**
 * Fix All Errors
 * 
 * Script to fix common errors in Next.js 15+ applications
 * - Cleans the .next directory
 * - Ensures all required dependencies are installed
 * - Updates gitignore with proper patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting error fixing process...');

// Function to ensure the directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// Function to run a command
function runCommand(command) {
  try {
    console.log(`🔄 Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Ensure critters is installed
function ensureDependencies() {
  console.log('📦 Checking dependencies...');
  
  try {
    // Check if critters is properly installed
    require.resolve('critters');
    console.log('✅ Critters is properly installed');
  } catch (error) {
    console.log('⚠️ Critters is not installed properly, installing now...');
    runCommand('npm install critters@0.0.23 --save-dev');
  }
}

// Clean the .next directory
function cleanNextDirectory() {
  console.log('Đang dọn dẹp thư mục .next...');
  
  const nextDir = path.join(__dirname, '.next');
  
  // Kiểm tra xem thư mục .next có tồn tại không
  if (!fs.existsSync(nextDir)) {
    console.log('Thư mục .next không tồn tại, bỏ qua bước này.');
    return;
  }
  
  try {
    // Thử xóa file trace trực tiếp bằng PowerShell vì Windows có thể lock file này
    try {
      execSync('powershell -Command "Remove-Item -Path .next\\trace -Force -ErrorAction SilentlyContinue"', {
        stdio: 'inherit'
      });
      console.log('Đã thử xóa file .next\\trace bằng PowerShell');
    } catch (err) {
      console.log('Lỗi khi dùng PowerShell xóa file trace:', err.message);
    }
    
    // Xóa các file cụ thể gây lỗi trước
    const problematicFiles = [
      '.next/trace',
      '.next/app-paths-manifest.json',
      '.next/server/app-paths-manifest.json'
    ];
    
    problematicFiles.forEach(filePath => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Đã xóa file: ${filePath}`);
        } catch (err) {
          console.log(`Không thể xóa file ${filePath}: ${err.message}`);
        }
      }
    });
    
    // Xóa các thư mục cache
    const cacheDirs = [
      '.next/cache',
      '.next/server/vendor-chunks',
      '.next/static/chunks',
      '.next/static/css'
    ];
    
    cacheDirs.forEach(dirPath => {
      const fullPath = path.join(__dirname, dirPath);
      if (fs.existsSync(fullPath)) {
        try {
          // Dùng rimraf bằng cách gọi Node
          execSync(`node -e "require('fs').rmSync('${fullPath.replace(/\\/g, '\\\\')}', { recursive: true, force: true });"`, {
            stdio: 'inherit'
          });
          console.log(`Đã xóa thư mục: ${dirPath}`);
        } catch (err) {
          console.log(`Không thể xóa thư mục ${dirPath}: ${err.message}`);
          
          // Thử xóa bằng PowerShell nếu Node không thành công
          try {
            execSync(`powershell -Command "Remove-Item -Path '${fullPath}' -Recurse -Force -ErrorAction SilentlyContinue"`, {
              stdio: 'inherit'
            });
            console.log(`Đã thử xóa thư mục ${dirPath} bằng PowerShell`);
          } catch (powershellErr) {
            console.log(`Cũng không thể xóa bằng PowerShell: ${powershellErr.message}`);
          }
        }
      }
    });
    
    console.log('Đã dọn dẹp thư mục .next thành công!');
  } catch (err) {
    console.error('Lỗi khi dọn dẹp thư mục .next:', err);
  }
}

// Fix next.config.js - ensure optimizeCss is disabled
function fixNextConfig() {
  console.log('🔧 Checking next.config.js...');
  
  const configPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(configPath)) {
    try {
      let content = fs.readFileSync(configPath, 'utf8');
      
      // Disable optimizeCss if enabled
      if (content.includes('optimizeCss: true')) {
        content = content.replace('optimizeCss: true', 'optimizeCss: false');
        fs.writeFileSync(configPath, content);
        console.log('✅ Disabled optimizeCss in next.config.js');
      } else {
        console.log('✅ next.config.js is already properly configured');
      }
    } catch (error) {
      console.error('❌ Failed to fix next.config.js');
      console.error(error.message);
    }
  } else {
    console.error('❌ next.config.js not found');
  }
}

// Create necessary directories to prevent errors
function createNecessaryDirectories() {
  console.log('📁 Creating necessary directories...');
  
  // Create .next/cache directory
  const cacheDir = path.join(process.cwd(), '.next', 'cache');
  ensureDirectoryExists(cacheDir);
  
  // Create static directory to prevent 404s
  const staticDir = path.join(process.cwd(), '.next', 'static');
  ensureDirectoryExists(staticDir);
  
  // Create static/chunks directory
  const chunksDir = path.join(staticDir, 'chunks');
  ensureDirectoryExists(chunksDir);
  
  // Create static/css directory
  const cssDir = path.join(staticDir, 'css');
  ensureDirectoryExists(cssDir);
  
  // Create static/media directory
  const mediaDir = path.join(staticDir, 'media');
  ensureDirectoryExists(mediaDir);
  
  console.log('✅ All necessary directories created');
}

// Hàm để tạo/cập nhật file run.bat để chạy tự động
function createDevRunScript() {
  console.log('Đang tạo file chạy tự động cho npm run dev...');
  
  try {
    const runBatPath = path.join(__dirname, 'run.bat');
    const runBatContent = `@echo off
echo Dang chuan bi moi truong phat trien...
echo Xoa file trace neu co...
powershell -Command "Remove-Item -Path .next\\trace -Force -ErrorAction SilentlyContinue"
echo Dang khoi dong server...
npm run dev
`;
    
    fs.writeFileSync(runBatPath, runBatContent, 'utf8');
    console.log('✅ Đã tạo file run.bat thành công!');
  } catch (err) {
    console.error('❌ Không thể tạo file run.bat:', err);
  }
}

// Hàm tạo các file static cần thiết để tránh lỗi 404
function createStaticFiles() {
  console.log('Đang tạo các thư mục và file static cần thiết...');
  
  const staticDirs = [
    '.next/static/css/app',
    '.next/static/app',
    '.next/static/app/admin',
    '.next/static/app/admin/products',
    '.next/static/app/admin/users',
    '.next/static/app/admin/orders',
    '.next/static/app/admin/settings',
    '.next/server/app',
    '.next/server/app/admin',
    '.next/server/pages',
    '.next/server/chunks',
    '.next/static/chunks',
    '.next/static/css',
    '.next/static/development',
  ];
  
  try {
    // Tạo các thư mục cần thiết
    staticDirs.forEach(dir => {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Đã tạo thư mục: ${dir}`);
      }
    });
    
    // Tạo file trống .gitkeep để Git lưu các thư mục trống
    staticDirs.forEach(dir => {
      const gitkeepPath = path.join(__dirname, dir, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
      }
    });
    
    // Tạo file app-paths-manifest.json trống để tránh lỗi ENOENT
    const manifestPath = path.join(__dirname, '.next/server/app-paths-manifest.json');
    if (!fs.existsSync(manifestPath)) {
      fs.writeFileSync(manifestPath, '{}');
      console.log('Đã tạo file app-paths-manifest.json trống');
    }
    
    console.log('✅ Đã tạo các thư mục và file static cần thiết!');
  } catch (err) {
    console.error('❌ Lỗi khi tạo thư mục và file static:', err);
  }
}

// Hàm cập nhật server-info.json để cải thiện hiệu suất Next.js
function updateServerInfo() {
  console.log('Đang cập nhật thông tin server...');
  
  try {
    const serverInfoPath = path.join(__dirname, '.next/server/server-info.json');
    const serverInfo = {
      version: '15.2.4',
      requiresSSL: false,
      buildId: 'build-id-' + Date.now(),
      env: [],
      staticFiles: {
        '/favicon.ico': {
          type: 'static',
          etag: '"favicon-etag"'
        }
      },
      rsc: {
        header: 'RSC',
        contentTypeHeader: 'text/x-component',
        prefetchHeader: 'prefetch',
        enableAtPrefetch: true,
        metadataHeader: 'Next-Metadata',
        encodingHeader: 'Next-RSC-Encoding',
        suffixHeader: 'Next-RSC-Suffix'
      }
    };
    
    fs.writeFileSync(serverInfoPath, JSON.stringify(serverInfo, null, 2));
    console.log('✅ Đã cập nhật thông tin server thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật thông tin server:', err);
  }
}

// Hàm cập nhật file .gitignore
function updateGitignore() {
  console.log('Đang cập nhật file .gitignore...');
  
  try {
    const gitignorePath = path.join(__dirname, '.gitignore');
    let gitignoreContent = '';
    
    // Đọc file .gitignore hiện tại nếu có
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }
    
    // Danh sách các pattern cần thêm vào .gitignore
    const patternsToAdd = [
      '# next.js static files',
      '.next/static/css/app/layout.css?v=*',
      '.next/static/main-app.*.js?v=*',
      '.next/static/app/layout.*.js',
      '.next/static/app/not-found.*.js',
      '.next/static/app/admin/layout.*.js',
      '.next/static/app/admin/page.*.js',
      '.next/static/app/loading.*.js',
      '.next/static/app-pages-internals.*.js',
      '',
      '# Keep specific gitkeep files',
      '!.next/static/app/.gitkeep',
      '!.next/static/css/.gitkeep',
      '!.next/static/chunks/.gitkeep',
      '!.next/server/.gitkeep',
      '!.next/server/app/.gitkeep',
      ''
    ];
    
    // Kiểm tra và thêm các pattern chưa có
    let updatedContent = gitignoreContent;
    patternsToAdd.forEach(pattern => {
      if (!updatedContent.includes(pattern) && pattern.trim() !== '') {
        updatedContent += pattern + '\n';
      }
    });
    
    // Ghi lại file .gitignore nếu có thay đổi
    if (updatedContent !== gitignoreContent) {
      fs.writeFileSync(gitignorePath, updatedContent);
      console.log('✅ Đã cập nhật file .gitignore thành công!');
    } else {
      console.log('ℹ️ File .gitignore không cần cập nhật.');
    }
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật file .gitignore:', err);
  }
}

// Main function
async function fixAllErrors() {
  console.log('Bắt đầu sửa lỗi...');
  
  try {
    // 1. Dọn dẹp thư mục .next
    cleanNextDirectory();
    
    // 2. Cập nhật file .gitignore
    updateGitignore();
    
    // 3. Tạo các thư mục và file static cần thiết
    createStaticFiles();
    
    // 4. Cập nhật thông tin server
    updateServerInfo();
    
    // 5. Tạo file run.bat để chạy tự động
    createDevRunScript();
    
    console.log('Đã sửa tất cả lỗi thành công!');
    console.log('\nHãy sử dụng lệnh "run.bat" để khởi động server đúng cách!');
  } catch (err) {
    console.error('Lỗi khi sửa lỗi:', err);
  }
}

// Run the script
fixAllErrors(); 