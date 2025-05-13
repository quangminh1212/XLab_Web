'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import withAdminAuth from '@/components/withAdminAuth';
import Image from 'next/image';
import RichTextEditor from '@/components/common/RichTextEditor';

function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    isPublished: false,
    price: 0,
    salePrice: 0,
    categoryId: 'office-software'
  });

  // Xử lý thêm hình ảnh từ URL
  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && isValidImageUrl(newImageUrl)) {
      setDescriptionImages([...descriptionImages, newImageUrl]);
      setNewImageUrl('');
    } else {
      setError('URL hình ảnh không hợp lệ. Vui lòng kiểm tra lại.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Xử lý thêm ảnh đại diện từ URL
  const handleAddFeaturedImageUrl = () => {
    if (featuredImageUrl.trim() && isValidImageUrl(featuredImageUrl)) {
      setFeaturedImage(featuredImageUrl);
      setFeaturedImageUrl('');
    } else {
      setError('URL hình ảnh không hợp lệ. Vui lòng kiểm tra lại.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Kiểm tra URL hình ảnh có hợp lệ không
  const isValidImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || 
           url.startsWith('https://') || 
           url.startsWith('http://');
  };

  // Xử lý upload hình ảnh
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Giới hạn kích thước file là 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Chỉ cho phép các loại file ảnh
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      setError('Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WEBP)');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Tạo URL tạm thời cho hình ảnh
    const imageUrl = URL.createObjectURL(file);
    setDescriptionImages([...descriptionImages, imageUrl]);
    
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Xử lý upload ảnh đại diện
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Giới hạn kích thước file là 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Chỉ cho phép các loại file ảnh
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      setError('Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WEBP)');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Tạo URL tạm thời cho hình ảnh
    const imageUrl = URL.createObjectURL(file);
    setFeaturedImage(imageUrl);
    
    // Reset input file
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = '';
    }
  };
  
  // Xử lý xóa hình ảnh
  const handleRemoveImage = (index: number) => {
    const newImages = [...descriptionImages];
    newImages.splice(index, 1);
    setDescriptionImages(newImages);
  };
  
  // Xử lý xóa ảnh đại diện
  const handleRemoveFeaturedImage = () => {
    setFeaturedImage(null);
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = '';
    }
  };
  
  // Xử lý chèn hình ảnh vào mô tả
  const handleInsertImageToDescription = (imageUrl: string) => {
    // Không cần chèn thủ công, vì rich text editor có chức năng chèn ảnh
    // Nhưng chúng ta có thể sao chép URL để dễ dàng dán vào editor
    navigator.clipboard.writeText(imageUrl).then(() => {
      setSuccessMessage("Đã sao chép URL hình ảnh vào clipboard, bạn có thể dán vào editor");
      setTimeout(() => setSuccessMessage(null), 3000);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'price' || name === 'salePrice' 
          ? parseFloat(value) 
          : value
    }));
  };
  
  // Xử lý thay đổi nội dung rich text
  const handleRichTextChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare the product data
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        isPublished: formData.isPublished,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        images: featuredImage ? [featuredImage] : [],
        descriptionImages: descriptionImages, // Thêm danh sách hình ảnh mô tả
        features: [],
        requirements: [],
        versions: [
          {
            name: 'Standard',
            description: 'Phiên bản tiêu chuẩn',
            price: formData.price,
            originalPrice: formData.salePrice || formData.price,
            features: []
          }
        ],
        categories: [formData.categoryId]
      };
      
      // Send the create request
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error('Không thể tạo sản phẩm mới');
      }
      
      const result = await response.json();
      setSuccessMessage('Sản phẩm đã được tạo thành công!');
      
      // Redirect to the product edit page after 1 second
      setTimeout(() => {
        router.push(`/admin/products/${result.id}`);
      }, 1000);
      
    } catch (err) {
      setError((err as Error).message);
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { id: 'office-software', name: 'Phần mềm văn phòng' },
    { id: 'business-solutions', name: 'Giải pháp doanh nghiệp' },
    { id: 'security-software', name: 'Phần mềm bảo mật' },
    { id: 'data-protection', name: 'Bảo vệ dữ liệu' },
    { id: 'design-software', name: 'Phần mềm thiết kế' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm"
        >
          ← Quay lại danh sách
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Danh mục
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categoryOptions.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Giá bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
                step="1000"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Giá gốc (VNĐ)
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
                step="1000"
              />
              <p className="text-sm text-gray-500 mt-1">Điền giá gốc nếu có khuyến mãi, nếu không thì để trống</p>
            </div>
            
            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 text-gray-700">
                  Công khai sản phẩm ngay
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Phần thêm ảnh đại diện sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Ảnh đại diện sản phẩm</h2>
          
          <div className="space-y-4">
            {/* Thêm ảnh đại diện từ URL */}
            <div className="flex">
              <input
                type="text"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="Nhập URL ảnh đại diện"
                className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddFeaturedImageUrl}
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
              >
                Thêm URL
              </button>
            </div>
            
            {/* Thêm ảnh đại diện từ máy tính */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Hoặc tải lên từ máy tính
              </label>
              <input
                type="file"
                accept="image/*"
                ref={featuredImageInputRef}
                onChange={handleFeaturedImageUpload}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* Hiển thị ảnh đại diện đã chọn */}
            {featuredImage && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Ảnh đại diện đã chọn</h4>
                <div className="relative border border-gray-200 rounded p-2 max-w-xs">
                  <div className="relative h-40 w-full overflow-hidden rounded">
                    <img 
                      src={featuredImage} 
                      alt="Ảnh đại diện sản phẩm" 
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleRemoveFeaturedImage}
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mô tả ngắn <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                required
              />
              <p className="text-sm text-gray-500 mt-1">Mô tả ngắn gọn về sản phẩm (hiển thị ở trang danh sách)</p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mô tả đầy đủ
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={handleRichTextChange}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                className="mb-1"
              />
              <p className="text-sm text-gray-500 mt-1">Mô tả chi tiết về sản phẩm (hiển thị ở trang chi tiết). Dán hình ảnh trực tiếp (Ctrl+V) vào ô soạn thảo.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-6 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Tạo sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(NewProductPage); 