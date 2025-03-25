@echo off
echo ==== XLab Web Application Runner ====
echo Starting XLab_Web development server...
echo.

echo [1/5] Cleaning environment...
if exist .next rmdir /s /q .next

echo [2/5] Checking Node.js version...
node --version

echo [3/5] Installing dependencies...
echo This may take a few minutes...
call npm install --legacy-peer-deps

echo.
echo [4/5] Verifying installation...
if not exist node_modules\react (
  echo ERROR: React not found. Trying alternative installation method...
  call npm cache clean --force 
  call npm install react@18.2.0 react-dom@18.2.0 next@13.5.6 --legacy-peer-deps --force
)

echo.
echo [5/5] Starting development server...
call npm run dev

if ERRORLEVEL 1 (
    echo.
    echo ERROR: Development server failed to start!
    echo Trying fallback method...
    echo.
    
    echo [FALLBACK] Cleaning npm cache...
    call npm cache clean --force
    
    echo [FALLBACK] Reinstalling core dependencies...
    call npm install react@18.2.0 react-dom@18.2.0 next@13.5.6 --legacy-peer-deps --no-save --force
    
    echo [FALLBACK] Clearing Next.js cache...
    if exist .next rmdir /s /q .next
    
    echo [FALLBACK] Starting development server with minimal config...
    set NODE_OPTIONS=--max_old_space_size=4096
    call npm run dev
)

echo.
echo If you're still experiencing issues, try:
echo 1. Delete node_modules folder and package-lock.json
echo 2. Run: npm cache clean --force
echo 3. Run: npm install --legacy-peer-deps
echo 4. Run: npm run dev

pause 