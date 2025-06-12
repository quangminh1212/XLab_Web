# Hướng dẫn đóng góp

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án XLab Web! Dưới đây là hướng dẫn giúp bạn bắt đầu.

## Quy trình phát triển

1. Fork dự án
2. Tạo nhánh feature (`git checkout -b feature/amazing-feature`)
3. Commit các thay đổi (`git commit -m 'feat: Add amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## Tiêu chuẩn code

### Định dạng mã nguồn

Dự án sử dụng ESLint và Prettier để đảm bảo tính nhất quán trong mã nguồn. Vui lòng đảm bảo mã của bạn tuân thủ cấu hình có sẵn:

```bash
# Kiểm tra định dạng
npm run format:check

# Tự động định dạng mã
npm run format
```

### Quy ước đặt tên

- **Components**: PascalCase (ví dụ: `ProductCard.tsx`)
- **Hooks**: camelCase, bắt đầu bằng `use` (ví dụ: `useCart.ts`)
- **Utilities**: camelCase (ví dụ: `formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (ví dụ: `API_ENDPOINTS.ts`)
- **Files**: kebab-case cho các file không phải component/hook (ví dụ: `api-client.ts`)

### Quy tắc TypeScript

- Luôn sử dụng kiểu dữ liệu rõ ràng
- Tránh sử dụng `any`
- Sử dụng interface cho Props và State
- Sử dụng type cho các kiểu dữ liệu phức tạp hoặc union types

### Tiêu chuẩn Component

- Sử dụng functional components với hooks
- Định nghĩa props interface bên trên component
- Sử dụng destructuring cho props
- Sắp xếp các imports theo thứ tự: React, thư viện bên ngoài, internal
- Sử dụng React Server Components khi có thể

## Quy ước commit

Dự án tuân theo [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Các loại commit:

- `feat`: Thêm tính năng mới
- `fix`: Sửa lỗi
- `docs`: Thay đổi tài liệu
- `style`: Thay đổi không ảnh hưởng đến code (format, spaces, v.v.)
- `refactor`: Tái cấu trúc code không thêm tính năng hoặc sửa lỗi
- `perf`: Cải thiện hiệu suất
- `test`: Thêm hoặc sửa tests
- `chore`: Thay đổi quy trình build hoặc công cụ phụ trợ
- `i18n`: Quốc tế hóa
- `a11y`: Cải thiện khả năng truy cập

## Kiểm thử

Tất cả các Pull Request phải vượt qua các bài kiểm tra tự động và đảm bảo độ phủ test đầy đủ:

```bash
# Chạy tests
npm run test

# Chạy tests với coverage
npm run test:ci
```

## Báo cáo lỗi

Khi báo cáo lỗi, vui lòng sử dụng template và cung cấp:

1. Mô tả chi tiết về lỗi
2. Các bước tái tạo lỗi
3. Hành vi mong đợi
4. Ảnh chụp màn hình (nếu có)
5. Môi trường (trình duyệt, hệ điều hành, v.v.)

## Pull Requests

- Đảm bảo PR chỉ giải quyết một vấn đề
- Cập nhật CHANGELOG.md nếu cần
- Liên kết PR với issue tương ứng
- Thêm người review thích hợp

## License

Bằng cách đóng góp cho dự án, bạn đồng ý rằng đóng góp của bạn sẽ được cấp phép theo [giấy phép ISC](LICENSE) của dự án.

---

Cảm ơn sự đóng góp của bạn! 