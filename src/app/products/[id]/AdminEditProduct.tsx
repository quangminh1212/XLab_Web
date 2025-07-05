'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface AdminEditProductProps {
  product: Product;
  onSave: (updatedProduct: Product) => void;
}

export default function AdminEditProduct({ product, onSave }: AdminEditProductProps) {
  const [description, setDescription] = useState(product.longDescription || '');
  const [previewImages, setPreviewImages] = useState<string[]>(product.descriptionImages || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý thêm ảnh từ URL
  const handleAddImageUrl = () => {
    if (!newImageUrl) return;

    // Thêm image tag vào mô tả
    const imageTag = `<img src="${newImageUrl}" alt="Mô tả sản phẩm" />`;
    setDescription(description + '\n' + imageTag);

    // Thêm vào danh sách ảnh xem trước
    setPreviewImages([...previewImages, newImageUrl]);

    // Reset input
    setNewImageUrl('');
  };

  // Xử lý thêm ảnh từ file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Giả lập upload ảnh (trong dự án thực tế, sẽ upload ảnh lên server)
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);

    // Thêm image tag vào mô tả
    const imageTag = `<img src="${imageUrl}" alt="Mô tả sản phẩm" />`;
    setDescription(description + '\n' + imageTag);

    // Thêm vào danh sách ảnh xem trước
    setPreviewImages([...previewImages, imageUrl]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Xử lý lưu sản phẩm
  const handleSave = () => {
    const updatedProduct = {
      ...product,
      longDescription: description,
      descriptionImages: previewImages,
    };
    onSave(updatedProduct);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa mô tả sản phẩm</h2>

      {/* Editor khu vực mô tả */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-semibold">Mô tả chi tiết:</label>
        <textarea
          className="w-full h-64 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Thêm ảnh từ URL */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-semibold">Thêm ảnh từ URL:</label>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập URL hình ảnh"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            onClick={handleAddImageUrl}
          >
            Thêm
          </button>
        </div>
      </div>

      {/* Thêm ảnh từ file */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-semibold">Thêm ảnh từ máy tính:</label>
        <input
          type="file"
          accept="image/*"
          className="p-2 border border-gray-300 rounded w-full"
          onChange={handleImageUpload}
          ref={fileInputRef}
        />
      </div>

      {/* Xem trước ảnh */}
      {previewImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Ảnh đã thêm:</h3>
          <div className="grid grid-cols-3 gap-4">
            {previewImages.map((img, index) => (
              <div key={index} className="relative group h-40 border rounded overflow-hidden">
                <Image src={img} alt={`Preview ${index}`} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nút lưu */}
      <div className="flex justify-end">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          onClick={handleSave}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
