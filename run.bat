@echo off
echo Preparing NextJS application...
node fix-all.js

echo Starting development server...
set NODE_OPTIONS=--no-warnings
npm run dev:safe 