# Internationalization (i18n) System

Hệ thống đa ngôn ngữ (i18n) của dự án XLab Web được tổ chức theo cấu trúc module để dễ dàng quản lý và mở rộng.

## Cấu trúc thư mục

```
src/i18n/
├── en/                   # Tiếng Anh
│   ├── admin.ts          # Phần quản trị
│   ├── common.ts         # Các thành phần dùng chung
│   ├── home.ts           # Trang chủ
│   ├── testimonials.ts   # Đánh giá khách hàng
│   ├── account.ts        # Tài khoản người dùng
│   └── index.ts          # File xuất tất cả các module tiếng Anh
├── vi/                   # Tiếng Việt
│   ├── admin.ts          # Phần quản trị
│   ├── common.ts         # Các thành phần dùng chung
│   ├── home.ts           # Trang chủ
│   ├── testimonials.ts   # Đánh giá khách hàng
│   ├── account.ts        # Tài khoản người dùng
│   └── index.ts          # File xuất tất cả các module tiếng Việt
├── index.ts              # File xuất tất cả ngôn ngữ
└── README.md             # Tài liệu hướng dẫn
```

## Cách thêm ngôn ngữ mới

1. Tạo thư mục mới với mã của ngôn ngữ (vd: `fr/` cho tiếng Pháp)
2. Sao chép các file từ thư mục `en/` sang thư mục mới
3. Dịch nội dung trong từng file
4. Cập nhật file `index.ts` trong thư mục ngôn ngữ mới
5. Thêm ngôn ngữ mới vào file `src/i18n/index.ts`

## Cách sử dụng

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('common.nav.home')}</h1>
      <p>{t('home.slogan')}</p>
      
      {/* Với tham số */}
      <p>{t('account.welcome', { name: 'John Doe' })}</p>
      
      {/* Chuyển đổi ngôn ngữ */}
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('vi')}>Tiếng Việt</button>
    </div>
  );
}
```

## Quy tắc đặt key

1. Sử dụng định dạng `module.section.key` để tổ chức key
2. Module là tên của file (vd: `admin`, `home`, `common`, etc.)
3. Section là nhóm chức năng (vd: `nav`, `button`, etc.)
4. Key là tên cụ thể của chuỗi (vd: `title`, `description`, etc.)

Ví dụ: `common.nav.home`, `admin.notifications.title`

## Thêm module mới

1. Tạo file mới trong thư mục `en/` và `vi/`
2. Thêm module mới vào file `index.ts` của mỗi thư mục ngôn ngữ

```ts
// src/i18n/en/index.ts hoặc src/i18n/vi/index.ts
import newModule from './newModule';

const en = {
  // ...các module hiện tại
  newModule,
};

export default en;
``` 