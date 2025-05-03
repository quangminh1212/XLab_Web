@echo off
echo Cleaning up Next.js development environment...

:: Dừng tất cả các tiến trình Node đang chạy
echo Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Xóa thư mục .next
echo Removing .next directory...
if exist .next rmdir /s /q .next >nul 2>&1

:: Xóa file .babelrc nếu tồn tại
echo Removing .babelrc file...
if exist .babelrc del /f /q .babelrc >nul 2>&1

:: Xóa cache trong node_modules
echo Cleaning node_modules cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache >nul 2>&1

echo Clean up completed successfully!
echo You can now start the application with 'run.bat' 