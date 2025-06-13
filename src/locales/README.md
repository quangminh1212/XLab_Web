# Hướng dẫn quản lý Localization 

## Cấu trúc thư mục

Cấu trúc thư mục cho phần localization được tổ chức như sau:

```
src/locales/
  ├── index.ts                # File chính xuất các translations và các tiện ích
  ├── namespaces/             # Thư mục chứa các namespace dịch thuật
  │   ├── admin/              # Namespace cho phần admin
  │   │   ├── vi.ts           # Tiếng Việt cho admin
  │   │   ├── en.ts           # Tiếng Anh cho admin
  │   │   ├── es.ts           # Tiếng Tây Ban Nha cho admin
  │   │   └── index.ts        # Xuất các file dịch thuật
  │   ├── common/             # Namespace cho phần common (header, footer)
  │   │   ├── vi.ts
  │   │   ├── en.ts
  │   │   ├── es.ts
  │   │   └── index.ts
  │   ├── home/               # Namespace cho trang chủ
  │   │   ├── vi.ts
  │   │   ├── en.ts
  │   │   ├── es.ts
  │   │   └── index.ts
  │   └── terms/              # Namespace cho điều khoản
  │       ├── vi.ts
  │       ├── en.ts
  │       ├── es.ts
  │       └── index.ts
  └── README.md               # Tài liệu hướng dẫn
```

## Sử dụng

1. **Thêm key dịch thuật mới**:
   - Xác định namespace phù hợp (admin, common, home, terms, v.v.)
   - Thêm key và giá trị vào file ngôn ngữ tương ứng trong namespace đó
   - Đảm bảo thêm key và giá trị cho tất cả các ngôn ngữ (vi, en, es)

2. **Thêm namespace mới**:
   - Tạo thư mục mới trong `src/locales/namespaces/`
   - Tạo các file `vi.ts`, `en.ts`, `es.ts` và `index.ts` theo mẫu
   - Import và export namespace mới trong file `src/locales/index.ts`

3. **Sử dụng trong code**:
   - Import hook `useLanguage` từ LanguageContext
   - Sử dụng hàm `t()` để dịch key:
     ```tsx
     const { t } = useLanguage();
     <h1>{t('home.title')}</h1>
     ```

## Quy tắc đặt tên key

- Sử dụng định dạng `namespace.key` hoặc `namespace.section.key`  
  Ví dụ: `home.slogan`, `admin.notifications.title`
- Sử dụng camelCase cho key
- Đặt tên có tính mô tả để dễ hiểu và bảo trì

## Kiểm tra key bị thiếu

Sử dụng hàm `validateTranslationKeys()` để kiểm tra xem có key nào bị thiếu trong các ngôn ngữ khác nhau hay không:

```tsx
import { validateTranslationKeys } from '@/locales';

const validation = validateTranslationKeys();
console.log(validation.hasAllKeys); // true nếu tất cả key đều có trong các ngôn ngữ
console.log(validation.missingKeys); // Danh sách key bị thiếu theo từng ngôn ngữ
``` 