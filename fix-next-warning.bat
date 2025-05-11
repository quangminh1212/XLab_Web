@echo off
echo ===== BAT DAU SUA LOI EPERM VA CANH BAO =====
echo Killing node processes...
taskkill /f /im node.exe 2>nul

echo Updating next.config.js...
node -e "const fs=require('fs');const path=require('path');const configPath=path.join(__dirname,'next.config.js');let config=fs.readFileSync(configPath,'utf8');config=config.replace(/compiler:\s*{[^}]*}/,`compiler: {\n    styledComponents: true\n  }`);config=config.replace(/experimental:\s*{[^}]*}/,`experimental: {\n    largePageDataBytes: 12800000,\n    forceSwcTransforms: false,\n    appDocumentPreloading: false,\n    disableOptimizedLoading: true,\n    disablePostcssPresetEnv: true\n  }`);fs.writeFileSync(configPath,config);console.log('Next.js config updated successfully');"

echo Running fix-trace.js...
node fix-trace.js

echo Starting Next.js...
set "LOG_FILE=next-start.log"
echo Starting Next.js at %time% %date% > %LOG_FILE%
set NODE_OPTIONS=--no-warnings --openssl-legacy-provider
npm run dev >> %LOG_FILE% 2>&1
echo ===== KET THUC ===== 