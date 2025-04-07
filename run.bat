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
echo [1/7] Dừng tất cả các tiến trình Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo.

REM Xóa cache Next.js
echo [2/7] Xóa thư mục .next...
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
echo [3/7] Thiết lập biến môi trường...
set "NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-experimental-fetch"
set "NEXT_TELEMETRY_DISABLED=1"
set "NEXT_SWCMINIFY=false"
set "NODE_ENV=development"
set "CHOKIDAR_USEPOLLING=true"
set "WATCHPACK_POLLING=true"
echo.

REM Tạo file cấu hình môi trường
echo [4/7] Tạo file cấu hình...
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

REM Sửa lỗi webpack trực tiếp
echo [5/7] Sửa lỗi Webpack (Unexpected token '||')...

REM Tạo file sửa lỗi webpack
echo console.log('Đang sửa lỗi webpack...'); > fix-webpack-temp.js
echo const fs = require('fs'); >> fix-webpack-temp.js
echo const path = require('path'); >> fix-webpack-temp.js
echo. >> fix-webpack-temp.js
echo // Tìm file webpack.js chính >> fix-webpack-temp.js
echo try { >> fix-webpack-temp.js
echo   const webpackPath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'webpack.js'); >> fix-webpack-temp.js
echo   if (fs.existsSync(webpackPath)) { >> fix-webpack-temp.js
echo     console.log('Sửa file webpack.js...'); >> fix-webpack-temp.js
echo     let content = fs.readFileSync(webpackPath, 'utf8'); >> fix-webpack-temp.js
echo     content = content.replace(/\|\|=/g, "= ||"); >> fix-webpack-temp.js
echo     fs.writeFileSync(webpackPath, content, 'utf8'); >> fix-webpack-temp.js
echo     console.log('Đã sửa file webpack.js thành công!'); >> fix-webpack-temp.js
echo   } >> fix-webpack-temp.js
echo. >> fix-webpack-temp.js
echo   // Sửa thêm file config-utils >> fix-webpack-temp.js
echo   const configPath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'server', 'config-utils.js'); >> fix-webpack-temp.js
echo   if (fs.existsSync(configPath)) { >> fix-webpack-temp.js
echo     console.log('Sửa file config-utils.js...'); >> fix-webpack-temp.js
echo     let content = fs.readFileSync(configPath, 'utf8'); >> fix-webpack-temp.js
echo     content = content.replace(/\|\|=/g, "= ||"); >> fix-webpack-temp.js
echo     fs.writeFileSync(configPath, content, 'utf8'); >> fix-webpack-temp.js
echo     console.log('Đã sửa file config-utils.js thành công!'); >> fix-webpack-temp.js
echo   } >> fix-webpack-temp.js
echo. >> fix-webpack-temp.js
echo   // Sửa thêm file bundle5.js >> fix-webpack-temp.js
echo   const bundlePath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle5.js'); >> fix-webpack-temp.js
echo   if (fs.existsSync(bundlePath)) { >> fix-webpack-temp.js
echo     console.log('Sửa file bundle5.js...'); >> fix-webpack-temp.js
echo     let content = fs.readFileSync(bundlePath, 'utf8'); >> fix-webpack-temp.js
echo     content = content.replace(/\|\|=/g, "= ||"); >> fix-webpack-temp.js
echo     fs.writeFileSync(bundlePath, content, 'utf8'); >> fix-webpack-temp.js
echo     console.log('Đã sửa file bundle5.js thành công!'); >> fix-webpack-temp.js
echo   } >> fix-webpack-temp.js
echo } catch (err) { >> fix-webpack-temp.js
echo   console.error('Lỗi khi sửa webpack:', err.message); >> fix-webpack-temp.js
echo } >> fix-webpack-temp.js

REM Chạy script sửa lỗi
node fix-webpack-temp.js

REM Xóa file tạm
del /F /Q fix-webpack-temp.js >nul 2>&1
echo.

REM Kiểm tra và sửa next.config.js
echo [6/7] Kiểm tra cấu hình Next.js...
echo const fs = require('fs'); > check-next-config.js
echo const path = require('path'); >> check-next-config.js
echo. >> check-next-config.js
echo const configPath = path.join(process.cwd(), 'next.config.js'); >> check-next-config.js
echo if (fs.existsSync(configPath)) { >> check-next-config.js
echo   let content = fs.readFileSync(configPath, 'utf8'); >> check-next-config.js
echo   let modified = false; >> check-next-config.js
echo. >> check-next-config.js
echo   // Đảm bảo tắt SWC minify >> check-next-config.js
echo   if (!content.includes('swcMinify: false')) { >> check-next-config.js
echo     content = content.replace( >> check-next-config.js
echo       /module\.exports\s*=\s*(\{)/s, >> check-next-config.js
echo       'module.exports = {\n  swcMinify: false,\n' >> check-next-config.js
echo     ); >> check-next-config.js
echo     modified = true; >> check-next-config.js
echo   } >> check-next-config.js
echo. >> check-next-config.js
echo   // Đảm bảo config watchOptions đúng cho Windows >> check-next-config.js
echo   if (!content.includes('watchOptions')) { >> check-next-config.js
echo     content = content.replace( >> check-next-config.js
echo       /webpack: \(config, \{ dev, isServer \}\) => \{/s, >> check-next-config.js
echo       'webpack: (config, { dev, isServer }) => {\n    // Xử lý lỗi webpack trên Windows\n    config.watchOptions = {\n      ...config.watchOptions,\n      poll: 1000,\n      aggregateTimeout: 300,\n      ignored: [\'node_modules/**\', \'.git/**\', \'.next/**\']\n    };' >> check-next-config.js
echo     ); >> check-next-config.js
echo     modified = true; >> check-next-config.js
echo   } >> check-next-config.js
echo. >> check-next-config.js
echo   if (modified) { >> check-next-config.js
echo     fs.writeFileSync(configPath, content, 'utf8'); >> check-next-config.js
echo     console.log('Đã cập nhật next.config.js'); >> check-next-config.js
echo   } else { >> check-next-config.js
echo     console.log('next.config.js không cần cập nhật'); >> check-next-config.js
echo   } >> check-next-config.js
echo } >> check-next-config.js

REM Chạy script kiểm tra next.config.js
node check-next-config.js

REM Xóa file tạm
del /F /Q check-next-config.js >nul 2>&1
echo.

REM Cập nhật .gitignore
echo [7/7] Cập nhật .gitignore...
findstr /c:".next/cache/" .gitignore >nul 2>&1
if errorlevel 1 (
    echo # Các file tạm và cache >> .gitignore
    echo .swc/ >> .gitignore
    echo tsconfig.tsbuildinfo >> .gitignore
    echo .next/cache/ >> .gitignore
    echo .next/server/ >> .gitignore
    echo *.hot-update.* >> .gitignore
    echo check-next-config.js >> .gitignore
    echo fix-webpack-temp.js >> .gitignore
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
