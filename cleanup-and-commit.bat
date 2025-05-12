@echo off
title XLab Web - Cleanup and Commit

echo ================================================
echo  XLab Web - Cleanup and Commit
echo ================================================
echo.

echo Xóa các file dư thừa...
if exist clean-up.js (
  node clean-up.js
  if exist clean-up.js del /F /Q clean-up.js
) else (
  echo File clean-up.js không tồn tại, sử dụng next-fix-all.js...
  if exist next-fix-all.js (
    node next-fix-all.js
  ) else (
    echo Không tìm thấy cả hai file clean-up.js và next-fix-all.js.
    goto :end
  )
)

echo.
echo ================================================
echo  Commit changes to Git
echo ================================================
echo.

REM Hiển thị trạng thái Git
if exist "%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" (
  powershell -Command "git status"
) else (
  git status
)

echo.
echo === Thêm tất cả file đã thay đổi vào stage ===
echo.

REM Thêm tất cả các file đã thay đổi
git add .

echo.
echo === Tạo commit ===
echo.

REM Commit với thông điệp mô tả việc tích hợp các file fix
git commit -m "refactor: integrate all fix scripts into a single unified next-fix-all.js"

echo.
echo ✅ Đã hoàn tất quá trình dọn dẹp và commit!
echo.

:end
pause 