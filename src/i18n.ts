import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Khởi tạo i18n instance cho server-side
export const initI18next = async (lng: string, ns: string | string[]) => {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(
            resourcesToBackend(
                (language: string, namespace: string) =>
                    import(`../public/locales/${language}/${namespace}.json`)
            )
        )
        .init({
            debug: process.env.NODE_ENV === 'development',
            lng,
            ns,
            fallbackLng: 'vi',
            defaultNS: 'common',
            fallbackNS: 'common',
            interpolation: {
                escapeValue: false, // React đã xử lý XSS rồi nên không cần escape
            },
        });

    return i18nInstance;
};

// Danh sách các ngôn ngữ được hỗ trợ
export const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
];

// Các namespace để phân chia các nhóm dịch
export const defaultNS = 'common';
export const namespaces = ['common', 'header', 'footer', 'home', 'auth'];

// Hàm chuyển đổi đường dẫn giữa các ngôn ngữ
export const getLocalizedPath = (path: string, locale: string) => {
    // Xử lý locale trong path
    if (path.startsWith('/vi/') || path.startsWith('/en/')) {
        // Nếu path đã có locale, thay thế locale
        return path.replace(/^\/(vi|en)/, `/${locale}`);
    }
    // Nếu path không có locale, thêm locale
    return `/${locale}${path}`;
};

// Hàm lấy locale từ request
export const getLocaleFromPath = (path: string) => {
    const locale = path.split('/')[1];
    if (languages.some(lang => lang.code === locale)) {
        return locale;
    }
    return 'vi'; // Mặc định là tiếng Việt
};

// Hàm lấy path gốc (không có locale)
export const getPathWithoutLocale = (path: string) => {
    return path.replace(/^\/(vi|en)/, '') || '/';
};

export default initI18next; 