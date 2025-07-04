import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

'use client';

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng ngay lập tức
    router.replace('/products');
  }, [router]);

  // Hiển thị màn hình trống trong khi chuyển hướng
  return null;
}
