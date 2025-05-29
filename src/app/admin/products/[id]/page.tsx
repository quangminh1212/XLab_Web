'use client'

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/ProductModel';
import withAdminAuth from '@/components/withAdminAuth';
import Image from 'next/image';
import RichTextEditor from '@/components/common/RichTextEditor';
import { v4 as uuidv4 } from 'uuid';

// Danh sách các tùy chọn thời hạn
const durationOptions = [
  { value: '1week', label: '1 Tuần' },
  { value: '1month', label: '1 Tháng' },
  { value: '3months', label: '3 Tháng' },
  { value: '6months', label: '6 Tháng' },
  { value: '1year', label: '1 Năm' },
  { value: '2years', label: '2 Năm' },
  { value: 'lifetime', label: 'Vĩnh viễn' }
];

interface AdminEditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const router = useRouter();
  
  // Unwrap params Promise với React.use() theo chuẩn Next.js mới
  const { id } = React.use(params);
  const productId = id;
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

  // Thêm state cho quản lý thời hạn theo từng tùy chọn sản phẩm
  const [optionDurations, setOptionDurations] = useState<{[key: string]: string}>({});

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
        
        // Tải thời hạn cho từng tùy chọn sản phẩm nếu có
        if (productData.optionDurations && typeof productData.optionDurations === 'object') {
          setOptionDurations(productData.optionDurations);
        } else {
          setOptionDurations({});
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

  // Helper to generate slug from name
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

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
      
      // Append productSlug and productName for uploads
      const slug = product?.slug || generateSlug(formData.name);
      uploadFormData.append('productSlug', slug);
      uploadFormData.append('productName', formData.name);
      
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
      
      // Append productSlug and productName for uploads
      const slug = product?.slug || generateSlug(formData.name);
      uploadFormData.append('productSlug', slug);
      uploadFormData.append('productName', formData.name);
      
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
      
      // Thêm thời hạn mặc định cho tùy chọn mới
      setOptionDurations(prev => ({
        ...prev,
        [newOption]: '1month' // Mặc định là 1 tháng
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
    
    // Xóa thời hạn của tùy chọn
    setOptionDurations(prev => {
      const newDurations = {...prev};
      delete newDurations[option];
      return newDurations;
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
    
    try {
      setIsSubmitting(true);
      
      // Basic validation
      if (!formData.name.trim()) {
        setError('Vui lòng nhập tên sản phẩm');
        return;
      }
      
      // Đảm bảo có ít nhất một giá hợp lệ (lớn hơn 0)
      let hasValidPrice = false;
      
      // Kiểm tra giá trong các tùy chọn sản phẩm
      if (Object.keys(optionPrices).length > 0) {
        for (const option of Object.keys(optionPrices)) {
          if (optionPrices[option].price > 0) {
            hasValidPrice = true;
            break;
          }
        }
      }
      
      // Kiểm tra giá cơ bản nếu vẫn chưa có giá hợp lệ
      if (!hasValidPrice && formData.price > 0) {
        hasValidPrice = true;
      }
      
      if (!hasValidPrice) {
        setError('Sản phẩm cần có ít nhất một giá hợp lệ (lớn hơn 0)');
        setIsSubmitting(false);
        return;
      }
      
      // Slug generation
      const slug = generateSlug(formData.name);
      
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
        optionPrices: optionPrices,
        // Thêm thời hạn cho từng tùy chọn
        optionDurations: optionDurations
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
          
          // Append productSlug and productName for uploads
          const slug = product?.slug || generateSlug(formData.name);
          uploadFormData.append('productSlug', slug);
          uploadFormData.append('productName', formData.name);
          
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
          
          // Append productSlug and productName for uploads
          const slug = product?.slug || generateSlug(formData.name);
          uploadFormData.append('productSlug', slug);
          uploadFormData.append('productName', formData.name);
          
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Đánh giá sao */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <label className="block text-sm font-medium text-gray-700 mb-3">Đánh giá sao</label>
              <div className="flex items-center justify-center flex-col space-y-3">
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary-600">{Number(formData.rating).toFixed(1)}</span>
                </div>
                <div className="flex text-2xl justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, rating: star}))}
                      className={`focus:outline-none transition-colors duration-200 ${
                        star <= Math.round(formData.rating) 
                          ? "text-yellow-400 hover:text-yellow-500" 
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="w-full">
                  <input 
                    type="range" 
                    name="rating"
                    value={formData.rating}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData(prev => ({...prev, rating: value}));
                    }}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
                <div className="flex justify-between w-full text-xs text-gray-500">
                  <span>Kém</span>
                  <span>Tuyệt vời</span>
                </div>
              </div>
            </div>
            
            {/* Số lượng mua trong tuần */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <label className="block text-sm font-medium text-gray-700 mb-3">Số lượng mua trong tuần</label>
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <input 
                    type="number" 
                    name="weeklyPurchases"
                    value={formData.weeklyPurchases}
                    onChange={handleInputChange}
                    min="0"
                    className="pl-10 block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex rounded-lg overflow-hidden">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (formData.weeklyPurchases > 0) {
                        setFormData(prev => ({...prev, weeklyPurchases: prev.weeklyPurchases - 1}));
                      }
                    }}
                    className="bg-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-300 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setFormData(prev => ({...prev, weeklyPurchases: prev.weeklyPurchases + 1}));
                    }}
                    className="bg-primary-100 px-3 py-2 text-primary-600 hover:bg-primary-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (formData.weeklyPurchases / 100) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>0</span>
                <span>100+</span>
              </div>
            </div>
            
            {/* Loại sản phẩm */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <label className="block text-sm font-medium text-gray-700 mb-3">Loại sản phẩm</label>
              <div className="space-y-3">
                <label className="inline-flex items-center w-full">
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
                  <span className="ml-3 text-gray-700">Phần mềm</span>
                </label>
                <label className="inline-flex items-center w-full">
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
                  <span className="ml-3 text-gray-700">Tài khoản</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Phần hình ảnh sản phẩm */}
            <div className="xl:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-medium mb-4 text-gray-900">Hình ảnh sản phẩm</h3>
                <div className="flex justify-center mb-4">
                  <div className="border rounded-lg overflow-hidden bg-white aspect-square w-full max-w-xs flex items-center justify-center relative"
                    onPaste={handlePasteImage} 
                    tabIndex={0}
                    style={{ outline: 'none' }}
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
                        <span className="block text-4xl mb-2">🖼️</span>
                        <span className="text-sm font-medium">Chưa có ảnh sản phẩm</span>
                        <p className="text-xs mt-2">Nhấn Ctrl+V để dán ảnh từ clipboard</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={featuredImageInputRef}
                    onChange={handleFeaturedImageUpload}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Phần tùy chọn và mô tả sản phẩm */}
            <div className="xl:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 h-full">
                {/* Tùy chọn sản phẩm */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Tùy chọn sản phẩm
                    <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">
                      {productOptions.length} tùy chọn
                    </span>
                  </h3>
                  
                  {/* Form thêm tùy chọn mới */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thêm tùy chọn mới</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newProductOption}
                        onChange={(e) => setNewProductOption(e.target.value)}
                        placeholder="Nhập tùy chọn mới (VD: Premium, Basic, Standard)"
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddProductOption();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddProductOption}
                        disabled={!newProductOption.trim()}
                        className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                  
                  {/* Danh sách tùy chọn */}
                  <div className="bg-gray-50 rounded-lg min-h-[200px]">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Danh sách tùy chọn</h4>
                        {productOptions.length > 0 && (
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {productOptions.length > 1 ? 'Kéo thả để sắp xếp' : ''}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {productOptions.map((option, index) => (
                          <div key={index} className="relative">
                            {/* Indicator mặc định */}
                            {option === defaultProductOption && (
                              <div className="absolute -left-1 top-0 bottom-0 w-1 bg-teal-500 rounded-r"></div>
                            )}
                            
                            <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                              {/* Header của tùy chọn */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-gray-900 text-base">{option}</h5>
                                  {option === defaultProductOption && (
                                    <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
                                      ⭐ Mặc định
                                    </span>
                                  )}
                                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    #{index + 1}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => handleSetDefaultOption(option)}
                                    className={`p-1.5 rounded transition-all duration-200 ${
                                      option === defaultProductOption 
                                        ? 'bg-teal-100 text-teal-600' 
                                        : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
                                    }`}
                                    title="Đặt làm mặc định"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveProductOption(index)}
                                    className="text-red-500 hover:text-red-700 p-1.5 rounded transition-colors duration-200 hover:bg-red-50"
                                    title="Xóa tùy chọn"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Thông tin chi tiết */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Cột 1: Thời hạn */}
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Thời hạn sử dụng</span>
                                  </div>
                                  <select
                                    value={optionDurations[option] || '1month'}
                                    onChange={(e) => {
                                      setOptionDurations(prev => ({
                                        ...prev,
                                        [option]: e.target.value
                                      }));
                                    }}
                                    className="w-full text-sm bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                                  >
                                    {durationOptions.map((duration) => (
                                      <option key={duration.value} value={duration.value}>
                                        {duration.label}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="mt-2 text-xs text-gray-500">
                                    Thời gian có thể sử dụng sản phẩm
                                  </div>
                                </div>
                                
                                {/* Cột 2: Giá bán */}
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Giá bán</span>
                                  </div>
                                  <div className="flex items-center">
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
                                            originalPrice: !prev[option]?.originalPrice ? price : prev[option].originalPrice
                                          }
                                        }));
                                      }}
                                      className="flex-1 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-right font-medium bg-white"
                                      min="0"
                                      step="1000"
                                      placeholder="0"
                                    />
                                    <span className="text-sm text-gray-600 ml-2 font-medium">đ</span>
                                  </div>
                                  <div className="mt-2 text-xs text-gray-500">
                                    Giá khách hàng phải trả
                                  </div>
                                </div>
                                
                                {/* Cột 3: Giá gốc & Giảm giá */}
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Giá gốc</span>
                                  </div>
                                  <div className="flex items-center mb-2">
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
                                      className="flex-1 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-600 transition-all duration-200 text-right bg-white"
                                      min="0"
                                      step="1000"
                                      placeholder="0"
                                    />
                                    <span className="text-sm text-gray-600 ml-2">đ</span>
                                  </div>
                                  {optionPrices[option]?.originalPrice > (optionPrices[option]?.price || 0) && (
                                    <div className="mt-1 text-xs">
                                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                        Giảm {Math.round(((optionPrices[option].originalPrice - optionPrices[option].price) / optionPrices[option].originalPrice) * 100)}%
                                      </span>
                                    </div>
                                  )}
                                  <div className="mt-2 text-xs text-gray-500">
                                    Giá trước khi giảm
                                  </div>
                                </div>
                              </div>
                              
                              {/* Preview tóm tắt */}
                              <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-teal-500">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">👁️ Preview:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-800">{option}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-teal-600 font-medium">
                                      {durationOptions.find(d => d.value === (optionDurations[option] || '1month'))?.label}
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="font-bold text-green-600">
                                      {(optionPrices[option]?.price || 0).toLocaleString()}đ
                                    </span>
                                    {optionPrices[option]?.originalPrice > (optionPrices[option]?.price || 0) && (
                                      <>
                                        <span className="text-gray-400 line-through text-xs">
                                          {(optionPrices[option]?.originalPrice || 0).toLocaleString()}đ
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {productOptions.length === 0 && (
                          <div className="text-gray-500 text-center p-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="font-medium text-lg mb-2">Chưa có tùy chọn nào</p>
                            <p className="text-sm mb-4">Thêm các tùy chọn khác nhau cho sản phẩm của bạn</p>
                            <div className="text-xs text-gray-400 space-y-1">
                              <p><strong>Ví dụ cho Software:</strong> Premium, Basic, Standard</p>
                              <p><strong>Ví dụ cho Account:</strong> Pro, Starter, Enterprise</p>
                              <p><strong>Ví dụ theo thời hạn:</strong> 1 Tháng, 6 Tháng, 1 Năm</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mô tả ngắn */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium mb-4 text-gray-900">Mô tả ngắn</h3>
                  <div onPaste={handlePasteDescriptionImage}>
                    <RichTextEditor
                      value={formData.shortDescription}
                      onChange={handleShortDescRichTextChange}
                      placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị ở trang danh sách)"
                      className="min-h-[180px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        
        <div className="sticky bottom-5 left-0 right-0 bg-white shadow-md rounded-lg p-4 border border-gray-200 flex justify-between items-center z-10">
          <div>
            {isNew ? (
              <span className="text-sm text-primary-600 font-medium">
                Tạo sản phẩm mới
              </span>
            ) : (
              <span className="text-sm text-primary-600 font-medium">
                Cập nhật sản phẩm: <span className="font-bold">{formData.name}</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-6 py-2 rounded-md transition-all duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(AdminEditProductPage); 