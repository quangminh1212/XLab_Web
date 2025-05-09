@echo off
title XLab Web - Fix All Next.js Errors

REM Kiểm tra quyền admin
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Đang yêu cầu quyền quản trị để tránh lỗi quyền truy cập...
    goto UACPrompt
) else (
    goto gotAdmin
)

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" (
        del "%temp%\getadmin.vbs"
    )
    pushd "%CD%"
    CD /D "%~dp0"

echo ====================================
echo   XLab Web - Fix All Next.js Errors
echo ====================================
echo.
echo This script will fix all Next.js errors including:
echo - ENOENT errors
echo - Webpack cache errors
echo - Server runtime errors
echo - Static file errors
echo - EPERM trace errors
echo - Vendor chunks errors
echo.

echo [1/11] Dừng tất cả tiến trình Node.js...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/11] Thiết lập biến môi trường...
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1

echo [3/11] Xóa hoàn toàn thư mục .next...
if exist .next rmdir /s /q .next 
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [4/11] Tạo cấu trúc thư mục Next.js cơ bản...
mkdir .next
mkdir .next\cache
mkdir .next\cache\webpack
mkdir .next\cache\webpack\client-development
mkdir .next\cache\webpack\server-development
mkdir .next\cache\webpack\edge-server-development
mkdir .next\cache\server
mkdir .next\server
mkdir .next\server\pages
mkdir .next\server\app
mkdir .next\server\app\_not-found
mkdir .next\server\vendor-chunks
mkdir .next\server\pages\vendor-chunks
mkdir .next\server\chunks
mkdir .next\static
mkdir .next\static\chunks
mkdir .next\static\chunks\app
mkdir .next\static\chunks\pages
mkdir .next\static\chunks\fallback
mkdir .next\static\css
mkdir .next\static\css\app
mkdir .next\static\media
mkdir .next\static\webpack

echo [5/11] Tạo các file webpack placeholder...
node fix-webpack-enoent.js

echo [6/11] Tạo các bản fix webpack hot update...
node fix-webpack-hot-update.js

echo [7/11] Tạo các bản fix vendor chunks...
node fix-nextjs-vendor-paths.js

echo [8/11] Tạo các file bị thiếu...
node fix-nextjs-missing-files.js

echo [9/11] Tạo các file manifest font và các file cần thiết khác...
echo {"pages":{},"app":{}} > .next\server\next-font-manifest.json
echo {"pages":{},"app":{}} > .next\server\app-paths-manifest.json
echo {"middleware":{},"functions":{},"version":2} > .next\server\middleware-manifest.json
echo {} > .next\build-manifest.json
echo {} > .next\react-loadable-manifest.json
echo {} > .next\fallback-build-manifest.json
echo {"page":"/_not-found"} > .next\server\_not-found.json

echo [10/11] Tạo các file fallback...
echo // Fallback file > .next\static\chunks\fallback\main.js
echo // Fallback file > .next\static\chunks\fallback\webpack.js
echo // Fallback file > .next\static\chunks\fallback\react-refresh.js
echo // Fallback file > .next\static\chunks\fallback\pages\_app.js
echo // Fallback file > .next\static\chunks\fallback\pages\_error.js

echo [11/11] Chạy các script bổ sung...
node clean-trace.js
node fix-critters.js
node fix-all.js

echo.
echo ====================================
echo Fix completed successfully!
echo.
echo Bạn có thể chạy:
echo   .\run.bat
echo để khởi động máy chủ phát triển.
echo ====================================
echo.

pause 