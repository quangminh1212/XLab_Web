# XLab Web - Quick Start Guide

## 🚀 Cách chạy nhanh nhất

### Bước 1: Chạy script tự động
```bash
run.bat
```

### Bước 2: Mở trình duyệt
Truy cập: http://localhost:3000

## ⚡ Scripts có sẵn

- **`run.bat`** - Script chính, tự động setup mọi thứ và chạy
- **`quick-start.bat`** - Version đơn giản hơn
- **`fix-and-run.bat`** - Xóa cache và cài lại từ đầu
- **`setup-env.bat`** - Chỉ setup environment variables

## 🔧 Các vấn đề thường gặp

### Lỗi 500 trên API
➡️ Chạy `setup-env.bat` để tạo file .env.local

### Port 3000 đã được sử dụng
➡️ Script sẽ tự động chuyển sang port khác

### Dependencies lỗi
➡️ Chạy `fix-and-run.bat` để cài lại từ đầu

### NextAuth errors
➡️ Cần cấu hình Google OAuth trong .env.local (xem README.md)

## 📋 Yêu cầu hệ thống

- ✅ Node.js 18+ 
- ✅ npm 9+
- ✅ Windows (PowerShell hoặc CMD)

## 📁 Files quan trọng

- `.env.local` - Environment variables (tự động tạo)
- `logs/` - Log files (tự động tạo)
- `package.json` - Dependencies và scripts

---

**Tip**: Nếu có vấn đề gì, check folder `logs/` để xem chi tiết lỗi! 