@echo off
echo === KIEM TRA CANH BAO SWC ===

echo Dang khoi dong lai ung dung...
taskkill /f /im node.exe > nul 2>&1

echo Chay fix-swc.js...
node fix-swc.js

echo Khoi dong lai Next.js...
set "LOG_FILE=next-start-check.log"
echo === Khoi dong Next.js === > %LOG_FILE%
echo Thoi gian: %date% %time% >> %LOG_FILE%
npm run dev >> %LOG_FILE% 2>&1

echo Da hoan thanh! Kiem tra %LOG_FILE% de xem ket qua.
echo === KET THUC == 