'use client';

import { useState, useEffect } from 'react';

export default function SimpleEnglishButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hàm xử lý click đơn giản nhất có thể
  const handleClick = () => {
    console.log('SimpleEnglishButton clicked');
    
    try {
      // Chỉ mở google.com trong tab mới
      window.open('https://www.google.com', '_blank');
    } catch (error: any) {
      console.error('Error opening URL:', error);
      alert('Không thể mở URL. Lỗi: ' + (error.message || 'unknown error'));
    }
  };

  if (!mounted) return null;

  return (
    <button
      id="simple-english-button"
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
    >
      <span role="img" aria-label="Test">✅</span>
      <span>Test Button</span>
    </button>
  );
} 