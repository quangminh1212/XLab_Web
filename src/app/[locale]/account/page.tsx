import AccountPage from '@/app/account/page';

interface LocaleAccountPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleAccount({ params }: LocaleAccountPageProps) {
  return <AccountPage />;
} 