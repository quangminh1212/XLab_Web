@echo off
echo === KIEM TRA LOI CANH BAO ===

echo Dang khoi dong lai ung dung...
taskkill /f /im node.exe > nul 2>&1

echo Chay fix-swc.js de cap nhat cau hinh...
node fix-swc.js

echo Tao file trace trong the rong de khong bi loi EPERM...
attrib -R .next\trace /S /D
if exist .next\trace (
  echo. > .next\trace
  echo Đã tạo file trace rỗng
) else (
  type nul > .next\.empty_trace
  echo Đã tạo file empty_trace đánh dấu
)

echo Dat quyen truy cap day du cho thu muc .next...
attrib -R .next /S /D
icacls .next /grant Everyone:F /T

echo Khoi dong lai Next.js voi NODE_OPTIONS...
set "LOG_FILE=next-start-check.log"
echo === Khoi dong Next.js === > %LOG_FILE%
echo Thoi gian: %date% %time% >> %LOG_FILE%
set NODE_OPTIONS=--no-warnings --openssl-legacy-provider
npm run dev >> %LOG_FILE% 2>&1

echo Da hoan thanh! Kiem tra %LOG_FILE% de xem ket qua.
echo === KET THUC === 