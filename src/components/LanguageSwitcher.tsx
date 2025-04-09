'use client';

import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { languages, getLocalizedPath } from '@/i18n';

export default function LanguageSwitcher() {
    const { i18n, t } = useTranslation('common');
    const router = useRouter();
    const pathname = usePathname();
    const [showLanguageNotice, setShowLanguageNotice] = useState(i18n.language !== 'vi');

    // Xử lý khi thay đổi ngôn ngữ
    const changeLanguage = (lng: string) => {
        // Lấy đường dẫn mới với ngôn ngữ đã chọn
        const path = getLocalizedPath(pathname, lng);

        // Chuyển hướng đến trang với ngôn ngữ mới
        router.push(path);

        // Hiển thị thông báo nếu không phải tiếng Việt
        setShowLanguageNotice(lng !== 'vi');
    };

    return (
        <div className="fixed bottom-0 right-0 z-40 p-2">
            {showLanguageNotice && (
                <div className="bg-white border border-gray-200 shadow-md rounded-lg mb-2 p-3 flex items-center text-sm">
                    <div className="flex-1">
                        <p className="text-gray-500 mr-2 flex items-center">
                            <span className="text-xs text-gray-400 mr-1">translated by</span>
                            <span className="font-semibold">Google</span>
                        </p>
                        <p className="text-gray-700">{t('common.languageNotice')}</p>
                    </div>
                    <button
                        onClick={() => changeLanguage('vi')}
                        className="ml-3 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 text-sm font-medium transition-colors"
                    >
                        {t('common.switchToVietnamese')}
                    </button>
                </div>
            )}

            <div className="bg-white rounded-full shadow-md p-2 border border-gray-200">
                <div className="flex space-x-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${i18n.language === lang.code
                                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                                    : 'hover:bg-gray-100'
                                }`}
                            title={lang.name}
                        >
                            <span>{lang.flag}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 