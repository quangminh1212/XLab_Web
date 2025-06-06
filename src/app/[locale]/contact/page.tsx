import ContactPage from '@/app/contact/page';

interface LocaleContactPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleContactPage({ params }: LocaleContactPageProps) {
  return <ContactPage />;
} 