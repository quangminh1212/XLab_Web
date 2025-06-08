# Hướng dẫn sử dụng tính năng đa ngôn ngữ XLab Web

## Giới thiệu

Tính năng đa ngôn ngữ trong XLab Web cho phép dịch tự động toàn bộ trang web từ tiếng Việt sang tiếng Anh mà không cần tạo file dịch sẵn. Hệ thống sử dụng dictionary và cơ chế cache để tối ưu hiệu suất.

## Các thành phần chính

1. **TranslationContext**: Quản lý trạng thái ngôn ngữ và cung cấp function dịch
2. **AutoTranslate Component**: Component để dịch một đoạn văn bản cụ thể
3. **TranslateWrapper**: Component bọc để dịch tự động tất cả văn bản bên trong
4. **NoTranslate**: Component để đánh dấu văn bản không cần dịch
5. **withTranslation HOC**: HOC để bọc component với khả năng dịch tự động

## Cách sử dụng

### 1. Dịch toàn bộ trang web (mặc định)

Toàn bộ trang web sẽ được dịch tự động thông qua `PageContent` component trong `ClientLayoutWrapper`.

```jsx
// src/components/layout/ClientLayoutWrapper.tsx
<main className="flex-grow">
  <PageContent>
    {children}
  </PageContent>
</main>
```

### 2. Dịch một đoạn văn bản cụ thể

Sử dụng component `AutoTranslate`:

```jsx
import { AutoTranslate } from '@/hooks/useAutoTranslate';

<AutoTranslate>Văn bản cần dịch</AutoTranslate>
```

### 3. Bọc component với khả năng dịch tự động

Sử dụng HOC `withTranslation`:

```jsx
import { withTranslation } from '@/hooks/useAutoTranslate';

const MyComponent = () => {
  return <div>Nội dung cần dịch</div>;
};

export default withTranslation(MyComponent);
```

### 4. Đánh dấu văn bản không cần dịch

Sử dụng component `NoTranslate`:

```jsx
import { NoTranslate } from '@/hooks/useAutoTranslate';

<NoTranslate>Văn bản không cần dịch</NoTranslate>
```

### 5. Sử dụng hook để dịch theo logic riêng

```jsx
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

const MyComponent = () => {
  const { translatedText, isTranslating } = useAutoTranslate('Văn bản cần dịch');
  
  return (
    <div className={isTranslating ? 'opacity-50' : 'opacity-100'}>
      {translatedText}
    </div>
  );
};
```

## Thêm từ vựng vào dictionary

Để thêm từ vựng mới vào dictionary, chỉnh sửa file `src/utils/translator.ts`:

```typescript
const simpleDictionary: Record<string, Record<string, string>> = {
  en: {
    'Từ tiếng Việt': 'English translation',
    // Thêm từ vựng mới ở đây
  },
};
```

## Cache dịch thuật

Hệ thống tự động lưu cache dịch vào:
- Bộ nhớ tạm (localStorage) ở client
- File JSON trong thư mục `data/translations` ở server

Không cần xóa cache khi thêm từ vựng mới, hệ thống sẽ ưu tiên sử dụng từ vựng trong dictionary.

## Trang test

Để kiểm tra tính năng dịch, truy cập trang:

```
/test-translate
```

## Lưu ý

- Tính năng dịch chỉ hoạt động với text node, không hoạt động với hình ảnh và nội dung trong file tĩnh
- Nên sử dụng component `AutoTranslate` cho các text quan trọng để đảm bảo dịch chính xác
- Dịch tự động có thể không hoạt động với một số component phức tạp, trong trường hợp đó hãy sử dụng `AutoTranslate` trực tiếp 