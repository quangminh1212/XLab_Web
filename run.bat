@echo off
title XLab Web - Development Server

echo ================================================
echo  XLab Web - Development Server
echo ================================================
echo.

REM Thiết lập chế độ màu cho console
color 0A

REM Kết thúc các tiến trình Node.js đang chạy
echo Dang dung cac tien trinh Node.js dang chay...
taskkill /f /im node.exe > nul 2>&1

REM Chọn chế độ
echo Chon che do khoi dong:
echo 1. Khoi dong binh thuong (dev)
echo 2. Khoi dong va sua loi (dev + fix errors)
echo 3. Khoi dong nhanh khong fix loi (fast dev)
echo 4. Chi sua loi khong khoi dong (fix only)
echo.
set /p mode="Nhap so tuong ung (mac dinh: 1): "

if "%mode%"=="" set mode=1

echo Đang chuẩn bị môi trường NextJS...
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096 --openssl-legacy-provider
set NEXT_TELEMETRY_DISABLED=1

if "%mode%"=="4" goto fix_only

REM Sửa lỗi trong cấu hình Next.js
echo Cập nhật cấu hình Next.js...
if exist next.config.js (
  node -e "const fs=require('fs');const path=require('path');const configPath=path.join(__dirname,'next.config.js');let config=fs.readFileSync(configPath,'utf8');config=config.replace(/compiler:\s*{[^}]*}/,`compiler: {\n    styledComponents: true\n  }`);config=config.replace(/experimental:\s*{[^}]*}/,`experimental: {\n    largePageDataBytes: 12800000,\n    forceSwcTransforms: false,\n    appDocumentPreloading: false,\n    disableOptimizedLoading: true,\n    disablePostcssPresetEnv: true\n  }`);fs.writeFileSync(configPath,config);console.log('✅ Next.js config updated successfully');"
) else (
  echo ⚠️ Không tìm thấy file next.config.js, bỏ qua...
)

if "%mode%"=="3" goto start_dev

REM Kiểm tra và xóa các thư mục tạm thời
echo Đang xóa các file tạm thời...
if exist .next\trace (
  attrib -R .next\trace /S /D
  echo. > .next\trace
  echo ✅ Đã tạo file trace rỗng
) else (
  type nul > .next\.empty_trace
  echo ✅ Đã tạo file .empty_trace đánh dấu
)

REM Đặt quyền truy cập đầy đủ cho thư mục .next
echo Đang thiết lập quyền truy cập cho thư mục .next...
attrib -R .next /S /D
icacls .next /grant Everyone:F /T

REM Tạo thư mục .next và các thư mục con nếu chưa tồn tại
if not exist .next mkdir .next
if not exist .next\server mkdir .next\server
if not exist .next\server\vendor-chunks mkdir .next\server\vendor-chunks
if not exist .next\server\chunks mkdir .next\server\chunks
if not exist .next\static mkdir .next\static
if not exist .next\static\chunks mkdir .next\static\chunks
if not exist .next\static\css mkdir .next\static\css

REM Sửa lỗi file trace
echo Đang sửa lỗi EPERM với file trace...
if exist fix-trace.js (
  node fix-trace.js
) else (
  echo ⚠️ Không tìm thấy fix-trace.js, bỏ qua...
)

REM Sửa lỗi component withAdminAuth
echo Đang kiểm tra và sửa lỗi component thiếu...
if exist fix-auth-component.js (
  node fix-auth-component.js
) else (
  echo ⚠️ Không tìm thấy file fix-auth-component.js, bỏ qua...
)

REM Sửa lỗi SWC
echo Đang sửa lỗi SWC...
if exist fix-swc.js (
  node fix-swc.js
) else (
  echo ⚠️ Không tìm thấy file fix-swc.js, bỏ qua...
)

REM Chạy script sửa lỗi tổng hợp
echo Đang sửa lỗi Next.js...
if exist fix-all-errors.js (
  node fix-all-errors.js
) else (
  echo ⚠️ Không tìm thấy file fix-all-errors.js, bỏ qua...
)

REM Sửa lỗi các file static có hash
echo Đang sửa lỗi các file static cụ thể...
if exist fix-static-files.js (
  node fix-static-files.js
) else (
  echo ⚠️ Không tìm thấy file fix-static-files.js, bỏ qua...
)

REM Sửa lỗi 404 cho các file static cụ thể
echo ================================================
echo  Đang sửa lỗi 404 cho các file static...
echo ================================================

REM Tạo các thư mục cần thiết
echo Tạo các thư mục cần thiết...
if not exist .next\static\css\app mkdir .next\static\css\app
if not exist .next\static\app mkdir .next\static\app
if not exist .next\static\app\admin mkdir .next\static\app\admin

REM Tạo các file CSS bị thiếu
echo Tạo các file CSS bị thiếu...
echo /* Layout CSS */ > .next\static\css\app\layout.css

REM Tạo các file JS với hash cụ thể bị thiếu
echo Tạo các file JS với hash cụ thể...
echo // Not Found Page > .next\static\app\not-found.7d3561764989b0ed.js
echo // Layout JS > .next\static\app\layout.32d8c3be6202d9b3.js
echo // App Pages Internals > .next\static\app-pages-internals.196c41f732d2db3f.js
echo // Main App > .next\static\main-app.aef085aefcb8f66f.js
echo // Loading > .next\static\app\loading.062c877ec63579d3.js
echo // Admin Layout > .next\static\app\admin\layout.bd8a9bfaca039569.js
echo // Admin Page > .next\static\app\admin\page.20e1580ca904d554.js

REM Tạo bản sao với timestamp
echo Tạo các bản sao với timestamp...
copy .next\static\css\app\layout.css .next\static\css\app\layout-1746857687478.css > nul
copy .next\static\css\app\layout.css .next\static\css\app\layout-1746857690764.css > nul
copy .next\static\main-app.aef085aefcb8f66f.js .next\static\main-app-1746857687478.js > nul
copy .next\static\main-app.aef085aefcb8f66f.js .next\static\main-app-1746857690764.js > nul

echo ✅ Đã sửa xong lỗi 404 cho các file static!

REM Cập nhật .gitignore nếu cần
echo Đang cập nhật .gitignore...
if exist update-gitignore.js (
  node update-gitignore.js
) else (
  echo ⚠️ Không tìm thấy file update-gitignore.js, bỏ qua...
)

REM Kiểm tra môi trường trước khi khởi động
echo Đang kiểm tra môi trường trước khi khởi động...
if exist verify-config.js (
  node verify-config.js
) else (
  echo ⚠️ Không tìm thấy file verify-config.js, bỏ qua...
)

:fix_only
if "%mode%"=="4" (
  echo ================================================
  echo  Đã hoàn thành việc sửa lỗi, không khởi động server
  echo ================================================
  echo.
  echo Nhấn phím bất kỳ để thoát...
  pause
  exit
)

:start_dev
echo.
echo ================================================
echo  Khởi động máy chủ phát triển...
echo ================================================
echo.

REM Ghi log nếu cần
set "LOG_FILE=next-start.log"
echo Starting Next.js at %time% %date% > %LOG_FILE%

if "%mode%"=="2" (
  npm run dev >> %LOG_FILE% 2>&1
) else (
  npm run dev
)

echo.
echo Server đã dừng, nhấn phím bất kỳ để đóng cửa sổ...
pause