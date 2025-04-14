'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { useProducts } from '@/context/ProductContext';
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck, FiSearch } from 'react-icons/fi';

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    price: 0,
    salePrice: 0,
    categoryId: '',
    imageUrl: '/images/placeholder-product.jpg',
    isFeatured: false,
    isNew: false,
    version: '1.0.0',
    size: '0MB',
    licenseType: 'Thương mại',
    storeId: '1'
  });
  
  // Reset form when closing
  useEffect(() => {
    if (!showAddForm && !showEditForm) {
      setFormData({
        name: '',
        slug: '',
        description: '',
        longDescription: '',
        price: 0,
        salePrice: 0,
        categoryId: '',
        imageUrl: '/images/placeholder-product.jpg',
        isFeatured: false,
        isNew: false,
        version: '1.0.0',
        size: '0MB',
        licenseType: 'Thương mại',
        storeId: '1'
      });
    }
  }, [showAddForm, showEditForm]);
  
  // If editing, populate form with product data
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        slug: editingProduct.slug,
        description: editingProduct.description,
        longDescription: editingProduct.longDescription,
        price: editingProduct.price,
        salePrice: editingProduct.salePrice || 0,
        categoryId: editingProduct.categoryId.toString(),
        imageUrl: editingProduct.imageUrl,
        isFeatured: editingProduct.isFeatured,
        isNew: editingProduct.isNew,
        version: editingProduct.version,
        size: editingProduct.size,
        licenseType: editingProduct.licenseType,
        storeId: editingProduct.storeId.toString()
      });
    }
  }, [editingProduct]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Auto-generate slug from name if slug field is empty
    if (name === 'name' && (!formData.slug || formData.slug === '')) {
      const slugValue = value.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug: slugValue }));
    }
  };
  
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.name || !formData.categoryId || formData.price <= 0) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc: Tên, Danh mục, Giá');
        return;
      }
      
      // No need to add downloadCount, viewCount, rating as they're handled in context
      addProduct(formData);
      setShowAddForm(false);
      alert('Thêm sản phẩm thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại sau.');
    }
  };
  
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    try {
      // Basic validation
      if (!formData.name || !formData.categoryId || formData.price <= 0) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc: Tên, Danh mục, Giá');
        return;
      }
      
      updateProduct(editingProduct.id, formData);
      setShowEditForm(false);
      setEditingProduct(null);
      alert('Cập nhật sản phẩm thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      alert('Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại sau.');
    }
  };
  
  const handleDeleteProduct = (productId: string | number) => {
    if (confirmDelete !== productId) {
      setConfirmDelete(productId.toString());
      return;
    }
    
    try {
      deleteProduct(productId);
      setConfirmDelete(null);
      alert('Xóa sản phẩm thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau.');
    }
  };
  
  const cancelDelete = () => {
    setConfirmDelete(null);
  };
  
  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };
  
  // Filter products by search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> Thêm sản phẩm mới
        </button>
      </div>
      
      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Product list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
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
                  Phiên bản
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tính năng
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={product.imageUrl || "/images/placeholder-product.jpg"}
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.categoryId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                      {product.salePrice && product.salePrice > 0 && (
                        <div className="text-sm text-gray-500">{formatCurrency(product.salePrice)} (Khuyến mãi)</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {product.isFeatured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Nổi bật
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Mới
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {confirmDelete === product.id.toString() ? (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-red-500 text-xs">Xác nhận xóa?</span>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm Sản Phẩm Mới</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
                    Giá khuyến mãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    <option value="cat-1">Bảo mật</option>
                    <option value="cat-2">Văn phòng</option>
                    <option value="cat-3">Tiện ích</option>
                    <option value="cat-4">Đa phương tiện</option>
                    <option value="cat-5">Phát triển</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                    Phiên bản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Kích thước
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700">
                    Loại giấy phép
                  </label>
                  <input
                    type="text"
                    id="licenseType"
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    URL Hình ảnh
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tính năng
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isFeatured"
                          name="isFeatured"
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isFeatured" className="font-medium text-gray-700">Sản phẩm nổi bật</label>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isNew"
                          name="isNew"
                          type="checkbox"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isNew" className="font-medium text-gray-700">Sản phẩm mới</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">
                  Mô tả chi tiết
                </label>
                <textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Thêm sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chỉnh sửa: {editingProduct.name}</h2>
              <button 
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-slug" className="block text-sm font-medium text-gray-700">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-salePrice" className="block text-sm font-medium text-gray-700">
                    Giá khuyến mãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    id="edit-salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-categoryId" className="block text-sm font-medium text-gray-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    <option value="cat-1">Bảo mật</option>
                    <option value="cat-2">Văn phòng</option>
                    <option value="cat-3">Tiện ích</option>
                    <option value="cat-4">Đa phương tiện</option>
                    <option value="cat-5">Phát triển</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-version" className="block text-sm font-medium text-gray-700">
                    Phiên bản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-version"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-size" className="block text-sm font-medium text-gray-700">
                    Kích thước
                  </label>
                  <input
                    type="text"
                    id="edit-size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-licenseType" className="block text-sm font-medium text-gray-700">
                    Loại giấy phép
                  </label>
                  <input
                    type="text"
                    id="edit-licenseType"
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-gray-700">
                    URL Hình ảnh
                  </label>
                  <input
                    type="text"
                    id="edit-imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tính năng
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="edit-isFeatured"
                          name="isFeatured"
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="edit-isFeatured" className="font-medium text-gray-700">Sản phẩm nổi bật</label>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="edit-isNew"
                          name="isNew"
                          type="checkbox"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="edit-isNew" className="font-medium text-gray-700">Sản phẩm mới</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-longDescription" className="block text-sm font-medium text-gray-700">
                  Mô tả chi tiết
                </label>
                <textarea
                  id="edit-longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 