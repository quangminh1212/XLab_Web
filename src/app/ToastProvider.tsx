'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
        },
        success: {
          style: {
            background: '#10B981',
            color: 'white',
          },
        },
        error: {
          style: {
            background: '#E11D48',
            color: 'white',
          },
        },
      }}
    />
  );
} 