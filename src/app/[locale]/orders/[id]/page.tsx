import { Suspense } from 'react';
import OrderDetailPage from '@/app/orders/[id]/page';

interface LocaleOrderDetailsPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default function LocaleOrderDetails({ params }: LocaleOrderDetailsPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetailPage params={Promise.resolve({ id: params.id })} />
    </Suspense>
  );
} 