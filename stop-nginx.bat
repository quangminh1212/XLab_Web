@echo off
title Stop Nginx
echo Stopping Nginx...
cd /d "C:\nginx"
nginx.exe -s quit
echo Nginx stopped.
timeout /t 2 >nul
