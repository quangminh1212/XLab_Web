'use client';

import { incrementDownloadCount } from '@/lib/utils';

interface DownloadButtonProps {
  slug: string;
  children: React.ReactNode;
}

export function DownloadButton({ slug, children }: DownloadButtonProps) {
  const handleDownload = () => {
    // Tăng lượt tải xuống
    incrementDownloadCount(slug);
    
    // Thực hiện tải xuống (giả lập)
    setTimeout(() => {
      alert('Đang tải xuống phần mềm...');
    }, 500);
  };

  return (
    <button 
      className="btn bg-gray-100 text-gray-700 w-full hover:bg-gray-200 transition-colors" 
      onClick={handleDownload}
    >
      {children}
    </button>
  );
} 