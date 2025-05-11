@echo off
echo ===== KHỞI ĐỘNG NEXTJS KHÔNG HIỂN THỊ CẢNH BÁO =====
set DISABLE_SWC=true
set NEXT_DISABLE_SWC=1
set NODE_OPTIONS=--no-warnings --max_old_space_size=4096

echo Cleaning cache...
if exist .next\cache rmdir /s /q .next\cache
if exist node_modules\.cache rmdir /s /q node_modules\.cache
mkdir .next\cache

echo Cleaning SWC fallback...
if exist node_modules\next\next-swc-fallback rmdir /s /q node_modules\next\next-swc-fallback
if exist node_modules\@next\swc-win32-x64-msvc rmdir /s /q node_modules\@next\swc-win32-x64-msvc

echo Starting Next.js with Babel...
npx cross-env DISABLE_SWC=true NEXT_DISABLE_SWC=1 NODE_OPTIONS="--no-warnings" next dev
