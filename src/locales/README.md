# Cấu trúc tổ chức file ngôn ngữ

Thư mục này chứa các file ngôn ngữ cho việc quốc tế hóa (i18n) trong ứng dụng, được tổ chức theo cấu trúc module để dễ dàng bảo trì.

## Cấu trúc thư mục

```
locales/
├── vi/                     # Tiếng Việt (ngôn ngữ mặc định)
│   ├── index.json          # File chỉ mục cho tiếng Việt
│   ├── common/             # Các chuỗi dùng chung
│   │   ├── navigation.json # Điều hướng, menu
│   ├── admin/              # Module quản trị
│   │   ├── notifications.json # Chuỗi quản lý thông báo 
│   ├── home/               # Module trang chủ
│   │   ├── index.json      # Chuỗi chính trên trang chủ
│   │   ├── features.json   # Tính năng trên trang chủ
│   │   ├── faq.json        # Câu hỏi thường gặp
│   ├── product/            # Module sản phẩm
│   │   ├── index.json      # Chuỗi chung về sản phẩm
│   │   ├── featured.json   # Sản phẩm nổi bật
│   │   ├── loader.json     # Chuỗi hiển thị khi đang tải
│   │   ├── speech.json     # Chuỗi cho tính năng nhận dạng giọng nói
│   ├── about/              # Module giới thiệu
│   │   ├── index.json      # Chuỗi chung trang giới thiệu
│   │   ├── company.json    # Thông tin công ty
│   ├── contact/            # Module liên hệ
│
├── en/                     # Tiếng Anh
│   ├── index.json          # File chỉ mục tiếng Anh
│   └── ... (cấu trúc tương tự)
│
├── README.md               # Tài liệu này
└── GUIDE_FOR_DEVS.md       # Hướng dẫn cho dev
```

## Nguyên tắc tổ chức

1. **Mỗi ngôn ngữ một thư mục riêng**: Giúp dễ dàng thêm ngôn ngữ mới
2. **Tách theo module chức năng**: Giúp dễ quản lý, phát triển và bảo trì hơn
3. **Cấu trúc phân cấp**: Sử dụng cấu trúc dữ liệu phân cấp với các khóa lồng nhau
4. **Nhất quán về tên key**: Sử dụng camelCase và dấu chấm (.) để đặt tên key

## Cách sử dụng

Trong component, sử dụng hook `useLanguage`:

```jsx
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('product.featured.title')}</h1>
      <p>{t('product.featured.relatedProducts')}</p>
    </div>
  );
};
```

## Sử dụng tham số

Để truyền tham số vào chuỗi:

```jsx
// Trong file ngôn ngữ: "greeting": "Xin chào, {name}!"
t('greeting', { name: 'John' }) // => "Xin chào, John!"
```

## Quy tắc khi thêm mới

1. Thêm khóa mới vào thư mục tương ứng với chức năng
2. Luôn thêm cả tiếng Việt và tiếng Anh (nếu cần)
3. Đảm bảo tên key nhất quán với các key hiện có
4. Cập nhật file chỉ mục nếu tạo file module mới 