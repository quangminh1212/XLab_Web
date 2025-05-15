@echo off
title XLab Web - Development Server

echo ================================================
echo  XLab Web - Development Server
echo ================================================
echo.

REM Đặt các biến môi trường cho NextJS
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_TRACE=1
set NEXT_TRACING_MODE=0
set NEXT_DISABLE_SWC_NATIVE=1
set NEXT_USE_SWC_WASM=1

REM Tạo thư mục .next nếu chưa tồn tại
if not exist .next (mkdir .next)

REM Đảm bảo quyền truy cập đầy đủ cho thư mục .next
echo Dat quyen truy cap day du cho thu muc .next...
attrib -R .next /S /D

echo.
echo ================================================
echo  Dang chay script sua loi...
echo ================================================
echo.

REM Chạy script sửa lỗi tổng hợp
node fix-all-errors.js

echo.
echo ================================================
echo  Khoi dong may chu phat trien...
echo ================================================
echo.

REM Khởi động Next.js thông thường
echo Khoi dong Next.js...
npx next dev

echo.
echo Server da dung, nhan phim bat ky de dong cua so...
pause