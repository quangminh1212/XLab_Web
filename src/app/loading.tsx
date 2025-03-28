'use client';

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Loading() {
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 mx-auto text-center">
        <div className="mb-6">
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-800">{translate('loading.title')}</h2>
        <p className="text-gray-600">{translate('loading.message')}</p>
      </div>

      <style jsx>{`
        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
          margin: 0 auto;
        }
        
        .double-bounce1, .double-bounce2 {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #4299e1;
          opacity: 0.6;
          position: absolute;
          top: 0;
          left: 0;
          
          -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
          animation: sk-bounce 2.0s infinite ease-in-out;
        }
        
        .double-bounce2 {
          -webkit-animation-delay: -1.0s;
          animation-delay: -1.0s;
          background-color: #3182ce;
        }
        
        @-webkit-keyframes sk-bounce {
          0%, 100% { -webkit-transform: scale(0.0) }
          50% { -webkit-transform: scale(1.0) }
        }
        
        @keyframes sk-bounce {
          0%, 100% { 
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
          } 50% { 
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  )
} 