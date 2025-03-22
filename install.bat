@echo off
echo Installing dependencies for XLab_Web...
cd /d %~dp0
cmd /c "powershell -ExecutionPolicy Bypass -Command npm install"
echo Installation complete. Now you can run the project using run.bat
pause 