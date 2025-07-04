# XLab Web - Scripts Guide

## 🚀 **Quick Start Scripts**

### **1. run.bat - Production Mode (HTTPS)**
Script chính luôn chạy production mode với HTTPS:
```cmd
run.bat
```

**Tự động thực hiện:**
- ✅ Kiểm tra Node.js và dependencies
- ✅ Sửa lỗi SWC version mismatch
- ✅ Setup environment production (.env.production → .env.local)
- ✅ Type checking và linting
- ✅ Build production
- ✅ Start production server
- 🔒 **HTTPS ready cho domain xlab.id.vn**

### **2. dev.bat - Development Mode**
Chạy development mode (chỉ khi cần test local):
```cmd
dev.bat
```

**Tự động thực hiện:**
- Kiểm tra Node.js
- Cài đặt dependencies
- Sửa lỗi SWC version
- Tạo .env.local nếu chưa có
- Clear cache
- Khởi động dev server (http://localhost:3000)

### **3. quick-start.bat - Khởi động development nhanh**
Khởi động development server nhanh nhất:
```cmd
quick-start.bat
```

### **4. run.ps1 - PowerShell nâng cao**
Script PowerShell với nhiều tính năng:
```powershell
.\run.ps1
```

**Tính năng nâng cao:**
- Kiểm tra prerequisites chi tiết
- Deploy to Server (SSH commands)
- Generate SSL commands
- Fix common issues
- Health check với test URL
- Copy commands to clipboard

## 🛠️ **Development Scripts**

### **Chạy production mode (mặc định):**
```cmd
# Production mode với HTTPS
run.bat
```

### **Chạy development mode (nếu cần):**
```cmd
# Development mode
dev.bat

# Hoặc khởi động nhanh
quick-start.bat

# Hoặc PowerShell
.\run.ps1
```

## 🌐 **Deployment Scripts**

### **Chuẩn bị deployment:**
```cmd
run.bat
# Chọn [2] Production Setup
```

**Script sẽ:**
1. Kiểm tra .env.production
2. Copy environment variables
3. Cài đặt dependencies
4. Chạy type checking
5. Chạy linting  
6. Build ứng dụng
7. Hiển thị hướng dẫn deploy

### **Deploy lên server:**
```powershell
.\run.ps1
# Chọn [3] Deploy to Server
```

**Sẽ hiển thị:**
- SSH commands
- Upload commands
- Setup script commands
- Option copy to clipboard

## 🔧 **Troubleshooting Scripts**

### **Fix common issues:**
```cmd
run.bat
# Chọn [4] Health Check

# Hoặc PowerShell
.\run.ps1
# Chọn [5] Fix Common Issues
```

**Sẽ sửa:**
- SWC version mismatch
- Clear caches (.next, node_modules/.cache)
- Reinstall dependencies
- Fix language issues

### **Health check:**
```cmd
run.bat
# Chọn [4] Health Check
```

**Kiểm tra:**
- Các file quan trọng
- Dependencies
- Scripts
- Environment variables

## 🔒 **SSL & Security**

### **Generate SSL commands:**
```powershell
.\run.ps1
# Chọn [6] Generate SSL Commands
```

**Tạo commands cho:**
- Cài đặt Certbot
- Tạo SSL certificate cho xlab.id.vn
- Test auto-renewal
- Kiểm tra SSL

## 📋 **Environment Variables**

### **Development (.env.local):**
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-dev-client-id
GOOGLE_CLIENT_SECRET=your-dev-client-secret
ADMIN_EMAILS=xlab.rnd@gmail.com
```

### **Production (.env.production):**
```env
NODE_ENV=production
NEXTAUTH_URL=https://xlab.id.vn
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-prod-client-id
GOOGLE_CLIENT_SECRET=your-prod-client-secret
ADMIN_EMAILS=xlab.rnd@gmail.com,admin@xlab.id.vn
```

## 🚨 **Common Issues & Solutions**

### **1. SWC Version Mismatch**
```cmd
npm install @next/swc-win32-x64-msvc@15.2.4
```

### **2. Port 3000 đã được sử dụng**
```cmd
npm run dev -- -p 3001
```

### **3. Build errors**
```cmd
# Clear cache
rd /s /q .next
npm run build
```

### **4. Environment variables không load**
```cmd
# Kiểm tra file .env.local tồn tại
# Copy từ .env.example nếu cần
copy .env.example .env.local
```

## 📁 **File Structure**

```
XLab_Web/
├── run.bat                 # Production mode (HTTPS)
├── dev.bat                 # Development mode
├── quick-start.bat         # Khởi động development nhanh
├── run.ps1                 # PowerShell script
├── scripts/
│   ├── setup-xlab-id-vn.sh    # Auto setup server
│   ├── deploy-server.sh        # Deploy script
│   ├── health-check.sh         # Health check
│   └── backup.sh               # Backup script
├── .env.example            # Environment template
├── .env.production         # Production config
└── SCRIPTS_GUIDE.md        # This file
```

## 🎯 **Recommended Workflow**

### **Development:**
1. `quick-start.bat` - Khởi động nhanh
2. Code và test
3. `run.bat` → [4] Health Check

### **Production:**
1. `run.bat` → [2] Production Setup
2. Upload to server
3. `sudo ./scripts/setup-xlab-id-vn.sh`
4. Test https://xlab.id.vn

### **Troubleshooting:**
1. `.\run.ps1` → [5] Fix Common Issues
2. `run.bat` → [4] Health Check
3. Check logs và errors

## 🎯 **Recommended Workflow**

### **Production (Mặc định):**
1. `run.bat` - Tự động build và start production
2. Upload to server: `sudo ./scripts/setup-xlab-id-vn.sh`
3. Test https://xlab.id.vn

### **Development (Nếu cần test local):**
1. `dev.bat` - Development mode
2. Code và test tại http://localhost:3000
3. Chuyển về production: `run.bat`

### **Troubleshooting:**
1. `.\run.ps1` → [5] Fix Common Issues
2. Check logs và errors
3. Rebuild: `run.bat`

**🎉 Chúc bạn development vui vẻ với XLab Web!**
