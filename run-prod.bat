@echo off
echo ======================================
echo XLab Web Application - PRODUCTION MODE
echo ======================================
echo.
echo Building production version...
call npm run build
echo.
echo Starting production server...
npm start 