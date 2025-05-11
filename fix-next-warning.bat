@echo off
echo ===== BAT DAU SUA LOI SWC =====
echo Killing node processes...
taskkill /f /im node.exe 2>nul

echo Updating next.config.js...
node -e "const fs=require('fs');const path=require('path');const configPath=path.join(__dirname,'next.config.js');let config=fs.readFileSync(configPath,'utf8');config=config.replace(/compiler:\s*{[^}]*}/,`compiler: {\n    styledComponents: true\n  }`);if(!config.includes('swcMinify:')){config=config.replace(/experimental:/,`swcMinify: false,\n  experimental:`);}fs.writeFileSync(configPath,config);console.log('Next.js config updated successfully');"

echo Starting Next.js...
set "LOG_FILE=next-start.log"
echo Starting Next.js at %time% %date% > %LOG_FILE%
npm run dev >> %LOG_FILE% 2>&1
echo ===== KET THUC ===== 