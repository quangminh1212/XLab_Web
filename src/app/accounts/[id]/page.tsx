'use client';

import React, { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { users } from '@/data/mockData';
import AccountDetails from '@/components/AccountDetails';

interface AccountPageProps {
  params: {
    id: string;
  };
}

export default function AccountPage({ params }: AccountPageProps) {
  useEffect(() => {
    document.title = 'Chi tiết tài khoản | XLab - Phần mềm và Dịch vụ';
  }, []);
  
  // Kiểm tra params tồn tại
  if (!params || !params.id) {
    return notFound();
  }
  
  const user = users.find((user) => user?.id === params.id);
  
  if (!user) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AccountDetails user={user} />
    </div>
  );
} 