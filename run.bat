@echo off
setlocal

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------

:: Kiểm tra tham số để xác định chế độ
if "%1"=="dev" (
  echo [Running in DEVELOPMENT mode]
  set MODE=development
) else (
  echo [Running in PRODUCTION mode]
  set MODE=production
)

:: Dừng tất cả các tiến trình Node đang chạy
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 >nul

:: Thiết lập biến môi trường
set NODE_ENV=%MODE%
set NEXT_TELEMETRY_DISABLED=1

if "%MODE%"=="production" (
  :: Chế độ production
  echo Running production build and start...
  
  :: Build trước khi start
  npm run build
  
  :: Chạy production server
  echo Starting production server...
  npm start
) else (
  :: Chế độ development
  echo Starting development server...
  npm run dev
)

endlocal 