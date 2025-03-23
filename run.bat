@echo off
setlocal EnableDelayedExpansion

echo ==== XLab Web Application Runner ====
echo.

set command=%1
if "!command!" == "" set command=run

REM Hiển thị trợ giúp nếu được yêu cầu
if /i "!command!" == "--help" (
  goto :show_help
)

if /i "!command!" == "check" (
  goto :check_versions
)

if /i "!command!" == "update" (
  goto :update_nextjs
)

if /i "!command!" == "auto-update" (
  goto :auto_update_nextjs
)

if /i "!command!" == "debug" (
  goto :run_debug
)

if /i "!command!" == "run" (
  goto :run_normal
)

echo Lệnh không hợp lệ: !command!
echo Sử dụng --help để xem danh sách lệnh hợp lệ.
exit /b 1

:show_help
echo Cách sử dụng: run.bat [COMMAND]
echo.
echo Commands:
echo   run          Chạy ứng dụng bình thường (mặc định)
echo   check        Kiểm tra phiên bản Next.js hiện tại và có sẵn
echo   update       Cập nhật Next.js với xác nhận trước
echo   auto-update  Tự động cập nhật Next.js không cần xác nhận
echo   debug        Chạy với chế độ debug và logging chi tiết
echo   --help       Hiển thị trợ giúp này
echo.
goto :eof

:check_versions
echo ==== Next.js Version Checker ====
echo.

echo Checking installed Next.js version...
call npx next --version

echo.
echo Checking installed React version...
call node -e "try { console.log('React: ' + require('react').version) } catch (e) { console.log('React not installed') }"

echo.
echo Checking for latest versions available...
call npm view next version
call npm view react version
call npm view react-dom version
call npm view @swc/helpers version

echo.
echo To update to the latest versions, run:
echo    run.bat update
echo.
goto :eof

:update_nextjs
echo ==== Next.js Updater Tool ====
echo.

echo This script will update Next.js and React to the latest versions.
echo It is recommended to commit your changes before updating.
echo.

set /p CONFIRM=Do you want to continue? (Y/N): 
if /i "!CONFIRM!" NEQ "Y" (
  echo Update cancelled.
  exit /b
)

call :do_update
goto :eof

:auto_update_nextjs
echo ==== Next.js Automatic Updater ====
echo.

echo Auto-updating Next.js and React to the latest versions...
call :do_update
goto :eof

:do_update
echo.
echo 1. Cleaning npm cache...
call npm cache clean --force

echo.
echo 2. Backing up package.json...
copy package.json package.json.bak
echo Backup created: package.json.bak

echo.
echo 3. Installing latest Next.js, React, and related packages...
call npm install next@latest react@latest react-dom@latest eslint-config-next@latest --save

echo.
echo 4. Checking for @swc/helpers compatibility...
call npm install @swc/helpers@latest --save

echo.
echo 5. Installed versions:
call npx next --version
call node -e "console.log('React: ' + require('react').version)"
call node -e "try { console.log('@swc/helpers: ' + require('@swc/helpers/package.json').version) } catch(e) { console.log('@swc/helpers: not found') }"

echo.
echo 6. Cleaning up Next.js cache...
if exist .next (
  rmdir /s /q .next
  echo .next directory cleaned
)

echo.
echo Update completed successfully!
if exist package.json.bak (
  echo If you encounter any issues, you can restore the backup with:
  echo    copy package.json.bak package.json
  echo    npm install
)
echo.
echo To run the application with the updated version:
echo    run.bat run
exit /b 0

:run_debug
echo.
echo Starting XLab_Web in DEBUG mode...
echo Press Ctrl+C to stop the server when finished.

echo Checking dependencies...
call npm install

echo.
echo Verifying installed versions:
call npx next --version
call node -e "console.log('React: ' + require('react').version)"

echo Debug mode: capturing all output to debug.log
call npm run dev:debug > debug.log 2>&1

IF ERRORLEVEL 1 (
  echo.
  echo Primary method failed, trying alternative method...
  call npm run dev
  
  IF ERRORLEVEL 1 (
    goto :run_error
  )
)
goto :eof

:run_normal
echo.
echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.

echo Checking dependencies...
call npm install

echo.
echo Verifying installed versions:
call npx next --version
call node -e "console.log('React: ' + require('react').version)"

call npm run dev 2> app.log

IF ERRORLEVEL 1 (
  echo.
  echo Primary method failed, trying alternative method...
  call npm run dev
  
  IF ERRORLEVEL 1 (
    goto :run_error
  )
)
goto :eof

:run_error
echo.
echo Error: Failed to start the development server.
echo Checking for common issues...

echo 1. Verifying node_modules directory...
if not exist node_modules (
  echo node_modules not found. Reinstalling dependencies...
  call npm install
  echo Trying to start server again...
  call npm run dev
) else (
  echo Cleaning cache and trying again...
  call npm cache clean --force
  call npm run dev
)

endlocal 