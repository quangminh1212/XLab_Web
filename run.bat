@echo off
echo ===========================================================
echo Starting Next.js application - XLab_Web
echo ===========================================================

REM Kiểm tra và xử lý file trace
if exist ".next\trace" (
  echo Fixing trace file...
  attrib -r -s -h .next\trace
  del /f /q .next\trace
)

REM Khởi động ứng dụng
echo Starting Next.js application...
npm run dev

pause