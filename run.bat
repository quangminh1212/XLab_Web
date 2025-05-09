@echo off
echo Preparing NextJS application...
node fix-webpack-hot-update.js
node fix-nextjs-vendor-paths.js

echo Starting development server...
npm run dev 