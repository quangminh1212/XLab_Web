import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{t('slogan')}</h1>
      <div className="mt-4">
        <p>
          {t('aboutDesc1')}
        </p>
      </div>
    </div>
  );
} 