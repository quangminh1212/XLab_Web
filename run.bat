@echo off
echo ================================================
echo  XLab Web - Development Server
echo ================================================
REM Đặt các biến môi trường cho NextJS
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_TRACE=1
set NEXT_TRACING_MODE=0
set NEXT_DISABLE_SWC_NATIVE=1
set NEXT_USE_SWC_WASM=1

REM Chạy scripts để sửa lỗi
echo Dang chay scripts sua loi...
node fix-all-errors.js

REM Tạo thư mục .swc-disabled nếu chưa tồn tại
if not exist .swc-disabled (
  mkdir .swc-disabled
  echo Da tao thu muc .swc-disabled de vo hieu hoa SWC native
)

REM Đảm bảo quyền truy cập đầy đủ cho thư mục .next
echo Dat quyen truy cap day du cho thu muc .next...
attrib -R .next /S /D

REM Tạo file .traceignore để ngăn Next.js tạo file trace
echo Tao file .traceignore...
echo **/* > .traceignore

REM Tạo file cấu hình tạm thời để disable trace
echo Tao file cau hinh tam thoi...
if not exist .next (mkdir .next)
echo {"disableTrace":true} > .next\no-trace.json

REM Xóa thư mục .next để bắt đầu với trạng thái sạch
echo Xoa thu muc .next de bat dau moi...
rmdir /s /q .next 2>nul

REM Tạo cấu trúc thư mục .next cần thiết
echo Tao cau truc thu muc .next...
mkdir .next 2>nul
mkdir .next\cache 2>nul
mkdir .next\cache\webpack 2>nul
mkdir .next\server 2>nul
mkdir .next\static 2>nul

REM Tạo file dummy trace rỗng và đặt quyền chỉ đọc
echo Tao file trace rong de ngan Next.js tao file moi...
copy NUL .next\trace >nul 2>&1
attrib +R .next\trace

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