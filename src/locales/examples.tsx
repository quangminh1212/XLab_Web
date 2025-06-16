'use client';

import { useLanguage } from '@/contexts/LanguageContext';

// Ví dụ về một component sử dụng hệ thống ngôn ngữ
export function ExampleComponent() {
  // Sử dụng hook để lấy tiện ích ngôn ngữ
  const { t, language, setLanguage } = useLanguage();
  
  // Xử lý sự kiện khi thay đổi ngôn ngữ
  const handleLanguageChange = (newLang: 'vi' | 'en') => {
    try {
      setLanguage(newLang);
    } catch (error) {
      console.error('Error changing language:', error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };
  
  // Ví dụ sử dụng dịch đơn giản
  const simpleTranslation = t('home.slogan');
  
  // Ví dụ sử dụng dịch với tham số
  const paramTranslation = t('product.purchasesPerWeek', { count: 42 });
  
  // Xử lý trường hợp key không tồn tại
  const fallbackTranslation = t('some.missing.key') || 'Default fallback text';
  
  return (
    <div>
      <h1>{simpleTranslation}</h1>
      <p>{paramTranslation}</p>
      <p>{fallbackTranslation}</p>
      
      <div>
        <button onClick={() => handleLanguageChange('vi')}>
          Tiếng Việt {language === 'vi' ? '(đang dùng)' : ''}
        </button>
        <button onClick={() => handleLanguageChange('en')}>
          English {language === 'en' ? '(current)' : ''}
        </button>
      </div>
    </div>
  );
}

// Ví dụ về cách xử lý ngoại lệ khi sử dụng bên ngoài LanguageProvider
export function SafeTranslationExample({ translationKey }: { translationKey: string }) {
  try {
    const { t } = useLanguage();
    return <span>{t(translationKey)}</span>;
  } catch (error) {
    console.error('Translation error:', error);
    return <span>Error loading translation</span>;
  }
}

// Ví dụ về cách kiểm tra tính hợp lệ của key trước khi sử dụng
export function ValidatedTranslation({ section, key }: { section: string, key: string }) {
  const { t } = useLanguage();
  
  // Kiểm tra tính hợp lệ của key
  const isValidKey = section && key && typeof section === 'string' && typeof key === 'string';
  const translationKey = isValidKey ? `${section}.${key}` : '';
  
  return <span>{translationKey ? t(translationKey) : 'Invalid translation key'}</span>;
}

