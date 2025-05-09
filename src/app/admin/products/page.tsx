'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/mockData';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trong dự án thực tế, sẽ gọi API để lấy danh sách sản phẩm
    // Ở đây chỉ giả lập bằng cách lấy từ dữ liệu mockData
    const fetchProducts = () => {
      try {
        setProductList(products);
      } catch (err) {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleDelete = (productId: string) => {
    // Trong dự án thực tế, sẽ gọi API để xóa sản phẩm
    // Ở đây chỉ giả lập bằng cách lọc sản phẩm ra khỏi danh sách
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProductList(productList.filter(product => product.id !== productId));
      alert('Đã xóa sản phẩm thành công!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <Link href="/admin/products/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Thêm sản phẩm mới
        </Link>
      </div>

      {productList.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded text-center">
          <p className="text-gray-500">Không có sản phẩm nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khuyến mãi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tùy chọn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-12 w-12">
                      <Image
                        src={product.imageUrl || '/images/placeholder/product.png'}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price?.toLocaleString('vi-VN')}₫</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.salePrice ? `${product.salePrice?.toLocaleString('vi-VN')}₫` : '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.categoryId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleEdit(product.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(product.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 