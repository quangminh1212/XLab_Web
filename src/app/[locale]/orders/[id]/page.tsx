import { Suspense } from 'react';
import OrderDetailPage from '@/app/orders/[id]/page';

interface LocaleOrderDetailsPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function LocaleOrderDetails({ params }: LocaleOrderDetailsPageProps) {
  // Ensure params is awaited before accessing properties
  const safeParams = await Promise.resolve(params);
  const orderId = safeParams.id;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetailPage params={Promise.resolve({ id: orderId })} />
    </Suspense>
  );
} 