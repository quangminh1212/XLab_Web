import OrdersHistoryPage from '@/app/orders/history/page';

interface LocaleOrdersHistoryPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleOrdersHistory({ params }: LocaleOrdersHistoryPageProps) {
  return <OrdersHistoryPage />;
} 