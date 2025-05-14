'use client'

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAdminAuth from '@/components/withAdminAuth';
import Image from 'next/image';
import RichTextEditor from '@/components/common/RichTextEditor';
import { slugify } from '@/utils/slugify';

// Định nghĩa hàm slugify
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  // Hình ảnh và dữ liệu
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Thêm phần features (Đặc điểm nổi bật)
  const [newFeature, setNewFeature] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [isEditingFeatures, setIsEditingFeatures] = useState(false);
  
  // Thêm thông tin bảo hành
  const [warranty, setWarranty] = useState('');
  const [isEditingWarranty, setIsEditingWarranty] = useState(false);
  
  // Thêm state cho mô tả kỹ thuật
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  
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
  const [selectedVersionId, setSelectedVersionId] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    isPublished: true,
    categoryId: '',
  });

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
           url.startsWith('http://') ||
           url.startsWith('/images/');
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
    
    try {
      // Tạo form data để upload file
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload hình ảnh lên server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải lên hình ảnh');
      }
      
      const data = await response.json();
      // Lấy URL thực từ server thay vì dùng blob URL
      const imageUrl = data.url || data.filepath || data.fileUrl;
      
      if (!imageUrl) {
        throw new Error('URL hình ảnh không hợp lệ');
      }
      
      setFeaturedImage(imageUrl);
    } catch (err) {
      console.error('Lỗi khi upload hình ảnh:', err);
      setError((err as Error).message || 'Không thể tải lên hình ảnh');
      setTimeout(() => setError(null), 3000);
      
      // Fallback to blob URL if server upload fails
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage(imageUrl);
    }
    
    // Reset input file
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = '';
    }
  };
  
  // Xử lý upload hình ảnh mô tả
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
    
    try {
      // Tạo form data để upload file
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload hình ảnh lên server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải lên hình ảnh');
      }
      
      const data = await response.json();
      // Lấy URL thực từ server thay vì dùng blob URL
      const imageUrl = data.url || data.filepath || data.fileUrl;
      
      if (!imageUrl) {
        throw new Error('URL hình ảnh không hợp lệ');
      }
      
      setDescriptionImages([...descriptionImages, imageUrl]);
    } catch (err) {
      console.error('Lỗi khi upload hình ảnh:', err);
      setError((err as Error).message || 'Không thể tải lên hình ảnh');
      setTimeout(() => setError(null), 3000);
      
      // Fallback to blob URL if server upload fails
      const imageUrl = URL.createObjectURL(file);
      setDescriptionImages([...descriptionImages, imageUrl]);
    }
    
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Xử lý xóa ảnh đại diện
  const handleRemoveFeaturedImage = () => {
    setFeaturedImage(null);
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = '';
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
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

  // Cập nhật phiên bản hiện tại
  const handleUpdateSelectedVersion = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    
    // Tìm và cập nhật phiên bản đang chọn
    const updatedVersions = productVersions.map(version => {
      if (version.id === selectedVersionId) {
        // Nếu đang cập nhật giá, cũng cập nhật giá gốc nếu giá gốc bằng 0 hoặc bằng giá cũ
        const updates = {
          ...version,
          [field]: field === 'price' || field === 'originalPrice' ? 
            (isNaN(numValue) ? 0 : numValue) : value
        };
        
        // Nếu cập nhật giá và chưa có giá gốc thì cập nhật giá gốc
        if (field === 'price' && (version.originalPrice === 0 || version.originalPrice === version.price)) {
          updates.originalPrice = isNaN(numValue) ? 0 : numValue;
        }
        
        return updates;
      }
      return version;
    });
    
    setProductVersions(updatedVersions);
  };

  // Xử lý thêm hình ảnh mô tả từ URL
  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && isValidImageUrl(newImageUrl)) {
      setDescriptionImages([...descriptionImages, newImageUrl]);
      setNewImageUrl('');
    } else {
      setError('URL hình ảnh không hợp lệ. Vui lòng kiểm tra lại.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Xử lý thêm sản phẩm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Xác thực dữ liệu đầu vào
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Tên sản phẩm là bắt buộc');
    if (!formData.description.trim()) errors.push('Mô tả sản phẩm là bắt buộc');
    
    // Đảm bảo có ít nhất một phiên bản
    if (productVersions.length === 0) {
      errors.push('Sản phẩm phải có ít nhất một phiên bản');
    }
    
    // Đảm bảo có hình đại diện
    if (!featuredImage) {
      errors.push('Sản phẩm phải có hình đại diện');
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    setLoading(true);
    
    try {
      // Tạo danh sách hình ảnh, với featuredImage là hình đầu tiên
      const productImages = featuredImage ? [featuredImage] : [];
      
      // Lưu đúng đường dẫn cho descriptionImages
      const sanitizedDescriptionImages = descriptionImages.map(imgUrl => {
        if (imgUrl.startsWith('/')) return imgUrl;
        return `/${imgUrl}`;
      });
      
      const versionsData = productVersions.map(version => ({
        name: version.name,
        description: version.description,
        price: version.price,
        originalPrice: version.originalPrice || version.price,
        features: []
      }));

      // Chuẩn bị dữ liệu sản phẩm để gửi lên server
      const productData = {
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        description: formData.description,
        shortDescription: formData.shortDescription,
        images: productImages,
        descriptionImages: sanitizedDescriptionImages,
        features: features,
        specifications: specifications,
        categories: [formData.categoryId],
        isPublished: true,
        rating: "4.7",
        weeklyPurchases: 0,
        versions: versionsData
      };
      
      console.log('Dữ liệu sản phẩm gửi lên:', productData);
      
      // Gửi dữ liệu lên server
      const response = await fetch('/api/products/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Đã xảy ra lỗi khi tạo sản phẩm');
      }
      
      // Hiển thị thông báo thành công
      setSuccessMessage('Sản phẩm đã được tạo thành công!');
      
      // Chuyển hướng đến trang danh sách sản phẩm sau 2 giây
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
      
    } catch (err) {
      console.error('Lỗi khi tạo sản phẩm:', err);
      setError((err as Error).message || 'Đã xảy ra lỗi khi tạo sản phẩm');
      setTimeout(() => setError(null), 5000);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="bg-blue-100 py-2 px-4 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors text-sm"
          >
            {showAdvancedOptions ? 'Ẩn tùy chọn nâng cao' : 'Tùy chọn nâng cao'}
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Giao diện chính giống giao diện sản phẩm trong hình */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            {/* Tiêu đề sản phẩm */}
            <div className="flex-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tên sản phẩm"
                className="text-2xl font-bold w-full p-2 border border-transparent hover:border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            {/* Công khai sản phẩm */}
            <div className="flex items-center ml-4">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                Công khai ngay
              </label>
            </div>
          </div>
          
          {/* Giá sản phẩm */}
          <div className="text-xl mb-6">
            {productVersions.length > 1 ? (
              <div className="font-bold text-green-600 text-2xl">
                {minPrice.toLocaleString('vi-VN')} đ
                {minPrice !== maxPrice && (
                  <span>
                    {' – '}{maxPrice.toLocaleString('vi-VN')} đ
                  </span>
                )}
              </div>
            ) : (
              <div className="font-bold text-green-600 text-2xl flex items-center space-x-3">
                <input 
                  type="number" 
                  value={selectedVersion.price || 0}
                  onChange={(e) => handleUpdateSelectedVersion(e, 'price')}
                  className="w-32 p-1 bg-transparent border-b border-green-500 focus:outline-none text-2xl font-bold text-green-600"
                  min="0"
                  step="1000"
                />
                <span>đ</span>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    value={selectedVersion.originalPrice || 0}
                    onChange={(e) => handleUpdateSelectedVersion(e, 'originalPrice')}
                    className="w-32 p-1 bg-transparent border-b border-gray-300 focus:outline-none text-lg line-through text-gray-500"
                    min="0"
                    step="1000"
                  />
                  <span className="text-lg line-through text-gray-500">đ</span>
                  
                  {/* Hiển thị phần trăm giảm giá - luôn hiển thị */}
                  {selectedVersion.originalPrice > 0 && (
                    <span className="ml-2 bg-red-100 text-red-700 text-sm px-2 py-1 rounded">
                      {selectedVersion.originalPrice > selectedVersion.price ? 
                        `-${Math.round((1 - selectedVersion.price / selectedVersion.originalPrice) * 100)}%` : 
                        '0%'}
                    </span>
                  )}
                </div>
                {selectedVersion.originalPrice === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      // Thêm giá gốc bằng cách nhân giá hiện tại với 1.2 (tăng 20%)
                      const updatedVersions = productVersions.map(version => {
                        if (version.id === selectedVersionId) {
                          return {
                            ...version,
                            originalPrice: Math.ceil(version.price * 1.2 / 1000) * 1000 // Làm tròn lên đến 1000đ
                          };
                        }
                        return version;
                      });
                      setProductVersions(updatedVersions);
                    }}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    + Thêm giá gốc
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phần hình ảnh và upload */}
            <div>
              <div className="border rounded-lg overflow-hidden bg-gray-100 aspect-square max-w-sm mx-auto flex items-center justify-center mb-3 relative">
                {featuredImage ? (
                  <>
                    <img 
                      src={featuredImage} 
                      alt={formData.name} 
                      className="object-contain max-w-full max-h-full" 
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFeaturedImage}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <span className="block text-3xl mb-2">🖼️</span>
                    <span className="text-sm">Chưa có ảnh sản phẩm</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex">
                  <input
                    type="text"
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    placeholder="Nhập URL ảnh"
                    className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeaturedImageUrl}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
                
                <label className="block text-gray-600 text-sm">Hoặc tải lên từ máy tính:</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={featuredImageInputRef}
                  onChange={handleFeaturedImageUpload}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            {/* Phần thông tin sản phẩm */}
            <div className="space-y-4">
              {/* Danh mục */}
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
              
              {/* Mô tả ngắn */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mô tả ngắn <span className="text-red-500">*</span>
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
              
              {/* Thêm hình ảnh mô tả */}
              {isEditingDescription && (
                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Hình ảnh mô tả
                  </label>
                  <div className="space-y-3">
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
                    
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  
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
                                  onClick={() => navigator.clipboard.writeText(imageUrl)}
                                  className="text-xs bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600 transition-colors"
                                >
                                  Sao chép URL
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = [...descriptionImages];
                                    newImages.splice(index, 1);
                                    setDescriptionImages(newImages);
                                  }}
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
              )}
              
              {/* Đặc điểm nổi bật */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-700 font-medium">
                    Đặc điểm nổi bật
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingFeatures(!isEditingFeatures)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    {isEditingFeatures ? 'Xong' : 'Chỉnh sửa'}
                  </button>
                </div>
                
                {isEditingFeatures ? (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Thêm đặc điểm mới"
                        className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 transition-colors"
                      >
                        Thêm
                      </button>
                    </div>
                    
                    {features.length > 0 && (
                      <ul className="space-y-1 mt-2">
                        {features.map((feature, index) => (
                          <li key={index} className="flex justify-between items-center bg-white p-2 rounded">
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
                    )}
                  </div>
                ) : (
                  features.length > 0 ? (
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
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
                      Chưa có đặc điểm nổi bật nào. Nhấn "Chỉnh sửa" để thêm.
                    </div>
                  )
                )}
              </div>
              
              {/* Bảo hành */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-700 font-medium">
                    Thông tin bảo hành
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingWarranty(!isEditingWarranty)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    {isEditingWarranty ? 'Xong' : 'Chỉnh sửa'}
                  </button>
                </div>
                
                {isEditingWarranty ? (
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="Ví dụ: Bảo hành 1 đổi 1 trong 30 ngày"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  warranty ? (
                    <div className="flex items-center space-x-2 text-blue-600 p-2 bg-blue-50 rounded-lg">
                      <span>🔄</span>
                      <span>{warranty}</span>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
                      Chưa có thông tin bảo hành. Nhấn "Chỉnh sửa" để thêm.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Phần phiên bản sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Phiên bản sản phẩm</h2>
          </div>
          
          {productVersions.length > 0 && (
            <div className="mb-6">
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
        
        {/* Phần mô tả chi tiết */}
        {showAdvancedOptions && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Mô tả chi tiết</h2>
              {isEditingDescription ? (
                <button 
                  type="button" 
                  onClick={() => setIsEditingDescription(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Xem trước
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setIsEditingDescription(true)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            
            {isEditingDescription ? (
              <RichTextEditor
                value={formData.description}
                onChange={handleRichTextChange}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                className="mb-1"
              />
            ) : (
              <div className="prose max-w-none border p-4 rounded min-h-[200px]" dangerouslySetInnerHTML={{ __html: formData.description || '<p>Chưa có mô tả chi tiết</p>' }} />
            )}
            <p className="text-sm text-gray-500 mt-1">
              Mô tả chi tiết về sản phẩm (hiển thị ở trang chi tiết). Dán hình ảnh trực tiếp (Ctrl+V) vào ô soạn thảo. 
              Bạn có thể chỉnh kích cỡ, độ đậm của chữ và căn giữa các ảnh bằng thanh công cụ phía trên khi đang chỉnh sửa.
            </p>
          </div>
        )}
        
        {/* Thông số kỹ thuật */}
        {showAdvancedOptions && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
        )}
        
        {/* Nút bấm tạo sản phẩm */}
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