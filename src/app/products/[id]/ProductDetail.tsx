'use client';

import React, { useState, useEffect, Fragment, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Product as ProductType } from '@/models/ProductModel';
import { useCart } from '@/components/cart/CartContext';
import dynamic from 'next/dynamic';
import RichTextContent from '@/components/common/RichTextContent';
import { Product as UIProduct } from '@/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RelatedProducts from '../../../components/product/RelatedProducts';
import { useLanguage } from '@/contexts/LanguageContext';

// Tải động component VoiceTypingDemo chỉ khi cần (khi sản phẩm là VoiceTyping)
const VoiceTypingDemo = dynamic(() => import('./VoiceTypingDemo'), {
  loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded-lg"></div>,
  ssr: false, // Tắt SSR vì component sử dụng Web Speech API chỉ hoạt động trên client
});

// Component xử lý hiển thị mô tả sản phẩm với Rich Text Content
const ProductDescription = ({ description, productId }: { description: string, productId: string }) => {
  const { t, language } = useLanguage();
  const [translatedDescription, setTranslatedDescription] = useState<string>(description);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (description && description.trim() !== '') {
        try {
          // Only attempt to translate if not in English
          if (language && language !== 'eng') {
            const response = await fetch('/api/product-translations?id=' + productId + '&lang=' + language);
            if (response.ok) {
              const data = await response.json();
              console.log("ProductDescription translation data:", data); // Ghi log để debug
              if (data && data.translatedText) {
                setTranslatedDescription(data.translatedText);
              } else {
                setTranslatedDescription(description); // Fallback to original
              }
            } else {
              setTranslatedDescription(description); // Fallback to original
            }
          } else {
            setTranslatedDescription(description); // Use original for English
          }
        } catch (error) {
          console.error('Error translating description:', error);
          setTranslatedDescription(description); // Fallback to original
        }
      }
    };

    fetchTranslation();
  }, [description, language, productId]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">{t('product.details')}</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="prose prose-sm sm:prose lg:prose-xl xl:prose-2xl max-w-none mx-auto">
          <RichTextContent content={translatedDescription} className="product-description" />
        </div>

        <style jsx global>{`
          .product-description {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }

          .product-description img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 2rem auto;
            display: block;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .product-description h2,
          .product-description h3 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .product-description p {
            margin-bottom: 1rem;
          }

          .product-description ul,
          .product-description ol {
            margin-left: 2rem;
            margin-bottom: 1.5rem;
            width: fit-content;
            max-width: 95%;
            margin: 0 auto 1.5rem auto;
          }

          .product-description li {
            margin-bottom: 0.75rem;
            line-height: 1.7;
          }

          .product-description p {
            line-height: 1.7;
          }
        `}</style>
      </div>
    </div>
  );
};

// Component xử lý hiển thị mô tả ngắn sản phẩm
const ProductShortDescription = ({ shortDescription, productId }: { shortDescription: string, productId: string }) => {
  const { language } = useLanguage();
  const [translatedShortDescription, setTranslatedShortDescription] = useState<string>(shortDescription);

  useEffect(() => {
    // Lấy bản dịch nếu đang ở chế độ tiếng Anh
    if (language === 'eng') {
      const fetchTranslation = async () => {
        try {
          const response = await fetch('/api/product-translations?id=' + productId + '&lang=' + language);
          if (response.ok) {
            const data = await response.json();
            console.log("ProductShortDescription translation data:", data); // Ghi log để debug
            if (data && data.shortDescription) {
              setTranslatedShortDescription(data.shortDescription);
            } else {
              setTranslatedShortDescription(shortDescription); // Fallback to original if no translation
            }
          } else {
            setTranslatedShortDescription(shortDescription); // Fallback to original
          }
        } catch (error) {
          console.error('Error fetching short description translation:', error);
          setTranslatedShortDescription(shortDescription); // Fallback to original
        }
      };

      fetchTranslation();
    } else {
      // Nếu tiếng Việt, sử dụng mô tả gốc
      setTranslatedShortDescription(shortDescription);
    }
  }, [shortDescription, language, productId]);

  return (
    <p className="mt-4 text-gray-600 text-lg">{translatedShortDescription || ''}</p>
  );
};

// Component xử lý hiển thị tính năng sản phẩm với khả năng dịch
const ProductFeatures = ({ features, productId }: { features: any[], productId: string }) => {
  const { t, language } = useLanguage();
  const [translatedFeatures, setTranslatedFeatures] = useState<any[]>(features);

  useEffect(() => {
    // Lấy bản dịch nếu đang ở chế độ tiếng Anh
    if (language === 'eng') {
      const fetchTranslation = async () => {
        try {
          const response = await fetch('/api/product-translations?id=' + productId + '&lang=' + language);
          if (response.ok) {
            const data = await response.json();
            console.log("ProductFeatures translation data:", data); // Ghi log để debug
            if (data && data.features) {
              setTranslatedFeatures(data.features);
            } else {
              setTranslatedFeatures([...features]); // Fallback to original if no translation
            }
          } else {
            setTranslatedFeatures([...features]); // Fallback to original
          }
        } catch (error) {
          console.error('Error fetching feature translations:', error);
          setTranslatedFeatures([...features]); // Fallback to original
        }
      };

      fetchTranslation();
    } else {
      // Nếu tiếng Việt, sử dụng tính năng gốc
      setTranslatedFeatures([...features]);
    }
  }, [features, language, productId]);

  if (!translatedFeatures || translatedFeatures.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-medium text-gray-900 mb-2">{t('product.features')}:</h3>
      <ul className="list-disc list-inside space-y-1">
        {translatedFeatures.map((feature, index) => (
          <li key={index} className="text-gray-600">
            {typeof feature === 'string' ? feature : feature.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Component xử lý dịch tùy chọn sản phẩm
const ProductOptions = ({ 
  options, 
  productId, 
  productOptions, 
  selectedOption, 
  setSelectedOption,
  optionPrices
}: { 
  options: string[], 
  productId: string,
  productOptions: string[],
  selectedOption: string,
  setSelectedOption: (option: string) => void,
  optionPrices?: { [key: string]: any }
}) => {
  const { t, language } = useLanguage();
  const [translatedOptions, setTranslatedOptions] = useState<{ [key: string]: string }>(
    productOptions.reduce((acc, option) => ({ ...acc, [option]: option }), {})
  );
  const [optionsTitle, setOptionsTitle] = useState<string>(t('product.options'));

  useEffect(() => {
    // Lấy bản dịch nếu đang ở chế độ tiếng Anh
    if (language === 'eng') {
      const fetchTranslation = async () => {
        try {
          const response = await fetch('/api/product-translations?id=' + productId + '&lang=' + language);
          if (response.ok) {
            const data = await response.json();
            console.log("ProductOptions translation data:", data); // Ghi log để debug
            if (data && data.productOptions) {
              setTranslatedOptions(data.productOptions);
            }
            if (data && data.options) {
              setOptionsTitle(data.options);
            }
          }
        } catch (error) {
          console.error('Error fetching options translations:', error);
        }
      };

      fetchTranslation();
    } else {
      // Nếu tiếng Việt, sử dụng tùy chọn gốc
      setTranslatedOptions(productOptions.reduce((acc, option) => ({ ...acc, [option]: option }), {}));
      setOptionsTitle(t('product.options'));
    }
  }, [language, productId, productOptions, t]);

  if (!options || options.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="font-medium text-gray-700 text-lg mb-4">{optionsTitle}</h4>
      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`border rounded-lg px-4 py-2 flex items-center whitespace-nowrap cursor-pointer transition-shadow hover:shadow-lg ${selectedOption === option ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}
          >
            <span className="text-gray-900 font-medium text-sm mr-2">
              {translatedOptions[option] || option}
            </span>
            {optionPrices && optionPrices[option] && (
              <span className="text-primary-600 font-medium text-sm">
                {formatCurrency(optionPrices[option].price)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component hiển thị thông số kỹ thuật
const ProductSpecifications = ({
  specifications,
}: {
  specifications?: { key: string; value: string }[] | { [key: string]: string };
}) => {
  const { t } = useLanguage();
  
  if (!specifications) return null;

  // Convert specifications từ object sang array nếu cần
  const specsArray = Array.isArray(specifications)
    ? specifications
    : Object.entries(specifications).map(([key, value]) => ({ key, value }));

  if (specsArray.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">{t('product.specifications')}</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <tbody>
            {specsArray.map((spec, index) => (
              <tr
                key={index}
                className={`${index < specsArray.length - 1 ? 'border-b' : ''} border-gray-200`}
              >
                <td className="py-3 w-1/3 font-medium text-gray-700">{spec.key}</td>
                <td className="py-3 text-gray-800">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function ProductDetail({ product }: { product: ProductType }) {
  const { t } = useLanguage();
  
  // Thêm class để đánh dấu khi component đã load xong
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.classList.add('product-detail-loaded');
    }
  }, []);

  // Update document title khi component được render
  useEffect(() => {
    document.title = `${product.name} | ${t('product.metaTitle')}`;
  }, [product.name, t]);

  // State để theo dõi số lượt xem
  const [viewCount, setViewCount] = useState<number>(0);

  // State lưu số lượng sản phẩm
  const [quantity, setQuantity] = useState<number>(1);

  // State lưu phiên bản sản phẩm được chọn
  const [selectedVersion, setSelectedVersion] = useState<string>(
    product.versions && product.versions.length > 0 ? product.versions[0].name : '',
  );

  // State quản lý tùy chọn mới
  const [newOptionText, setNewOptionText] = useState('');

  // State danh sách tùy chọn
  const [productOptions, setProductOptions] = useState(product.productOptions || []);

  // State tùy chọn đang chọn
  const [selectedOption, setSelectedOption] = useState<string>(
    product.productOptions && product.productOptions.length > 0 ? product.productOptions[0] : '',
  );

  // State hiển thị tùy chọn hiện có
  const [showOptions, setShowOptions] = useState(false);

  // State cho việc kéo thả
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // State để hiện thị hiệu ứng khi thêm vào giỏ
  const [showAddToCartAnimation, setShowAddToCartAnimation] = useState<boolean>(false);
  const [addedToCartMessage, setAddedToCartMessage] = useState<string>('');

  // Xử lý thêm tùy chọn mới
  const handleAddOption = () => {
    if (newOptionText.trim()) {
      setProductOptions([...productOptions, newOptionText.trim()]);
      setNewOptionText('');
    }
  };

  // Xử lý xóa tùy chọn
  const handleRemoveOption = (index: number) => {
    const newOptions = [...productOptions];
    newOptions.splice(index, 1);
    setProductOptions(newOptions);
  };

  // Xử lý khi bắt đầu kéo
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  // Xử lý khi kéo qua một phần tử khác
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    // Sắp xếp lại mảng
    const newOptions = [...productOptions];
    const draggedOption = newOptions[draggedItem];
    newOptions.splice(draggedItem, 1);
    newOptions.splice(index, 0, draggedOption);

    // Cập nhật index của item đang được kéo
    setDraggedItem(index);
    setProductOptions(newOptions);
  };

  // Xử lý khi kết thúc kéo
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Lấy ảnh sản phẩm
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // Không sử dụng blob URLs
      if (typeof firstImage === 'string' && firstImage.startsWith('blob:')) {
        return '/images/placeholder/product-placeholder.svg';
      }

      const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url;

      // Kiểm tra xem ảnh có tồn tại không
      if (imageUrl && imageUrl.includes('/images/products/')) {
        // Sử dụng đường dẫn ảnh đã được tổ chức theo thư mục sản phẩm
        return imageUrl;
      }

      return '/images/placeholder/product-placeholder.svg';
    }
    return '/images/placeholder/product-placeholder.svg';
  };

  // Tính toán giá dựa trên tùy chọn đã chọn
  const calculateSelectedPrice = () => {
    // Nếu có giá tùy chọn, ưu tiên sử dụng giá của tùy chọn
    if (selectedOption && product.optionPrices && product.optionPrices[selectedOption]) {
      return product.optionPrices[selectedOption].price;
    }

    // Ngược lại sử dụng giá của version
    if (selectedVersion && product.versions && product.versions.length > 0) {
      const version = product.versions.find((v) => v.name === selectedVersion);
      return version ? version.price : product.versions[0]?.price || 0;
    }

    return calculateCheapestPrice();
  };

  // Tính toán giá gốc của tùy chọn đã chọn
  const calculateSelectedOriginalPrice = () => {
    // Nếu có giá gốc tùy chọn, ưu tiên sử dụng giá gốc của tùy chọn
    if (selectedOption && product.optionPrices && product.optionPrices[selectedOption]) {
      return product.optionPrices[selectedOption].originalPrice;
    }

    // Ngược lại sử dụng giá gốc của version
    if (selectedVersion && product.versions && product.versions.length > 0) {
      const version = product.versions.find((v) => v.name === selectedVersion);
      return version ? version.originalPrice : product.versions[0]?.originalPrice || 0;
    }

    return calculateOriginalPriceOfCheapest();
  };

  // Tính phần trăm giảm giá
  const calculateDiscountPercentage = () => {
    const originalPrice = calculateSelectedOriginalPrice();
    const price = calculateSelectedPrice();

    if (originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  // Tính toán giá rẻ nhất trong tất cả các tùy chọn
  const calculateCheapestPrice = () => {
    let cheapestPrice = Number.MAX_VALUE;

    // Kiểm tra giá trong tùy chọn
    if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
      for (const option in product.optionPrices) {
        const price = product.optionPrices[option].price;
        if (price < cheapestPrice) {
          cheapestPrice = price;
        }
      }
    }

    // Kiểm tra giá trong versions
    if (product.versions && product.versions.length > 0) {
      for (const version of product.versions) {
        if (version.price < cheapestPrice) {
          cheapestPrice = version.price;
        }
      }
    }

    return cheapestPrice === Number.MAX_VALUE ? 0 : cheapestPrice;
  };

  // Tính toán giá gốc của tùy chọn có giá rẻ nhất
  const calculateOriginalPriceOfCheapest = () => {
    let cheapestPrice = Number.MAX_VALUE;
    let originalPrice = 0;

    // Kiểm tra giá trong tùy chọn
    if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
      for (const option in product.optionPrices) {
        const price = product.optionPrices[option].price;
        if (price < cheapestPrice) {
          cheapestPrice = price;
          originalPrice = product.optionPrices[option].originalPrice;
        }
      }
    }

    // Kiểm tra giá trong versions
    if (product.versions && product.versions.length > 0) {
      for (const version of product.versions) {
        if (version.price < cheapestPrice) {
          cheapestPrice = version.price;
          originalPrice = version.originalPrice;
        }
      }
    }

    return originalPrice;
  };

  // Tính phần trăm giảm giá cho tùy chọn rẻ nhất
  const calculateCheapestDiscountPercentage = () => {
    const originalPrice = calculateOriginalPriceOfCheapest();
    const price = calculateCheapestPrice();

    if (originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  // Hook cart context
  const { addItem, clearCart } = useCart();

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    try {
      let productImage = '/images/placeholder/product-placeholder.svg';

      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        // Xử lý đường dẫn ảnh
        if (typeof firstImage === 'string' && !firstImage.startsWith('blob:')) {
          productImage = firstImage;
        } else if (typeof firstImage !== 'string' && firstImage.url) {
          productImage = firstImage.url;
        }
      }

      const productPrice = calculateSelectedPrice();
      console.log('🛒 Adding product to cart:', {
        id: product.id,
        name: product.name,
        price: productPrice,
        quantity: quantity,
        version: selectedOption || selectedVersion
      });

      // Thêm sản phẩm vào giỏ hàng - header sẽ tự cập nhật vì itemCount được tính lại qua useCart()
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: productPrice,
        quantity: quantity,
        image: productImage,
        version: selectedOption || selectedVersion,
        options: selectedOption ? [selectedOption] : selectedVersion ? [selectedVersion] : undefined,
      });

      console.log('🛒 Product successfully added to cart');

      // Hiển thị thông báo đã thêm vào giỏ
      setAddedToCartMessage(t('product.addedToCart', { quantity }));
      setShowAddToCartAnimation(true);

      // Ẩn thông báo sau 3 giây
      setTimeout(() => {
        setShowAddToCartAnimation(false);
      }, 3000);

      return true;
    } catch (error) {
      console.error('❌ Error adding product to cart:', error);
      return false;
    }
  };

  // Tăng số lượt xem khi người dùng truy cập trang
  useEffect(() => {
    // Tăng số lượt xem khi component được mount và chỉ mount lần đầu 
    setViewCount((prev) => prev + 1);

    // Trong ứng dụng thực tế, đây là nơi bạn sẽ gọi API để cập nhật số lượt xem
    // Không tham chiếu đến viewCount trong effect để tránh vòng lặp vô hạn
    console.log(`Đang xem sản phẩm: ${product.name}`);
  }, [product.id, product.name]); // Chỉ phụ thuộc vào ID và tên sản phẩm

  // Kiểm tra xem có phải là sản phẩm tài khoản hay không
  const isAccount = product.categories?.some((cat) => cat.id === 'tai-khoan-hoc-tap');

  // Xử lý tăng số lượng
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Xử lý giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t('product.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 product-detail-loaded">
      {/* Thông báo thêm vào giỏ hàng thành công */}
      {showAddToCartAnimation && (
        <div className="fixed top-20 right-4 bg-green-600 text-white py-2 px-4 rounded-md shadow-lg z-50 animate-fadeInOut">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{addedToCartMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-primary-600">
            {t('nav.home')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href={isAccount ? '/categories/tai-khoan-hoc-tap' : '/products'}
            className="text-gray-500 hover:text-primary-600"
          >
            {isAccount ? t('products.accounts') : t('nav.products')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        {/* Product main info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product image */}
            <div className="flex flex-col">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={getProductImage()}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Additional images */}
              {product.descriptionImages && product.descriptionImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.descriptionImages.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-100"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 100px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

              <div className="mt-4 flex items-center">
                <div className="text-3xl font-bold text-primary-600">
                  {calculateCheapestPrice() === 0
                    ? t('product.free')
                    : formatCurrency(calculateCheapestPrice())}
                </div>

                {calculateOriginalPriceOfCheapest() > calculateCheapestPrice() && (
                  <>
                    <div className="ml-4 text-xl text-gray-500 line-through">
                      {formatCurrency(calculateOriginalPriceOfCheapest())}
                    </div>
                    <div className="ml-3 bg-red-100 text-red-700 text-lg px-3 py-1 rounded">
                      -{calculateCheapestDiscountPercentage()}%
                    </div>
                  </>
                )}
              </div>

              {/* Tùy chọn loại sản phẩm - đưa lên đầu */}
              <div className="mt-6 p-4 rounded-lg">
                {/* Product options/versions */}
                {product.versions && product.versions.length > 1 && (
                  <div className="mb-3">
                    <div className="grid grid-cols-1 gap-1.5">
                      {product.versions.map((version) => (
                        <div
                          key={version.name}
                          className={`
                            border rounded-md p-2 cursor-pointer transition flex items-center
                            ${
                              selectedVersion === version.name
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}
                          onClick={() => setSelectedVersion(version.name)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full border flex-shrink-0 mr-2 ${selectedVersion === version.name ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}
                              >
                                {selectedVersion === version.name && (
                                  <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                                )}
                              </div>
                              <span className="font-medium text-gray-900">{version.name}</span>
                            </div>
                            {version.description && (
                              <p className="mt-0.5 text-xs text-gray-500 ml-6">
                                {version.description}
                              </p>
                            )}
                          </div>
                          <span className="font-medium text-primary-600 ml-2 text-sm">
                            {formatCurrency(version.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loại sản phẩm */}
                {product.productOptions && product.productOptions.length > 0 && (
                  <ProductOptions 
                    options={productOptions} 
                    productId={product.id.toString()}
                    productOptions={productOptions}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    optionPrices={product.optionPrices}
                  />
                )}
              </div>

              <ProductShortDescription 
                shortDescription={product.shortDescription || ''} 
                productId={product.id.toString()} 
              />

              {/* Quantity selector */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">{t('product.quantity')}:</h3>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 rounded-l-lg bg-gray-100 flex items-center justify-center border border-gray-300"
                  >
                    <span className="text-xl">-</span>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-14 h-10 text-center border-t border-b border-gray-300"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 rounded-r-lg bg-gray-100 flex items-center justify-center border border-gray-300"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="px-4 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-transform active:scale-95"
                >
                  {t('product.addToCart')}
                </button>
                <Link
                  href="/checkout?skipInfo=true"
                  onClick={(e) => {
                    e.preventDefault();
                    // Xóa giỏ hàng hiện tại trước
                    clearCart();
                    // Thêm sản phẩm hiện tại vào giỏ hàng
                    let productImage = '/images/placeholder/product-placeholder.svg';
                    if (product.images && product.images.length > 0) {
                      const firstImage = product.images[0];
                      if (typeof firstImage === 'string' && !firstImage.startsWith('blob:')) {
                        productImage = firstImage;
                      } else if (typeof firstImage !== 'string' && firstImage.url) {
                        productImage = firstImage.url;
                      }
                    }
                    // Thêm sản phẩm vào giỏ hàng
                    addItem({
                      id: product.id.toString(),
                      name: product.name,
                      price: calculateSelectedPrice(),
                      quantity: quantity,
                      image: productImage,
                      version: selectedOption || selectedVersion,
                      options: selectedOption ? [selectedOption] : selectedVersion ? [selectedVersion] : undefined,
                    });
                    // Chuyển hướng đến trang thanh toán
                    window.location.href = '/checkout?skipInfo=true';
                  }}
                  className="px-4 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 text-center transition-transform active:scale-95"
                >
                  {t('product.buyNow')}
                </Link>
              </div>

              {/* Features list */}
              {product.features && product.features.length > 0 && (
                <ProductFeatures features={product.features} productId={product.id.toString()} />
              )}
            </div>
          </div>
        </div>

        {/* Product description */}
        <div className="max-w-6xl mx-auto">
          <ProductDescription description={product.description} productId={product.id.toString()} />
        </div>

        {/* Related products */}
        <RelatedProducts
          currentProductId={product.id}
          categoryId={
            product.categories && product.categories.length > 0
              ? typeof product.categories[0].id === 'object'
                ? (product.categories[0].id as any)?.id
                : product.categories[0].id
              : undefined
          }
        />
      </div>
    </div>
  );
}
