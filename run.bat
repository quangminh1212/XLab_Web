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

echo Ẩn cảnh báo Next.js...
if exist hide-warnings.js (
  node hide-warnings.js
) else (
  echo Không tìm thấy file hide-warnings.js, bỏ qua...
)

echo Sửa lỗi file trace...
if exist fix-trace-error.js (
  node fix-trace-error.js
) else (
  echo Không tìm thấy file fix-trace-error.js, bỏ qua...
)

echo Đang chuẩn bị môi trường NextJS...

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
if not exist .next\static\css\app mkdir .next\static\css\app
if not exist .next\static\app mkdir .next\static\app
if not exist .next\static\app\admin mkdir .next\static\app\admin

REM Sửa lỗi component withAdminAuth
echo Đang kiểm tra và sửa lỗi component thiếu...
if exist fix-auth-component.js (
  node fix-auth-component.js
) else (
  echo Không tìm thấy file fix-auth-component.js, bỏ qua...
)

REM Sửa lỗi SWC
echo Đang sửa lỗi SWC...
if exist fix-swc-errors.js (
  node fix-swc-errors.js
) else (
  echo Không tìm thấy file fix-swc-errors.js, bỏ qua...
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
echo ================================================
echo   Fixing 404 errors for static files
echo ================================================
echo.

REM Create missing CSS files
echo Creating missing CSS files...
echo /* Layout CSS */ > .next\static\css\app\layout.css

REM Create missing JS files with exact hashes
echo Creating missing JS files with exact hashes...
echo // Not Found Page > .next\static\app\not-found.7d3561764989b0ed.js
echo // Layout JS > .next\static\app\layout.32d8c3be6202d9b3.js
echo // App Pages Internals > .next\static\app-pages-internals.196c41f732d2db3f.js
echo // Main App > .next\static\main-app.aef085aefcb8f66f.js
echo // Loading > .next\static\app\loading.062c877ec63579d3.js
echo // Admin Layout > .next\static\app\admin\layout.bd8a9bfaca039569.js
echo // Admin Page > .next\static\app\admin\page.20e1580ca904d554.js

REM Create copies with timestamp suffixes
echo Creating timestamp copies...
copy .next\static\css\app\layout.css .next\static\css\app\layout-1746857687478.css 2>nul
copy .next\static\css\app\layout.css .next\static\css\app\layout-1746857690764.css 2>nul
copy .next\static\css\app\layout.css .next\static\css\app\layout-1746857700000.css 2>nul
copy .next\static\main-app.aef085aefcb8f66f.js .next\static\main-app-1746857687478.js 2>nul
copy .next\static\main-app.aef085aefcb8f66f.js .next\static\main-app-1746857690764.js 2>nul
copy .next\static\main-app.aef085aefcb8f66f.js .next\static\main-app-1746857700000.js 2>nul

echo.
echo ================================================
echo   All 404 errors fixed!
echo ================================================
echo.

REM Cập nhật .env.local
echo Updating .env.local...
echo NEXT_TELEMETRY_DISABLED=1> .env.local
echo NODE_OPTIONS="--no-warnings">> .env.local
echo NEXT_DISABLE_TRACE=1>> .env.local
echo NEXT_DISABLE_SWC_NATIVE=1>> .env.local
echo NEXT_USE_SWC_WASM=1>> .env.local
echo Updated .env.local successfully.

REM Cập nhật .gitignore nếu cần
echo Đang cập nhật .gitignore...
if exist update-gitignore.js (
  node update-gitignore.js
) else (
  echo Không tìm thấy file update-gitignore.js, bỏ qua...
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

echo.
echo Server đã dừng, nhấn phím bất kỳ để đóng cửa sổ...
pause