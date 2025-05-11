@echo off
title XLab Web - Development Server

echo ================================================
echo  XLab Web - Development Server
echo ================================================
echo.

echo Dang chuan bi moi truong NextJS...
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1

REM Xoa file tam thoi
echo Dang xoa cac file tam thoi...
if exist .next\trace del /F /Q .next\trace 2>nul
if exist .next\cache\server\*.pack del /F /Q .next\cache\server\*.pack 2>nul
if exist .next\cache\server\*.pack.gz del /F /Q .next\cache\server\*.pack.gz 2>nul

REM Tao thu muc can thiet
if not exist .next mkdir .next
if not exist .next\server mkdir .next\server
if not exist .next\static mkdir .next\static

REM Chay script sua loi tong hop
echo Dang sua loi Next.js...
if exist fix-all-errors.js (
  node fix-all-errors.js
) else (
  echo Khong tim thay file fix-all-errors.js, bo qua...
)

REM Cap nhat .gitignore neu can
echo Dang cap nhat .gitignore...
if exist update-gitignore.js (
  node update-gitignore.js
) else (
  echo Khong tim thay file update-gitignore.js, bo qua...
)

echo.
echo ================================================
echo  Khoi dong may chu phat trien...
echo ================================================
echo.

npm run dev

echo.
echo Server da dung, nhan phim bat ky de dong cua so...
pause