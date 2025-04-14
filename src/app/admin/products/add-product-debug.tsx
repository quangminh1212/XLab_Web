'use client';

import { useState } from 'react';
import { Product } from '@/types';

export default function AddProductDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any }>({
    success: false,
    message: ''
  });
  
  const addSampleProduct = async () => {
    setIsLoading(true);
    setResult({ success: false, message: 'Đang xử lý...' });
    
    // Sản phẩm mẫu để thử nghiệm
    const sampleProduct = {
      name: 'Sản phẩm test ' + new Date().toISOString(),
      slug: 'san-pham-test-' + Date.now(),
      description: 'Mô tả ngắn cho sản phẩm test',
      longDescription: '<p>Đây là mô tả chi tiết cho sản phẩm test</p>',
      price: 299000,
      salePrice: 199000,
      categoryId: 'cat-1', // ID danh mục đầu tiên từ mockData
      imageUrl: '/images/placeholder-product.jpg',
      version: '1.0.0',
      size: '10MB',
      licenseType: 'Thương mại',
      isFeatured: false,
      isNew: true,
      storeId: '1'
    };
    
    try {
      console.log('Gửi request thêm sản phẩm mẫu:', sampleProduct);
      
      // Gọi API trực tiếp
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sampleProduct)
      });
      
      console.log('Trạng thái response:', response.status, response.statusText);
      
      // Lấy dữ liệu response dưới dạng text
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Chuyển đổi text thành JSON nếu có thể
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Dữ liệu response (đã parse):', responseData);
      } catch (parseError) {
        console.error('Lỗi khi parse JSON:', parseError);
        setResult({
          success: false,
          message: `Response không phải JSON hợp lệ. Status: ${response.status}. Data: ${responseText}`
        });
        return;
      }
      
      if (response.ok) {
        setResult({
          success: true,
          message: 'Thêm sản phẩm thành công!',
          data: responseData
        });
        
        // Làm mới trang sau 3 giây
        setTimeout(() => {
          window.location.href = '/admin/products';
        }, 3000);
      } else {
        setResult({
          success: false,
          message: `Lỗi: ${responseData.error || response.statusText}`,
          data: responseData
        });
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi API:', error);
      setResult({
        success: false,
        message: `Lỗi: ${error.message || 'Không thể kết nối đến server'}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Công cụ thêm sản phẩm mẫu (Debug)</h2>
      <p className="mb-4 text-gray-700">
        Công cụ này sẽ tạo một sản phẩm mẫu với dữ liệu ngẫu nhiên để kiểm tra API hoạt động.
        Sử dụng nút bên dưới để thêm sản phẩm trực tiếp thông qua API.
      </p>
      
      <button
        type="button"
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={addSampleProduct}
        disabled={isLoading}
      >
        {isLoading ? 'Đang xử lý...' : 'Thêm sản phẩm mẫu'}
      </button>
      
      {result.message && (
        <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <div className="font-medium">{result.message}</div>
          {result.data && (
            <pre className="mt-2 text-xs overflow-auto max-h-60 bg-gray-100 p-2 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        <h3 className="font-medium text-gray-700 mb-2">Hướng dẫn khắc phục lỗi:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Kiểm tra console của trình duyệt (F12) để xem thông báo lỗi chi tiết</li>
          <li>Xác minh rằng API route <code>/api/products</code> hoạt động đúng</li>
          <li>Kiểm tra trạng thái response được trả về từ API</li>
          <li>Xác nhận rằng dữ liệu request và response có cấu trúc đúng</li>
        </ol>
      </div>
    </div>
  );
} 