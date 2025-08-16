'use client';

import { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils';

interface ProductOptionsProps {
  options: string[];
  productId: string;
  productOptions: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  optionPrices?: { [key: string]: { price: number; originalPrice?: number } };
  product?: { defaultProductOption?: string };
}

const ProductOptions = ({
  options,
  productId,
  productOptions,
  selectedOption,
  setSelectedOption,
  optionPrices,
  product
}: ProductOptionsProps) => {
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
            if (data && data.productOptions) {
              // Process translations
              const translations: { [key: string]: string } = {};
              Object.keys(data.productOptions).forEach(key => {
                const matchingOriginalKey = productOptions.find(opt => opt.toLowerCase().includes(key.toLowerCase()));
                if (matchingOriginalKey) {
                  translations[matchingOriginalKey] = data.productOptions[key];
                }
              });
              setTranslatedOptions(prev => ({...prev, ...translations}));
              
              // Set options title if available
              if (data.optionsTitle) {
                setOptionsTitle(data.optionsTitle);
              }
            }
          }
        } catch (_error) {
          // error fetching option translations (silent)
        }
      };

      fetchTranslation();
    }
  }, [language, productId, productOptions]);

  return (
    <div className="mb-6">
      <h4 className="font-medium text-gray-700 text-lg mb-4">{optionsTitle}</h4>
      <div className="flex flex-wrap gap-3">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`
              border rounded-lg px-4 py-3 flex items-center whitespace-nowrap cursor-pointer 
              transition-all hover:shadow-md ${
                selectedOption === option ? 
                  'border-primary-500 bg-primary-50 shadow-sm' : 
                  (!selectedOption && product?.defaultProductOption === option) ? 
                    'border-primary-500 bg-primary-50 shadow-sm' : 
                    'border-gray-200 bg-white'
              }
            `}
          >
            <span className="text-gray-900 font-medium text-sm mr-3">
              {translatedOptions[option] || option}
            </span>
            {optionPrices && optionPrices[option] && (
              <div className="flex items-center">
                <span className="text-primary-600 font-medium text-sm">
                  {formatCurrency(optionPrices[option].price)}
                </span>
                {optionPrices[option].originalPrice && optionPrices[option].originalPrice > optionPrices[option].price && (
                  <>
                    <span className="text-xs text-gray-400 line-through ml-2">
                      {formatCurrency(optionPrices[option].originalPrice)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                      -{Math.round(((optionPrices[option].originalPrice - optionPrices[option].price) / optionPrices[option].originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductOptions; 