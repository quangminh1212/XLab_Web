// Import các module ngôn ngữ tiếng Việt
import viCommon from './vi/common';
import viPagesAbout from './vi/pages/about';
import viPagesContact from './vi/pages/contact';
import viHome from './vi/home';

// Import các module ngôn ngữ tiếng Anh
import enCommon from './en/common';
import enPagesAbout from './en/pages/about';
import enPagesContact from './en/pages/contact';
import enHome from './en/home';

// Type definition để hỗ trợ typescript
type Language = 'vi' | 'en';
type TranslationRecord = Record<string, string>;

// Gộp các module thành đối tượng ngôn ngữ hoàn chỉnh
const translations: Record<Language, TranslationRecord> = {
  vi: {
    ...viCommon,
    ...viPagesAbout,
    ...viPagesContact,
    ...viHome,
  },
  en: {
    ...enCommon,
    ...enPagesAbout,
    ...enPagesContact,
    ...enHome,
  }
};

export default translations; 