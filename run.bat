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
set NEXT_DISABLE_SWC_NATIVE=1
set NEXT_USE_SWC_WASM=1

REM Xử lý file trace ngay từ đầu
if exist .next\trace (
  echo Dang xu ly file trace...
  attrib -R .next\trace 2>nul
  del /F /Q .next\trace 2>nul
  if exist .next\trace (
    echo Khong the xoa file trace, dang doi ten...
    ren .next\trace trace.old.%random% 2>nul
  )
)

REM Tạo thư mục .swc-disabled nếu chưa tồn tại
if not exist .swc-disabled (
  mkdir .swc-disabled
  echo Đã tạo thư mục .swc-disabled để vô hiệu hóa SWC native
)

echo.
echo ================================================
echo  Đang cấu hình và sửa lỗi Next.js...
echo ================================================
echo.

REM Chạy script tổng hợp sửa lỗi
if exist next-fix-all.js (
  node next-fix-all.js
) else (
  echo Không tìm thấy file next-fix-all.js, vui lòng tạo file trước khi chạy script này.
  goto :end
)

REM Kiểm tra file trace lần cuối trước khi khởi động
if exist .next\trace (
  echo Xoa file trace lan cuoi...
  attrib -R .next\trace 2>nul
  del /F /Q .next\trace 2>nul
  if exist .next\trace (
    echo Khong the xoa file trace, bo qua...
  )
)

echo.
echo ================================================
echo  Khởi động máy chủ phát triển...
echo ================================================
echo.

call npm run dev:wasm

:end
echo.
echo Server đã dừng, nhấn phím bất kỳ để đóng cửa sổ...
pause