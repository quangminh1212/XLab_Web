/**
 * Format currency based on language setting
 * Adapts currency and formatting according to locale
 */
export const formatCurrency = (
  amount: number,
  language: string = 'vie'
): string => {
  // Define locale and currency mapping
  const localeMap: Record<string, { locale: string; currency: string }> = {
    vie: { locale: 'vi-VN', currency: 'VND' },
    eng: { locale: 'en-US', currency: 'USD' },
    spa: { locale: 'es-ES', currency: 'EUR' },
    chi: { locale: 'zh-CN', currency: 'CNY' }
  };

  // Get locale configuration based on language or fall back to Vietnamese
  const { locale, currency } = localeMap[language] || localeMap.vie;

  // Apply appropriate decimal settings based on currency
  const fractionDigits = currency === 'VND' ? 0 : 2;
  
  // Special case for VND to display currency code instead of symbol
  if (currency === 'VND') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      maximumFractionDigits: fractionDigits
    }).format(amount);
  }

  // Format the amount using Intl.NumberFormat for other currencies
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: fractionDigits
  }).format(amount);
};

/**
 * Convert between currencies based on language
 * Uses approximate exchange rates (should be updated with real-time rates)
 */
export const convertCurrency = (
  amountInVND: number,
  targetLanguage: string = 'vie'
): number => {
  // Approximate exchange rates (as of implementation)
  const exchangeRates: Record<string, number> = {
    vie: 1, // 1 VND = 1 VND (base currency)
    eng: 0.000041, // 1 VND ≈ 0.000041 USD
    spa: 0.000038, // 1 VND ≈ 0.000038 EUR
    chi: 0.00029 // 1 VND ≈ 0.00029 CNY
  };

  // Get exchange rate or use Vietnamese rate as fallback
  const exchangeRate = exchangeRates[targetLanguage] || exchangeRates.vie;
  
  // Convert the amount
  return amountInVND * exchangeRate;
}; 