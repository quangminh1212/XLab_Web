/**
 * Script tổng hợp cho Next.js
 * - Dọn dẹp và sửa lỗi tự động
 * - Tạo cấu trúc file tối thiểu cho .next
 * - Xóa file tạm thời
 * - Tối ưu hóa dự án
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Thiết lập
const VERBOSE = false; // True để hiển thị tất cả log, False để chỉ hiển thị log quan trọng
const MIN_FILES_ONLY = true; // Chỉ tạo các file tối thiểu cần thiết
const CLEANUP_TEMP_FILES = true; // Tự động xóa các script tạm thời sau khi chạy

// Danh sách file tạm thời sẽ bị xóa khi kết thúc
const TEMP_FILES = [
  'check-config.js',
  'restart-dev.js',
  'restart.bat',
  'restart.ps1',
  'check-fix.ps1', 
  'commit-changes.ps1'
];

// Ghi log
function log(message, isImportant = false) {
  if (VERBOSE || isImportant) {
    console.log(message);
  }
}

log('=== Tối ưu hóa dự án Next.js ===', true);

// Tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✅ Đã tạo thư mục: ${dirPath}`);
  }
}

// Tạo file với nội dung
function createFileWithContent(filePath, content) {
  const dirPath = path.dirname(filePath);
  ensureDirectoryExists(dirPath);
  
  fs.writeFileSync(filePath, content);
  log(`✅ Đã tạo file: ${filePath}`);
}

// Sửa lỗi Next.js config để tương thích với phiên bản mới nhất
function fixNextConfig() {
  log('🔧 Kiểm tra và sửa cấu hình Next.js...', true);
  
  const configPath = path.join(__dirname, 'next.config.js');
  if (!fs.existsSync(configPath)) {
    log('❌ Không tìm thấy file next.config.js', true);
    return;
  }
  
  // Tạo bản sao lưu
  try {
    fs.copyFileSync(configPath, `${configPath}.bak`);
    log('✅ Đã tạo bản sao lưu next.config.js.bak');
  } catch (err) {
    log(`❌ Lỗi khi tạo bản sao lưu: ${err.message}`, true);
  }
  
  // Đọc nội dung file
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Kiểm tra xem outputFileTracingExcludes có trong experimental không
  const hasExperimentalTracing = configContent.includes('experimental') && 
    configContent.includes('outputFileTracingExcludes') && 
    /experimental\s*:\s*{[^}]*outputFileTracingExcludes/.test(configContent);
  
  if (hasExperimentalTracing) {
    log('🔄 Đang sửa cấu hình next.config.js...', true);
    
    // Thay thế bằng cách đưa outputFileTracingExcludes ra khỏi experimental
    let newConfig = configContent;
    
    try {
      // Trích xuất nội dung của outputFileTracingExcludes
      const tracingMatch = /outputFileTracingExcludes\s*:\s*({[^}]*})/.exec(configContent);
      if (tracingMatch && tracingMatch[1]) {
        const tracingContent = tracingMatch[1];
        
        // Xóa nó khỏi experimental
        newConfig = newConfig.replace(/(\s*outputFileTracingExcludes\s*:\s*{[^}]*}),?/g, '');
        
        // Thêm nó như một tùy chọn cấp cao nhất
        newConfig = newConfig.replace(/(experimental\s*:\s*{[^}]*}\s*),?/g, '$1,\n  outputFileTracingExcludes: ' + tracingContent + ',\n  ');
        
        fs.writeFileSync(configPath, newConfig);
        log('✅ Đã sửa cấu hình next.config.js thành công', true);
      } else {
        log('⚠️ Không thể tìm thấy nội dung outputFileTracingExcludes', true);
      }
    } catch (err) {
      log(`❌ Lỗi khi sửa cấu hình: ${err.message}`, true);
      // Khôi phục bản sao lưu
      fs.copyFileSync(`${configPath}.bak`, configPath);
      log('⚠️ Đã khôi phục bản sao lưu next.config.js', true);
    }
  } else {
    log('✅ Cấu hình next.config.js đã hợp lệ', true);
  }
}

// Xử lý file trace
function fixTraceFile() {
  log('🔍 Kiểm tra và xử lý file trace...', true);
  
  const tracePath = path.join(__dirname, '.next', 'trace');
  if (fs.existsSync(tracePath)) {
    try {
      // Đặt lại quyền truy cập
      try {
        fs.chmodSync(tracePath, 0o666);
        log('✅ Đã đặt lại quyền truy cập cho file trace');
      } catch (chmodErr) {
        log(`⚠️ Không thể đặt lại quyền truy cập: ${chmodErr.message}`);
      }
      
      // Xóa file trace
      try {
        fs.unlinkSync(tracePath);
        log('✅ Đã xóa file trace thành công', true);
      } catch (unlinkErr) {
        log(`❌ Không thể xóa file trace: ${unlinkErr.message}`, true);
        
        // Thử phương pháp khác trên Windows
        try {
          execSync('attrib -r -s -h .next\\trace');
          execSync('del /f /q .next\\trace');
          if (!fs.existsSync(tracePath)) {
            log('✅ Đã xóa file trace thành công bằng CMD', true);
          }
        } catch (cmdErr) {
          log(`❌ Vẫn không thể xóa file trace, vui lòng xóa thủ công: ${cmdErr.message}`, true);
        }
      }
    } catch (error) {
      log(`❌ Lỗi khi xử lý file trace: ${error.message}`, true);
    }
  } else {
    log('✅ Không tìm thấy file trace, không cần xử lý', true);
  }
}

// Tạo cấu trúc thư mục tối thiểu cho .next
function createMinimalNextStructure() {
  log('📁 Tạo cấu trúc thư mục tối thiểu cho Next.js...', true);
  
  const nextDir = path.join(__dirname, '.next');
  ensureDirectoryExists(nextDir);
  
  // Tạo các thư mục cốt lõi
  const coreDirs = [
    path.join(nextDir, 'cache'),
    path.join(nextDir, 'server'),
    path.join(nextDir, 'static'),
    path.join(nextDir, 'static', 'chunks'),
    path.join(nextDir, 'static', 'css'),
    path.join(nextDir, 'server', 'pages'),
    path.join(nextDir, 'server', 'chunks')
  ];
  
  coreDirs.forEach(dir => ensureDirectoryExists(dir));
  
  // Tạo file .gitkeep trong mỗi thư mục
  coreDirs.forEach(dir => {
    const gitkeepPath = path.join(dir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
  });
  
  // Tạo các file manifest cơ bản
  createFileWithContent(
    path.join(nextDir, 'server', 'middleware-manifest.json'),
    JSON.stringify({ middleware: {}, functions: {}, version: 2 }, null, 2)
  );
  
  log('✅ Đã tạo xong cấu trúc thư mục tối thiểu', true);
}

// Xóa cache và file tạm thời
function cleanupProject() {
  log('🧹 Đang dọn dẹp dự án...', true);
  
  const nextDir = path.join(__dirname, '.next');
  
  // Xóa cache
  const cacheDirs = [
    path.join(nextDir, 'cache'),
    path.join(nextDir, 'static', 'webpack')
  ];
  
  cacheDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        log(`✅ Đã xóa thư mục cache: ${dir}`);
        ensureDirectoryExists(dir);
      } catch (err) {
        log(`⚠️ Không thể xóa thư mục ${dir}: ${err.message}`);
      }
    }
  });
  
  // Xóa các file tạm thời
  if (CLEANUP_TEMP_FILES) {
    TEMP_FILES.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath) && file !== 'fix-all-errors.js') {
        try {
          fs.unlinkSync(filePath);
          log(`✅ Đã xóa file tạm thời: ${file}`, true);
        } catch (err) {
          log(`⚠️ Không thể xóa file ${file}: ${err.message}`);
        }
      }
    });
  }
  
  log('✅ Đã hoàn tất dọn dẹp dự án', true);
}

// Cập nhật gitignore để loại trừ các file tạm thời
function updateGitignore() {
  log('📝 Cập nhật .gitignore...', true);
  
  const gitignorePath = path.join(__dirname, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    log('❌ Không tìm thấy file .gitignore', true);
    return;
  }
  
  let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  // Danh sách các mẫu cần thêm vào .gitignore
  const ignorePatterns = [
    '# Temporary files',
    '/check-config.js',
    '/restart-dev.js',
    '/restart.bat',
    '/restart.ps1',
    '/check-fix.ps1',
    '/commit-changes.ps1',
    '/node_modules/.cache/',
    '/.next/cache/**/*',
    '/.next/trace*',
    '**/*.hot-update.*',
    '**/*.js.map'
  ];
  
  // Thêm các mẫu chưa có vào .gitignore
  let updated = false;
  ignorePatterns.forEach(pattern => {
    if (!gitignoreContent.includes(pattern)) {
      gitignoreContent += `\n${pattern}`;
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(gitignorePath, gitignoreContent);
    log('✅ Đã cập nhật .gitignore', true);
  } else {
    log('✅ .gitignore đã chứa tất cả các mẫu cần thiết', true);
  }
}

// Tạo file run.bat đơn giản
function createRunScript() {
  log('📄 Tạo file run.bat đơn giản...', true);
  
  const runBatContent = `@echo off
echo ===========================================================
echo Starting Next.js application - XLab_Web
echo ===========================================================

REM Kiểm tra và xử lý file trace
if exist ".next\\trace" (
  echo Fixing trace file...
  attrib -r -s -h .next\\trace
  del /f /q .next\\trace
)

REM Khởi động ứng dụng
echo Starting Next.js application...
npm run dev

pause`;
  
  const runBatPath = path.join(__dirname, 'run.bat');
  fs.writeFileSync(runBatPath, runBatContent);
  log('✅ Đã tạo file run.bat thành công', true);
}

// Chạy tất cả các chức năng
async function main() {
  try {
    log('🚀 Bắt đầu quá trình tối ưu hóa...', true);
    
    // Xử lý file trace
    fixTraceFile();
    
    // Sửa cấu hình Next.js
    fixNextConfig();
    
    // Tạo cấu trúc thư mục tối thiểu
    createMinimalNextStructure();
    
    // Dọn dẹp dự án
    cleanupProject();
    
    // Cập nhật gitignore
    updateGitignore();
    
    // Tạo file run.bat đơn giản
    createRunScript();
    
    log('✅ Đã hoàn tất quá trình tối ưu hóa!', true);
    log('🚀 Chạy file run.bat để khởi động dự án', true);
  } catch (error) {
    log(`❌ Lỗi trong quá trình tối ưu hóa: ${error.message}`, true);
    log(`Stack: ${error.stack}`, true);
  }
}

// Chạy chương trình
main(); 