import { redirect } from 'next/navigation';

interface LocalePageProps {
  params: {
    locale: string;
  };
}

export default function LocalePage({ params }: LocalePageProps) {
  // Redirect to the home page with the selected locale
  redirect('/');
} 