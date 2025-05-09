@echo off
title XLab Web - Development Server

REM Kiểm tra quyền admin
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Đang yêu cầu quyền quản trị để tránh lỗi quyền truy cập...
    goto UACPrompt
) else (
    goto gotAdmin
)

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" (
        del "%temp%\getadmin.vbs"
    )
    pushd "%CD%"
    CD /D "%~dp0"

echo ================================================
echo  XLab Web - Fixed Development Server
echo ================================================
echo.

echo Đang chuẩn bị môi trường NextJS...
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1

echo Xóa file trace nếu tồn tại (để tránh lỗi EPERM)...
if exist .next\trace del /F /Q .next\trace 2>nul

echo Chạy fix-all.js...
node fix-all.js

echo.
echo ================================================
echo  Khởi động máy chủ phát triển...
echo ================================================
echo.

npm run dev:safe

pause 