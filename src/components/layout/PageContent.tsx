'use client';

import React, { ReactNode } from 'react';
import { TranslateWrapper } from '@/hooks/useAutoTranslate';
import { useTranslation } from '@/contexts/TranslationContext';

interface PageContentProps {
  children: ReactNode;
}

/**
 * Component bọc nội dung trang và áp dụng dịch tự động
 */
const PageContent: React.FC<PageContentProps> = ({ children }) => {
  const { language } = useTranslation();
  
  return (
    <div className="page-content">
      <TranslateWrapper>
        {children}
      </TranslateWrapper>
    </div>
  );
};

export default PageContent; 