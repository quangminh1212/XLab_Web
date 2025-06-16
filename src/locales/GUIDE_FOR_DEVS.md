# Hướng dẫn tổ chức và phát triển đa ngôn ngữ

## Cách thức tổ chức mới

Hệ thống đa ngôn ngữ đã được cập nhật để tuân theo các tiêu chuẩn quốc tế về i18n (internationalization):

1. **Tách biệt các file ngôn ngữ**: Mỗi ngôn ngữ được lưu trong một file JSON riêng trong thư mục `/src/locales`
2. **Cấu trúc phân cấp**: Các khóa ngôn ngữ được tổ chức theo cấu trúc phân cấp
3. **Hỗ trợ dot notation**: Dễ dàng truy cập các giá trị lồng nhau với ký hiệu dấu chấm
4. **Tích hợp với React**: Sử dụng hook `useLanguage` để truy cập các chuỗi đã được dịch

## Lợi ích của cấu trúc này

1. **Dễ dàng mở rộng**: Thêm ngôn ngữ mới chỉ cần thêm file JSON mới
2. **Dễ bảo trì**: Các chuỗi được nhóm theo tính năng/thành phần, giúp dễ tìm và cập nhật
3. **Giảm kích thước bundle**: Chỉ tải các file ngôn ngữ cần thiết
4. **Hỗ trợ dynamic loading**: Có thể tải ngôn ngữ theo nhu cầu
5. **Giảm thiểu lỗi**: Cấu trúc phân cấp giúp tránh xung đột khóa
6. **Hỗ trợ công cụ và quy trình**: Dễ dàng tích hợp với công cụ dịch tự động và quy trình CI/CD

## Quy trình thêm khóa mới

Khi cần thêm một chuỗi văn bản mới:

1. Xác định vị trí phù hợp trong cấu trúc phân cấp
2. Thêm khóa và giá trị vào TẤT CẢ các file ngôn ngữ
3. Sử dụng khóa đó trong code với hook `useLanguage`

```jsx
// Ví dụ thêm khóa mới
// 1. Thêm vào vi.json
"feature": {
  "newKey": "Giá trị tiếng Việt"
}

// 2. Thêm vào en.json
"feature": {
  "newKey": "English value"
}

// 3. Sử dụng trong component
const { t } = useLanguage();
return <div>{t('feature.newKey')}</div>;
```

## Cấu trúc khóa đề xuất

Nên tuân theo cấu trúc khóa sau để đảm bảo tính nhất quán:

- `page.{pageName}.{elementName}`: Cho các chuỗi liên quan đến trang cụ thể
- `component.{componentName}.{elementName}`: Cho các thành phần giao diện có thể tái sử dụng
- `common.{category}.{elementName}`: Cho các chuỗi dùng chung
- `feature.{featureName}.{elementName}`: Cho các tính năng xuyên suốt ứng dụng
- `error.{code/type}`: Cho các thông báo lỗi

## Quy tắc làm việc với đa ngôn ngữ

1. **Không hard code chuỗi văn bản** vào code React, luôn sử dụng khóa và hook `t()`
2. **Cập nhật tất cả các file ngôn ngữ** khi thêm khóa mới
3. **Sử dụng tham số** thay vì ghép chuỗi để hỗ trợ tốt hơn cho đa ngôn ngữ
4. **Kiểm tra độ dài** của chuỗi dịch, vì một số ngôn ngữ có thể dài hơn đáng kể
5. **Lưu ý về số ít/số nhiều** trong các ngôn ngữ khác nhau

## Tài nguyên tham khảo

- [i18next Documentation](https://www.i18next.com/)
- [React Intl](https://formatjs.io/docs/react-intl/)
- [Mozilla L10n Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Localization)
- [W3C Internationalization](https://www.w3.org/International/) 