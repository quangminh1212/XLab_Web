'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { useProducts } from '@/context/ProductContext';

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Hiển thị thông báo thành công
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Xử lý khi gửi form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError('');
    setSuccessMessage('');
    
    try {
      // Tạo form data từ form
      const formData = new FormData(event.currentTarget);
      
      // Xử lý giá trị từ form để đảm bảo kiểu dữ liệu chính xác
      const price = Number(formData.get('price')) || 0;
      const salePrice = Number(formData.get('salePrice')) || price;
      const name = (formData.get('name') as string || '').trim();
      const slug = (formData.get('slug') as string || '').trim() || 
                   name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      const categoryId = formData.get('categoryId') as string;
      
      // Kiểm tra dữ liệu đầu vào
      if (!name) {
        throw new Error('Tên sản phẩm không được để trống');
      }
      
      if (!categoryId) {
        throw new Error('Vui lòng chọn danh mục cho sản phẩm');
      }
      
      if (price <= 0) {
        throw new Error('Giá sản phẩm phải lớn hơn 0');
      }
      
      // Tạo đối tượng sản phẩm
      const productData = {
        // ID sẽ được tạo bởi API khi thêm mới, hoặc giữ nguyên khi cập nhật
        id: isEditing && currentProduct ? String(currentProduct.id) : undefined, 
        name,
        slug,
        description: (formData.get('description') as string || '').trim(),
        longDescription: (formData.get('longDescription') as string || '').trim(),
        price,
        salePrice,
        categoryId,
        imageUrl: (formData.get('imageUrl') as string || '').trim() || '/images/placeholder-product.jpg',
        version: (formData.get('version') as string || '').trim() || '1.0.0',
        size: (formData.get('size') as string || '').trim() || '0MB',
        licenseType: (formData.get('licenseType') as string) || 'Thương mại',
        isFeatured: formData.get('isFeatured') === 'on',
        isNew: formData.get('isNew') === 'on',
        // storeId nên được lấy từ user session hoặc form nếu cần
        storeId: currentProduct?.storeId || '1', 
        downloadCount: currentProduct?.downloadCount || 0,
        viewCount: currentProduct?.viewCount || 0,
        rating: currentProduct?.rating || 0,
        createdAt: currentProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Omit<Product, 'id'> & { id?: string }; // Cho phép id là optional khi tạo mới
      
      console.log("Submitting product data:", productData);
      
      try {
        if (isEditing && currentProduct) {
          // Đảm bảo id tồn tại khi chỉnh sửa
          const updateData = { ...productData, id: String(currentProduct.id) } as Product;
          await updateProduct(updateData); // Gọi hàm từ context
          showSuccess('Sản phẩm đã được cập nhật thành công!');
        } else {
          // Tạo product mới không bao gồm id client-side
          const createData = { ...productData };
          delete createData.id; // Xóa id tạm nếu có
          
          // API sẽ tạo ID, nên truyền dữ liệu không có ID
          // Chú ý: Cần đảm bảo kiểu Product có thể nhận dữ liệu thiếu id khi tạo
          // Hoặc điều chỉnh API/Context để xử lý việc này
          await addProduct(createData as any); // Gọi hàm từ context (cần xem lại kiểu dữ liệu)
          showSuccess('Sản phẩm mới đã được thêm thành công!');
        }
        
        // Reset form
        resetForm();
      } catch (contextError: any) {
        console.error("Context operation error:", contextError);
        setFormError(contextError.message || 'Đã xảy ra lỗi khi xử lý sản phẩm, vui lòng thử lại');
      }
    } catch (error: any) {
      console.error("Error preparing product data:", error);
      setFormError(error.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id: string | number, event?: React.MouseEvent) => {
    // Ngăn chặn event bubbling nếu có event
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log("Attempting to delete product with ID:", id);
    
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setIsLoading(true);
      setFormError('');
      setSuccessMessage('');
      
      try {
        // Chuyển đổi id thành string để đảm bảo việc so sánh chính xác
        const productId = String(id);
        
        await deleteProduct(productId); // Gọi hàm từ context
        
        console.log("Product deleted successfully:", id);
        showSuccess('Sản phẩm đã được xóa thành công!');
      } catch (contextError: any) {
        console.error("Error deleting product via context:", contextError);
        setFormError(contextError.message || 'Đã xảy ra lỗi khi xóa sản phẩm');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Xử lý sửa sản phẩm
  const handleEdit = (product: Product, event?: React.MouseEvent) => {
    // Ngăn chặn event bubbling nếu có event
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log("Editing product:", product);
    
    try {
      // Tạo bản sao sâu của product để tránh thay đổi trực tiếp vào state
      const productCopy = JSON.parse(JSON.stringify(product));
      console.log("Product copy to edit:", productCopy);
      
      setIsEditing(true);
      setCurrentProduct(productCopy);
      setShowForm(true);
      
      // Đảm bảo UI được cập nhật trước khi scroll
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      console.error("Error in edit handling:", error);
      alert(error.message || 'Đã xảy ra lỗi khi chuẩn bị chỉnh sửa sản phẩm');
    }
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentProduct(null);
    setFormError('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-primary-800 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Quản lý sản phẩm</h1>
          <p className="text-xl max-w-3xl">
            Thêm, chỉnh sửa và xóa sản phẩm trên XLab
          </p>
        </div>
      </section>

      {/* Admin Dashboard */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
                <p className="text-gray-500 mt-1">Tổng số: {products.length} sản phẩm</p>
              </div>
              <div className="flex space-x-4">
                <Link href="/admin" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Quay lại
                </Link>
                <button 
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentProduct(null);
                    setShowForm(!showForm);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {showForm ? 'Đóng form' : 'Thêm sản phẩm mới'}
                </button>
              </div>
            </div>
            
            {/* Thông báo lỗi và thành công toàn cục */}
            {formError && !showForm && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{formError}</span>
                </div>
                <button 
                  onClick={() => setFormError('')}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{successMessage}</span>
                </div>
                <button 
                  onClick={() => setSuccessMessage('')}
                  className="text-green-500 hover:text-green-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Form thêm/sửa sản phẩm */}
            {showForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                
                {formError && showForm && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{formError}</span>
                    </div>
                    <button 
                      onClick={() => setFormError('')}
                      className="text-red-500 hover:text-red-700"
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="product-name" className="block mb-2 font-medium text-gray-700">
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-name"
                        name="name"
                        defaultValue={currentProduct?.name || ''}
                        placeholder="Ví dụ: XLab Office Suite"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-slug" className="block mb-2 font-medium text-gray-700">
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-slug"
                        name="slug"
                        defaultValue={currentProduct?.slug || ''}
                        placeholder="Ví dụ: xlab-office-suite"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-category" className="block mb-2 font-medium text-gray-700">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="product-category"
                        name="categoryId"
                        defaultValue={currentProduct?.categoryId || ''}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
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
                      <label htmlFor="product-price" className="block mb-2 font-medium text-gray-700">
                        Giá (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="product-price"
                        name="price"
                        defaultValue={currentProduct?.price || ''}
                        placeholder="Ví dụ: 1200000"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-sale-price" className="block mb-2 font-medium text-gray-700">
                        Giá khuyến mãi (VNĐ)
                      </label>
                      <input
                        type="number"
                        id="product-sale-price"
                        name="salePrice"
                        defaultValue={currentProduct?.salePrice || ''}
                        placeholder="Để trống nếu không có khuyến mãi"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-version" className="block mb-2 font-medium text-gray-700">
                        Phiên bản <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-version"
                        name="version"
                        defaultValue={currentProduct?.version || ''}
                        placeholder="Ví dụ: 1.0.0"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-image-url" className="block mb-2 font-medium text-gray-700">
                        URL hình ảnh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-image-url"
                        name="imageUrl"
                        defaultValue={currentProduct?.imageUrl || ''}
                        placeholder="/images/placeholder-product.jpg"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-size" className="block mb-2 font-medium text-gray-700">
                        Dung lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-size"
                        name="size"
                        defaultValue={currentProduct?.size || ''}
                        placeholder="Ví dụ: 50MB"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-license" className="block mb-2 font-medium text-gray-700">
                        Loại giấy phép <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="product-license"
                        name="licenseType"
                        defaultValue={currentProduct?.licenseType || ''}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      >
                        <option value="">-- Chọn loại giấy phép --</option>
                        <option value="Thương mại">Thương mại</option>
                        <option value="Cá nhân">Cá nhân</option>
                        <option value="Doanh nghiệp">Doanh nghiệp</option>
                        <option value="Doanh nghiệp lớn">Doanh nghiệp lớn</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="product-description" className="block mb-2 font-medium text-gray-700">
                        Mô tả ngắn <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="product-description"
                        name="description"
                        rows={3}
                        defaultValue={currentProduct?.description || ''}
                        placeholder="Mô tả ngắn gọn về sản phẩm của bạn"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="product-long-description" className="block mb-2 font-medium text-gray-700">
                        Mô tả chi tiết <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="product-long-description"
                        name="longDescription"
                        rows={6}
                        defaultValue={currentProduct?.longDescription || ''}
                        placeholder="Mô tả chi tiết về tính năng, lợi ích của sản phẩm"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="md:col-span-2 flex space-x-6">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="product-featured" 
                          name="isFeatured" 
                          className="mr-2 h-4 w-4" 
                          defaultChecked={currentProduct?.isFeatured || false}
                        />
                        <label htmlFor="product-featured" className="text-gray-700">
                          Đánh dấu là sản phẩm nổi bật
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="product-new" 
                          name="isNew" 
                          className="mr-2 h-4 w-4" 
                          defaultChecked={currentProduct?.isNew || false}
                        />
                        <label htmlFor="product-new" className="text-gray-700">
                          Đánh dấu là sản phẩm mới
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <button 
                      type="button" 
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={resetForm}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Danh sách sản phẩm */}
            {!showForm && (
              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
                    <p className="text-gray-500 mb-4">Chưa có sản phẩm nào trong hệ thống</p>
                    <button 
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center"
                      onClick={() => {
                        setIsEditing(false);
                        setCurrentProduct(null);
                        setShowForm(true);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Thêm sản phẩm đầu tiên
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map(product => {
                        const category = categories.find(c => c.id === product.categoryId);
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-3">
                                  <Image
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={product.imageUrl || '/images/placeholder-product.jpg'}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">Phiên bản: {product.version}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{category?.name || 'Không có danh mục'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.salePrice < product.price ? (
                                <div>
                                  <div className="text-sm text-gray-900">{formatCurrency(product.salePrice)}</div>
                                  <div className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.isNew ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Mới
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Có sẵn
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  type="button"
                                  className="text-primary-600 hover:text-primary-900 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={(e) => handleEdit(product, e)}
                                  disabled={isLoading}
                                >
                                  Sửa
                                </button>
                                <button 
                                  type="button"
                                  className="text-red-600 hover:text-red-900 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={(e) => handleDelete(product.id, e)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <span className="flex items-center">
                                      <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Đang xóa...
                                    </span>
                                  ) : (
                                    'Xóa'
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )})}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 