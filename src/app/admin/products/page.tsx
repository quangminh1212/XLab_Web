'use client';

import React, { useState, useEffect, useContext, useReducer } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { useProducts } from '@/context/ProductContext';
import { FiPlus, FiEdit, FiTrash2, FiInfo, FiFilter } from 'react-icons/fi';
import { createPortal } from 'react-dom';

// Định nghĩa interface cho ProductFormProps
interface ProductFormProps {
  isEditing: boolean;
  currentProduct: Product | null;
  categories: Category[];
  isLoading: boolean;
  formError: {
    name?: string;
    slug?: string;
    categoryId?: string;
    price?: string;
    salePrice?: string;
    version?: string;
    imageUrl?: string;
    size?: string;
    license?: string;
    shortDescription?: string;
    longDescription?: string;
    category?: string;
    [key: string]: string | undefined; // Cho phép truy cập dynamic các field error
  };
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  setFormError: React.Dispatch<React.SetStateAction<any>>;
}

// Component ProductForm
const ProductForm = ({
  isEditing,
  currentProduct,
  categories,
  isLoading,
  formError,
  onSubmit,
  onCancel,
  setFormError
}: ProductFormProps) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setModalRoot(document.getElementById('modal-root'));
    }
  }, []);
  
  if (!modalRoot) return null;
  
  const handleFieldUpdate = (fieldName: string, value: any) => {
    const updatedProduct = { ...currentProduct } as any;
    updatedProduct[fieldName] = value;
    // Cập nhật product
  };
  
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên sản phẩm */}
            <div className="col-span-2">
              <label htmlFor="name" className="block mb-1 font-medium">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full p-2 border rounded ${formError.name ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.name || ''}
                required
              />
              {formError.name && (
                <p className="text-red-500 text-sm mt-1">{formError.name}</p>
              )}
            </div>
            
            {/* Slug */}
            <div className="col-span-2">
              <label htmlFor="slug" className="block mb-1 font-medium">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                className={`w-full p-2 border rounded ${formError.slug ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.slug || ''}
                required
              />
              {formError.slug && (
                <p className="text-red-500 text-sm mt-1">{formError.slug}</p>
              )}
            </div>
            
            {/* Danh mục */}
            <div>
              <label htmlFor="category" className="block mb-1 font-medium">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                className={`w-full p-2 border rounded ${formError.category ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.categoryId || ''}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formError.category && (
                <p className="text-red-500 text-sm mt-1">{formError.category}</p>
              )}
            </div>
            
            {/* Giá */}
            <div>
              <label htmlFor="price" className="block mb-1 font-medium">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className={`w-full p-2 border rounded ${formError.price ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.price || ''}
                min="0"
                required
              />
              {formError.price && (
                <p className="text-red-500 text-sm mt-1">{formError.price}</p>
              )}
            </div>
            
            {/* Giá khuyến mãi */}
            <div>
              <label htmlFor="salePrice" className="block mb-1 font-medium">
                Giá khuyến mãi (VNĐ)
              </label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                className={`w-full p-2 border rounded ${formError.salePrice ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.salePrice || ''}
                min="0"
              />
              {formError.salePrice && (
                <p className="text-red-500 text-sm mt-1">{formError.salePrice}</p>
              )}
            </div>
            
            {/* Phiên bản */}
            <div>
              <label htmlFor="version" className="block mb-1 font-medium">
                Phiên bản
              </label>
              <input
                type="text"
                id="version"
                name="version"
                className={`w-full p-2 border rounded ${formError.version ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.version || ''}
              />
              {formError.version && (
                <p className="text-red-500 text-sm mt-1">{formError.version}</p>
              )}
            </div>
            
            {/* URL hình ảnh */}
            <div className="col-span-2">
              <label htmlFor="imageUrl" className="block mb-1 font-medium">
                URL hình ảnh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                className={`w-full p-2 border rounded ${formError.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.imageUrl || ''}
                required
              />
              {formError.imageUrl && (
                <p className="text-red-500 text-sm mt-1">{formError.imageUrl}</p>
              )}
            </div>
            
            {/* Kích cỡ */}
            <div>
              <label htmlFor="size" className="block mb-1 font-medium">
                Kích cỡ
              </label>
              <input
                type="text"
                id="size"
                name="size"
                className={`w-full p-2 border rounded ${formError.size ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.size || ''}
              />
              {formError.size && (
                <p className="text-red-500 text-sm mt-1">{formError.size}</p>
              )}
            </div>
            
            {/* Loại giấy phép */}
            <div>
              <label htmlFor="licenseType" className="block mb-1 font-medium">
                Loại giấy phép
              </label>
              <input
                type="text"
                id="licenseType"
                name="licenseType"
                className={`w-full p-2 border rounded ${formError.license ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.licenseType || ''}
              />
              {formError.license && (
                <p className="text-red-500 text-sm mt-1">{formError.license}</p>
              )}
            </div>
            
            {/* Mô tả ngắn */}
            <div className="col-span-2">
              <label htmlFor="shortDescription" className="block mb-1 font-medium">
                Mô tả ngắn <span className="text-red-500">*</span>
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={3}
                className={`w-full p-2 border rounded ${formError.shortDescription ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.description || ''}
                required
              ></textarea>
              {formError.shortDescription && (
                <p className="text-red-500 text-sm mt-1">{formError.shortDescription}</p>
              )}
            </div>
            
            {/* Mô tả chi tiết */}
            <div className="col-span-2">
              <label htmlFor="longDescription" className="block mb-1 font-medium">
                Mô tả chi tiết
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                rows={5}
                className={`w-full p-2 border rounded ${formError.longDescription ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={currentProduct?.longDescription || ''}
              ></textarea>
              {formError.longDescription && (
                <p className="text-red-500 text-sm mt-1">{formError.longDescription}</p>
              )}
            </div>
            
            {/* Sản phẩm nổi bật */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  className="w-4 h-4 mr-2"
                  defaultChecked={currentProduct?.isFeatured || false}
                />
                <label htmlFor="isFeatured" className="font-medium">
                  Sản phẩm nổi bật
                </label>
              </div>
            </div>
            
            {/* Sản phẩm mới */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNew"
                  name="isNew"
                  className="w-4 h-4 mr-2"
                  defaultChecked={currentProduct?.isNew || false}
                />
                <label htmlFor="isNew" className="font-medium">
                  Sản phẩm mới
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              disabled={isLoading}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    modalRoot
  );
};

// Đây là modal form thêm sản phẩm trực tiếp mà không sử dụng component ProductForm
export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, setProducts } = useProducts();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // State lưu trữ danh sách sản phẩm đã được lọc và sắp xếp
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // State cho modal xem chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Sử dụng state nhưng kết hợp với localStorage
  const [clickCount, setClickCount] = useState<number>(() => {
    // Khởi tạo từ localStorage nếu chạy ở client-side
    if (typeof window !== 'undefined') {
      const savedCount = localStorage.getItem('clickCount');
      return savedCount ? parseInt(savedCount, 10) : 0;
    }
    return 0;
  });
  
  // Hàm cập nhật clickCount kết hợp với localStorage
  const incrementClickCount = () => {
    // Sử dụng biến đếm độc lập với React state
    const currentCount = localStorage.getItem('clickCount') 
      ? parseInt(localStorage.getItem('clickCount')!, 10) 
      : 0;
      
    const newCount = currentCount + 1;
    
    // Lưu vào localStorage
    localStorage.setItem('clickCount', newCount.toString());
    console.log(`[STORAGE] Saved count ${currentCount} -> ${newCount}`);
    
    // Cập nhật DOM trực tiếp
    const elements = document.querySelectorAll('.text-red-600');
    elements.forEach(el => {
      el.textContent = String(newCount);
    });
    
    // Cập nhật React state
    setClickCount(newCount);
    
    document.title = `Count: ${newCount}`;
  };
  
  const resetClickCount = () => {
    // Reset trong localStorage
    localStorage.setItem('clickCount', '0');
    
    // Reset trong DOM
    const elements = document.querySelectorAll('.text-red-600');
    elements.forEach(el => {
      el.textContent = '0';
    });
    
    // Reset state
    setClickCount(0);
  };
  
  // Effect để đồng bộ lại giá trị khi component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem('clickCount');
      if (storedCount) {
        const parsedCount = parseInt(storedCount, 10);
        if (parsedCount !== clickCount) {
          setClickCount(parsedCount);
          
          // Cập nhật cả DOM
          const elements = document.querySelectorAll('.text-red-600');
          elements.forEach(el => {
            el.textContent = storedCount;
          });
        }
      }
    }
  }, []);
  
  // Effect để theo dõi thay đổi localStorage từ các cửa sổ khác
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'clickCount' && e.newValue) {
          const newCount = parseInt(e.newValue, 10);
          console.log(`Storage changed externally: ${e.oldValue} -> ${e.newValue}`);
          
          // Cập nhật React state
          setClickCount(newCount);
          
          // Cập nhật DOM
          const elements = document.querySelectorAll('.text-red-600');
          elements.forEach(el => {
            el.textContent = e.newValue!;
          });
        }
      };
      
      // Thêm listener
      window.addEventListener('storage', handleStorageChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);
  
  // Thêm state để debug showForm
  const [isDebug, setIsDebug] = useState(true);
  
  // Log khi state showForm thay đổi
  useEffect(() => {
    console.log('showForm state changed to:', showForm);
  }, [showForm]);
  
  // Thêm useEffect để debug showForm
  useEffect(() => {
    if (isDebug) {
      console.log('showForm changed:', showForm);
    }
  }, [showForm, isDebug]);
  
  // Thêm useEffect để log khi clickCount thay đổi
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] clickCount changed:`, clickCount);
    
    // Kiểm tra DOM có được cập nhật không
    const debugElement = document.querySelector('.text-red-600');
    if (debugElement) {
      console.log(`DOM element contains: ${debugElement.textContent}`);
    } else {
      console.log('Debug element not found in DOM');
    }
    
    // Ghi vào document.title để dễ theo dõi
    document.title = `clickCount: ${clickCount}`;
  }, [clickCount]);
  
  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    let result = [...products];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.version.toLowerCase().includes(term)
      );
    }
    
    // Lọc theo danh mục
    if (filterCategory) {
      result = result.filter(product => product.categoryId === filterCategory);
    }
    
    // Sắp xếp
    result.sort((a, b) => {
      let valueA: any = a[sortBy as keyof Product];
      let valueB: any = b[sortBy as keyof Product];
      
      // Xử lý các trường hợp đặc biệt
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      // Kiểm tra undefined
      if (valueA === undefined) return sortOrder === 'asc' ? -1 : 1;
      if (valueB === undefined) return sortOrder === 'asc' ? 1 : -1;
      
      // So sánh và trả về kết quả tùy theo thứ tự sắp xếp
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, filterCategory, sortBy, sortOrder]);
  
  // Khởi tạo dữ liệu ban đầu
  useEffect(() => {
    console.log('Admin Products Page Loaded');
    // Tự động hiển thị form khi không có sản phẩm nào
    if (products && products.length === 0) {
      console.log('No products found, auto showing form');
      setShowForm(true);
    }
  }, [products]);
  
  // Hiển thị thông báo thành công
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Hiển thị thông báo thành công và cập nhật UI thay vì reload trang
  const showSuccessAndReset = (message: string, shouldResetForm = true) => {
    showSuccess(message);
    if (shouldResetForm) {
      resetForm();
    }
  };
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Phương thức reset form và đóng form
  const resetForm = () => {
    console.log('Resetting form and closing modal');
    setShowForm(false);
    setIsEditing(false);
    setCurrentProduct(null);
    setFormError({});
    setSuccessMessage('');
  };
  
  // Xử lý xem chi tiết sản phẩm
  const handleViewDetail = (product: Product, event?: React.MouseEvent) => {
    // Ngăn chặn event bubbling nếu có event
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedProduct(product);
    setShowDetailModal(true);
  };
  
  // Đóng modal chi tiết
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedProduct(null), 300); // Đợi animation đóng xong rồi mới reset state
  };
  
  // Xử lý khi gửi form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Form đã được submit');
    setIsLoading(true);
    setFormError({});
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
      const categoryId = formData.get('category') as string;
      
      // Kiểm tra dữ liệu đầu vào chi tiết hơn
      const errors = [];
      if (!name) errors.push('Tên sản phẩm không được để trống');
      if (!slug) errors.push('Slug không được để trống');
      if (!categoryId) errors.push('Vui lòng chọn danh mục cho sản phẩm');
      if (price <= 0) errors.push('Giá sản phẩm phải lớn hơn 0');
      if (salePrice > price) errors.push('Giá khuyến mãi không thể cao hơn giá gốc');
      
      // Kiểm tra slug đã tồn tại chưa (chỉ khi thêm mới hoặc slug khác với slug cũ)
      if (!isEditing || (currentProduct && slug !== currentProduct.slug)) {
        const existingProduct = products.find(p => p.slug === slug && (!isEditing || p.id !== currentProduct?.id));
        if (existingProduct) {
          errors.push(`Slug "${slug}" đã tồn tại, vui lòng chọn một slug khác`);
        }
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join('<br>'));
      }
      
      try {
        if (isEditing && currentProduct) {
          // Đảm bảo id tồn tại khi chỉnh sửa
          const updateData = { 
            ...currentProduct,
            name,
            slug,
            description: (formData.get('shortDescription') as string || '').trim(),
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
            updatedAt: new Date().toISOString()
          } as Product;
          
          console.log("[AdminProductsPage] Updating product:", updateData);
          await updateProduct(updateData); // Gọi hàm từ context
          showSuccessAndReset('Đã cập nhật sản phẩm thành công!');
        } else {
          // Tạo product mới không bao gồm id client-side
          const createData = { 
            name,
            slug,
            description: (formData.get('shortDescription') as string || '').trim(),
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
            storeId: '1', // Giá trị mặc định cho storeId
            downloadCount: 0, 
            viewCount: 0,
            rating: 0
          };
          
          console.log("[AdminProductsPage] Creating new product:", createData);
          
          try {
            const newProduct = await addProduct(createData);
            console.log("[AdminProductsPage] Product added successfully:", newProduct);
            showSuccessAndReset('Đã thêm sản phẩm mới thành công!');
          } catch (addError: any) {
            console.error("[AdminProductsPage] Error from addProduct:", addError);
            console.log("[AdminProductsPage] Trying direct API call as fallback...");
            
            // Thử gọi API trực tiếp nếu context thất bại
            try {
              const directResponse = await fetch('/api/products', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(createData)
              });
              
              console.log("[AdminProductsPage] Direct API call response status:", directResponse.status);
              
              const responseData = await directResponse.json();
              console.log("[AdminProductsPage] Direct API call response:", responseData);
              
              if (!directResponse.ok) {
                throw new Error(responseData.error || `Lỗi API: ${directResponse.status}`);
              }
              
              // Nếu thành công, cập nhật UI
              setProducts((prev: Product[]) => [...prev, responseData as Product]);
              showSuccessAndReset('Đã thêm sản phẩm mới thành công (trực tiếp từ API)!');
            } catch (directError: any) {
              console.error("[AdminProductsPage] Direct API call also failed:", directError);
              throw new Error(directError.message || addError.message || 'Lỗi khi thêm sản phẩm');
            }
          }
        }
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
    
    console.log("[AdminProductsPage] Attempting to delete product with ID:", id);
    
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setIsLoading(true);
      setFormError({});
      setSuccessMessage('');
      
      try {
        // Chuyển đổi id thành string để đảm bảo việc so sánh chính xác
        const productId = String(id);
        console.log("[AdminProductsPage] Calling deleteProduct from context with ID:", productId);
        
        // Lấy tên sản phẩm để hiển thị trong thông báo thành công
        const productToDelete = products.find(p => String(p.id) === productId);
        const productName = productToDelete?.name || 'Sản phẩm';
        
        await deleteProduct(productId); // Gọi hàm từ context
        
        console.log("[AdminProductsPage] Product deleted successfully via context, ID:", productId);
        showSuccess(`Đã xóa sản phẩm "${productName}" thành công!`);
      } catch (contextError: any) {
        console.error("[AdminProductsPage] Error calling deleteProduct from context:", contextError);
        setFormError(contextError.message || 'Đã xảy ra lỗi khi xóa sản phẩm');
      } finally {
        console.log("[AdminProductsPage] Finished delete attempt, resetting loading state.");
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
    
    console.log("[AdminProductsPage] handleEdit called for product:", product);
    
    try {
      // Tạo bản sao sâu của product để tránh thay đổi trực tiếp vào state
      const productCopy = JSON.parse(JSON.stringify(product));
      console.log("[AdminProductsPage] Product copy to edit:", productCopy);
      
      setIsEditing(true);
      setCurrentProduct(productCopy);
      setShowForm(true);
      setFormError({}); // Xóa lỗi cũ khi mở form sửa
      setSuccessMessage(''); // Xóa thông báo thành công cũ
      
      // Đảm bảo UI được cập nhật trước khi scroll
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      console.error("[AdminProductsPage] Error in handleEdit:", error);
      // Hiển thị lỗi ở form thay vì alert
      setFormError(error.message || 'Đã xảy ra lỗi khi chuẩn bị chỉnh sửa sản phẩm'); 
      setShowForm(true); // Vẫn hiển thị form để người dùng thấy lỗi
    }
  };
  
  // Hàm chung để xử lý việc thêm sản phẩm từ các nút khác nhau
  const handleAddProduct = (source: string) => {
    console.log(`Add product button clicked from: ${source}`);
    incrementClickCount();
    setIsEditing(false);
    setCurrentProduct(null);
    setFormError({});
    setShowForm(true);
    console.log("showForm set to:", true);
  };

  // Hàm xử lý khi nhấn nút thêm sản phẩm
  const handleAddProductClick = () => {
    handleAddProduct('main button');
  };
  
  // Thêm useEffect để tạo modal-root element nếu nó chưa tồn tại
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let modalRoot = document.getElementById('modal-root');
      if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* DEBUG INFO */}
      <div className="fixed top-0 right-0 bg-black bg-opacity-75 text-white p-2 z-[999999] font-mono">
        showForm: {showForm ? 'true' : 'false'}<br/>
        clickCount: <span className="font-bold text-red-600" id="click-counter">{clickCount}</span><br/>
        version: <span className="font-bold text-green-400">{Math.random().toString(36).substring(2, 8)}</span>
      </div>
      
      {/* Debug section */}
      {isDebug && (
        <div className="bg-yellow-100 p-4 mb-4 rounded-lg border border-yellow-400">
          <h3 className="font-bold">Debug Info:</h3>
          <p>showForm: {showForm ? 'true' : 'false'}</p>
          <p>clickCount: <span className="font-bold text-red-600">{clickCount}</span> (Timestamp: {new Date().toLocaleTimeString()})</p>
          <div className="flex gap-2 mt-2">
            <button 
              className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => setShowForm(true)}
            >
              Force Show Form
            </button>
            <button 
              className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => setShowForm(false)}
            >
              Force Hide Form
            </button>
            <button 
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => setIsDebug(false)}
            >
              Hide Debug
            </button>
            <button 
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => resetClickCount()}
            >
              Reset Clicks
            </button>
            <button 
              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => {
                console.log("CLICK TEST BUTTON");
                incrementClickCount();
              }}
            >
              Test Click +1
            </button>
            <button 
              className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm"
              id="direct-dom-update"
              onClick={() => {
                // Tăng giá trị trực tiếp trong localStorage
                const currentCount = localStorage.getItem('clickCount') 
                  ? parseInt(localStorage.getItem('clickCount')!, 10) 
                  : 0;
                
                const newCount = currentCount + 1;
                localStorage.setItem('clickCount', newCount.toString());
                
                // Cập nhật DOM
                const elements = document.querySelectorAll('.text-red-600');
                elements.forEach(el => {
                  el.textContent = String(newCount);
                });
                
                document.title = `DOM Only: ${newCount}`;
              }}
            >
              DOM Only
            </button>
            <button 
              className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => {
                const currentCount = localStorage.getItem('clickCount') || '0';
                alert(`Current localStorage count: ${currentCount}`);
                console.log('localStorage:', currentCount);
              }}
            >
              Show Storage
            </button>
          </div>
        </div>
      )}
      
      {/* Modal Form thêm/sửa sản phẩm */}
      {showForm && (
        <ProductForm
          isEditing={isEditing}
          currentProduct={currentProduct}
          categories={categories}
          isLoading={isLoading}
          formError={formError}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          setFormError={setFormError}
        />
      )}

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
                  onClick={() => {
                    // Tăng clickCount một cách đơn giản
                    incrementClickCount();
                    
                    // Xử lý chức năng thêm sản phẩm
                    setIsEditing(false);
                    setCurrentProduct(null);
                    setFormError({});
                    setShowForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 flex items-center"
                >
                  <FiPlus className="mr-2" /> Thêm sản phẩm mới
                </button>
              </div>
            </div>
            
            {/* Thông báo lỗi và thành công toàn cục */}
            {Object.keys(formError).length > 0 && !showForm && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
                <div className="flex items-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div dangerouslySetInnerHTML={{ __html: Object.values(formError).join('<br>') }} />
                </div>
                <button 
                  onClick={() => setFormError({})}
                  className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"
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
            
            {/* Danh sách sản phẩm */}
            {!showForm && (
              <div className="overflow-x-auto">
                {/* Bộ lọc và tìm kiếm */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-700">
                        Tìm kiếm
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                        </div>
                        <input
                          type="search"
                          id="search"
                          className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Tìm theo tên, mô tả, phiên bản..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="category-filter" className="block mb-2 text-sm font-medium text-gray-700">
                        Lọc theo danh mục
                      </label>
                      <select
                        id="category-filter"
                        className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="sort-by" className="block mb-2 text-sm font-medium text-gray-700">
                        Sắp xếp theo
                      </label>
                      <div className="flex space-x-2">
                        <select
                          id="sort-by"
                          className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="name">Tên</option>
                          <option value="price">Giá</option>
                          <option value="updatedAt">Ngày cập nhật</option>
                          <option value="viewCount">Lượt xem</option>
                        </select>
                        <button
                          type="button"
                          className="px-3 py-2 border border-gray-300 rounded-md"
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          aria-label="Thứ tự sắp xếp"
                        >
                          {sortOrder === 'asc' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Hiển thị số lượng kết quả lọc */}
                  <div className="mt-4 text-sm text-gray-500">
                    Hiển thị {filteredProducts.length} / {products.length} sản phẩm
                    {(searchTerm || filterCategory) && (
                      <button
                        type="button"
                        className="ml-2 text-primary-600 hover:text-primary-800"
                        onClick={() => {
                          setSearchTerm('');
                          setFilterCategory('');
                        }}
                      >
                        Xóa bộ lọc
                      </button>
                    )}
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
                    {products.length === 0 ? (
                      <>
                        <p className="text-gray-500 mb-4">Chưa có sản phẩm nào trong hệ thống</p>
                        <button 
                          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center"
                          onClick={() => {
                            // Tăng clickCount một cách đơn giản
                            incrementClickCount();
                            
                            // Xử lý chức năng thêm sản phẩm
                            setIsEditing(false);
                            setCurrentProduct(null);
                            setFormError({});
                            setShowForm(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Thêm sản phẩm đầu tiên
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm nào phù hợp với bộ lọc</p>
                        <button 
                          className="text-primary-600 hover:text-primary-800"
                          onClick={() => {
                            setSearchTerm('');
                            setFilterCategory('');
                          }}
                        >
                          Xóa bộ lọc
                        </button>
                      </>
                    )}
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
                      {filteredProducts.map(product => {
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
                                  className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={(e) => handleViewDetail(product, e)}
                                  disabled={isLoading}
                                >
                                  Xem
                                </button>
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
      
      {/* Modal xem chi tiết sản phẩm */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeDetailModal}></div>
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={closeDetailModal}
              >
                <span className="sr-only">Đóng</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative pb-[100%] bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProduct.imageUrl || '/images/placeholder-product.jpg'}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium text-gray-700">Giá</span>
                      <span>{formatCurrency(selectedProduct.price)}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium text-gray-700">Giá KM</span>
                      <span>{formatCurrency(selectedProduct.salePrice)}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium text-gray-700">Phiên bản</span>
                      <span>{selectedProduct.version}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium text-gray-700">Dung lượng</span>
                      <span>{selectedProduct.size}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium text-gray-700">Lượt xem</span>
                      <span>{selectedProduct.viewCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="block font-medium text-gray-700">Lượt tải</span>
                      <span>{selectedProduct.downloadCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded col-span-2">
                      <span className="block font-medium text-gray-700">Loại giấy phép</span>
                      <span>{selectedProduct.licenseType}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {selectedProduct.isNew && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Mới
                      </span>
                    )}
                    {selectedProduct.isFeatured && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                        Nổi bật
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 ${
                            rating <= Math.round(selectedProduct.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.934L4.618 19 5.764 12.606 0.764 7.894 7.236 6.982 10 1 12.764 6.982 19.236 7.894 14.236 12.606 15.382 19z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {selectedProduct.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Danh mục</h3>
                    <p className="text-gray-600 mt-1">
                      {categories.find(c => c.id === selectedProduct.categoryId)?.name || 'Không có danh mục'}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">Mô tả ngắn</h3>
                    <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">Mô tả chi tiết</h3>
                    <div 
                      className="prose prose-sm mt-2 text-gray-600"
                      dangerouslySetInnerHTML={{ __html: selectedProduct.longDescription }}
                    />
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      onClick={(e) => {
                        closeDetailModal();
                        setTimeout(() => handleEdit(selectedProduct), 300);
                      }}
                    >
                      Sửa sản phẩm
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={closeDetailModal}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 