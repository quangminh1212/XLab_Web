@echo off
echo ===========================================================
echo Starting Next.js application - XLab_Web
echo ===========================================================

echo Performing maintenance and optimization...
node scripts/maintenance.js

echo Starting Next.js application...
npm run dev

pause