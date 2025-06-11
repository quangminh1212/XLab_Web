# XLab Web - Hướng dẫn tối ưu hóa

## Giới thiệu

Tài liệu này cung cấp hướng dẫn về các cải tiến và tối ưu hóa đã được thực hiện trong dự án XLab Web, cùng với các lời khuyên để duy trì hiệu suất và dễ dàng phát triển.

## Cải tiến đã thực hiện

### 1. Tối ưu hóa cấu trúc dự án

- Cập nhật `.gitignore` để loại trừ nhiều file tạm thời và không cần thiết hơn
- Cập nhật `tsconfig.json` để cải thiện hiệu suất biên dịch TypeScript
- Tạo file utility trong `src/utils/productUtils.ts` để tái sử dụng mã
- Tối ưu hóa component với `React.memo` để giảm re-render không cần thiết

### 2. Cải tiến Scripts

- `npm run dev:clean`: Xóa file tạm, sửa lỗi Next.js và chạy dev server
- `npm run clean`: Dọn dẹp các file tạm và tối ưu package.json
- `npm run fix`: Sửa các lỗi phổ biến của Next.js
- `npm run optimize`: Chạy toàn bộ quy trình tối ưu (clean, format, lint, fix)
- `npm run analyze`: Phân tích kích thước bundle để tối ưu hóa thêm

### 3. Quản lý lỗi tốt hơn

- Script `fix-next-errors.js` đã được cập nhật để xử lý nhiều lỗi phổ biến hơn
- Cải thiện xử lý ngoại lệ và báo cáo lỗi
- Thêm quyền truy cập hợp lý cho các thư mục và file

## Hướng dẫn sử dụng

### Khởi động dự án

```bash
# Cách tốt nhất để khởi động (tự động dọn dẹp và sửa lỗi)
npm run dev:clean

# HOẶC chỉ cần chạy file batch
run.bat
```

### Khi gặp lỗi

```bash
# Sửa lỗi Next.js phổ biến
npm run fix

# Dọn dẹp file tạm
npm run clean

# Tối ưu toàn diện
npm run optimize
```

### Trước khi commit

```bash
# Đảm bảo code sạch sẽ và đúng chuẩn
npm run format
npm run lint:fix
```

## Các cải tiến chính về hiệu suất

1. **Memorization**: Sử dụng `useMemo` và `React.memo` để tránh các component re-render không cần thiết
2. **Tách nhỏ component**: Các component đã được tách nhỏ để dễ bảo trì và tối ưu hiệu suất
3. **Lazy loading**: Hình ảnh sử dụng Next.js Image với lazy loading
4. **Utility functions**: Các hàm chung được tách ra utility để tái sử dụng

## Các biện pháp tối ưu khác

1. **Cấu trúc thư mục**:
   - `/src/utils`: Chứa các hàm tiện ích tái sử dụng
   - `/scripts`: Chứa các script tự động hóa và sửa lỗi

2. **Quy ước đặt tên**:
   - Component: PascalCase (VD: ProductCard)
   - Hàm tiện ích: camelCase (VD: formatCurrency)
   - Files: kebab-case (VD: product-utils.ts)

3. **Chuẩn hóa CSS**:
   - Sử dụng TailwindCSS nhất quán
   - Đặt tên class theo BEM khi cần thiết

## Thông tin thêm

Để biết thêm thông tin chi tiết về dự án, vui lòng tham khảo:
- `README.md`: Tài liệu chính của dự án
- `README_SECURE_DATA.md`: Hướng dẫn về bảo mật dữ liệu 