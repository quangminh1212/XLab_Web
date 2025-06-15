'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

export default function TestHydrationPage() {
  useEffect(() => {
    // Run verification code directly
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log('Checking for hydration issues...');
        const footerCopyright = document.querySelector('.text-center.sm\\:text-left p.text-xs.sm\\:text-sm.text-slate-400');
        if (footerCopyright) {
          console.log('Footer copyright section found');
          console.log('HTML structure:', footerCopyright.innerHTML);
          
          // Check for the specific fix we made
          const hasSpanDot = footerCopyright.innerHTML.includes('<span>.</span>');
          const hasPlainDot = />[^<]*\.[^<]*</.test(footerCopyright.innerHTML);
          
          console.log('Has <span>.</span>:', hasSpanDot);
          console.log('Has plain dot:', hasPlainDot);
          
          if (!hasSpanDot && hasPlainDot) {
            console.log('✅ Hydration fix appears to be working correctly!');
          } else {
            console.warn('⚠️ Hydration issue may still be present');
          }
        } else {
          console.error('Could not find footer copyright section');
        }
      }, 1000);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hydration Test Page</h1>
      <p className="mb-4">This page is used to test if the hydration issue in the Footer component has been fixed.</p>
      <p>Please check the browser console for verification results.</p>
    </div>
  );
} 