import VouchersUsedPage from '@/app/vouchers/used/page';

interface LocaleVouchersUsedPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleVouchersUsed({ params }: LocaleVouchersUsedPageProps) {
  return <VouchersUsedPage />;
} 