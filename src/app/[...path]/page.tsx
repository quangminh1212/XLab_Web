'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { NextPage } from 'next';

const CatchAllPage: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  
  // Handle loading of dynamic route
  useEffect(() => {
    // Get the current path from params
    const path = Array.isArray(params.path) ? params.path.join('/') : params.path || '';
    
    // Redirect to 404 if path is not valid
    if (!path) {
      router.push('/404');
    }
  }, [params, router]);

  return null;
}

export default CatchAllPage; 