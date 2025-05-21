@echo off
echo Dang chuan bi moi truong phat trien...
echo Tao thu muc va file vendor-chunks can thiet...
powershell -Command "New-Item -Path '.next\server\vendor-chunks' -ItemType Directory -Force"
powershell -Command "New-Item -Path '.next\server\vendor-chunks\next.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\server\vendor-chunks\tailwind-merge.js' -ItemType File -Force"
echo Xoa file trace neu co...
powershell -Command "Remove-Item -Path .next\trace -Force -ErrorAction SilentlyContinue"
echo Tao cac file static quan trong...
powershell -Command "New-Item -Path '.next\static\css\empty.css' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\chunks\empty.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\app\page.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\app\not-found.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\app\layout.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\app\loading.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\app\empty.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\main-app.js' -ItemType File -Force"
powershell -Command "New-Item -Path '.next\static\app-pages-internals.js' -ItemType File -Force"
echo Dang khoi dong server...
npm run dev
