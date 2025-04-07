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

REM Kiểm tra tồn tại của script
if exist "fix-webpack.js" (
    node fix-webpack.js
) else (
    REM Script chính không tồn tại - tạo script tạm thời để sửa webpack
    echo "Script fix-webpack.js không tồn tại. Sử dụng cách sửa trực tiếp..."
    
    REM Tạo file script tạm thời
    (
    echo const fs = require('fs'^);
    echo const path = require('path'^);
    echo try {
    echo   // Tìm file webpack.js chính
    echo   const webpackMainPath = path.join(process.cwd(^), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'webpack.js'^);
    echo   if (fs.existsSync(webpackMainPath^)^) {
    echo     console.log('Sửa trực tiếp file webpack.js...'^);
    echo     let content = fs.readFileSync(webpackMainPath, 'utf8'^);
    echo     // Thay thế các phép toán có thể gây lỗi
    echo     content = content.replace(/\|\|=/g, "= ||"^);
    echo     fs.writeFileSync(webpackMainPath, content, 'utf8'^);
    echo     console.log('Đã sửa file webpack.js thành công!'^);
    echo   } else {
    echo     console.log('Không tìm thấy file webpack.js!'^);
    echo   }
    echo   // Thêm file config-utils
    echo   const configUtilsPath = path.join(process.cwd(^), 'node_modules', 'next', 'dist', 'server', 'config-utils.js'^);
    echo   if (fs.existsSync(configUtilsPath^)^) {
    echo     let content = fs.readFileSync(configUtilsPath, 'utf8'^);
    echo     if (content.includes('||='^)^) {
    echo       content = content.replace(/\|\|=/g, "= ||"^);
    echo       fs.writeFileSync(configUtilsPath, content, 'utf8'^);
    echo       console.log('Đã sửa file config-utils.js!'^);
    echo     }
    echo   }
    echo } catch (error^) {
    echo   console.error('Lỗi:', error.message^);
    echo }
    ) > temp-fix.js
    
    REM Chạy script tạm thời
    node temp-fix.js
    
    REM Xóa file tạm sau khi sử dụng
    del /F /Q temp-fix.js >nul 2>&1
)

REM Thử sửa trực tiếp nếu vẫn cần thiết
if exist "fix-webpack-direct.js" (
    echo Thực hiện sửa lỗi trực tiếp file webpack.js...
    node fix-webpack-direct.js
)
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
