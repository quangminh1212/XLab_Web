@echo off
chcp 65001 > nul
cd /d %~dp0

echo Starting Next.js directly...
echo Checking node version...
node --version

set NODE_OPTIONS=--max-old-space-size=4096

if exist .next-dev\server (
  echo Using existing dev build...
) else (
  echo No dev build found, cleaning cache...
  if exist .next-dev rd /s /q .next-dev 2>nul
)

echo Starting server on http://localhost:3000
node node_modules\next\dist\bin\next dev --port 3000
exit /b 0 