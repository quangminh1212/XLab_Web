'use client';

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  // Xử lý lấy đường dẫn không chứa locale
  const getBasePathname = (path: string): string => {
    // Loại bỏ locale từ pathname
    const segments = path.split('/');
    if (segments.length > 1 && (segments[1] === 'vi' || segments[1] === 'en')) {
      return '/' + segments.slice(2).join('/');
    }
    return path;
  };

  const handleChangeLanguage = async (newLocale: string) => {
    // Lấy đường dẫn cơ bản không chứa locale
    const basePath = getBasePathname(pathname);
    
    // Cập nhật ngôn ngữ cho người dùng nếu đã đăng nhập
    if (session?.user?.email) {
      try {
        await fetch('/api/user/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updateData: {
              settings: {
                language: newLocale
              }
            }
          }),
        });
      } catch (error) {
        console.error('Failed to update user language preference', error);
      }
    }

    // Chuyển hướng đến đường dẫn mới với locale mới
    const newPath = `/${newLocale}${basePath}`;
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span className="mr-1">{t('language')}</span>
        <span className="uppercase font-bold">{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 z-10">
          <div className="rounded-md ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={() => handleChangeLanguage('vi')}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === 'vi'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
                role="menuitem"
              >
                Tiếng Việt
              </button>
              <button
                onClick={() => handleChangeLanguage('en')}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === 'en'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
                role="menuitem"
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 