# Báo cáo sửa lỗi SWC trong Next.js

## Mô tả vấn đề
Next.js không thể tải module SWC native trên Windows x64, gây ra lỗi:
```
⚠ Attempted to load C:\VF\XLab_Web\node_modules\next\next-swc-fallback\@next\swc-win32-x64-msvc\next-swc.win32-x64-msvc.node, but an error occurred:
\\?\C:\VF\XLab_Web\node_modules\next\next-swc-fallback\@next\swc-win32-x64-msvc\next-swc.win32-x64-msvc.node is not a valid Win32 application.
⚠ Attempted to load @next/swc-win32-x64-msvc, but it was not installed
```

## Giải pháp đã áp dụng
1. Cài đặt phiên bản WASM của SWC thay vì native binary:
   - Cài đặt `@next/swc-wasm-nodejs@15.2.4` vào devDependencies
   - Cập nhật file `.npmrc` để sử dụng WASM thay vì native

2. Cấu hình Next.js để không sử dụng SWC cho minification:
   - Thêm `swcMinify: false` vào next.config.js
   - Đảm bảo `forceSwcTransforms: true` trong cấu hình experimental

3. Xóa cache của Next.js để áp dụng thay đổi:
   - Xóa thư mục `.next/cache`
   - Xóa thư mục `node_modules/.cache`

## Kết quả
Ứng dụng Next.js đã khởi động thành công và không còn hiển thị lỗi SWC.

## Lưu ý
- Giải pháp này dùng WASM thay vì native binary có thể làm giảm hiệu suất biên dịch, nhưng đảm bảo ứng dụng hoạt động ổn định trên mọi môi trường
- Nếu cần tăng hiệu suất, có thể thử cài đặt lại native binary trong tương lai 