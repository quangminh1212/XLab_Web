'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/ProductModel';
import withAdminAuth from '@/components/withAdminAuth';
import Image from 'next/image';
import RichTextEditor from '@/components/common/RichTextEditor';

interface AdminEditProductPageProps {
  params: {
    id: string;
  };
}

function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    isPublished: false,
    price: 0,
    salePrice: 0
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Không thể tải thông tin sản phẩm');
        }
        
        const productData = await response.json();
        setProduct(productData);
        
        // Populate form data
        setFormData({
          name: productData.name || '',
          shortDescription: productData.shortDescription || '',
          description: productData.description || '',
          isPublished: productData.isPublished || false,
          price: productData.versions?.[0]?.price || 0,
          salePrice: productData.versions?.[0]?.originalPrice || 0
        });
        
        // Set description images if available
        if (productData.descriptionImages && Array.isArray(productData.descriptionImages)) {
          setDescriptionImages(productData.descriptionImages);
        }
        
        // Set featured image if available
        if (productData.images && productData.images.length > 0) {
          setFeaturedImage(productData.images[0]);
        }
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Update product with form data
      const updatedProduct = {
        ...product,
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        isPublished: formData.isPublished,
        images: featuredImage ? [featuredImage] : [],
        descriptionImages: descriptionImages, // Thêm danh sách hình ảnh mô tả
        versions: product?.versions?.map((version, index) => {
          if (index === 0) {
            return {
              ...version,
              price: formData.price,
              originalPrice: formData.salePrice
            };
          }
          return version;
        }) || []
      };
      
      // Send the update request
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });
      
      if (!response.ok) {
        throw new Error('Không thể cập nhật sản phẩm');
      }
      
      const result = await response.json();
      setProduct(result);
      setSuccessMessage('Sản phẩm đã được cập nhật thành công!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      setError((err as Error).message);
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Không tìm thấy sản phẩm'}</p>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => router.push('/admin/products')}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h1>
      
      <div className="mb-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => router.push('/admin/products')}
        >
          &larr; Quay lại danh sách
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSaveProduct} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tên sản phẩm
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
                Trạng thái
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Công khai</span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Giá bán (VNĐ)
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
            </div>
          </div>
        </div>
        
        {/* Phần thêm ảnh đại diện sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mô tả ngắn
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
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
            </div>
            
            {/* Phần thêm hình ảnh cho mô tả */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Thêm hình ảnh vào mô tả</h3>
              
              <div className="space-y-4">
                {/* Thêm hình ảnh từ URL */}
                <div className="flex">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Nhập URL hình ảnh"
                    className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
                  >
                    Thêm URL
                  </button>
                </div>
                
                {/* Thêm hình ảnh từ máy tính */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Hoặc tải lên từ máy tính
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                {/* Hiển thị danh sách hình ảnh đã thêm */}
                {descriptionImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Hình ảnh đã thêm</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {descriptionImages.map((imageUrl, index) => (
                        <div key={index} className="relative border border-gray-200 rounded p-2 group">
                          <div className="relative h-40 w-full overflow-hidden rounded">
                            <img 
                              src={imageUrl} 
                              alt={`Hình ảnh ${index + 1}`} 
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="mt-2 flex justify-between">
                            <button
                              type="button"
                              onClick={() => handleInsertImageToDescription(imageUrl)}
                              className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                            >
                              Sao chép URL ảnh
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(AdminEditProductPage); 