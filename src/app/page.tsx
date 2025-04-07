'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">XLab Web</h1>
        <p className="text-gray-600 mb-4 text-center">
          Ứng dụng đang hoạt động ở chế độ cơ bản
        </p>
        <div className="flex justify-center">
          <button 
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            onClick={() => alert('Nút đang hoạt động!')}
          >
            Kiểm tra
          </button>
        </div>
      </div>
    </div>
  )
} 