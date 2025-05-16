'use client'

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/ProductModel';
import withAdminAuth from '@/components/withAdminAuth';
import Image from 'next/image';
import RichTextEditor from '@/components/common/RichTextEditor';
import { v4 as uuidv4 } from 'uuid';

interface AdminEditProductPageProps {
  params: {
    id: string;
  };
}

// Thêm component hiển thị lợi ích của sản phẩm
const ProductBenefits = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Giao hàng<br/>nhanh chóng</h3>
      <p className="text-xs text-gray-600 text-center">Giao tài khoản ngay trong vòng 5h sau khi nhận được thanh toán.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Rẻ nhất<br/>thị trường</h3>
      <p className="text-xs text-gray-600 text-center">Cam kết giá rẻ nhất thị trường, tiết kiệm lên đến 90% so với giá gốc.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Bảo hành<br/>1 đổi 1</h3>
      <p className="text-xs text-gray-600 text-center">Đổi tài khoản mới ngay trong 24h nếu tài khoản phát sinh lỗi.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Hỗ trợ<br/>nhanh chóng</h3>
      <p className="text-xs text-gray-600 text-center">Chúng tôi sẵn sàng hỗ trợ mọi khó khăn trong quá trình sử dụng tài khoản.</p>
    </div>
  </div>
);

function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const router = useRouter();
  
  // Use React.use to unwrap params object properly at the component level
  // Type assertion to inform TypeScript about the expected type
  const safeParams = React.use(params as any) as { id: string };
  const productId = safeParams.id;
  const isNew = productId === 'new';
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    isPublished: false,
    price: 0,
    salePrice: 0,
    categories: [] as string[],
    specs: '',
    rating: 5,
    weeklyPurchases: 0,
    type: 'software' as 'software' | 'account',
    isAccount: false
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);
  
  // Thêm state cho mô tả kỹ thuật
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm state cho quản lý tùy chọn sản phẩm
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [newProductOption, setNewProductOption] = useState('');
  const [defaultProductOption, setDefaultProductOption] = useState('');
  
  // Thêm state cho quản lý giá theo từng tùy chọn sản phẩm
  const [optionPrices, setOptionPrices] = useState<{[key: string]: {price: number, originalPrice: number}}>({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${productId}`);
        
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
          salePrice: productData.versions?.[0]?.originalPrice || 0,
          categories: productData.categories ? productData.categories.map((c: any) => c.id) : [],
          specs: productData.specifications ? productData.specifications.map((spec: {key: string, value: string}) => spec.key + ': ' + spec.value).join('\n') : '',
          rating: productData.rating !== undefined ? productData.rating : 5,
          weeklyPurchases: productData.weeklyPurchases || 0,
          type: productData.type || 'software',
          isAccount: productData.isAccount || productData.type === 'account' || false
        });
        
        // Tải thông tin tùy chọn sản phẩm nếu có
        if (productData.productOptions && Array.isArray(productData.productOptions)) {
          setProductOptions(productData.productOptions);
        } else {
          // Không có tùy chọn ban đầu
          setProductOptions([]);
        }
        
        // Tải giá cho từng tùy chọn sản phẩm nếu có
        if (productData.optionPrices && typeof productData.optionPrices === 'object') {
          setOptionPrices(productData.optionPrices);
        } else {
          setOptionPrices({});
        }
        
        // Tải tùy chọn mặc định
        if (productData.defaultProductOption) {
          setDefaultProductOption(productData.defaultProductOption);
        } else if (productData.productOptions && productData.productOptions.length > 0) {
          setDefaultProductOption(productData.productOptions[0]);
        } else {
          // Không có tùy chọn mặc định
          setDefaultProductOption('');
        }
        
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

    if (!isNew && productId) {
      fetchProduct();
    } else {
      // Skip fetch in creation mode
      setLoading(false);
    }
  }, [productId, isNew]);

  // Kiểm tra URL hình ảnh có hợp lệ không
  const isValidImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || 
           url.startsWith('https://') || 
           url.startsWith('http://') ||
           url.startsWith('/images/');
  };

  // Hàm lấy tên danh mục từ ID
  const getCategoryName = (id: string): string => {
    const categories = [
      { id: 'office-software', name: 'Phần mềm văn phòng' },
      { id: 'business-solutions', name: 'Giải pháp doanh nghiệp' },
      { id: 'security-software', name: 'Phần mềm bảo mật' },
      { id: 'data-protection', name: 'Bảo vệ dữ liệu' },
      { id: 'design-software', name: 'Phần mềm thiết kế' },
      { id: 'ai-tools', name: 'Công cụ AI' },
    ];
    
    const category = categories.find(c => c.id === id);
    return category ? category.name : id;
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
    
    try {
      // Tạo form data để upload file
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      // Nếu có thông tin sản phẩm, thêm slug và tên sản phẩm vào form data
      if (product && product.slug) {
        uploadFormData.append('productSlug', product.slug);
        uploadFormData.append('productName', product.name || '');
      }
      
      // Upload hình ảnh lên server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
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
  
  // Xử lý upload ảnh đại diện
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    console.log("Uploading featured image:", file.name);
    
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
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      // Nếu có thông tin sản phẩm, thêm slug và tên sản phẩm vào form data
      if (product && product.slug) {
        uploadFormData.append('productSlug', product.slug);
        uploadFormData.append('productName', product.name || '');
      }
      
      // Upload hình ảnh lên server
      console.log("Sending upload request to /api/upload");
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload error:", errorData);
        throw new Error('Không thể tải lên hình ảnh: ' + (errorData.error || response.statusText));
      }
      
      const data = await response.json();
      console.log("Upload response data:", data);
      
      // Lấy URL thực từ server thay vì dùng blob URL
      const imageUrl = data.url || data.filepath || data.fileUrl;
      
      if (!imageUrl) {
        throw new Error('URL hình ảnh không hợp lệ');
      }
      
      console.log("Setting featured image to:", imageUrl);
      setFeaturedImage(imageUrl);
    } catch (err) {
      console.error('Lỗi khi upload hình ảnh:', err);
      setError((err as Error).message || 'Không thể tải lên hình ảnh');
      setTimeout(() => setError(null), 3000);
      
      // Fallback to blob URL if server upload fails
      const imageUrl = URL.createObjectURL(file);
      console.log("Using fallback blob URL:", imageUrl);
      setFeaturedImage(imageUrl);
    }
    
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

  // Xử lý thêm tùy chọn mới
  const handleAddProductOption = () => {
    if (newProductOption.trim()) {
      const newOption = newProductOption.trim();
      setProductOptions([...productOptions, newOption]);
      setNewProductOption('');
      
      // Thêm giá mặc định cho tùy chọn mới
      setOptionPrices(prev => ({
        ...prev,
        [newOption]: {
          price: formData.price || 0,
          originalPrice: formData.salePrice || 0
        }
      }));
      
      // Nếu chưa có tùy chọn mặc định, đặt tùy chọn đầu tiên làm mặc định
      if (!defaultProductOption && productOptions.length === 0) {
        setDefaultProductOption(newOption);
      }
    }
  };
  
  // Xử lý xóa tùy chọn
  const handleRemoveProductOption = (index: number) => {
    const option = productOptions[index];
    const newOptions = [...productOptions];
    newOptions.splice(index, 1);
    setProductOptions(newOptions);
    
    // Xóa giá của tùy chọn
    setOptionPrices(prev => {
      const newPrices = {...prev};
      delete newPrices[option];
      return newPrices;
    });
    
    // Nếu xóa tùy chọn mặc định, chọn tùy chọn đầu tiên còn lại làm mặc định
    if (option === defaultProductOption) {
      if (newOptions.length > 0) {
        setDefaultProductOption(newOptions[0]);
      } else {
        setDefaultProductOption('');
      }
    }
  };
  
  // Xử lý đặt tùy chọn mặc định
  const handleSetDefaultOption = (option: string) => {
    setDefaultProductOption(option);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên sản phẩm');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Prepare product data to send to API
      const productData = {
        id: productId,
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        isPublished: formData.isPublished,
        specifications: specifications,
        specs: formData.specs,
        rating: formData.rating,
        weeklyPurchases: formData.weeklyPurchases,
        type: formData.type,
        isAccount: formData.isAccount,
        versions: [
          {
            name: 'Default',
            description: 'Phiên bản mặc định',
            price: formData.price,
            originalPrice: formData.salePrice,
            features: []
          }
        ],
        categories: formData.categories.map(id => ({ id })),
        descriptionImages: descriptionImages,
        images: featuredImage ? [featuredImage] : [],
        // Thêm dữ liệu tùy chọn sản phẩm
        productOptions: productOptions,
        defaultProductOption: defaultProductOption,
        // Thêm giá cho từng tùy chọn
        optionPrices: optionPrices
      };
      
      console.log("Saving product data:", JSON.stringify(productData, null, 2));
      
      // Send the request for create or update
      const url = isNew ? '/api/products/new' : `/api/admin/products/${productId}`;
      const method = isNew ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error(isNew ? 'Không thể tạo sản phẩm' : 'Không thể cập nhật sản phẩm');
      }
      
      const result = await response.json();
      // For update, set product state; for create, skip
      if (!isNew) {
        setProduct(result);
      }
      setSuccessMessage(isNew ? 'Sản phẩm đã được tạo thành công!' : 'Sản phẩm đã được cập nhật thành công!');
      // Redirect or hide message
      if (isNew) {
        setTimeout(() => router.push('/admin/products'), 2000);
      } else {
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      
    } catch (err) {
      setError((err as Error).message);
      console.error('Error updating product:', err);
    } finally {
      setIsSubmitting(false);
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

  // Thêm hàm xử lý paste ảnh từ clipboard
  const handlePasteImage = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    // Tìm kiếm hình ảnh trong clipboard
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (!file) continue;
        
        // Giới hạn kích thước file là 5MB
        if (file.size > 5 * 1024 * 1024) {
          setError('Kích thước file không được vượt quá 5MB');
          setTimeout(() => setError(null), 3000);
          return;
        }
        
        try {
          // Tạo form data để upload file
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          
          // Nếu có thông tin sản phẩm, thêm slug và tên sản phẩm vào form data
          if (product && product.slug) {
            uploadFormData.append('productSlug', product.slug);
            uploadFormData.append('productName', product.name || '');
          }
          
          // Upload hình ảnh lên server
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          });
          
          if (!response.ok) {
            throw new Error('Không thể tải lên hình ảnh');
          }
          
          const data = await response.json();
          // Lấy URL thực từ server
          const imageUrl = data.url || data.filepath || data.fileUrl;
          
          if (!imageUrl) {
            throw new Error('URL hình ảnh không hợp lệ');
          }
          
          setFeaturedImage(imageUrl);
          setSuccessMessage('Đã dán ảnh từ clipboard thành công');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          console.error('Lỗi khi upload hình ảnh từ clipboard:', err);
          setError((err as Error).message || 'Không thể tải lên hình ảnh');
          setTimeout(() => setError(null), 3000);
        }
        break;
      }
    }
  };

  // Thêm hàm xử lý paste ảnh mô tả từ clipboard
  const handlePasteDescriptionImage = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    // Tìm kiếm hình ảnh trong clipboard
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (!file) continue;
        
        // Giới hạn kích thước file là 5MB
        if (file.size > 5 * 1024 * 1024) {
          setError('Kích thước file không được vượt quá 5MB');
          setTimeout(() => setError(null), 3000);
          return;
        }
        
        try {
          // Tạo form data để upload file
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          
          // Nếu có thông tin sản phẩm, thêm slug và tên sản phẩm vào form data
          if (product && product.slug) {
            uploadFormData.append('productSlug', product.slug);
            uploadFormData.append('productName', product.name || '');
          }
          
          // Upload hình ảnh lên server
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          });
          
          if (!response.ok) {
            throw new Error('Không thể tải lên hình ảnh');
          }
          
          const data = await response.json();
          // Lấy URL thực từ server
          const imageUrl = data.url || data.filepath || data.fileUrl;
          
          if (!imageUrl) {
            throw new Error('URL hình ảnh không hợp lệ');
          }
          
          setDescriptionImages([...descriptionImages, imageUrl]);
          setSuccessMessage('Đã dán ảnh mô tả từ clipboard thành công');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          console.error('Lỗi khi upload hình ảnh từ clipboard:', err);
          setError((err as Error).message || 'Không thể tải lên hình ảnh');
          setTimeout(() => setError(null), 3000);
        }
        break;
      }
    }
  };

  if (loading) {
    return (
      <div className="container flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || (!product && !isNew)) {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isNew ? 'Tạo sản phẩm' : 'Chỉnh sửa sản phẩm'}</h1>
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
      
      <form onSubmit={handleSaveProduct}>
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
          
          {/* Thông tin đánh giá và số lượng mua */}
          <div className="flex flex-wrap gap-6 mb-2">
            {/* Đánh giá sao */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Đánh giá sao</label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-20 p-2 border border-gray-300 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex text-yellow-400 text-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Số lượng mua trong tuần */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Số lượng mua trong tuần</label>
              <input 
                type="number" 
                name="weeklyPurchases"
                value={formData.weeklyPurchases}
                onChange={handleInputChange}
                min="0"
                className="w-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* Loại sản phẩm */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Loại sản phẩm</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="software"
                    checked={formData.type === 'software'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        type: 'software',
                        isAccount: false
                      }));
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Phần mềm</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="account"
                    checked={formData.type === 'account'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        type: 'account',
                        isAccount: true
                      }));
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Tài khoản</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Danh mục sản phẩm */}
          <div className="mt-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Danh mục sản phẩm</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className={`relative overflow-hidden rounded-lg transition-all duration-200 ${formData.categories.includes('phan-mem-doanh-nghiep') ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}>
                <input
                  type="checkbox"
                  id="cat-phan-mem-doanh-nghiep"
                  name="categories"
                  value="phan-mem-doanh-nghiep"
                  checked={formData.categories.includes('phan-mem-doanh-nghiep')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({...prev, categories: [...prev.categories, e.target.value]}));
                    } else {
                      setFormData(prev => ({...prev, categories: prev.categories.filter(cat => cat !== e.target.value)}));
                    }
                  }}
                  className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`p-4 flex items-center ${formData.categories.includes('phan-mem-doanh-nghiep') ? 'bg-primary-50' : 'bg-white'}`}>
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Phần mềm doanh nghiệp</h3>
                    <span className="text-xs text-gray-500">ERP, CRM, Quản lý</span>
                  </div>
                  {formData.categories.includes('phan-mem-doanh-nghiep') && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`relative overflow-hidden rounded-lg transition-all duration-200 ${formData.categories.includes('ung-dung-van-phong') ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}>
                <input
                  type="checkbox"
                  id="cat-ung-dung-van-phong"
                  name="categories"
                  value="ung-dung-van-phong"
                  checked={formData.categories.includes('ung-dung-van-phong')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({...prev, categories: [...prev.categories, e.target.value]}));
                    } else {
                      setFormData(prev => ({...prev, categories: prev.categories.filter(cat => cat !== e.target.value)}));
                    }
                  }}
                  className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`p-4 flex items-center ${formData.categories.includes('ung-dung-van-phong') ? 'bg-primary-50' : 'bg-white'}`}>
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Ứng dụng văn phòng</h3>
                    <span className="text-xs text-gray-500">Office, PDF, Tài liệu</span>
                  </div>
                  {formData.categories.includes('ung-dung-van-phong') && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`relative overflow-hidden rounded-lg transition-all duration-200 ${formData.categories.includes('phan-mem-do-hoa') ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}>
                <input
                  type="checkbox"
                  id="cat-phan-mem-do-hoa"
                  name="categories"
                  value="phan-mem-do-hoa"
                  checked={formData.categories.includes('phan-mem-do-hoa')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({...prev, categories: [...prev.categories, e.target.value]}));
                    } else {
                      setFormData(prev => ({...prev, categories: prev.categories.filter(cat => cat !== e.target.value)}));
                    }
                  }}
                  className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`p-4 flex items-center ${formData.categories.includes('phan-mem-do-hoa') ? 'bg-primary-50' : 'bg-white'}`}>
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Phần mềm đồ họa</h3>
                    <span className="text-xs text-gray-500">Thiết kế, Chỉnh sửa ảnh</span>
                  </div>
                  {formData.categories.includes('phan-mem-do-hoa') && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`relative overflow-hidden rounded-lg transition-all duration-200 ${formData.categories.includes('bao-mat-antivirus') ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}>
                <input
                  type="checkbox"
                  id="cat-bao-mat-antivirus"
                  name="categories"
                  value="bao-mat-antivirus"
                  checked={formData.categories.includes('bao-mat-antivirus')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({...prev, categories: [...prev.categories, e.target.value]}));
                    } else {
                      setFormData(prev => ({...prev, categories: prev.categories.filter(cat => cat !== e.target.value)}));
                    }
                  }}
                  className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`p-4 flex items-center ${formData.categories.includes('bao-mat-antivirus') ? 'bg-primary-50' : 'bg-white'}`}>
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Bảo mật & Antivirus</h3>
                    <span className="text-xs text-gray-500">Antivirus, Firewall, VPN</span>
                  </div>
                  {formData.categories.includes('bao-mat-antivirus') && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`relative overflow-hidden rounded-lg transition-all duration-200 ${formData.categories.includes('ung-dung-giao-duc') ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}>
                <input
                  type="checkbox"
                  id="cat-ung-dung-giao-duc"
                  name="categories"
                  value="ung-dung-giao-duc"
                  checked={formData.categories.includes('ung-dung-giao-duc')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({...prev, categories: [...prev.categories, e.target.value]}));
                    } else {
                      setFormData(prev => ({...prev, categories: prev.categories.filter(cat => cat !== e.target.value)}));
                    }
                  }}
                  className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`p-4 flex items-center ${formData.categories.includes('ung-dung-giao-duc') ? 'bg-primary-50' : 'bg-white'}`}>
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Ứng dụng giáo dục</h3>
                    <span className="text-xs text-gray-500">Học tập, Ngoại ngữ</span>
                  </div>
                  {formData.categories.includes('ung-dung-giao-duc') && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`relative overflow-hidden rounded-lg transition-all duration-200 ${formData.categories.includes('tai-khoan-hoc-tap') ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}>
                <input
                  type="checkbox"
                  id="cat-tai-khoan-hoc-tap"
                  name="categories"
                  value="tai-khoan-hoc-tap"
                  checked={formData.categories.includes('tai-khoan-hoc-tap')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({...prev, categories: [...prev.categories, e.target.value]}));
                    } else {
                      setFormData(prev => ({...prev, categories: prev.categories.filter(cat => cat !== e.target.value)}));
                    }
                  }}
                  className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`p-4 flex items-center ${formData.categories.includes('tai-khoan-hoc-tap') ? 'bg-primary-50' : 'bg-white'}`}>
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Tài khoản học tập</h3>
                    <span className="text-xs text-gray-500">Coursera, Udemy, Duolingo</span>
                  </div>
                  {formData.categories.includes('tai-khoan-hoc-tap') && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phần hình ảnh và upload */}
            <div className="order-last">
              <div className="border rounded-lg overflow-hidden bg-white aspect-square max-w-md mx-auto flex items-center justify-center mb-3 relative"
                onPaste={handlePasteImage} 
                tabIndex={0} // Cho phép focus để nhận sự kiện paste
                style={{ outline: 'none' }} // Ẩn đường viền khi focus
              >
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
                    <p className="text-xs mt-2">Nhấn Ctrl+V để dán ảnh từ clipboard</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={featuredImageInputRef}
                  onChange={handleFeaturedImageUpload}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            {/* Mô tả ngắn và Tùy chọn sản phẩm */}
            <div className="order-first">
              {/* Tùy chọn loại sản phẩm */}
              <div className="mb-3">
                <h3 className="text-md font-medium mb-2">Tùy chọn sản phẩm</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={newProductOption}
                    onChange={(e) => setNewProductOption(e.target.value)}
                    placeholder="Nhập tùy chọn mới (VD: Full - Dùng riêng - 6 Tháng)"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddProductOption}
                    className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
                
                {/* Danh sách tùy chọn */}
                <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {productOptions.map((option, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                        <div className="flex-1 flex items-center">
                          <span>{option}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              value={optionPrices[option]?.price || 0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                const price = isNaN(value) ? 0 : value;
                                setOptionPrices(prev => ({
                                  ...prev,
                                  [option]: {
                                    ...prev[option],
                                    price: price,
                                    // Tự động cập nhật giá gốc nếu chưa có hoặc bằng giá cũ
                                    originalPrice: !prev[option]?.originalPrice ? price : prev[option].originalPrice
                                  }
                                }));
                              }}
                              className="w-24 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                              min="0"
                              step="1000"
                              title="Giá bán"
                            />
                            <span className="text-sm text-gray-500">đ</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              value={optionPrices[option]?.originalPrice || 0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                const originalPrice = isNaN(value) ? 0 : value;
                                setOptionPrices(prev => ({
                                  ...prev,
                                  [option]: {
                                    ...prev[option],
                                    originalPrice
                                  }
                                }));
                              }}
                              className="w-24 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-500"
                              min="0"
                              step="1000"
                              title="Giá gốc"
                            />
                            <span className="text-sm text-gray-500">đ</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProductOption(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Xóa tùy chọn"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <input
                            type="radio"
                            name="defaultOption"
                            checked={option === defaultProductOption}
                            onChange={() => handleSetDefaultOption(option)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            title="Đặt làm mặc định"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {productOptions.length === 0 && (
                      <div className="text-gray-500 text-center p-2">
                        Chưa có tùy chọn nào. Hãy thêm tùy chọn ở phía trên.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả ngắn
              </label>
              <RichTextEditor
                value={formData.shortDescription}
                onChange={handleShortDescRichTextChange}
                placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị ở trang danh sách)"
                className="mb-3 min-h-[200px]"
                onPaste={handlePasteDescriptionImage}
              />
            </div>
          </div>
        </div>
        
        {/* Hiển thị lợi ích sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Lợi ích sản phẩm (Hiển thị trên trang chi tiết)</h2>
          <ProductBenefits />
          <p className="text-sm text-gray-500 mt-2">Lưu ý: Đây là phần hiển thị cố định cho tất cả sản phẩm trên trang web.</p>
        </div>
        
        {showAdvancedOptions && (
          <>
            {/* Mô tả đầy đủ */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Mô tả đầy đủ</h2>
                <button 
                  type="button" 
                  onClick={() => setIsEditingDescription(!isEditingDescription)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {isEditingDescription ? 'Xong' : 'Chỉnh sửa'}
                </button>
              </div>
              
              {isEditingDescription && (
                <RichTextEditor
                  value={formData.description}
                  onChange={handleRichTextChange}
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                  className="mb-4"
                />
              )}
              
              {/* Xem trước mô tả đầy đủ */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Xem trước mô tả đầy đủ</h3>
                
                <div className="prose max-w-none border p-4 rounded min-h-[200px]" dangerouslySetInnerHTML={{ __html: formData.description || '<p>Chưa có mô tả chi tiết</p>' }} />
              </div>
            </div>
            
            {/* Thông số kỹ thuật */}
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
                  <RichTextEditor
                    value={formData.specs}
                    onChange={(content) => setFormData(prev => ({ ...prev, specs: content }))}
                    placeholder="Nhập thông số kỹ thuật chi tiết..."
                    className="mb-4"
                  />
                  
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
          </>
        )}
        
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
            {loading ? 'Đang lưu...' : (isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(AdminEditProductPage); 