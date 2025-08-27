'use client';

import { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils';

interface ProductOptionsProps {
  options: string[];
  _productId: string;
  productOptions: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  optionPrices?: { [key: string]: { price: number; originalPrice?: number } };
  product?: { defaultProductOption?: string };
}

const ProductOptions = ({
  options,
  _productId,
  productOptions,
  selectedOption,
  setSelectedOption,
  optionPrices,
  product
}: ProductOptionsProps) => {
  const { t } = useLanguage();
  const [translatedOptions] = useState<{ [key: string]: string }>(
    productOptions.reduce((acc, option) => ({ ...acc, [option]: option }), {})
  );
  const [optionsTitle, setOptionsTitle] = useState<string>(t('product.options'));

  useEffect(() => {
    // Options đã đúng ngôn ngữ từ API; đồng bộ title về key i18n
    setOptionsTitle(t('product.options'));
  }, [t]);

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
                  {formatCurrency(optionPrices?.[option]?.price ?? 0)}
                </span>
                {!!optionPrices?.[option]?.originalPrice && (optionPrices?.[option]?.originalPrice as number) > (optionPrices?.[option]?.price ?? 0) && (
                  <>
                    <span className="text-xs text-gray-400 line-through ml-2">
                      {formatCurrency(optionPrices?.[option]?.originalPrice as number)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                      -{Math.round((((optionPrices?.[option]?.originalPrice as number) - (optionPrices?.[option]?.price ?? 0)) / (optionPrices?.[option]?.originalPrice as number)) * 100)}%
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