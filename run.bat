@echo off
setlocal enabledelayedexpansion

echo ========================================
echo =    XLab Web - Script khoi dong       =
echo ========================================
echo.

echo Kiem tra Node.js...
node --version
if %errorlevel% neq 0 (
  echo [LOI] Node.js chua duoc cai dat. Vui long cai dat Node.js tu https://nodejs.org/
  pause
  exit /b
)

echo.
if not exist node_modules (
  echo Cai dat cac goi phu thuoc...
  call npm install --no-fund
  if %errorlevel% neq 0 (
    echo [LOI] Khong the cai dat cac goi phu thuoc. Vui long kiem tra ket noi mang.
    pause
    exit /b
  )
) else (
  echo Da tim thay node_modules. Tiep tuc...
)

echo.
echo Tien hanh build du an...
call npm run build

if %errorlevel% neq 0 (
  echo [LOI] Khong the build du an. Vui long kiem tra lai code va thu lai.
  pause
  exit /b
)

echo.
echo Build thanh cong! Dang khoi dong o che do production...
call npm run start 