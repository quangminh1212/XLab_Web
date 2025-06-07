'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ServicesPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleServicesPage({ params }: ServicesPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng ngay lập tức sang trang products
    router.replace(`/${params.locale}/products`);
  }, [router, params.locale]);

  // Hiển thị màn hình trống trong khi chuyển hướng
  return null;
} 