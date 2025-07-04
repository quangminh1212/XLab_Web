# XLab Web - Production Hosting Guide

## 🚀 Automated Production Hosting for xlab.id.vn

Tài liệu này hướng dẫn cách sử dụng script `start.bat` đã được chuyển đổi thành một hệ thống hosting tự động cho domain xlab.id.vn.

## ✨ Tính năng mới của start.bat

### Trước đây (Development Mode):
- Menu interactive với nhiều lựa chọn
- Chạy development server (npm run dev)
- Cần input từ người dùng

### Bây giờ (Production Hosting Mode):
- **Tự động hoàn toàn** - không cần input
- **Production server** (npm run start)
- **Domain xlab.id.vn** được cấu hình sẵn
- **Logging tự động** với timestamp
- **Error handling** và recovery
- **Continuous hosting** - chạy liên tục

## 🔧 Cấu hình Production

### Environment Variables (.env.local):
```env
NEXTAUTH_SECRET=Cmjb/lPYHoCnsiaEh0KwFkGG7POh6v3S3DXm169y8+U=
NEXTAUTH_URL=https://xlab.id.vn
GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
ADMIN_EMAILS=xlab.rnd@gmail.com
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

### Next.js Configuration:
- **Domain**: xlab.id.vn và www.xlab.id.vn đã được whitelist
- **Security headers**: CSP, HSTS, X-Frame-Options
- **Image optimization**: Hỗ trợ WebP, AVIF
- **Type checking**: Tự động skip để build nhanh hơn

## 📋 Quy trình tự động của start.bat

### 1. Kiểm tra hệ thống:
- ✅ Node.js và npm
- ✅ Package.json
- ✅ Dependencies

### 2. Cấu hình production:
- ✅ Tạo .env.local với NEXTAUTH_URL=https://xlab.id.vn
- ✅ Backup thành .env.production
- ✅ Cài đặt dependencies

### 3. Chuẩn bị môi trường:
- ✅ Chạy fix scripts
- ✅ Tạo thư mục cần thiết
- ✅ Kiểm tra build production

### 4. Build production (nếu cần):
- ✅ Tự động build nếu chưa có
- ✅ Skip type checking để build nhanh
- ✅ Optimize cho production

### 5. Khởi động server:
- ✅ Kill processes cũ trên port 3000
- ✅ Tạo log file với timestamp
- ✅ Khởi động production server
- ✅ Chạy liên tục cho đến khi dừng

## 🖥️ Cách sử dụng

### Khởi động hosting:
```bash
# Chạy script hosting tự động
start.bat
```

### Output mẫu:
```
================================================================
                   XLab Web Production Server
                  Hosting for xlab.id.vn Domain
================================================================

[INFO] Kiem tra Node.js...
[SUCCESS] Node.js da duoc cai dat
[INFO] Kiem tra npm...
[SUCCESS] npm da duoc cai dat
[INFO] Thong tin he thong:
- Node.js: v22.14.0
- npm: 10.9.2
- OS: Windows
- Mode: Development

[SUCCESS] Tim thay package.json
[INFO] Tao thu muc can thiet...
[SUCCESS] Da tao thu muc can thiet
[INFO] Cau hinh environment cho production (xlab.id.vn)...
[SUCCESS] Da cau hinh environment cho xlab.id.vn
[SUCCESS] Da backup environment config
[INFO] Cai dat dependencies...
[SUCCESS] Dependencies da duoc cai dat
[INFO] Chuan bi moi truong production...
[SUCCESS] Da chuan bi moi truong Next.js
[SUCCESS] Da sua loi ngon ngu
[INFO] Kiem tra va build production...
[SUCCESS] Production build da ton tai

================================================================
                    PRODUCTION SERVER READY
================================================================
   Domain: xlab.id.vn
   Environment: Production
   Port: 3000
   Host: 0.0.0.0 (All interfaces)
   Protocol: HTTP (Reverse proxy to HTTPS)
   Status: Starting...
================================================================

[INFO] Server Configuration:
[INFO] - Local Access: http://localhost:3000
[INFO] - Network Access: http://[YOUR-IP]:3000
[INFO] - Production Domain: https://xlab.id.vn
[INFO] - Environment: Production Mode
[INFO] - Authentication: Google OAuth Enabled
[INFO] - Admin Email: xlab.rnd@gmail.com

[INFO] Kiem tra port 3000...
[INFO] ========================================
[INFO] KHOI DONG PRODUCTION SERVER CHO XLAB.ID.VN
[INFO] ========================================
[INFO] Starting Next.js Production Server...
[INFO] Domain: xlab.id.vn
[INFO] Port: 3000
[INFO] Environment: Production
[INFO] ========================================

[INFO] Log file: logs\server-20250704-143022.log
[INFO] Server dang khoi dong...

================================================================
   XLab Web Production Server is STARTING...
   Domain: https://xlab.id.vn
   Local: http://localhost:3000
   Status: Initializing...
   Log: logs\server-20250704-143022.log
================================================================

[INFO] Server se chay lien tuc. Nhan Ctrl+C de dung server.
[INFO] Neu ban dong cua so nay, server se bi dung.

   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   - Network:      http://10.13.1.138:3000
   - Environments: .env.local, .env.production, .env

 ✓ Ready in 2.1s
```

## 📁 Files được tạo

### Scripts:
- **start.bat**: Production hosting script (đã chuyển đổi)
- **start-dev.bat**: Development script (backup của start.bat cũ)
- **deploy.bat**: Deployment utilities
- **clean.bat**: Cache cleaning
- **commit-changes.ps1**: Auto commit script

### Logs:
- **logs/server-YYYYMMDD-HHMMSS.log**: Server logs với timestamp

### Environment:
- **.env.local**: Production environment cho xlab.id.vn
- **.env.production**: Backup của production config

## 🌐 Network Configuration

### Local Access:
- **http://localhost:3000** - Local development
- **http://[YOUR-IP]:3000** - Network access

### Production Domain:
- **https://xlab.id.vn** - Main domain
- **https://www.xlab.id.vn** - WWW subdomain

### Reverse Proxy Setup:
Server chạy trên HTTP port 3000, cần reverse proxy (Nginx/Apache) để:
- Proxy từ HTTPS (443) → HTTP (3000)
- Handle SSL certificates
- Domain routing cho xlab.id.vn

## 🔒 Security Features

### Headers được cấu hình:
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **X-XSS-Protection**: 1; mode=block
- **Content-Security-Policy**: Production CSP
- **Strict-Transport-Security**: HSTS enabled

### Authentication:
- **Google OAuth**: Configured for xlab.id.vn
- **Admin Access**: xlab.rnd@gmail.com
- **Session Management**: NextAuth.js

## 🚨 Troubleshooting

### Server không khởi động:
1. Kiểm tra port 3000 có bị chiếm không
2. Xem log file trong thư mục `logs/`
3. Chạy `clean.bat` để xóa cache
4. Chạy lại `start.bat`

### Build lỗi:
1. Chạy `npm install` để cài đặt dependencies
2. Xóa thư mục `.next` và build lại
3. Kiểm tra TypeScript errors

### Domain không hoạt động:
1. Kiểm tra DNS settings cho xlab.id.vn
2. Cấu hình reverse proxy
3. Kiểm tra SSL certificates

## 📞 Support

- **Repository**: https://github.com/quangminh1212/XLab_Web
- **Admin Email**: xlab.rnd@gmail.com
- **Domain**: https://xlab.id.vn
