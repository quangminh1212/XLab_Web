'use client';

import React, { useState, useEffect, Fragment, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, convertCurrency } from '@/shared/utils/formatCurrency';
import { Product as ProductType } from '@/models/ProductModel';
import { useCart } from '@/components/cart/CartContext';
import RichTextContent from '@/components/common/RichTextContent';
import { Product as UIProduct } from '@/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RelatedProducts from '../../../components/product/RelatedProducts';
import { useLanguage } from '@/contexts/LanguageContext';

// Component xử lý hiển thị mô tả sản phẩm với Rich Text Content
const ProductDescription = ({ description, productId }: { description: string, productId: string }) => {
  const { t, language } = useLanguage();
  const [translatedDescription, setTranslatedDescription] = useState<string>(description);

  useEffect(() => {
    // Lấy bản dịch nếu đang ở chế độ tiếng Anh
    if (language === 'eng') {
      const fetchTranslation = async () => {
        try {
          const response = await fetch('/api/product-translations?id=' + productId + '&lang=' + language);
          if (response.ok) {
            const data = await response.json();
            console.log("ProductDescription translation data:", data); // Ghi log để debug
            if (data && data.description) {
              setTranslatedDescription(data.description);
            } else {
              setTranslatedDescription(description); // Fallback to original if no translation
            }
          } else {
            setTranslatedDescription(description); // Fallback to original
          }
        } catch (error) {
          console.error('Error fetching translation:', error);
          setTranslatedDescription(description); // Fallback to original
        }
      };

      fetchTranslation();
    } else {
      // Nếu tiếng Việt, sử dụng mô tả gốc
      setTranslatedDescription(description);
    }
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
              setTranslatedFeatures(features); // Fallback to original if no translation
            }
          } else {
            setTranslatedFeatures(features); // Fallback to original
          }
        } catch (error) {
          console.error('Error fetching feature translations:', error);
          setTranslatedFeatures(features); // Fallback to original
        }
      };

      fetchTranslation();
    } else {
      // Nếu tiếng Việt, sử dụng tính năng gốc
      setTranslatedFeatures(features);
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

  // Format price based on selected language
  const displayPrice = (amount: number) => {
    const convertedAmount = convertCurrency(amount, language);
    return formatCurrency(convertedAmount, language);
  };

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
                {displayPrice(optionPrices[option].price)}
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
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  
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

    addItem({
      id: product.id.toString(),
      name: product.name,
      price: calculateSelectedPrice(),
      quantity: quantity,
      image: productImage,
      version: selectedOption || selectedVersion,
      options: selectedOption ? [selectedOption] : selectedVersion ? [selectedVersion] : undefined,
    });

    // Hiển thị thông báo đã thêm vào giỏ
    setAddedToCartMessage(t('product.addedToCart', { quantity }));
    setShowAddToCartAnimation(true);

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setShowAddToCartAnimation(false);
    }, 3000);

    return true;
  };

  // Tăng số lượt xem khi người dùng truy cập trang
  useEffect(() => {
    // Tăng số lượt xem khi component được mount
    setViewCount((prev) => prev + 1);

    // Trong ứng dụng thực tế, đây là nơi bạn sẽ gọi API để cập nhật số lượt xem
    console.log(`Đang xem sản phẩm: ${product.name}, Lượt xem: ${viewCount + 1}`);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Format price based on selected language
  const displayPrice = (amount: number) => {
    const convertedAmount = convertCurrency(amount, language);
    return formatCurrency(convertedAmount, language);
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
          
          {/* Language selector */}
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-xs text-gray-500">{t('language.select')}:</span>
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  // Reload page with new language
                  window.location.reload();
                }}
                className={`px-2 py-1 text-xs rounded-md ${
                  language === lang
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang === 'eng' ? 'EN' : lang === 'vie' ? 'VI' : lang === 'spa' ? 'ES' : lang === 'chi' ? 'CN' : lang}
              </button>
            ))}
          </div>
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
                    : displayPrice(calculateCheapestPrice())}
                </div>

                {calculateOriginalPriceOfCheapest() > calculateCheapestPrice() && (
                  <>
                    <div className="ml-4 text-xl text-gray-500 line-through">
                      {displayPrice(calculateOriginalPriceOfCheapest())}
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
                            {displayPrice(version.price)}
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

        {/* Product Reviews */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">{t('testimonials.title')}</h2>
            
            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star}
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-8 w-8 text-yellow-400" 
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-2xl font-bold text-gray-900">4.8</span>
                    <span className="ml-2 text-gray-600">(58 đánh giá)</span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percent = rating === 5 ? 75 : rating === 4 ? 18 : rating === 3 ? 5 : rating === 2 ? 1 : 1;
                      return (
                        <div key={rating} className="flex items-center">
                          <span className="w-6 text-gray-600">{rating}</span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 text-yellow-400 mx-1" 
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="bg-yellow-400 h-full rounded-full" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="ml-8 text-center px-6 py-4 bg-primary-50 rounded-lg">
                  <p className="text-gray-700 mb-4">Hài lòng với sản phẩm?</p>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Viết đánh giá
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium mb-6">Đánh giá gần đây</h3>
              
              <div className="space-y-8">
                {/* Review 1 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-bold">TH</span>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">Trần Huy</div>
                        <div className="text-sm text-gray-500">15/04/2023</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-yellow-400" 
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Sản phẩm rất tuyệt vời, đúng với mô tả và đáp ứng đầy đủ nhu cầu của tôi. Giao diện dễ sử dụng, 
                    tính năng đầy đủ và hiệu suất ổn định. Đặc biệt ấn tượng với khả năng xử lý nhiều tác vụ cùng lúc 
                    mà không bị giật lag. Dịch vụ hỗ trợ khách hàng cũng rất nhiệt tình và chuyên nghiệp. 
                    Sẽ tiếp tục sử dụng và giới thiệu cho bạn bè!
                  </p>
                </div>
                
                {/* Review 2 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-bold">LM</span>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">Lê Minh</div>
                        <div className="text-sm text-gray-500">02/04/2023</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-yellow-400" 
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-gray-300" 
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Sản phẩm có chất lượng tốt, dễ dàng cài đặt và sử dụng. Tính năng AI hoạt động hiệu quả 
                    và tiết kiệm thời gian đáng kể cho công việc của tôi. Tuy nhiên, giao diện người dùng 
                    có thể cải thiện thêm để trở nên trực quan hơn. Dịch vụ hỗ trợ phản hồi nhanh và giải quyết 
                    vấn đề hiệu quả. Đáng giá với mức giá này.
                  </p>
                </div>
                
                {/* Review 3 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-bold">NH</span>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">Nguyễn Hương</div>
                        <div className="text-sm text-gray-500">28/03/2023</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-yellow-400" 
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Tôi đã thử nhiều sản phẩm tương tự trên thị trường nhưng cái này vượt trội hơn hẳn. 
                    Giao diện đẹp, dễ sử dụng, và hiệu suất xử lý rất nhanh. Đặc biệt ấn tượng với khả năng 
                    tự động hóa các tác vụ lặp lại, giúp tôi tiết kiệm rất nhiều thời gian. Hỗ trợ kỹ thuật 
                    rất nhanh nhẹn và chuyên nghiệp. Rất đáng đồng tiền bát gạo!
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button className="px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                  Xem thêm đánh giá
                </button>
              </div>
            </div>
          </div>
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
