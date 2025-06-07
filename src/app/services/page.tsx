'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng ngay lập tức sang trang products
    router.replace('/products');
  }, [router]);

  // Hiển thị màn hình trống trong khi chuyển hướng
  return null;
}
