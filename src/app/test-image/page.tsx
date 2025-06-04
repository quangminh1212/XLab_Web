'use client';

import React from 'react';
import Image from 'next/image';
import { ProductImage } from '@/components/ProductImage';

const TestImagePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra hiển thị hình ảnh</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Hình ảnh local từ public/images/products</h2>
          <div className="relative w-full h-64">
            <Image
              src="/images/products/office-pro.png"
              alt="Office Pro"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Hình ảnh test từ public</h2>
          <div className="relative w-full h-64">
            <Image src="/design-test.png" alt="Design Test" fill className="object-contain" />
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Hình ảnh SVG từ public</h2>
          <div className="relative w-full h-64">
            <Image src="/nextjs-icon.svg" alt="Next.js Icon" fill className="object-contain" />
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Hình ảnh từ ProductImage component</h2>
          <div className="relative w-full h-64">
            <ProductImage
              src="/images/products/design-master.png"
              alt="Design Master"
              width={300}
              height={300}
            />
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Hình ảnh từ nguồn internet</h2>
          <div className="relative w-full h-64">
            <Image
              src="https://images.unsplash.com/photo-1579403124614-197f69d8187b"
              alt="Test Remote Image"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Hình ảnh từ Icons8</h2>
          <div className="relative w-full h-64">
            <Image
              src="https://img.icons8.com/fluency/96/microsoft-office-2019.png"
              alt="Microsoft Office Icon"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestImagePage;
