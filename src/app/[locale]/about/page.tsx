import AboutPage from '@/app/about/page';

interface LocaleAboutPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleAboutPage({ params }: LocaleAboutPageProps) {
  return <AboutPage />;
} 