@echo off
echo Starting XLab_Web development server directly...
cd /d %~dp0
start cmd /c "node node_modules/next/dist/bin/next dev" 