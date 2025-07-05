@echo off
title XLab Web - Ngrok Tunnel Setup

echo.
echo ================================================================
echo                    XLab Web - Ngrok Setup
echo                   Tao tunnel tam thoi cho xlab.id.vn
echo ================================================================
echo.

echo [INFO] Ngrok la giai phap tunnel tam thoi de test website
echo [INFO] Khong can cau hinh router, hoat dong ngay lap tuc
echo.

echo [STEP 1] Tai ngrok:
echo 1. Truy cap: https://ngrok.com/download
echo 2. Tai phien ban Windows
echo 3. Giai nen vao thu muc hien tai
echo.

echo [STEP 2] Dang ky tai khoan (mien phi):
echo 1. Truy cap: https://dashboard.ngrok.com/signup
echo 2. Dang ky tai khoan mien phi
echo 3. Lay authtoken tu dashboard
echo.

echo [STEP 3] Cau hinh ngrok:
echo 1. Chay: ngrok authtoken [YOUR_TOKEN]
echo 2. Chay: ngrok http 80
echo.

echo [STEP 4] Su dung tunnel:
echo 1. Ngrok se tao URL nhu: https://abc123.ngrok.io
echo 2. URL nay se tro ve website xlab.id.vn
echo 3. Co the chia se URL nay cho nguoi khac test
echo.

echo ================================================================
echo                    HUONG DAN CHI TIET
echo ================================================================
echo.

echo [NEU DA CO NGROK:]
echo 1. Mo cmd moi
echo 2. Chay: ngrok http 80
echo 3. Copy URL tu output
echo 4. Test URL do thay vi xlab.id.vn
echo.

echo [UU DIEM NGROK:]
echo - Khong can cau hinh router
echo - Hoat dong ngay lap tuc
echo - Co HTTPS mien phi
echo - Co the chia se cho nguoi khac
echo.

echo [NHUOC DIEM NGROK:]
echo - URL thay doi moi lan restart
echo - Can ket noi internet lien tuc
echo - Gioi han bandwidth (free plan)
echo.

echo ================================================================
echo                    ALTERNATIVE: CLOUDFLARE TUNNEL
echo ================================================================
echo.

echo [CLOUDFLARE TUNNEL (Mien phi, on dinh hon):]
echo 1. Tai cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
echo 2. Chay: cloudflared tunnel --url http://localhost:80
echo 3. Nhan duoc URL on dinh
echo.

pause
