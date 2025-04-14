'use client';

import { useState, useEffect } from 'react';
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
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Xử lý khi gửi form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError('');
    
    // Tạo form data từ form
    const formData = new FormData(event.currentTarget);
    const productData = {
      id: isEditing && currentProduct ? currentProduct.id : `prod-${Date.now()}`,
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || formData.get('name') as string,
      description: formData.get('description') as string,
      longDescription: formData.get('longDescription') as string,
      price: Number(formData.get('price')),
      salePrice: Number(formData.get('salePrice')) || Number(formData.get('price')),
      categoryId: formData.get('categoryId') as string,
      imageUrl: formData.get('imageUrl') as string || '/images/placeholder-product.jpg',
      version: formData.get('version') as string || '1.0.0',
      size: formData.get('size') as string || '0MB',
      licenseType: formData.get('licenseType') as string || 'Thương mại',
      isFeatured: formData.get('isFeatured') === 'on',
      isNew: formData.get('isNew') === 'on',
      storeId: '1', // Mặc định sử dụng storeId là 1
      downloadCount: currentProduct?.downloadCount || 0,
      viewCount: currentProduct?.viewCount || 0,
      rating: currentProduct?.rating || 0,
      createdAt: currentProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Product;
    
    try {
      if (isEditing && currentProduct) {
        // Cập nhật sản phẩm qua context
        updateProduct(productData);
        alert('Đã cập nhật sản phẩm thành công!');
      } else {
        // Thêm sản phẩm mới qua context
        addProduct(productData);
        alert('Đã thêm sản phẩm thành công!');
      }
      
      // Reset form
      resetForm();
    } catch (error: any) {
      setFormError(error.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id: string | number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Xóa sản phẩm qua context
      deleteProduct(id);
      alert('Đã xóa sản phẩm thành công!');
    } catch (error: any) {
      alert(error.message || 'Đã xảy ra lỗi khi xóa sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý sửa sản phẩm
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            
            {/* Form thêm/sửa sản phẩm */}
            {showForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {formError}
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
            {isLoading ? (
              <div className="flex justify-center py-10">
                <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Danh mục
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map(product => {
                        const category = categories.find(c => c.id === product.categoryId);
                        return (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 relative">
                                  <Image
                                    src={product.imageUrl || '/images/placeholder-product.jpg'}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/images/placeholder-product.jpg';
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{category?.name || 'Chưa phân loại'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                              {product.salePrice && product.salePrice < product.price && (
                                <div className="text-sm text-green-600">{formatCurrency(product.salePrice)} (Giảm giá)</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.isNew ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Mới
                                </span>
                              ) : product.isFeatured ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Nổi bật
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Đang bán
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  className="text-primary-600 hover:text-primary-900"
                                  onClick={() => handleEdit(product)}
                                >
                                  Sửa
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  Xóa
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