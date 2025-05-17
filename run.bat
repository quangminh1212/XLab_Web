@echo off
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

REM Tạo thư mục tạm để lưu trữ trace thay vì sử dụng thư mục .next
mkdir "%TEMP%\nextjs-trace-workaround" 2>nul
set NEXT_TRACE_DIR=%TEMP%\nextjs-trace-workaround

REM Tạo thư mục .next nếu chưa tồn tại
if not exist .next (mkdir .next)

REM Đảm bảo quyền truy cập đầy đủ cho thư mục .next
echo Đặt quyền truy cập đầy đủ cho thư mục .next...
attrib -R .next /S /D

REM Xóa file trace nếu tồn tại
if exist .next\trace (
  echo Xóa file trace cũ...
  del /F /Q .next\trace 2>nul
  if exist .next\trace (
    echo Không thể xóa file trace, đang tạo file trống...
    copy nul .next\trace >nul 2>&1
  )
)

echo.
echo ================================================
echo  Khởi động máy chủ phát triển...
echo ================================================
echo.

REM Khởi động Next.js thông thường
echo Khởi động Next.js...
npx next dev

echo.
echo Server đã dừng, nhấn phím bất kỳ để đóng cửa sổ...
pause > nul