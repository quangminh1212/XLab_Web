// Import các thư viện
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

// Metadata
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return {
    title: t('meta.homeTitle'),
    description: t('meta.homeDescription'),
  };
}

// Trang chính
export default function HomePage() {
  const t = useTranslations('home');
  
  return (
    <main>
      <h1 className="text-3xl font-bold text-center py-10">
        {t('title')}
      </h1>
      <p className="text-center px-4 max-w-3xl mx-auto">
        {t('subtitle')}
      </p>
    </main>
  );
} 