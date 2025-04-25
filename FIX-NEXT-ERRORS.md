# Hướng dẫn khắc phục lỗi Next.js

Tài liệu này mô tả cách khắc phục các lỗi liên quan đến React Server Components trong Next.js. Các lỗi thường gặp như "Could not find the module in the React Client Manifest" được giải quyết bằng cách sau.

## Nguyên nhân của lỗi

Lỗi chủ yếu là do sự không tương thích giữa các phiên bản của Next.js, React và các dependencies khác. Next.js phiên bản 15.x beta có thể gây ra một số vấn đề tương thích với các thư viện hiện có.

## Hướng dẫn khắc phục

1. **Chạy script làm sạch và cài đặt lại**:
   ```
   clean-reinstall.bat
   ```

2. **Khởi động lại ứng dụng với phiên bản Next.js mới**:
   ```
   run.bat
   ```

3. **Nếu vẫn gặp lỗi, thực hiện các bước thủ công**:
   - Xóa thư mục `.next`
   - Xóa thư mục `node_modules`
   - Xóa file `package-lock.json` và `yarn.lock` (nếu có)
   - Chạy lệnh `npm install`
   - Chạy lệnh `npm run dev`

## Các thay đổi đã được thực hiện

1. Hạ cấp Next.js từ phiên bản 15.x xuống 14.1.0 (ổn định)
2. Cập nhật cấu hình trong `next.config.js` để hỗ trợ React Server Components
3. Cập nhật `tsconfig.json` để sử dụng moduleResolution "bundler"
4. Đồng bộ hóa các phiên bản dependencies để tránh xung đột

## Các file đã chỉnh sửa

- package.json
- next.config.js
- tsconfig.json
- run.bat
- .gitignore

## Lưu ý quan trọng

Sau khi cài đặt lại, ứng dụng sẽ sử dụng Next.js 14.1.0 thay vì phiên bản 15.x beta. Phiên bản này ổn định hơn và có tính tương thích tốt hơn với hệ sinh thái React hiện tại. 