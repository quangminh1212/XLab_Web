@echo off
echo ======================================
echo XLab Web - Fix Next.js Cache Errors
echo ======================================
echo.
echo This will clean up the Next.js cache files and fix ENOENT errors
echo.

:: Dừng tất cả các tiến trình Node đang chạy
echo [1/4] Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: Xóa thư mục .next/cache
echo [2/4] Removing .next/cache directory...
if exist .next\cache rmdir /s /q .next\cache 2>nul
if exist .next\static rmdir /s /q .next\static 2>nul
if exist .next\server rmdir /s /q .next\server 2>nul
if exist .next\trace del /f /q .next\trace 2>nul
if exist .next\build-manifest.json del /f /q .next\build-manifest.json 2>nul
if exist .next\react-loadable-manifest.json del /f /q .next\react-loadable-manifest.json 2>nul

:: Tạo lại cấu trúc thư mục cần thiết
echo [3/4] Creating necessary directory structure...
if not exist .next mkdir .next
if not exist .next\cache mkdir .next\cache
if not exist .next\cache\webpack mkdir .next\cache\webpack
if not exist .next\cache\webpack\client-development mkdir .next\cache\webpack\client-development
if not exist .next\cache\webpack\server-development mkdir .next\cache\webpack\server-development
if not exist .next\cache\webpack\edge-server-development mkdir .next\cache\webpack\edge-server-development

:: Chạy script clean-trace.js để tạo các file placeholder cần thiết
echo [4/4] Running clean-trace.js script...
node clean-trace.js

echo.
echo ======================================
echo Fix completed! Now you can run:
echo npm run dev
echo to start the development server.
echo ======================================

pause 