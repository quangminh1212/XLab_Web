@echo off
rem Khong su dung tieng Viet co dau trong file .bat
setlocal enabledelayedexpansion

title XLab Web - All-in-One Launcher
color 0A

echo ========================================================
echo     XLab Web - All-in-One Launcher
echo ========================================================
echo.

REM Xác định đường dẫn hiện tại
cd /d "%~dp0"
echo Thư mục hiện tại: %CD%
echo.

REM Dừng các tiến trình Node.js
echo [1/12] Dừng tất cả các tiến trình Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo.

REM Xóa cache Next.js
echo [2/12] Xóa thư mục .next...
if exist ".next" (
    echo Đang xóa thư mục .next...
    rmdir /S /Q .next 2>nul

    REM Kiểm tra xem thư mục đã được xóa chưa
    if exist ".next" (
        echo Không thể xóa thư mục .next bằng cách thông thường
        echo Đang dùng phương pháp xóa file cụ thể...
        if exist ".next\trace" (
            del /F /S /Q ".next\trace\*.*" >nul 2>&1
            rmdir /S /Q ".next\trace" >nul 2>&1
        )
        if exist ".next\cache" (
            del /F /S /Q ".next\cache\*.*" >nul 2>&1 
            rmdir /S /Q ".next\cache" >nul 2>&1
        )
        del /F /S /Q ".next\*.*" >nul 2>&1
        rmdir /S /Q ".next" >nul 2>&1
    )
)
echo.

REM Đặt biến môi trường cụ thể cho Windows 10
echo [3/12] Thiết lập biến môi trường...
set NODE_OPTIONS=--max-old-space-size=4096 --dns-result-order=ipv4first
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development
set NEXT_DEVELOPMENT_MODE=1
set NEXT_WEBPACK_ERROR_HANDLING=1
set CHOKIDAR_USEPOLLING=true
set WATCHPACK_POLLING=true
echo.

REM Tạo file .env.local tương thích Windows 10
echo [4/12] Tạo file .env.local cho Windows...
(
echo NODE_OPTIONS=--max-old-space-size=4096 --dns-result-order=ipv4first
echo NEXT_TELEMETRY_DISABLED=1
echo NODE_ENV=development
echo NEXT_DEVELOPMENT_MODE=1
echo NEXT_WEBPACK_ERROR_HANDLING=1
echo CHOKIDAR_USEPOLLING=true
echo WATCHPACK_POLLING=true
) > .env.local
echo.

REM Tạo npmrc tương thích Windows 10
echo [5/12] Cấu hình npm...
(
echo registry=https://registry.npmjs.org/
echo legacy-peer-deps=true
echo engine-strict=false
echo fund=false
echo progress=false
echo loglevel=error
echo ignore-scripts=false
echo cache-min=3600
echo prefer-offline=true
) > .npmrc
echo.

REM Kiểm tra thư mục node_modules
echo [6/12] Kiểm tra thư mục node_modules...
if not exist node_modules (
    echo Thư mục node_modules không tồn tại, sẽ cài đặt mới
    set need_install=1
) else (
    echo Thư mục node_modules đã tồn tại, bỏ qua bước cài đặt
    set need_install=0
)
echo.

REM Tạo thư mục tạm thời nếu không tồn tại
if not exist "tmp" mkdir tmp
set TEMP=%CD%\tmp
set TMP=%CD%\tmp

REM Kiểm tra phiên bản Node.js (tích hợp từ node-version-check.js)
echo [7/12] Kiểm tra phiên bản Node.js...
node -e "const currentNodeVersion = process.versions.node; const semver = currentNodeVersion.split('.'); const major = parseInt(semver[0], 10); console.log('Kiểm tra phiên bản Node.js: ' + currentNodeVersion); if (major < 16) { console.error('Bạn đang sử dụng Node.js ' + currentNodeVersion + '.\nDự án này yêu cầu Node.js 16 hoặc mới hơn.\nVui lòng cập nhật phiên bản Node.js của bạn.'); process.exit(1); } if (process.platform === 'win32' && major < 18) { console.warn('Lưu ý: Bạn đang sử dụng Node.js ' + currentNodeVersion + ' trên Windows.\nMột số tính năng có thể không hoạt động như mong đợi. Khuyến nghị sử dụng Node.js 18 hoặc mới hơn.'); } try { eval('const test = null ?? \"default\"'); console.log('✅ Trình biên dịch hỗ trợ toán tử nullish coalescing (??)'); } catch (e) { console.error('❌ Phiên bản Node.js của bạn không hỗ trợ toán tử nullish coalescing (??).\nĐiều này có thể gây ra lỗi khi chạy dự án.\nVui lòng cập nhật lên Node.js 14 hoặc mới hơn.'); process.exit(1); } try { eval('const obj = {}; const test = obj?.property'); console.log('✅ Trình biên dịch hỗ trợ toán tử optional chaining (?)'); } catch (e) { console.error('❌ Phiên bản Node.js của bạn không hỗ trợ toán tử optional chaining (?).\nĐiều này có thể gây ra lỗi khi chạy dự án.\nVui lòng cập nhật lên Node.js 14 hoặc mới hơn.'); process.exit(1); } try { eval('let a = null; a = a || \"default\"'); console.log('✅ Trình biên dịch hỗ trợ toán tử logical OR'); } catch (e) { console.error('❌ Lỗi với các toán tử logic trong Node.js của bạn.\nĐiều này có thể gây ra lỗi khi chạy dự án.'); } console.log('✅ Kiểm tra phiên bản Node.js hoàn tất');"
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================================
    echo     LỖI: Phiên bản Node.js không tương thích!
    echo     Vui lòng cập nhật Node.js
    echo ========================================================
    echo.
    pause
    exit /b 1
)
echo.

REM Sửa lỗi Windows và sửa lỗi Node_modules
echo [8/12] Sửa lỗi các module cho Windows...
node -e "const fs = require('fs'); const path = require('path'); const util = require('util'); const readFile = util.promisify(fs.readFile); const writeFile = util.promisify(fs.writeFile); const exists = util.promisify(fs.existsSync || ((p, cb) => cb(null, fs.existsSync(p)))); const MODULES_PATH = path.join(process.cwd(), 'node_modules'); async function patchFile(filePath, searchFunction) { try { if (!fs.existsSync(filePath)) { console.log(`File not found: ${filePath}`); return; } let content = await readFile(filePath, 'utf8'); const original = content; content = searchFunction(content); if (content !== original) { await writeFile(filePath, content, 'utf8'); console.log(`✅ Patched: ${filePath}`); } else { console.log(`ℹ️ No change needed: ${filePath}`); } } catch (error) { console.error(`❌ Error patching ${filePath}:`, error); } } async function fixRequireHook() { const filePath = path.join(MODULES_PATH, 'next', 'dist', 'server', 'require-hook.js'); await patchFile(filePath, (content) => { if (content.includes('__non_webpack_require__')) { return content.replace(/let resolve = process\.env\.NEXT_MINIMAL \? __non_webpack_require__\.resolve : require\.resolve;/g, 'let resolve = require.resolve;'); } return content; }); } async function fixJSONParse() { const webpackFiles = [ path.join(MODULES_PATH, 'next', 'dist', 'compiled', 'webpack', 'bundle5.js'), path.join(MODULES_PATH, 'webpack', 'lib', 'NormalModule.js') ]; for (const filePath of webpackFiles) { await patchFile(filePath, (content) => { return content.replace(/JSON\.parse\(([^)]+)\)/g, 'JSON.parse($1 || \"{}\")'); }); } } async function fixWindowsPathIssues() { const pathFiles = [ path.join(MODULES_PATH, 'next', 'dist', 'server', 'utils.js'), path.join(MODULES_PATH, 'next', 'dist', 'server', 'load-components.js') ]; for (const filePath of pathFiles) { await patchFile(filePath, (content) => { return content .replace(/path\.join\(([^)]+)\)/g, 'path.join($1).replace(/\\\\/g, \"/\")') .replace(/path\.resolve\(([^)]+)\)/g, 'path.resolve($1).replace(/\\\\/g, \"/\")'); }); } } async function main() { console.log('🛠️ Starting Windows module fixes...'); await fixRequireHook(); await fixJSONParse(); await fixWindowsPathIssues(); console.log('✅ All module fixes applied!'); } main().catch(err => { console.error('❌ Error in fix script:', err); });"
echo.

REM Sửa lỗi toán tử logic (tích hợp từ fix-operators.js)
echo [9/12] Sửa lỗi toán tử logic trong mã nguồn...
node -e "const fs = require('fs'); const path = require('path'); const util = require('util'); const readFile = util.promisify(fs.readFile); const writeFile = util.promisify(fs.writeFile); const readdir = util.promisify(fs.readdir); const stat = util.promisify(fs.stat); const IGNORE_DIRS = ['node_modules','.git','.next','out','public','dist','build','tmp']; async function findJSFiles(dir) { const files = []; async function scanDir(directory) { try { const entries = await readdir(directory); for (const entry of entries) { if (IGNORE_DIRS.includes(entry)) continue; const fullPath = path.join(directory, entry); try { const stats = await stat(fullPath); if (stats.isDirectory()) { await scanDir(fullPath); } else if (stats.isFile() && (entry.endsWith('.js') || entry.endsWith('.ts') || entry.endsWith('.jsx') || entry.endsWith('.tsx'))) { files.push(fullPath); } } catch (err) { console.log(`Skipping ${fullPath} due to error:`, err.message); } } } catch (err) { console.log(`Skipping directory ${directory} due to error:`, err.message); } } await scanDir(dir); return files; } async function fixOperatorsInFile(filePath) { try { console.log(`Đang kiểm tra: ${filePath}`); let content = await readFile(filePath, 'utf8'); const original = content; content = content.replace(/(\w+)\s*\|\|=\s*([^;]+);/g, '$1 = $1 || $2;'); content = content.replace(/(\w+)\s*&&=\s*([^;]+);/g, '$1 = $1 && $2;'); content = content.replace(/(\w+)\s*\?\?=\s*([^;]+);/g, '$1 = $1 ?? $2;'); if (content !== original) { await writeFile(filePath, content, 'utf8'); console.log(`✅ Đã sửa: ${filePath}`); return true; } else { return false; } } catch (error) { console.error(`❌ Lỗi khi sửa file ${filePath}:`, error.message); return false; } } async function main() { console.log('🔍 Đang tìm các file cần sửa...'); const rootDir = process.cwd(); const jsFiles = await findJSFiles(rootDir); console.log(`Tìm thấy ${jsFiles.length} file JS/TS cần kiểm tra`); let fixedCount = 0; for (const file of jsFiles) { const fixed = await fixOperatorsInFile(file); if (fixed) fixedCount++; } console.log(`✅ Hoàn tất! Đã sửa ${fixedCount} file.`); } main().catch(err => { console.error('❌ Lỗi khi chạy script:', err.message); });"
echo.

REM Làm sạch cache npm nếu cần thiết
echo [10/12] Kiểm tra và làm sạch cache npm nếu cần...
set "npm_cache_dir=%APPDATA%\npm-cache"
for /f "tokens=1,2 delims= " %%a in ('npm cache verify --loglevel=error ^| findstr /C:"Cache verified and compressed"') do (
    if not "%%a %%b"=="Cache verified" (
        echo Làm sạch cache npm...
        call npm cache clean --force
    ) else (
        echo Cache npm đã OK, bỏ qua bước làm sạch
    )
)
echo.

REM Cài đặt dependencies nếu cần
echo [11/12] Cài đặt dependencies nếu cần...
if "%need_install%"=="1" (
    echo Đang cài đặt dependencies...
    call npm install --legacy-peer-deps --no-fund
    echo.
) else (
    echo Bỏ qua cài đặt dependencies, đã có node_modules
    echo.
)

REM Thêm các sửa lỗi cuối cùng
echo [12/12] Áp dụng các sửa lỗi cuối cùng...
REM Thêm các file được tạo khi dự án chạy vào .gitignore nếu chưa có
echo Cập nhật .gitignore...
findstr /c:"**/.next/cache/**" .gitignore >nul 2>&1
if errorlevel 1 (
    echo # Thêm cache và các file tạm thời khác >> .gitignore
    echo .swc/ >> .gitignore
    echo .node-version >> .gitignore
    echo .npm/ >> .gitignore
    echo .eslintcache >> .gitignore
    echo tsconfig.tsbuildinfo >> .gitignore
    echo .cache/ >> .gitignore
    echo *.log >> .gitignore
    echo **/.next/cache/** >> .gitignore
    echo **/.next/server/** >> .gitignore
)
echo.

echo Khởi động ứng dụng...
echo.
echo ========================================================
echo     STARTING XLAB WEB
echo     Press Ctrl+C để dừng lại
echo ========================================================
echo.

REM Khởi động ứng dụng với cấu hình phù hợp
set "OPTIONS=--max-old-space-size=4096 --dns-result-order=ipv4first"
call npm run dev

echo.
echo ========================================================
echo     APPLICATION STOPPED
echo ========================================================
echo.
pause
exit /b 0
