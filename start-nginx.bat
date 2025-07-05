@echo off
title Nginx for XLab Web
echo Starting Nginx for xlab.id.vn...
cd /d "C:\nginx"
nginx.exe
if errorlevel 1 (
    echo [ERROR] Nginx khong the khoi dong!
    pause
) else (
    echo [SUCCESS] Nginx da khoi dong thanh cong!
    echo [INFO] Website co the truy cap tai: http://xlab.id.vn
)
