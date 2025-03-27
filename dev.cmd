@echo off
chcp 65001 >nul
cd /d "%~dp0"
set NODE_OPTIONS=--max-old-space-size=4096
node ./node_modules/next/dist/bin/next dev 