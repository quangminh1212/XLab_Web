import VouchersPublicPage from '@/app/vouchers/public/page';

interface LocaleVouchersPublicPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleVouchersPublic({ params }: LocaleVouchersPublicPageProps) {
  return <VouchersPublicPage />;
} 