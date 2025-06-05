'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

// Tạo một phiên bản đơn giản của LanguageSwitcher không sử dụng các hook của next-intl
export default function LanguageSwitcherWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [locale, setLocale] = useState('vi');
  const [messages, setMessages] = useState<Record<string, any>>({});

  // Xác định locale hiện tại từ pathname
  useEffect(() => {
    const segments = pathname?.split('/');
    if (segments && segments.length > 1 && (segments[1] === 'vi' || segments[1] === 'en')) {
      setLocale(segments[1]);
    }
  }, [pathname]);

  // Tải các message cho locale hiện tại
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await import(`../../messages/${locale}.json`);
        setMessages(messages.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages({});
      }
    };

    loadMessages();
  }, [locale]);

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
    const path = pathname || '/';
    const basePath = getBasePathname(path);
    
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
        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all"
        aria-label="Chọn ngôn ngữ"
      >
        <FaGlobe className="mr-2 text-primary-600" />
        <span className="mr-1">{messages?.common?.language || 'Ngôn ngữ'}:</span>
        <span className="uppercase font-bold text-primary-600">{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 z-10 border border-gray-200 dark:border-gray-700">
          <div className="rounded-md ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={() => handleChangeLanguage('vi')}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  locale === 'vi'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                <span className="w-6 h-6 mr-2 flex items-center justify-center">🇻🇳</span>
                Tiếng Việt
              </button>
              <button
                onClick={() => handleChangeLanguage('en')}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  locale === 'en'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                <span className="w-6 h-6 mr-2 flex items-center justify-center">🇬🇧</span>
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 