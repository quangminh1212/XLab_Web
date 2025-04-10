'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CreateProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([
    { id: 'office', name: 'Văn phòng' },
    { id: 'design', name: 'Thiết kế' },
    { id: 'development', name: 'Phát triển' },
    { id: 'security', name: 'Bảo mật' },
    { id: 'utility', name: 'Tiện ích' },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    price: '',
    salePrice: '',
    categoryId: '',
    imageUrl: '',
    version: '1.0.0',
    size: '',
    licenseType: '',
    isFeatured: false,
    isNew: true,
  });
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
  
  // Xử lý khi người dùng thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Tự động tạo slug từ tên sản phẩm
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      
      setFormData(prevState => ({
        ...prevState,
        slug
      }));
    }
  };
  
  // Kiểm tra quyền admin hoặc token truy cập
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token !== 'xlab-admin-secret' && status === 'authenticated') {
      if (session?.user?.email !== 'xlab.rnd@gmail.com') {
        router.push('/');
      }
    } else if (token !== 'xlab-admin-secret' && status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router, searchParams]);
  
  // Xử lý khi gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Tạo đối tượng sản phẩm mới
      const newProduct = {
        id: Date.now(), // Tạo ID duy nhất dựa trên timestamp
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        longDescription: formData.longDescription,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl,
        version: formData.version,
        size: formData.size,
        licenseType: formData.licenseType,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        downloadCount: 0,
        viewCount: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        storeId: 1,
      };
      
      // Lấy danh sách sản phẩm hiện có từ localStorage
      const existingProducts = localStorage.getItem('admin_products');
      let updatedProducts = [];
      
      if (existingProducts) {
        updatedProducts = JSON.parse(existingProducts);
      }
      
      // Thêm sản phẩm mới vào danh sách
      updatedProducts.push(newProduct);
      
      // Lưu danh sách cập nhật vào localStorage
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      
      alert('Đã thêm sản phẩm thành công!');
      
      // Chuyển hướng về trang quản trị
      router.push('/admin');
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert('Đã xảy ra lỗi khi lưu sản phẩm!');
      setIsLoading(false);
    }
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
      <section className="bg-primary-800 text-white py-10">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tạo sản phẩm mới</h1>
          <p className="text-xl max-w-3xl">
            Thêm phần mềm và dịch vụ mới vào gian hàng XLab
          </p>
        </div>
      </section>

      {/* Create Product Form */}
      <section className="py-10">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Thông tin sản phẩm</h2>
              <Link href="/admin" className="text-primary-600 hover:text-primary-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </Link>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="product-name" className="block mb-2 font-medium text-gray-700">
                        Tên phần mềm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
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
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: xlab-office-suite"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        URL thân thiện cho sản phẩm. Chỉ sử dụng chữ cái, số và dấu gạch ngang.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="product-category" className="block mb-2 font-medium text-gray-700">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="product-category"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
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
                      <label htmlFor="product-version" className="block mb-2 font-medium text-gray-700">
                        Phiên bản <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-version"
                        name="version"
                        value={formData.version}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: 1.0.0"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Mô tả sản phẩm</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="product-description" className="block mb-2 font-medium text-gray-700">
                        Mô tả ngắn <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="product-description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Mô tả ngắn gọn về phần mềm của bạn"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        Mô tả ngắn gọn về sản phẩm (tối đa 255 ký tự).
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="product-long-description" className="block mb-2 font-medium text-gray-700">
                        Mô tả chi tiết <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="product-long-description"
                        name="longDescription"
                        value={formData.longDescription}
                        onChange={handleInputChange}
                        rows={8}
                        placeholder="Mô tả chi tiết về tính năng, lợi ích của phần mềm"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        Mô tả chi tiết về sản phẩm, tính năng và lợi ích. Có thể sử dụng định dạng HTML cơ bản.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Giá và thông tin phân phối</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="product-price" className="block mb-2 font-medium text-gray-700">
                        Giá (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="product-price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
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
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        placeholder="Để trống nếu không có khuyến mãi"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="product-license" className="block mb-2 font-medium text-gray-700">
                        Loại giấy phép <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="product-license"
                        name="licenseType"
                        value={formData.licenseType}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      >
                        <option value="">-- Chọn loại giấy phép --</option>
                        <option value="personal">Cá nhân</option>
                        <option value="business">Doanh nghiệp</option>
                        <option value="enterprise">Doanh nghiệp lớn</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="product-size" className="block mb-2 font-medium text-gray-700">
                        Dung lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-size"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: 50MB"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Hình ảnh và trạng thái</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="product-image-url" className="block mb-2 font-medium text-gray-700">
                        URL hình ảnh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        id="product-image-url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Liên kết đến hình ảnh đại diện cho sản phẩm.
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap space-y-4 md:space-y-0 md:space-x-6">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="product-featured" 
                          name="isFeatured" 
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="mr-2" 
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
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="mr-2" 
                        />
                        <label htmlFor="product-new" className="text-gray-700">
                          Đánh dấu là sản phẩm mới
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Link 
                  href="/admin" 
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </Link>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Đăng sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 