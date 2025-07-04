@echo off
title XLab Web - Auto Commit
echo.
echo ==========================================
echo    XLab Web - Auto Commit to Git
echo ==========================================
echo.

echo [1] Kiem tra git status...
git status --porcelain
if errorlevel 1 (
    echo ❌ Git khong kha dung hoac khong phai git repository!
    pause
    exit /b 1
)

echo.
echo [2] Kiem tra cac thay doi...
git status --short

echo.
echo [3] Add tat ca files...
git add .
if errorlevel 1 (
    echo ❌ Loi khi add files!
    pause
    exit /b 1
)
echo ✅ Da add tat ca files

echo.
echo [4] Commit voi message...
git commit -m "🚀 Production ready: Update domain to xlab.id.vn & fix build issues

✅ Domain Configuration:
- Update all configs from xlab.vn to xlab.id.vn
- Update siteConfig, environment variables, nginx config
- Update deployment scripts and documentation

🔧 Build Fixes:
- Fix SWC version mismatch (15.2.4)
- Fix TypeScript/glob dependencies issues
- Improve error handling in build process
- Auto-install TypeScript if missing

🎯 Production Mode:
- run.bat now defaults to production mode with HTTPS
- Automatic production build and server start
- Better dependency management (include dev deps for build)
- Graceful error handling for type-check and linting

📁 New Scripts:
- dev.bat: Development mode (if needed)
- test-fix.bat: Pre-build testing
- scripts/simple-fix.js: Dependency-free fixes
- auto-commit.bat: Auto git commit

🌐 Ready for deployment to https://xlab.id.vn"

if errorlevel 1 (
    echo ❌ Loi khi commit!
    pause
    exit /b 1
)
echo ✅ Da commit thanh cong

echo.
echo [5] Push len remote repository...
git push
if errorlevel 1 (
    echo ❌ Loi khi push! Kiem tra remote repository.
    echo Neu chua co remote, chay: git remote add origin <repository-url>
    pause
    exit /b 1
)
echo ✅ Da push thanh cong

echo.
echo ==========================================
echo    🎉 AUTO COMMIT HOAN TAT!
echo ==========================================
echo.
echo ✅ Tat ca thay doi da duoc commit va push len git
echo 🌐 San sang deploy len server: https://xlab.id.vn
echo 📋 Cac buoc tiep theo:
echo    1. SSH vao server: ssh root@1.52.110.251
echo    2. Pull code: git pull origin main
echo    3. Chay setup: sudo ./scripts/setup-xlab-id-vn.sh
echo.
pause
