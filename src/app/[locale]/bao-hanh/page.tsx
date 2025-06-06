import BaoHanhPage from '@/app/bao-hanh/page';

interface LocaleBaoHanhPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleBaoHanhPage({ params }: LocaleBaoHanhPageProps) {
  return <BaoHanhPage />;
} 