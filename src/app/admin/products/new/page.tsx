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
  const [showPreview, setShowPreview] = useState(false);
  
  // Thêm phần features (Đặc điểm nổi bật)
  const [newFeature, setNewFeature] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  
  // Thêm thông tin bảo hành
  const [warranty, setWarranty] = useState('');
  
  // Thêm quản lý các phiên bản sản phẩm
  const [productVersions, setProductVersions] = useState([
    { 
      id: 1, 
      name: 'Standard', 
      description: 'Phiên bản tiêu chuẩn',
      price: 0,
      originalPrice: 0 
    }
  ]);
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [currentVersion, setCurrentVersion] = useState({
    id: 0,
    name: '',
    description: '',
    price: 0,
    originalPrice: 0
  });
  
  // Thêm state để theo dõi phiên bản đang chọn trong preview
  const [selectedVersionId, setSelectedVersionId] = useState(1);
  
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
  
  // Xử lý thêm đặc điểm nổi bật
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Xử lý xóa đặc điểm nổi bật
  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };
  
  // Xử lý thêm phiên bản sản phẩm
  const handleAddVersion = () => {
    if (currentVersion.name && currentVersion.price > 0) {
      const newId = productVersions.length ? Math.max(...productVersions.map(v => v.id)) + 1 : 1;
      setProductVersions([...productVersions, { ...currentVersion, id: newId }]);
      setCurrentVersion({
        id: 0,
        name: '',
        description: '',
        price: 0,
        originalPrice: 0
      });
      setShowVersionForm(false);
    } else {
      setError("Tên phiên bản và giá là bắt buộc");
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Xử lý xóa phiên bản
  const handleRemoveVersion = (id: number) => {
    setProductVersions(productVersions.filter(version => version.id !== id));
  };
  
  // Xử lý thay đổi thông tin phiên bản
  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCurrentVersion(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (productVersions.length === 0) {
        throw new Error('Cần thêm ít nhất một phiên bản sản phẩm');
      }
      
      // Prepare the product data
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        isPublished: formData.isPublished,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        images: featuredImage ? [featuredImage] : [],
        descriptionImages: descriptionImages,
        features: features,
        warranty: warranty,
        requirements: [],
        versions: productVersions,
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
    { id: 'ai-tools', name: 'Công cụ AI' },
  ];

  // Tìm phiên bản đang chọn
  const selectedVersion = productVersions.find(v => v.id === selectedVersionId) || productVersions[0];
  
  // Hiển thị giá thấp nhất và cao nhất
  const minPrice = productVersions.length > 0 
    ? Math.min(...productVersions.map(v => v.price))
    : 0;
  
  const maxPrice = productVersions.length > 0 
    ? Math.max(...productVersions.map(v => v.price))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="bg-blue-100 py-2 px-4 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors text-sm"
          >
            {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
          </button>
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm"
          >
            ← Quay lại danh sách
          </button>
        </div>
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
      
      <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2 gap-6' : 'grid-cols-1'}`}>
        <div className="space-y-6">
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
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Ảnh đại diện sản phẩm</h2>
              
              <div className="space-y-4">
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
              <h2 className="text-xl font-bold mb-4">Thông tin đặc trưng</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Đặc điểm nổi bật
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Nhập đặc điểm nổi bật"
                      className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  {features.length > 0 && (
                    <div className="mt-2 bg-gray-50 p-3 rounded">
                      <h4 className="font-medium mb-2">Danh sách đặc điểm:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {features.map((feature, index) => (
                          <li key={index} className="flex justify-between items-center">
                            <span>{feature}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Thông tin bảo hành
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="Ví dụ: Bảo hành 1 đổi 1 trong 30 ngày"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Phiên bản sản phẩm</h2>
              
              {productVersions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Danh sách phiên bản:</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Tên phiên bản</th>
                          <th className="py-2 px-4 border-b">Mô tả</th>
                          <th className="py-2 px-4 border-b">Giá (VNĐ)</th>
                          <th className="py-2 px-4 border-b">Giá gốc (VNĐ)</th>
                          <th className="py-2 px-4 border-b">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productVersions.map((version) => (
                          <tr key={version.id}>
                            <td className="py-2 px-4 border-b">{version.name}</td>
                            <td className="py-2 px-4 border-b">{version.description}</td>
                            <td className="py-2 px-4 border-b">{version.price.toLocaleString('vi-VN')}</td>
                            <td className="py-2 px-4 border-b">{version.originalPrice > 0 ? version.originalPrice.toLocaleString('vi-VN') : '-'}</td>
                            <td className="py-2 px-4 border-b">
                              <button
                                type="button"
                                onClick={() => handleRemoveVersion(version.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {!showVersionForm ? (
                <button
                  type="button"
                  onClick={() => setShowVersionForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  + Thêm phiên bản
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <h4 className="font-medium mb-3">Thêm phiên bản sản phẩm mới</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Tên phiên bản <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentVersion.name}
                        onChange={handleVersionChange}
                        placeholder="Ví dụ: Pro, Enterprise, Individual..."
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Mô tả phiên bản
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={currentVersion.description}
                        onChange={handleVersionChange}
                        placeholder="Ví dụ: Dùng chung, Dùng riêng..."
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Giá bán (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={currentVersion.price}
                        onChange={handleVersionChange}
                        min="0"
                        step="1000"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Giá gốc (VNĐ)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={currentVersion.originalPrice}
                        onChange={handleVersionChange}
                        min="0"
                        step="1000"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddVersion}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Lưu phiên bản
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVersionForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
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
        
        {/* Phần preview sản phẩm */}
        {showPreview && (
          <div className="sticky top-0 h-max">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Xem trước sản phẩm</h2>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h1 className="text-2xl font-bold">
                    {formData.name || 'Tên sản phẩm'}
                  </h1>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="border rounded-lg overflow-hidden bg-gray-100 h-80 flex items-center justify-center">
                        {featuredImage ? (
                          <img 
                            src={featuredImage} 
                            alt={formData.name} 
                            className="object-contain max-h-full max-w-full" 
                          />
                        ) : (
                          <div className="text-gray-400 text-center p-4">
                            <span className="block text-4xl mb-2">🖼️</span>
                            <span>Chưa có ảnh sản phẩm</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        {productVersions.length > 1 ? (
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-green-600">
                              {minPrice.toLocaleString('vi-VN')} đ
                            </span>
                            {minPrice !== maxPrice && (
                              <span className="text-2xl font-bold text-green-600">
                                {' – '}{maxPrice.toLocaleString('vi-VN')} đ
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-green-600">
                              {selectedVersion.price.toLocaleString('vi-VN')} đ
                            </span>
                            {selectedVersion.originalPrice > selectedVersion.price && (
                              <span className="text-lg line-through text-gray-500 ml-2">
                                {selectedVersion.originalPrice.toLocaleString('vi-VN')} đ
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-gray-700">
                          {formData.shortDescription || 'Mô tả ngắn về sản phẩm sẽ hiển thị ở đây'}
                        </p>
                      </div>
                      
                      {features.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <ul className="space-y-1">
                            {features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">–</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {productVersions.length > 0 && (
                        <div>
                          <div className="mb-2 font-medium">Loại</div>
                          <select 
                            className="w-full p-2 border border-gray-300 rounded"
                            value={selectedVersionId}
                            onChange={(e) => setSelectedVersionId(parseInt(e.target.value))}
                          >
                            {productVersions.map(version => (
                              <option key={version.id} value={version.id}>
                                {version.name} {version.description ? `(${version.description})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {warranty && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <span>🔄</span>
                          <span>{warranty}</span>
                        </div>
                      )}
                      
                      <div>
                        <button className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                          Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="border-b border-gray-200 mb-4">
                      <div className="inline-block py-2 px-4 border-b-2 border-primary-500 font-medium text-primary-600">
                        Mô tả chi tiết
                      </div>
                    </div>
                    
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.description || '<p>Mô tả chi tiết sản phẩm sẽ hiển thị ở đây</p>' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(NewProductPage); 