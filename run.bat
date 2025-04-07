@echo off
rem Khong su dung tieng Viet co dau trong file .bat
setlocal enabledelayedexpansion

title XLab Web - Launcher
color 0A

echo ========================================================
echo     XLab Web - Launcher
echo ========================================================
echo.

REM Xác định đường dẫn hiện tại
cd /d "%~dp0"
echo Thư mục hiện tại: %CD%
echo.

REM Dừng các tiến trình Node.js
echo [1/6] Dừng tất cả các tiến trình Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo.

REM Xóa cache Next.js
echo [2/6] Xóa thư mục .next...
if exist ".next" (
    echo Đang xóa thư mục .next...
    rmdir /S /Q .next 2>nul
    if exist ".next" (
        del /F /S /Q ".next\*.*" >nul 2>&1
        rmdir /S /Q ".next" >nul 2>&1
    )
)
echo.

REM Đặt biến môi trường cụ thể cho Node.js và Next.js
echo [3/6] Thiết lập biến môi trường...
set "NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-experimental-fetch"
set "NEXT_TELEMETRY_DISABLED=1"
set "NEXT_SWCMINIFY=false"
set "NODE_ENV=development"
set "CHOKIDAR_USEPOLLING=true"
set "WATCHPACK_POLLING=true"
echo.

REM Tạo file cấu hình môi trường
echo [4/6] Tạo file cấu hình...
(
echo NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-experimental-fetch
echo NEXT_TELEMETRY_DISABLED=1
echo NEXT_SWCMINIFY=false
echo NODE_ENV=development
echo CHOKIDAR_USEPOLLING=true
echo WATCHPACK_POLLING=true
) > .env.local

REM Đặt cấu hình npm
(
echo registry=https://registry.npmjs.org/
echo legacy-peer-deps=true
echo fund=false
) > .npmrc
echo.

REM Sửa lỗi Webpack - khắc phục triệt để lỗi "Unexpected token '||'"
echo [5/6] Sửa lỗi Webpack (Unexpected token '||')...
node -e "
try {
  const fs = require('fs');
  const path = require('path');
  
  // Sửa next.config.js nếu cần
  const configPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, 'utf8');
    let modified = false;
    
    // Đảm bảo tắt SWC minify
    if (!content.includes('swcMinify: false')) {
      content = content.replace(
        /module\.exports\s*=\s*(\{)/s,
        'module.exports = {\n  swcMinify: false,\n'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(configPath, content, 'utf8');
      console.log('✅ Đã cập nhật next.config.js');
    }
  }
  
  // Đảm bảo file .babelrc tồn tại
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  if (!fs.existsSync(babelrcPath)) {
    const babelConfig = {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              targets: {
                browsers: [
                  '>0.3%',
                  'not ie 11',
                  'not dead',
                  'not op_mini all'
                ],
                node: 'current'
              },
              useBuiltIns: 'usage',
              corejs: 3
            }
          }
        ]
      ],
      plugins: []
    };
    
    fs.writeFileSync(babelrcPath, JSON.stringify(babelConfig, null, 2), 'utf8');
    console.log('✅ Đã tạo file .babelrc');
  }
  
  // Tìm và sửa tất cả file webpack.js có vấn đề
  const targetWebpackFiles = [
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'webpack.js'),
    path.join(process.cwd(), 'node_modules', 'webpack', 'lib', 'javascript', 'JavascriptParser.js')
  ];
  
  // Hàm sửa lỗi toán tử trong file webpack
  function fixWebpackFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    
    try {
      console.log(`🔍 Kiểm tra file: ${filePath}`);
      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;
      
      // Sửa các toán tử
      // Thay thế ||= bằng dạng tương thích
      content = content.replace(/(\w+)\s*\|\|=\s*([^;,\n)]+)/g, '$1 = $1 || $2');
      
      // Thay thế &&= bằng dạng tương thích
      content = content.replace(/(\w+)\s*&&=\s*([^;,\n)]+)/g, '$1 = $1 && $2');
      
      // Thay thế ??= bằng dạng tương thích
      content = content.replace(/(\w+)\s*\?\?=\s*([^;,\n)]+)/g, '$1 = $1 ?? $2');
      
      // Thay thế nullish coalescing ?? bằng dạng tương thích
      content = content.replace(/([^=!><*\/%-+]+)\s*\?\?\s*([^;,\n)]+)/g, 
        '(($1 !== null && $1 !== undefined) ? $1 : $2)');
      
      // Thay thế các toán tử assignment khác
      content = content.replace(/\|\|=/g, '= ||');
      content = content.replace(/&&=/g, '= &&');
      content = content.replace(/\?\?=/g, '= ??');
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Đã sửa: ${filePath}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Lỗi khi sửa file ${filePath}:`, error.message);
      return false;
    }
  }
  
  // Sửa các file webpack cụ thể
  let fixedCount = 0;
  for (const file of targetWebpackFiles) {
    if (fixWebpackFile(file)) {
      fixedCount++;
    }
  }
  
  // Tìm kiếm thêm các file webpack
  const webpackDirs = [
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack'),
    path.join(process.cwd(), 'node_modules', 'webpack')
  ];
  
  for (const dir of webpackDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.js')) {
            const filePath = path.join(dir, file);
            if (fixWebpackFile(filePath)) {
              fixedCount++;
            }
          }
        }
      } catch (error) {
        console.error(`❌ Lỗi khi duyệt thư mục ${dir}:`, error.message);
      }
    }
  }
  
  console.log(`✅ Đã kiểm tra và sửa ${fixedCount} file webpack`);
} catch (error) {
  console.error('❌ Lỗi:', error.message);
}
"
echo.

REM Cập nhật .gitignore
echo [6/6] Cập nhật .gitignore...
findstr /c:".next/cache/" .gitignore >nul 2>&1
if errorlevel 1 (
    echo # Các file tạm và cache >> .gitignore
    echo .swc/ >> .gitignore
    echo tsconfig.tsbuildinfo >> .gitignore
    echo .next/cache/ >> .gitignore
    echo .next/server/ >> .gitignore
)
echo.

echo ========================================================
echo     KHỞI ĐỘNG XLAB WEB
echo     Nhấn Ctrl+C để dừng lại
echo ========================================================
echo.

REM Khởi động dự án
call npm run dev

echo.
echo ========================================================
echo     ỨNG DỤNG ĐÃ DỪNG
echo ========================================================
echo.
pause
exit /b 0
