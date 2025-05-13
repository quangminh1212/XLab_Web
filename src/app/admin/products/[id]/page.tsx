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
  
  // Thêm state cho mô tả kỹ thuật
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);

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
        
        // Set specifications if available
        if (productData.specifications && Array.isArray(productData.specifications)) {
          setSpecifications(productData.specifications);
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
  
  // Xử lý thêm thông số kỹ thuật
  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications([...specifications, {
        key: newSpecKey.trim(),
        value: newSpecValue.trim()
      }]);
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  // Xử lý xóa thông số kỹ thuật
  const handleRemoveSpecification = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
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
  
  // Xử lý thay đổi nội dung mô tả ngắn rich text
  const handleShortDescRichTextChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      shortDescription: content
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
        specifications: specifications, // Thêm thông số kỹ thuật
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

  // Xử lý thay đổi giá
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const price = parseFloat(value);
    
    setFormData(prev => ({
      ...prev, 
      price: isNaN(price) ? 0 : price,
      // Nếu giá gốc chưa được đặt hoặc bằng giá cũ, tự động cập nhật giá gốc
      salePrice: (prev.salePrice === 0 || prev.salePrice === prev.price) 
        ? (isNaN(price) ? 0 : price) 
        : prev.salePrice
    }));
  };

  // Xử lý thay đổi giá gốc
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const salePrice = parseFloat(value);
    
    setFormData(prev => ({
      ...prev, 
      salePrice: isNaN(salePrice) ? 0 : salePrice
    }));
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
            
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Giá sản phẩm (VNĐ)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                step="1000"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Giá gốc (VNĐ)
              </label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleSalePriceChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                step="1000"
              />
              {/* Hiển thị phần trăm giảm giá */}
              {formData.salePrice > 0 && (
                <div className="mt-2 bg-red-100 text-red-700 text-sm px-2 py-1 rounded inline-block">
                  Giảm giá: {formData.salePrice > formData.price ? 
                    Math.round((1 - formData.price / formData.salePrice) * 100) : 0}%
                </div>
              )}
              {formData.salePrice === 0 && formData.price > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    // Thêm giá gốc bằng cách nhân giá hiện tại với 1.2 (tăng 20%)
                    setFormData(prev => ({
                      ...prev,
                      salePrice: Math.ceil(prev.price * 1.2 / 1000) * 1000 // Làm tròn lên đến 1000đ
                    }));
                  }}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700 block"
                >
                  + Thêm giá gốc
                </button>
              )}
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
                <div className="relative border border-gray-200 rounded p-2 max-w-sm mx-auto">
                  <div className="relative aspect-square w-full overflow-hidden rounded">
                    <img 
                      src={featuredImage} 
                      alt="Ảnh đại diện sản phẩm" 
                      className="object-contain max-w-full max-h-full" 
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
              <RichTextEditor
                value={formData.shortDescription}
                onChange={handleShortDescRichTextChange}
                placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị ở trang danh sách)"
                className="mb-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Mô tả ngắn gọn về sản phẩm (hiển thị ở trang danh sách)
              </p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mô tả đầy đủ
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={handleRichTextChange}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                className="mb-4"
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {descriptionImages.map((imageUrl, index) => (
                        <div key={index} className="relative border border-gray-200 rounded p-2 group">
                          <div className="relative aspect-square w-full overflow-hidden rounded">
                            <img 
                              src={imageUrl} 
                              alt={`Hình ảnh ${index + 1}`} 
                              className="object-contain max-w-full max-h-full" 
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs">
                            <button
                              type="button"
                              onClick={() => handleInsertImageToDescription(imageUrl)}
                              className="text-xs bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600 transition-colors"
                            >
                              Sao chép URL
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 transition-colors"
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
        
        {/* Thông số kỹ thuật */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Thông số kỹ thuật</h2>
            <button 
              type="button" 
              onClick={() => setIsEditingSpecs(!isEditingSpecs)}
              className="text-blue-500 hover:text-blue-700"
            >
              {isEditingSpecs ? 'Xong' : 'Chỉnh sửa'}
            </button>
          </div>
          
          {isEditingSpecs ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Tên thông số (VD: CPU, RAM, HDD)"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="Giá trị thông số"
                    className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>
              
              {specifications.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Thông số đã thêm</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="py-2 text-left">Tên thông số</th>
                          <th className="py-2 text-left">Giá trị</th>
                          <th className="py-2 w-20"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {specifications.map((spec, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-2 font-medium">{spec.key}</td>
                            <td className="py-2">{spec.value}</td>
                            <td className="py-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecification(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            specifications.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <table className="w-full border-collapse">
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2 font-medium w-1/3">{spec.key}</td>
                        <td className="py-2">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
                Chưa có thông số kỹ thuật nào. Nhấn "Chỉnh sửa" để thêm.
              </div>
            )
          )}
          <p className="text-sm text-gray-500 mt-4">
            Thêm các thông số kỹ thuật chi tiết của sản phẩm để giúp người dùng hiểu rõ hơn về sản phẩm (VD: Cấu hình, Yêu cầu hệ thống, Tính năng đặc biệt).
          </p>
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