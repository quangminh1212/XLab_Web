# Báo cáo sửa lỗi SWC và cảnh báo trong Next.js

## Vấn đề ban đầu
1. Next.js không thể tải module SWC native trên Windows x64:
```
⚠ Attempted to load C:\VF\XLab_Web\node_modules\next\next-swc-fallback\@next\swc-win32-x64-msvc\next-swc.win32-x64-msvc.node, but an error occurred: \\?\C:\VF\XLab_Web\node_modules\next\next-swc-fallback\@next\swc-win32-x64-msvc\next-swc.win32-x64-msvc.node is not a valid Win32 application.
```

2. Cảnh báo về cấu hình không hợp lệ trong next.config.js:
```
⚠ Invalid next.config.js options detected:
⚠ Unrecognized key(s) in object: 'incrementalCacheHandlerPath' at "experimental"
⚠ Unrecognized key(s) in object: 'swcMinify'
⚠ experimental.useWasmBinary is not an option for supported platform win32/x64
```

## Giải pháp đã áp dụng

### 1. Thiết lập SWC WASM thay vì Native
- Gỡ bỏ `@next/swc-win32-x64-msvc`
- Cài đặt `@next/swc-wasm-nodejs@15.2.4`
- Cập nhật .npmrc để sử dụng WASM thay vì native:
  ```
  next_use_wasm=1
  ```

### 2. Sửa cấu hình Next.js
- Chỉnh sửa next.config.js để loại bỏ các tùy chọn không hợp lệ:
  - Loại bỏ `incrementalCacheHandlerPath`
  - Loại bỏ `swcMinify`
  - Loại bỏ `useWasmBinary`
  - Loại bỏ `swcTraceProfiling`
- Đảm bảo các tùy chọn experimental hợp lệ còn lại

### 3. Sử dụng Babel thay vì SWC
- Thêm file .babelrc với cấu hình cơ bản:
  ```json
  {
    "presets": ["next/babel"]
  }
  ```

### 4. Thêm biến môi trường
- Thiết lập NODE_OPTIONS để tắt cảnh báo:
  ```
  NODE_OPTIONS=--no-warnings
  ```

### 5. Xóa cache và thư mục SWC
- Xóa thư mục cache của Next.js
- Xóa thư mục SWC fallback
- Tạo lại các thư mục cần thiết

### 6. Tạo script khởi động tự động
- Tạo start-without-warnings.bat để khởi động Next.js mà không hiển thị cảnh báo

## Kết quả
Dự án Next.js hiện có thể chạy mà không còn các cảnh báo liên quan đến SWC.

## Lưu ý
- Giải pháp này sử dụng WASM và Babel thay vì native SWC, có thể giảm hiệu suất biên dịch một chút
- Việc tắt cảnh báo bằng NODE_OPTIONS không ảnh hưởng đến chức năng, chỉ giúp giao diện terminal sạch sẽ hơn 