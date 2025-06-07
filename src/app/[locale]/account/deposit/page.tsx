import DepositPage from '@/app/account/deposit/page';

interface LocaleDepositPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleDeposit({ params }: LocaleDepositPageProps) {
  return <DepositPage />;
} 