'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { NextPage } from 'next';

const CatchAllPage: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  
  // Force reload when language changes
  useEffect(() => {
    // Get the current path from params
    const path = Array.isArray(params.path) ? params.path.join('/') : params.path || '';
    
    // Reload the current page
    router.push(`/${path}`);
  }, [params, router, language]);

  return null;
}

export default CatchAllPage; 