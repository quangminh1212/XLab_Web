@echo off
title XLab Web - Development Server

echo ================================================
echo  XLab Web - Development Server
echo ================================================
echo.

echo Đang chuẩn bị môi trường NextJS...
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1

REM Kiểm tra và xóa các thư mục tạm thời
echo Đang xóa các file tạm thời...
if exist .next\trace del /F /Q .next\trace 2>nul
if exist .next\cache\server\*.pack del /F /Q .next\cache\server\*.pack 2>nul
if exist .next\cache\server\*.pack.gz del /F /Q .next\cache\server\*.pack.gz 2>nul

REM Tạo thư mục .next và các thư mục con nếu chưa tồn tại
if not exist .next mkdir .next
if not exist .next\server mkdir .next\server
if not exist .next\server\vendor-chunks mkdir .next\server\vendor-chunks
if not exist .next\server\chunks mkdir .next\server\chunks
if not exist .next\static mkdir .next\static
if not exist .next\static\chunks mkdir .next\static\chunks
if not exist .next\static\css mkdir .next\static\css

REM Sửa lỗi component withAdminAuth
echo Đang kiểm tra và sửa lỗi component thiếu...
if exist fix-auth-component.js (
  node fix-auth-component.js
) else (
  echo Không tìm thấy file fix-auth-component.js, bỏ qua...
)

REM Chạy script sửa lỗi tổng hợp
echo Đang sửa lỗi Next.js...
if exist fix-all-errors.js (
  node fix-all-errors.js
) else (
  echo Không tìm thấy file fix-all-errors.js, bỏ qua...
)

REM Sửa lỗi các file static có hash
echo Đang sửa lỗi các file static cụ thể...
if exist fix-static-files.js (
  node fix-static-files.js
) else (
  echo Không tìm thấy file fix-static-files.js, bỏ qua...
)

REM Sửa lỗi 404 cho các file static cụ thể
echo Đang sửa lỗi 404 cho các file static...
if exist fix-404-errors.bat (
  call fix-404-errors.bat
) else (
  echo Không tìm thấy file fix-404-errors.bat, bỏ qua...
)

REM Cập nhật .gitignore nếu cần
echo Đang cập nhật .gitignore...
if exist update-gitignore.js (
  node update-gitignore.js
) else (
  echo Không tìm thấy file update-gitignore.js, bỏ qua...
)

echo.
echo ================================================
echo  Khởi động máy chủ phát triển...
echo ================================================
echo.

npm run dev

echo.
echo Server đã dừng, nhấn phím bất kỳ để đóng cửa sổ...
pause