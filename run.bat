@echo off
setlocal enabledelayedexpansion

echo ========================================
echo =    XLab Web - Script khoi dong       =
echo ========================================
echo.

rem Kiem tra neu node_modules da ton tai
if exist node_modules (
  echo Node modules da ton tai. Ban co muon cai lai khong? (Y/N)
  set /p reinstall=
  if /i "!reinstall!"=="Y" (
    echo Dang xoa node_modules cu...
    rmdir /s /q node_modules
    echo Xoa thanh cong!
  ) else (
    echo Giu nguyen node_modules hien tai.
  )
)

echo Kiem tra Node.js...
node --version
if %errorlevel% neq 0 (
  echo [LOI] Node.js chua duoc cai dat. Vui long cai dat Node.js tu https://nodejs.org/
  pause
  exit /b
)

echo.
echo Cai dat cac goi phu thuoc...
call npm install --no-fund
if %errorlevel% neq 0 (
  echo [LOI] Khong the cai dat cac goi phu thuoc. Vui long kiem tra ket noi mang hoac xoa thu muc node_modules va thu lai.
  pause
  exit /b
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

echo.
echo Cam on ban da su dung XLab Web!
pause 