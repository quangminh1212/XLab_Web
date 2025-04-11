'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export default function MyProductsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Kiểm tra đăng nhập
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // Lấy danh sách sản phẩm của người dùng
      fetchUserProducts();
    }
  }, [status, router]);

  // Lấy danh sách sản phẩm của người dùng
  const fetchUserProducts = async () => {
    try {
      setIsLoading(true);
      // Trong một ứng dụng thực tế, bạn sẽ cần gọi API để lấy sản phẩm của người dùng đang đăng nhập
      // Ở đây, chúng ta sẽ giả lập bằng cách lấy tất cả sản phẩm và lọc theo storeId
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (result.success) {
        // Lọc sản phẩm thuộc về người dùng hiện tại (giả định các sản phẩm có storeId = 1 là của người dùng đó)
        // Trong thực tế, API sẽ trả về chỉ sản phẩm của người dùng đang đăng nhập
        const userProducts = result.data.filter(p => p.storeId === '1');
        setProducts(userProducts);
      } else {
        console.error('Lỗi khi lấy sản phẩm:', result.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi gửi form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError('');
    
    try {
      // Tạo form data từ form
      const formData = new FormData(event.target);
      const productData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        longDescription: formData.get('longDescription'),
        price: Number(formData.get('price')),
        salePrice: formData.get('salePrice') ? Number(formData.get('salePrice')) : null,
        categoryId: formData.get('categoryId'),
        imageUrl: formData.get('imageUrl'),
        version: formData.get('version'),
        size: formData.get('size'),
        licenseType: formData.get('licenseType'),
        isFeatured: formData.get('isFeatured') === 'on',
        isNew: formData.get('isNew') === 'on',
        storeId: '1', // Trong ứng dụng thực tế, lấy từ session hoặc profile người dùng
      };
      
      // Nếu đang chỉnh sửa sản phẩm
      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Cập nhật lại danh sách sản phẩm
          await fetchUserProducts();
          setShowForm(false);
          setEditingProduct(null);
          event.target.reset();
          alert('Cập nhật sản phẩm thành công!');
        } else {
          setFormError(result.message || 'Lỗi khi cập nhật sản phẩm');
        }
      } 
      // Nếu đang tạo sản phẩm mới
      else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Cập nhật lại danh sách sản phẩm
          await fetchUserProducts();
          setShowForm(false);
          event.target.reset();
          alert('Thêm sản phẩm thành công!');
        } else {
          setFormError(result.message || 'Lỗi khi thêm sản phẩm');
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      setFormError('Đã xảy ra lỗi khi xử lý yêu cầu');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi nhấn nút xóa
  const handleDelete = async (productId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Cập nhật lại danh sách sản phẩm
        await fetchUserProducts();
        alert('Xóa sản phẩm thành công!');
      } else {
        alert(result.message || 'Lỗi khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Đã xảy ra lỗi khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Xử lý hủy form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormError('');
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm của tôi</h1>
          <p className="text-xl max-w-3xl">
            Quản lý các sản phẩm bạn đã đăng bán trên XLab.
          </p>
        </div>
      </section>

      {/* Product Management */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
              onClick={() => {
                setShowForm(!showForm);
                setEditingProduct(null);
                setFormError('');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showForm ? 'Đóng form' : 'Thêm sản phẩm mới'}
            </button>
          </div>
          
          {formError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Form thêm/chỉnh sửa sản phẩm */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-name" className="block mb-2 font-medium text-gray-700">
                      Tên phần mềm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="product-name"
                      name="name"
                      placeholder="Ví dụ: XLab Office Suite"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.name || ''}
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
                      placeholder="Ví dụ: xlab-office-suite"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.slug || ''}
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
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.categoryId || ''}
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      <option value="cat-1">Phần mềm doanh nghiệp</option>
                      <option value="cat-2">Ứng dụng văn phòng</option>
                      <option value="cat-3">Phần mềm đồ họa</option>
                      <option value="cat-4">Bảo mật & Antivirus</option>
                      <option value="cat-5">Ứng dụng giáo dục</option>
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
                      placeholder="Ví dụ: 1200000"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.price || ''}
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
                      placeholder="Để trống nếu không có khuyến mãi"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.salePrice || ''}
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
                      placeholder="Ví dụ: 1.0.0"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.version || ''}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="product-description" className="block mb-2 font-medium text-gray-700">
                      Mô tả ngắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="product-description"
                      name="description"
                      rows={3}
                      placeholder="Mô tả ngắn gọn về phần mềm của bạn"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.description || ''}
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
                      placeholder="Mô tả chi tiết về tính năng, lợi ích của phần mềm"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.longDescription || ''}
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="product-image-url" className="block mb-2 font-medium text-gray-700">
                      URL hình ảnh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="product-image-url"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.imageUrl || ''}
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
                      placeholder="Ví dụ: 50MB"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.size || ''}
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
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      defaultValue={editingProduct?.licenseType || ''}
                      required
                    >
                      <option value="">-- Chọn loại giấy phép --</option>
                      <option value="Cá nhân">Cá nhân</option>
                      <option value="Thương mại">Thương mại</option>
                      <option value="Doanh nghiệp">Doanh nghiệp</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 flex items-center">
                    <input 
                      type="checkbox" 
                      id="product-featured" 
                      name="isFeatured" 
                      className="mr-2" 
                      defaultChecked={editingProduct?.isFeatured}
                    />
                    <label htmlFor="product-featured" className="text-gray-700">
                      Đánh dấu là sản phẩm nổi bật
                    </label>
                  </div>
                  
                  <div className="md:col-span-2 flex items-center">
                    <input 
                      type="checkbox" 
                      id="product-new" 
                      name="isNew" 
                      className="mr-2" 
                      defaultChecked={editingProduct?.isNew}
                    />
                    <label htmlFor="product-new" className="text-gray-700">
                      Đánh dấu là sản phẩm mới
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <button 
                    type="button" 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={handleCancelForm}
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
                    {editingProduct ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Danh sách sản phẩm */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Sản phẩm của bạn</h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : products.length > 0 ? (
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
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover rounded-md"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder.png'
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">Phiên bản: {product.version}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.categoryId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                          {product.salePrice && product.salePrice < product.price && (
                            <div className="text-sm text-red-600">{formatCurrency(product.salePrice)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {product.isFeatured && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
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
                          <button 
                            className="text-primary-600 hover:text-primary-900 mr-3"
                            onClick={() => handleEdit(product)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(product.id.toString())}
                            disabled={isDeleting}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Chưa có sản phẩm nào</h4>
                <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào được đăng bán. Hãy thêm sản phẩm đầu tiên của bạn!</p>
                <button 
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center mx-auto"
                  onClick={() => setShowForm(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm sản phẩm
                </button>
              </div>
            )}
          </div>
          
          {/* Thông tin và hướng dẫn */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Hướng dẫn bán sản phẩm</h3>
            
            <div className="prose max-w-none">
              <p>
                Bán sản phẩm phần mềm của bạn trên XLab là cách tuyệt vời để tiếp cận khách hàng tiềm năng 
                và kiếm thu nhập từ công việc của bạn. Dưới đây là một số hướng dẫn để tối ưu hóa sản phẩm 
                của bạn:
              </p>
              
              <h4>Tiêu chuẩn sản phẩm</h4>
              <ul>
                <li>Sản phẩm phải hoạt động đúng như mô tả</li>
                <li>Mã nguồn và tệp thực thi không được chứa mã độc</li>
                <li>Sản phẩm không vi phạm bản quyền và sở hữu trí tuệ</li>
                <li>Sản phẩm phải có tài liệu hướng dẫn sử dụng đầy đủ</li>
              </ul>
              
              <h4>Cách tạo sản phẩm nổi bật</h4>
              <ul>
                <li>Sử dụng hình ảnh chất lượng cao minh họa sản phẩm</li>
                <li>Viết mô tả chi tiết về tính năng và lợi ích</li>
                <li>Định giá hợp lý, cạnh tranh với thị trường</li>
                <li>Cung cấp hỗ trợ kỹ thuật chuyên nghiệp</li>
                <li>Cập nhật sản phẩm thường xuyên</li>
              </ul>
              
              <p>
                <a href="/terms" className="text-primary-600 hover:text-primary-800">Xem thêm các điều khoản dành cho người bán</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 