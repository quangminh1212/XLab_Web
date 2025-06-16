import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return {
    title: t('meta.aboutTitle'),
    description: t('meta.aboutDescription'),
  };
}

export default function AboutPage() {
  const t = useTranslations('about');
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('title')}</h1>
      <div className="max-w-3xl mx-auto">
        <p className="mb-4">{t('description')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('missionTitle')}</h2>
        <p className="mb-4">{t('mission')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('valuesTitle')}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('value1')}</li>
          <li>{t('value2')}</li>
          <li>{t('value3')}</li>
        </ul>
      </div>
    </div>
  );
} 