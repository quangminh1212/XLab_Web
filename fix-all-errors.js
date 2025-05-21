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

// Main function
async function fixAllErrors() {
  try {
    console.log('🚀 Starting fix-all-errors script...');
    
    // Run the fixes
    cleanNextDirectory();
    ensureDependencies();
    fixNextConfig();
    createNecessaryDirectories();
    
    // Tạo file run.bat để chạy tự động
    createDevRunScript();
    
    console.log('✅ All fixes completed successfully');
    console.log('\nHãy sử dụng lệnh "run.bat" để khởi động server đúng cách!');
  } catch (error) {
    console.error('❌ An error occurred during the fix process:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
fixAllErrors(); 