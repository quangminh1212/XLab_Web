'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Image 
            src="/images/icons/404-illustration.svg" 
            alt="404 Page Not Found"
            width={200}
            height={200}
            priority
            className="w-52 h-52"
          />
        </div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-primary-600 mb-3">
            404
          </h1>
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            {t('system.pageNotFound')}
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {t('system.pageNotFoundMessage')}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 px-6 py-2 rounded-md font-medium transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {t('system.returnToHome')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
