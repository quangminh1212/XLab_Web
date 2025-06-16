'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import LanguageSwitcher component với chế độ client-side only
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), { 
  ssr: false,
  // Không hiển thị loading state để tránh hydration mismatch
  loading: () => null
});

export default function DynamicLanguageSwitcher() {
  // Trả về component LanguageSwitcher với className từ bên ngoài
  return <LanguageSwitcher />;
} 