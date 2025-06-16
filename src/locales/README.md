# Hướng dẫn tổ chức file ngôn ngữ

Thư mục này chứa các file ngôn ngữ cho tất cả các chuỗi văn bản trong ứng dụng, phục vụ cho việc quốc tế hóa (i18n).

## Cấu trúc file

Mỗi ngôn ngữ được lưu trong một file JSON riêng biệt, tuân theo quy ước đặt tên ISO language code:

- `vi.json`: Tiếng Việt (mặc định)
- `en.json`: Tiếng Anh
- Các ngôn ngữ khác trong tương lai: `fr.json`, `de.json`, v.v...

## Cấu trúc dữ liệu

Các chuỗi được tổ chức theo cấu trúc phân cấp để dễ quản lý:

```json
{
  "section1": {
    "key1": "Giá trị 1",
    "key2": "Giá trị 2",
    "subsection": {
      "key3": "Giá trị 3"
    }
  },
  "section2": {
    "key1": "Giá trị khác 1"
  }
}
```

## Sử dụng trong ứng dụng

Để sử dụng các chuỗi đã được định nghĩa, sử dụng hook `useLanguage`:

```jsx
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('section1.key1')}</h1>
      <p>{t('section1.subsection.key3')}</p>
    </div>
  );
};
```

## Quy tắc đặt tên key

- Sử dụng camelCase cho key
- Sử dụng dấu chấm (`.`) để phân tách các cấp
- Đặt tên theo cấu trúc `[component/feature].[element].[specific]`
- Ví dụ: `product.details.price`, `auth.login.welcomeMessage`

## Thông tin bổ sung

- Không bao giờ đưa các giá trị chuỗi cứng vào code, luôn sử dụng keys
- Tham số động có thể truyền vào bằng cách sử dụng `{paramName}` trong chuỗi:
  ```jsx
  // Trong file ngôn ngữ: "welcome": "Xin chào, {name}!"
  t('welcome', { name: 'John' }) // => "Xin chào, John!"
  ```

## Quy trình cập nhật

1. Khi thêm tính năng mới, thêm key mới vào TẤT CẢ các file ngôn ngữ
2. Không xóa key nếu tính năng vẫn còn được sử dụng ở nơi khác
3. Thêm comment cho các key phức tạp hoặc đặc biệt 