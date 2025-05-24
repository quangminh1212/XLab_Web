# Sửa lỗi EPERM Trace File

## Vấn đề
Lỗi EPERM xuất hiện khi Next.js cố gắng tạo file trace trên Windows:
```
[Error: EPERM: operation not permitted, open 'C:\VF\XLab_Web\.next\trace']
```

## Giải pháp đã áp dụng

### 1. Tắt Next.js Telemetry
- **Global:** `npx next telemetry disable`
- **Config:** Thêm `telemetry: false` trong `next.config.js`
- **Environment:** Set `NEXT_TELEMETRY_DISABLED=1` trong tất cả scripts

### 2. Tắt SWC Cache
- Set `SWC_DISABLE_CACHE=1` trong environment variables
- Thêm vào tất cả scripts dev và build

### 3. Cập nhật Next.js Config
```javascript
// next.config.js
{
  telemetry: false,
  experimental: {
    instrumentationHook: false,
  }
}
```

### 4. Cập nhật .gitignore
- Thêm `.next/**/*` để ignore toàn bộ thư mục .next
- Loại bỏ các quy tắc trùng lặp
- Đảm bảo tất cả file tạm được ignore

### 5. Scripts được cập nhật
- `npm run dev` - Với NEXT_TELEMETRY_DISABLED=1 và SWC_DISABLE_CACHE=1
- `npm run cleanup` - Dọn dẹp cache và trace files
- `scripts/setup-dev.js` - Tự động set environment variables

## Cách sử dụng

### Chạy development server
```bash
npm run dev
```

### Dọn dẹp cache khi gặp lỗi
```bash
npm run cleanup
npm run dev
```

### Xóa thủ công nếu cần
```powershell
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
```

## Ngăn chặn tái hiện

1. **Không commit .next folder:** Đã có trong .gitignore
2. **Tự động tắt telemetry:** Trong tất cả scripts
3. **Tự động tắt SWC cache:** Trong environment variables
4. **Script cleanup:** Sẵn sàng để dọn dẹp khi cần

## Kiểm tra trạng thái
```bash
# Kiểm tra telemetry status
npx next telemetry status

# Should show: "Status: Disabled"
```

Lỗi EPERM sẽ không còn tái hiện với cấu hình này. 