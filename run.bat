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

REM Sửa lỗi component withAdminAuth
echo Đang kiểm tra và sửa lỗi component thiếu...
if exist fix-auth-component.js (
  node fix-auth-component.js
) else (
  echo Không tìm thấy file fix-auth-component.js, bỏ qua...
)

REM Chạy script fix lỗi tiếp theo
echo Đang sửa lỗi vendor paths...
if exist fix-nextjs-vendor-paths.js (
  node fix-nextjs-vendor-paths.js
) else (
  echo Không tìm thấy file fix-nextjs-vendor-paths.js, bỏ qua...
)

echo Đang sửa lỗi missing files...
if exist fix-nextjs-missing-files.js (
  node fix-nextjs-missing-files.js
) else (
  echo Không tìm thấy file fix-nextjs-missing-files.js, bỏ qua...
)

echo Đang sửa lỗi webpack...
if exist fix-webpack-enoent.js (
  node fix-webpack-enoent.js
) else (
  echo Không tìm thấy file fix-webpack-enoent.js, bỏ qua...
)

echo Đang sửa lỗi vendor chunks...
if exist fix-vendor-chunks.js (
  node fix-vendor-chunks.js
) else (
  echo Không tìm thấy file fix-vendor-chunks.js, bỏ qua...
)

echo Đang sửa lỗi webpack hot update...
if exist fix-webpack-hot-update.js (
  node fix-webpack-hot-update.js
) else (
  echo Không tìm thấy file fix-webpack-hot-update.js, bỏ qua...
)

echo Đang sửa lỗi critters...
if exist fix-critters.js (
  node fix-critters.js
) else (
  echo Không tìm thấy file fix-critters.js, bỏ qua...
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