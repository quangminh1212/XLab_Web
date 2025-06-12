'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Component này được sử dụng để sửa lỗi hydration do session provider lồng nhau
export default function SessionFix() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();

  // Chỉ render ở client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Không hiển thị gì cả, chỉ dùng để lấy session
  return null;
} 