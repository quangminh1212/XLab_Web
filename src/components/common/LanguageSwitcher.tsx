'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    // The pathname will be like /vi/about or /en/about
    // We need to remove the current locale and add the new one.
    const newPath = `/${newLocale}${pathname.substring(3)}`;
    router.replace(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLocale('vi')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          locale === 'vi'
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        VI
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
} 