'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { useProducts } from '@/context/ProductContext';

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, setProducts } = useProducts();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');
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
  
  // Log products state whenever it changes
  useEffect(() => {
    console.log("[AdminProductsPage] Products state updated:", products.length);
  }, [products]);
  
  // Log form state để debug
  useEffect(() => {
    console.log("[AdminProductsPage] Form state:", { showForm, isEditing, currentProduct });
  }, [showForm, isEditing, currentProduct]);
  
  // Hiển thị thông báo thành công và cập nhật UI thay vì reload trang
  const showSuccessAndReset = (message: string, shouldResetForm = true) => {
    showSuccess(message);
    if (shouldResetForm) {
      resetForm();
    }
  };
  
  // Tự động tải lại trang sau khi thực hiện thao tác thành công
  const reloadAfterSuccess = (message: string) => {
    showSuccess(message);
    // Đặt timeout dài hơn (3 giây) để đảm bảo API và localStorage đã được cập nhật
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };
  
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
      setFormError('');
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
      setFormError(''); // Xóa lỗi cũ khi mở form sửa
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

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentProduct(null);
    setFormError('');
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
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Nút thêm sản phẩm mới được nhấn");
                    setIsEditing(false);
                    setCurrentProduct(null);
                    setShowForm(!showForm);
                    // Đảm bảo UI được cập nhật trước khi scroll
                    if (!showForm) {
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }
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
                <div className="flex items-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div dangerouslySetInnerHTML={{ __html: formError }} />
                </div>
                <button 
                  onClick={() => setFormError('')}
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
            
            {/* Form thêm/sửa sản phẩm */}
            {showForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                
                {formError && showForm && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <div className="flex items-center w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div dangerouslySetInnerHTML={{ __html: formError }} />
                    </div>
                    <button 
                      onClick={() => setFormError('')}
                      className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"
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
                    <div className="md:col-span-2 bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Vui lòng điền đầy đủ thông tin cho các trường bắt buộc (có dấu <span className="text-red-500">*</span>).
                            Nếu gặp lỗi khi thêm sản phẩm, hãy thử công cụ khắc phục ở cuối trang.
                          </p>
                        </div>
                      </div>
                    </div>
                    
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
                        onChange={(e) => {
                          // Tự động sinh slug từ tên sản phẩm
                          const slugInput = document.getElementById('product-slug') as HTMLInputElement;
                          if (slugInput && (!slugInput.value || !isEditing)) {
                            slugInput.value = e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^\w\-]+/g, '');
                          }
                        }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("Nút thêm sản phẩm đầu tiên được nhấn");
                            setIsEditing(false);
                            setCurrentProduct(null);
                            setShowForm(true);
                            // Đảm bảo UI được cập nhật trước khi scroll
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
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
      
      {/* Thêm công cụ debug nếu không có sản phẩm nào */}
      {products.length === 0 && (
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Công cụ khắc phục</h2>
              <p className="text-gray-600 mb-6">
                Bạn đang gặp vấn đề khi thêm sản phẩm? Hãy thử công cụ khắc phục bên dưới để thêm trực tiếp một sản phẩm mẫu.
              </p>
              
              {/* @ts-ignore */}
              <div id="debug-tool">
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                  <a 
                    href="/admin/products/add-product-debug" 
                    target="_blank"
                    className="inline-flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Mở công cụ khắc phục
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
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
                    <h3 className="text-lg font-medium text-gray-900">Mô tả ngắn</h3>
                    <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Mô tả chi tiết</h3>
                    <div 
                      className="prose prose-sm max-w-none mt-1 text-gray-600"
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