@echo off
setlocal enableextensions

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------

:: Thiết lập môi trường
call setup-env.bat

:: Hủy tất cả tiến trình Node đang chạy
echo Đang kết thúc các tiến trình Node.js đang chạy...
taskkill /F /IM node.exe >NUL 2>NUL

:: Tìm cổng trống để sử dụng
set PORT=3000
netstat -an | find "LISTENING" | find ":3000" > nul
if %errorlevel% equ 0 (
  echo Cổng 3000 đang được sử dụng. Thử cổng 3001...
  set PORT=3001
  
  netstat -an | find "LISTENING" | find ":3001" > nul
  if %errorlevel% equ 0 (
    echo Cổng 3001 đang được sử dụng. Thử cổng 3002...
    set PORT=3002
    
    netstat -an | find "LISTENING" | find ":3002" > nul
    if %errorlevel% equ 0 (
      echo Cổng 3002 đang được sử dụng. Thử cổng 3003...
      set PORT=3003
    )
  )
)

echo Sử dụng cổng %PORT%

:: Đặt cổng trong file .env.local
echo Cập nhật .env.local với cổng %PORT%...
powershell -Command "(Get-Content .env.local) -replace 'NEXTAUTH_URL=http://localhost:3000', ('NEXTAUTH_URL=http://localhost:' + '%PORT%') | Set-Content .env.local"

:: Kiểm tra tham số để xác định chế độ
if "%1"=="dev" (
  echo [Running in DEVELOPMENT mode]
  echo Running development server...
  
  :: Thiết lập biến môi trường
  set NEXT_PUBLIC_PORT=%PORT%
  set NODE_ENV=development
  
  npm run dev -- -p %PORT%
) else (
  echo [Running in PRODUCTION mode]

  rem Kiểm tra và cài đặt các package cần thiết
  echo Checking dependencies...
  if not exist node_modules\critters (
    echo Installing critters package...
    call npm install critters@0.0.20 --save
  )
  
  if not exist node_modules\cross-env (
    echo Installing cross-env package...
    call npm install cross-env@7.0.3 --save-dev
  )

  rem Làm sạch cache và build artifacts
  echo Cleaning build artifacts...
  call npm run clean

  echo Running production build and start...
  
  rem Tạo thư mục .next nếu chưa tồn tại
  if not exist .next mkdir .next
  if not exist .next\server mkdir .next\server

  rem Tạo prerender-manifest.json trống nếu không tồn tại
  if not exist .next\prerender-manifest.json (
    echo Creating empty prerender-manifest.json...
    echo { "version": 4, "routes": {}, "dynamicRoutes": {}, "preview": { "previewModeId": "", "previewModeSigningKey": "", "previewModeEncryptionKey": "" }, "notFoundRoutes": [] } > .next\prerender-manifest.json
  )
  
  :: Thiết lập biến môi trường
  set NEXT_PUBLIC_PORT=%PORT%
  set NODE_ENV=production
  set PORT=%PORT%
  
  rem Chạy build với cross-env để hỗ trợ biến môi trường trên Windows
  call npm run build
  
  rem Nếu build thành công, chạy server với cổng đã chọn
  call npm run start-port %PORT%
)

echo Ứng dụng đang chạy tại: http://localhost:%PORT%
echo Nhấn Ctrl+C để dừng ứng dụng.

endlocal 