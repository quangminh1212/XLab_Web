'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-t-4 border-b-4 border-teal-500 rounded-full animate-spin"></div>
        <p className="text-xl font-medium text-gray-700">Đang tải...</p>
      </div>
    </div>
  );
} 