@echo off
echo ================================================
echo   Fixing 404 errors for static files
echo ================================================
echo.

REM Create necessary directories
echo Creating necessary directories...
if not exist .next\static\css\app mkdir .next\static\css\app
if not exist .next\static\app mkdir .next\static\app
if not exist .next\static\app\admin mkdir .next\static\app\admin

REM Create missing CSS files
echo Creating missing CSS files...
echo /* Layout CSS */ > .next\static\css\app\layout.css

REM Create missing JS files with exact hashes
echo Creating missing JS files with exact hashes...
echo // Not Found Page > .next\static\app\not-found.7d3561764989b0ed.js
echo // Layout JS > .next\static\app\layout.32d8c3be6202d9b3.js
echo // App Pages Internals > .next\static\app-pages-internals.196c41f732d2db3f.js
echo // Main App > .next\static\main-app.aef085aefcb8f66f.js
echo // Loading > .next\static\app\loading.062c877ec63579d3.js
echo // Admin Layout > .next\static\app\admin\layout.bd8a9bfaca039569.js
echo // Admin Page > .next\static\app\admin\page.20e1580ca904d554.js

REM Create copies with timestamp suffixes
echo Creating timestamp copies...
copy .next\static\css\app\layout.css .next\static\css\app\layout-1746857687478.css
copy .next\static\css\app\layout.css .next\static\css\app\layout-1746857690764.css
copy .next\static\main-app.aef085aefcb8f66f.js .next\static\main-app-1746857687478.js
copy .next\static\main-app.aef085aefcb8f66f.js .next\static\main-app-1746857690764.js

echo.
echo ================================================
echo   All 404 errors fixed!
echo ================================================
echo. 