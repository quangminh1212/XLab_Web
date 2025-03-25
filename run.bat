@echo off
echo ==== XLab Web Application Runner ====
echo Starting XLab_Web development server...
echo.

echo [1/6] Kiểm tra Node.js...
call node --version
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js không được cài đặt hoặc không tìm thấy trong PATH.
  echo Vui lòng cài đặt Node.js từ https://nodejs.org/
  pause
  exit /b 1
)

echo [2/6] Chạy script sửa lỗi Next.js...
call node fix-next.js
if %ERRORLEVEL% NEQ 0 (
  echo WARNING: Script sửa lỗi không chạy thành công, tiếp tục...
)

echo [3/6] Cài đặt dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
  echo WARNING: Cài đặt dependencies không thành công, thử phương pháp khác...
  call npm install --legacy-peer-deps --force
)

echo [4/6] Dọn dẹp cache Next.js...
if exist .next rmdir /s /q .next

echo [5/6] Kiểm tra cài đặt...
if not exist node_modules\react\package.json (
  echo ERROR: React không được cài đặt đúng cách.
  echo Thử phương pháp cài đặt thay thế...
  call npm install react@18.2.0 react-dom@18.2.0 next@13.5.6 --legacy-peer-deps --force
)

echo [6/6] Bắt đầu máy chủ phát triển...
set NODE_OPTIONS=--max_old_space_size=4096
call npm run dev

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo ERROR: Máy chủ phát triển không khởi động được!
  echo Đang thử phương pháp thay thế...
  
  echo Khởi động phiên gỡ lỗi...
  call npm run debug
)

echo.
echo Nếu bạn vẫn gặp vấn đề, hãy thử những bước sau:
echo 1. Xóa thư mục node_modules và package-lock.json
echo 2. Chạy: npm cache clean --force
echo 3. Chạy: npm install --legacy-peer-deps
echo 4. Chạy: npm run fix-next
echo 5. Chạy: npm run dev

pause 