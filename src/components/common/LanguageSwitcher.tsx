'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import dynamic from 'next/dynamic';

interface LanguageSwitcherProps {
  className?: string;
}

// Simple placeholder component that shows during SSR
const PlaceholderLanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  
  return (
    <div className={`relative ${className}`}>
      <div className="opacity-0">
        <span>{isVi ? 'VIE' : 'ENG'}</span>
      </div>
    </div>
  );
};

// The main component is the placeholder
const LanguageSwitcher = (props: LanguageSwitcherProps) => {
  return <DynamicLanguageSwitcher {...props} />;
};

// The real component is loaded dynamically with SSR disabled
const DynamicLanguageSwitcher = dynamic(
  () => import('./LanguageSwitcherClient'),
  { ssr: false, loading: (props) => <PlaceholderLanguageSwitcher {...props as LanguageSwitcherProps} /> }
);

export default LanguageSwitcher; 