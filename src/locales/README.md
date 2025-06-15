# Hướng dẫn quản lý ngôn ngữ (i18n)

## Cấu trúc thư mục

```
src/locales/
├── index.ts                # Điểm vào chính, xuất các ngôn ngữ và helper functions
├── en/                     # Thư mục chứa các bản dịch tiếng Anh
│   ├── index.ts           # Gộp các namespace tiếng Anh
│   ├── translations.ts    # Các bản dịch chính tiếng Anh
│   ├── account/           # Namespace cho phần tài khoản
│   ├── admin/             # Namespace cho phần quản trị
│   └── ...                # Các namespace khác
└── vi/                     # Thư mục chứa các bản dịch tiếng Việt
    ├── index.ts           # Gộp các namespace tiếng Việt
    ├── translations.ts    # Các bản dịch chính tiếng Việt
    ├── account/           # Namespace cho phần tài khoản
    ├── admin/             # Namespace cho phần quản trị
    └── ...                # Các namespace khác
```

## Cách sử dụng

### Trong component React

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
      
      {/* Sử dụng params */}
      <p>{t('greeting.hello', { name: 'John' })}</p>
      
      {/* Chuyển đổi ngôn ngữ */}
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('vi')}>Tiếng Việt</button>
    </div>
  );
}
```

## Cách thêm mới bản dịch

### 1. Tạo namespace mới

Ví dụ tạo namespace `profile` cho phần hồ sơ người dùng:

a. Tạo file `src/locales/vi/profile/index.ts`:

```ts
const profile = {
  'profile.title': 'Hồ sơ của tôi',
  'profile.edit': 'Chỉnh sửa hồ sơ',
  'profile.save': 'Lưu thay đổi',
  // Thêm các bản dịch khác...
};

export default profile;
```

b. Tạo file `src/locales/en/profile/index.ts`:

```ts
const profile = {
  'profile.title': 'My Profile',
  'profile.edit': 'Edit Profile',
  'profile.save': 'Save Changes',
  // Thêm các bản dịch khác...
};

export default profile;
```

### 2. Cập nhật file index.ts của ngôn ngữ tương ứng

a. Cập nhật `src/locales/vi/index.ts`:

```ts
import translations from './translations';
import profile from './profile';

const vi = {
  ...translations,
  ...profile,
  // ...các namespace khác
};

export default vi;
```

b. Cập nhật `src/locales/en/index.ts`:

```ts
import translations from './translations';
import profile from './profile';

const en = {
  ...translations,
  ...profile,
  // ...các namespace khác
};

export default en;
```

## Quy ước đặt tên

- Sử dụng định dạng `namespace.key` hoặc `namespace.section.key` để tránh xung đột
- Ví dụ: `home.title`, `admin.users.create`, `product.details.price`
- Duy trì sự nhất quán giữa các ngôn ngữ (đảm bảo các key giống nhau)

## Kiểm tra bản dịch bị thiếu

Khi thêm bản dịch mới, hãy đảm bảo thêm cho cả hai ngôn ngữ (và các ngôn ngữ khác trong tương lai).

## Mở rộng

Hệ thống này có thể dễ dàng mở rộng để hỗ trợ thêm nhiều ngôn ngữ khác bằng cách:

1. Tạo thư mục ngôn ngữ mới (ví dụ: `src/locales/ja/` cho tiếng Nhật)
2. Tạo các file tương tự như trong `vi` và `en`
3. Cập nhật type `Language` trong `src/locales/index.ts`
4. Thêm ngôn ngữ mới vào đối tượng `translations` trong `LanguageContext.tsx` 