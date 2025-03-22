@echo off
echo Starting XLab_Web development server...
cd /d %~dp0
start cmd /c "powershell -ExecutionPolicy Bypass -Command npm run dev" 