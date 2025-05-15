@echo off
title XLab Web - Development Server

echo ================================================
echo  XLab Web - Development Server
echo ================================================
echo.

REM Kiểm tra tham số dòng lệnh
set CLEAN_MODE=0
if "%1"=="clean" set CLEAN_MODE=1
if "%1"=="-c" set CLEAN_MODE=1
if "%1"=="--clean" set CLEAN_MODE=1

REM Hỏi người dùng nếu không có tham số
if not "%1"=="" goto skip_prompt
echo Chon che do khoi dong:
echo 1. Binh thuong 
echo 2. Xoa cache va cai dat moi (--clean)
choice /C 12 /N /M "Lua chon cua ban (1-2): "
if errorlevel 2 set CLEAN_MODE=1
:skip_prompt

REM Đặt các biến môi trường cho NextJS
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_TRACE=1
set NEXT_TRACING_MODE=0
set NEXT_DISABLE_SWC_NATIVE=1
set NEXT_USE_SWC_WASM=1

REM Tạo file .traceignore để ngăn Next.js tạo file trace
echo Tao file .traceignore...
echo **/* > .traceignore

REM Tạo file cấu hình tạm thời để disable trace
echo Tao file cau hinh tam thoi...
if not exist .next (mkdir .next)
echo {"disableTrace":true} > .next\no-trace.json

REM Tạo thư mục .swc-disabled nếu chưa tồn tại
if not exist .swc-disabled (
  mkdir .swc-disabled
  echo Da tao thu muc .swc-disabled de vo hieu hoa SWC native
)

REM Đảm bảo quyền truy cập đầy đủ cho thư mục .next
echo Dat quyen truy cap day du cho thu muc .next...
attrib -R .next /S /D

REM Tạo file dummy trace rỗng và đặt quyền chỉ đọc
echo Tao file trace rong de ngan Next.js tao file moi...
copy NUL .next\trace >nul 2>&1
attrib +R .next\trace

echo.
echo ================================================
echo  Dang chay tien ich sua loi XLab...
echo ================================================
echo.

REM Chạy script utility mới
if exist xlab-utils.js (
  echo Dang chay tien ich XLab Web Toolkit...
  node xlab-utils.js fix-all
) else (
  echo Khong tim thay file xlab-utils.js, dang bo qua buoc sua loi...
)

REM Nếu là chế độ clean, xóa thư mục node_modules và .next
if %CLEAN_MODE%==1 (
  echo.
  echo ================================================
  echo  CHE DO CLEAN: Dang xoa cache va cai dat lai...
  echo ================================================
  echo.
  
  echo Dang xoa thu muc .next...
  rmdir /s /q .next 2>nul
  
  echo Dang xoa thu muc node_modules...
  rmdir /s /q node_modules 2>nul
  
  echo Dang xoa file package-lock.json...
  del /f /q package-lock.json 2>nul
  
  echo Dang cai dat lai cac goi...
  npm install
  
  echo.
  echo Hoan tat cai dat lai trong che do clean!
  echo.
)

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