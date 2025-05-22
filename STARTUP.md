# XLab Web - Hướng dẫn khởi động

## 🚀 Cách khởi động nhanh

### Khởi động đơn giản (Khuyến nghị)
```batch
.\run.bat
```

### Khởi động thủ công
```bash
# 1. Cài package thiếu
npm install @radix-ui/react-slot

# 2. Dọn cache (nếu cần)
rmdir /s /q .next

# 3. Khởi động server
npm run dev:simple
```

## 📋 Các bước tự động

Khi chạy `.\run.bat`, script sẽ tự động thực hiện:

1. ✅ **[1/4]** Kiểm tra Node.js installation
2. ✅ **[2/4]** Kiểm tra npm installation  
3. ✅ **[3/4]** Cài đặt dependencies thiếu (@radix-ui/react-slot)
4. ✅ **[4/4]** Dọn cache và khởi động development server

## 🌐 Truy cập ứng dụng

- **URL**: http://localhost:3000
- **Dừng server**: `Ctrl+C`

## 🛠️ Xử lý sự cố

### Lỗi "Module not found"
```bash
npm install @radix-ui/react-slot
```

### Lỗi cache build
```bash
rmdir /s /q .next
```

### Port đã được sử dụng
Next.js sẽ tự động chuyển sang port khác (3001, 3002, ...)

## 📁 Cấu trúc đơn giản

- `run.bat` - Script khởi động duy nhất (tích hợp tất cả)
- `package.json` - Dependencies và npm scripts
- `STARTUP.md` - Hướng dẫn này

## ⚡ Tính năng

- 🔍 **Auto-detect**: Tự động kiểm tra môi trường
- 📦 **Auto-install**: Tự động cài package thiếu
- 🧹 **Auto-clean**: Tự động dọn cache build
- 🎨 **User-friendly**: Giao diện rõ ràng với progress indicators
- 🛡️ **Error handling**: Xử lý lỗi và hướng dẫn sửa 