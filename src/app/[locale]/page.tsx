import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('common');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center mb-8">{t('welcome')}</h1>
      <div className="flex flex-col space-y-4">
        <Link href="/products" className="text-blue-500 hover:underline">
          {t('products')}
        </Link>
        <Link href="/about" className="text-blue-500 hover:underline">
          {t('about')}
        </Link>
        <Link href="/contact" className="text-blue-500 hover:underline">
          {t('contact')}
        </Link>
      </div>
    </main>
  );
} 