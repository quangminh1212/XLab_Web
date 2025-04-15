'use client';

import { useState, useEffect } from 'react';
import { categories } from '@/data/mockData';
import { Product } from '@/types';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Lấy danh sách sản phẩm từ API khi component được tải
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      // Thêm tham số timestamp để tránh cache
      const timestamp = new Date().getTime();
      console.log(`Đang tải danh sách sản phẩm với timestamp: ${timestamp}`);
      
      const response = await fetch(`/api/products?t=${timestamp}`);
      
      console.log('Phản hồi từ API GET:', response.status);
      
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu sản phẩm');
      }
      
      const data = await response.json();
      console.log(`Đã tải ${data.length} sản phẩm từ API`);
      
      setProducts(data);
      setLoadingProducts(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      setErrorMessage('Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau.');
      setLoadingProducts(false);
    }
  };
  
  // Tải danh sách sản phẩm khi component được tải
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Xử lý khi gửi form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Lấy form data từ form
      const formEl = event.currentTarget;
      const nameInput = formEl.querySelector('input[name="name"]') as HTMLInputElement;
      const slugInput = formEl.querySelector('input[name="slug"]') as HTMLInputElement;
      const categoryInput = formEl.querySelector('select[name="categoryId"]') as HTMLSelectElement;
      const priceInput = formEl.querySelector('input[name="price"]') as HTMLInputElement;
      const descriptionInput = formEl.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
      
      if (!nameInput || !slugInput || !categoryInput || !priceInput || !descriptionInput) {
        throw new Error('Thiếu thông tin các trường dữ liệu');
      }
      
      const productData = {
        id: `prod-${Date.now()}`, // Tạo ID tạm thời
        name: nameInput.value,
        slug: slugInput.value,
        description: descriptionInput.value,
        longDescription: descriptionInput.value,
        price: Number(priceInput.value) || 0,
        salePrice: 0,
        categoryId: categoryInput.value,
        imageUrl: '/images/products/placeholder-product.jpg',
        isFeatured: true, // Đặt mặc định là true để hiển thị ở mục "Phần mềm nổi bật"
        isNew: true,
        downloadCount: 0,
        viewCount: 0,
        rating: 0,
        version: '1.0',
        size: '10MB',
        licenseType: 'Standard',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        storeId: '1'
      };
      
      // In ra log toàn bộ dữ liệu sản phẩm để kiểm tra
      console.log('Dữ liệu sản phẩm chuẩn bị gửi:', JSON.stringify(productData, null, 2));
      
      // Kiểm tra dữ liệu bắt buộc
      if (!productData.name || !productData.slug || !productData.categoryId || !productData.price) {
        throw new Error('Vui lòng điền đầy đủ tất cả các trường bắt buộc');
      }
      
      // Gửi API request để thêm sản phẩm
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        cache: 'no-store'
      });
      
      console.log('Phản hồi từ API POST:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lỗi từ API:', errorText);
        throw new Error(`Lỗi khi thêm sản phẩm: ${response.status} - ${errorText}`);
      }
      
      // Đọc dữ liệu phản hồi
      const data = await response.json();
      
      // Thêm sản phẩm thành công
      console.log('Sản phẩm đã được thêm thành công:', data);
      
      // Lưu sản phẩm vừa thêm
      setLastAddedProduct(data);
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Sản phẩm "${data.name}" đã được thêm thành công!`);
      
      // Lấy lại danh sách sản phẩm mới nhất từ server
      fetchProducts();
      
      // Reset form
      formEl.reset();
      
    } catch (error: any) {
      console.error('Lỗi khi đăng sản phẩm:', error);
      setErrorMessage('Đã xảy ra lỗi khi thêm sản phẩm: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý sản phẩm</h1>
      
      {/* Hiển thị thông báo lỗi */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center" role="alert">
          <div className="flex-shrink-0 mr-2">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">{errorMessage}</p>
          </div>
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setErrorMessage('')}
          >
            <svg className="h-4 w-4 text-red-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center" role="alert">
          <div className="flex-shrink-0 mr-2">
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">{successMessage}</p>
            {lastAddedProduct && (
              <p className="text-sm">
                ID: {lastAddedProduct.id} | Giá: {formatCurrency(lastAddedProduct.price)}
              </p>
            )}
          </div>
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setSuccessMessage('')}
          >
            <svg className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        
        <form onSubmit={handleSubmit} method="POST">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Tên phần mềm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ví dụ: XLab Office Suite"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                placeholder="Ví dụ: xlab-office-suite"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                className="w-full border rounded-md px-4 py-2"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="Ví dụ: 1200000"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Mô tả sản phẩm của bạn"
                className="w-full border rounded-md px-4 py-2"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex items-center space-x-4">
            <button 
              type="submit" 
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
              disabled={isLoading}
            >
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              )}
              {isLoading ? 'Đang xử lý...' : 'Đăng sản phẩm'}
            </button>
            
            <div className="text-sm text-gray-500">
              Sản phẩm sẽ được hiển thị ngay trong danh sách bên dưới
            </div>
          </div>
        </form>
      </div>
      
      {/* Danh sách sản phẩm đã đăng */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sản phẩm đã đăng ({products.length})</h2>
          
          <button 
            onClick={fetchProducts}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center hover:bg-blue-100"
            disabled={loadingProducts}
          >
            {loadingProducts ? (
              <span className="flex items-center">
                <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full mr-1"></div>
                Đang làm mới...
              </span>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới danh sách
              </span>
            )}
          </button>
        </div>
        
        {loadingProducts ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Đang tải danh sách sản phẩm...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className={lastAddedProduct && product.id === lastAddedProduct.id ? "bg-green-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(product.categoryId.toString())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                      {product.salePrice > 0 && (
                        <div className="text-sm text-gray-500">{formatCurrency(product.salePrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lastAddedProduct && product.id === lastAddedProduct.id ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Mới thêm
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Đang bán
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-500 mb-1">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500">Sử dụng form bên trên để thêm sản phẩm mới</p>
          </div>
        )}
      </div>
      
      {products.length > 0 && (
        <div className="text-center bg-blue-50 rounded-lg p-4 text-blue-700 mb-8">
          <p className="font-medium mb-2">Đã tìm thấy {products.length} sản phẩm trong hệ thống</p>
          <p className="text-sm">Các sản phẩm đã được lưu vĩnh viễn và sẽ không bị mất khi làm mới trang</p>
        </div>
      )}
      
      <div className="text-center text-gray-500 py-4">
        <p className="mb-2">Lưu ý: Sản phẩm sẽ được lưu vào hệ thống ngay sau khi đăng thành công.</p>
        <p className="mb-2">Nếu bạn muốn xem sản phẩm trên trang chủ, hãy click vào link bên dưới và nhấn "Làm mới dữ liệu".</p>
        <p>
          <a href="/" className="text-blue-500 hover:underline flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ để xem sản phẩm
          </a>
        </p>
      </div>
    </div>
  );
} 