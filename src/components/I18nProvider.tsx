'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { namespaces, defaultNS } from '@/i18n';

// Khởi tạo i18next cho client-side
i18next
    .use(initReactI18next)
    .use(
        resourcesToBackend(
            (language: string, namespace: string) =>
                import(`../../public/locales/${language}/${namespace}.json`)
        )
    )
    .init({
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: 'vi',
        defaultNS,
        fallbackNS: defaultNS,
        ns: namespaces,
        interpolation: {
            escapeValue: false, // React đã xử lý XSS rồi nên không cần escape
        },
    });

export default function I18nProvider({
    children,
    locale,
}: {
    children: ReactNode;
    locale: string;
}) {
    // Cập nhật ngôn ngữ khi locale thay đổi
    useEffect(() => {
        i18next.changeLanguage(locale);
    }, [locale]);

    return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
} 