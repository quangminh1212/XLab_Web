# XLab Web - Hướng dẫn khởi động

## 🚀 Cách khởi động nhanh

### Phương pháp 1: Batch file (Khuyến nghị)
```batch
.\run.bat
```

### Phương pháp 2: PowerShell trực tiếp
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

### Phương pháp 3: Manual
```bash
# 1. Cài package thiếu
npm install @radix-ui/react-slot

# 2. Dọn cache (nếu cần)
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

# 3. Khởi động server
npm run dev:simple
```

## 📋 Các bước tự động

Khi chạy `run.bat`, script sẽ tự động:

1. ✅ Kiểm tra Node.js và npm
2. ✅ Cài đặt dependencies thiếu
3. ✅ Dọn cache build
4. ✅ Khởi động development server

## 🌐 Truy cập ứng dụng

- **URL**: http://localhost:3000
- **Dừng server**: `Ctrl+C`

## 🛠️ Xử lý sự cố

### Lỗi "Module not found"
```bash
npm install @radix-ui/react-slot
```

### Lỗi cache
```bash
rmdir /s /q .next
```

### Lỗi port đã sử dụng
Server sẽ tự động chuyển sang port 3001, 3002, ...

## 📁 Cấu trúc files

- `run.bat` - Script chính (gọi PowerShell)
- `start.ps1` - PowerShell script thực thi
- `package.json` - Dependencies và scripts 