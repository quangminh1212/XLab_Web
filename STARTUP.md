# XLab Web - Hướng dẫn khởi động

## 🚀 Cách khởi động siêu đơn giản

### Chạy mặc định (option 2 - không cần chọn):
```batch
run.bat
```
**→ Chạy thẳng Full Check + Start, không hiển thị menu**

### Các mode khác:
```batch
run.bat quick    # Siêu nhanh (không check)
run.bat dev      # An toàn có check
run.bat auto     # Full check mode
run.bat menu     # Hiển thị menu lựa chọn
```

## 📋 Chi tiết các mode

### run.bat (mặc định) - Full Check + Start
- ✅ Dọn cache và temporary files
- ✅ Kiểm tra Node.js/npm
- ✅ Cài package thiếu
- ✅ Khởi động development server
- ✅ **KHÔNG hiển thị menu**
- ✅ **KHÔNG pause giữa chừng**
- ⭐ **Mode mặc định - khuyến nghị cho daily development**

### run.bat quick - Siêu nhanh
- ✅ Dọn cache .next
- ✅ Start server ngay lập tức
- ❌ **KHÔNG check Node.js/npm**
- ❌ **KHÔNG check dependencies**
- ⚡ **Nhanh nhất, dành cho khi chắc chắn môi trường OK**

### run.bat dev - An toàn có check  
- ✅ Check Node.js/npm
- ✅ Dọn cache
- ✅ Cài dependencies thiếu
- ✅ Start server
- ✅ **KHÔNG hiển thị menu**
- ✅ **KHÔNG pause giữa chừng**

### run.bat auto - Full check mode
- ✅ Dọn cache và temporary files
- ✅ Kiểm tra Node.js/npm
- ✅ Cài package thiếu
- ✅ Khởi động development server
- ✅ **KHÔNG hiển thị menu**
- ✅ **KHÔNG pause giữa chừng**

### run.bat menu - Menu lựa chọn
Hiển thị menu với các options:
- **[0] Auto Run** - Tương đương `run.bat auto`
- **[1] Quick Start** - Khởi động nhanh có check
- **[2] Full Check + Start** - Kiểm tra toàn diện + khởi động **[MẶC ĐỊNH]**
- **[3] Optimize Only** - Chỉ tối ưu, không khởi động
- **[4] Exit** - Thoát

## 🌐 Truy cập ứng dụng

- **URL**: http://localhost:3000
- **Dừng server**: `Ctrl+C`

## 🛠️ Xử lý sự cố

### Lỗi "Module not found"
Chạy `run.bat dev` hoặc `run.bat auto` để tự động cài package

### Lỗi cache build
Tất cả mode đều tự động dọn cache

### Port đã được sử dụng
Next.js sẽ tự động chuyển sang port khác (3001, 3002, ...)

## 📁 Cấu trúc đơn giản

- `run.bat` - **File duy nhất cho tất cả**
- `package.json` - Dependencies và npm scripts
- `STARTUP.md` - Hướng dẫn này

## 💡 Khuyến nghị sử dụng

- **Daily development**: `run.bat` (mặc định, option 2)
- **Siêu nhanh**: `run.bat quick` 
- **An toàn hơn**: `run.bat dev`
- **Cần menu**: `run.bat menu`

## 🎯 Workflow đơn giản nhất

**99% thời gian chỉ cần:**
```batch
run.bat
```
**→ Chạy thẳng option 2, không cần chọn gì cả!**

## 🛠️ Scripts npm bổ sung

```bash
npm run check          # TypeScript + ESLint check
npm run fix           # Auto-fix ESLint issues
npm run type-check    # TypeScript type checking
npm run lint:check    # ESLint check only
``` 

## 🔧 Tính năng

- 🎯 **Default to option 2**: Chạy `run.bat` = option 2 ngay lập tức
- ⚡ **Multiple modes**: Quick/Dev/Auto/Menu modes
- 🚀 **No-menu by default**: Mặc định không hiển thị menu
- 📋 **Menu on demand**: `run.bat menu` khi cần
- 🔧 **Smart detection**: Tự động check và cài đặt
- 🧹 **Auto-clean**: Tự động dọn cache 