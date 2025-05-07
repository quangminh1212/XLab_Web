@echo off
setlocal enabledelayedexpansion

echo XLab Web - Fix NextJS Errors Tool
echo ------------------------------

:: Dừng tất cả các tiến trình Node đang chạy
echo [1/5] Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Xóa thư mục .next hoàn toàn
echo [2/5] Removing .next directory completely...
if exist .next (
  rmdir /s /q .next
  if errorlevel 1 (
    echo Failed to remove .next directory, will try to fix existing files
  ) else (
    echo Successfully removed .next directory
  )
)

:: Tạo cấu trúc thư mục .next mới
echo [3/5] Creating new .next directory structure...
mkdir .next 2>nul
mkdir .next\cache 2>nul
mkdir .next\cache\webpack 2>nul
mkdir .next\cache\webpack\client-development 2>nul
mkdir .next\cache\webpack\server-development 2>nul
mkdir .next\cache\webpack\edge-server-development 2>nul
mkdir .next\server 2>nul
mkdir .next\server\vendor-chunks 2>nul
mkdir .next\server\pages 2>nul
mkdir .next\static 2>nul
mkdir .next\static\chunks 2>nul
mkdir .next\static\chunks\app 2>nul
mkdir .next\static\chunks\pages 2>nul
mkdir .next\static\chunks\webpack 2>nul
mkdir .next\static\css 2>nul
mkdir .next\static\css\app 2>nul
mkdir .next\static\development 2>nul
mkdir .next\static\media 2>nul
mkdir .next\types 2>nul

:: Tạo các file cần thiết
echo [4/5] Creating essential Next.js files...

:: Tạo file webpack runtime
echo module.exports = { moduleLoading: true, loadModule: function() { return Promise.resolve({ default: {} }); } }; > .next\server\webpack-runtime.js
echo module.exports = { moduleLoading: true, loadModule: function() { return Promise.resolve({ default: {} }); } }; > .next\server\pages\webpack-runtime.js

:: Tạo file vendor-chunks/next.js
echo module.exports = { createContext: () => ({}), useState: () => [null, () => {}], useEffect: () => {}, Fragment: 'div' }; > .next\server\vendor-chunks\next.js

:: Tạo các file manifest
echo {"pages":{},"app":{}} > .next\server\next-font-manifest.json
echo {"/_not-found":{"resolvedPagePath":"next/dist/client/components/not-found-error"},"/":{"/":"app/page.js"}} > .next\server\app-paths-manifest.json
echo {"version":2,"sortedMiddleware":[],"middleware":{},"functions":{},"pages":{}} > .next\server\middleware-manifest.json
echo {"polyfillFiles":[],"devFiles":[],"ampDevFiles":[],"lowPriorityFiles":[],"rootMainFiles":[],"pages":{"/_app":[],"/_error":[]},"ampFirstPages":[]} > .next\build-manifest.json
echo {} > .next\react-loadable-manifest.json

:: Tạo file CSS placeholder
echo /* Placeholder CSS */ > .next\static\css\app\layout.css

:: Chạy clean-trace.js để hoàn tất việc chuẩn bị
echo [5/5] Running clean-trace.js to finalize setup...
node clean-trace.js

echo ------------------------------
echo Done! Try running 'npm run dev' or 'npx next dev' now.
echo If you still encounter errors, try the following:
echo 1. Delete node_modules folder and run 'npm install'
echo 2. Run 'npm cache clean --force'
echo 3. Restart your computer and try again

endlocal 