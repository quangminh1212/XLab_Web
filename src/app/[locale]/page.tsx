import { redirect } from 'next/navigation';
import HomePage from '@/app/page';

interface LocalePageProps {
  params: {
    locale: string;
  };
}

export default function LocalePage({ params }: LocalePageProps) {
  // Không redirect nữa, thay vào đó render trực tiếp HomePage
  return <HomePage />;
} 