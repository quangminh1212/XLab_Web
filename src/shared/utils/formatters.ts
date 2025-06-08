import { Language } from '@/contexts/LanguageContext';

// Format currency based on language
export const formatCurrency = (amount: number, language: Language = 'vi'): string => {
  if (language === 'vi') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  }
};

// Format date based on language
export const formatDate = (dateString: string, language: Language = 'vi'): string => {
  try {
    const date = new Date(dateString);
    // Ensure it's a valid date
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Create a consistent date in user's local timezone
    const localDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    
    if (language === 'vi') {
      return localDate.toLocaleDateString('vi-VN');
    } else {
      return localDate.toLocaleDateString('en-US');
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format number with localized thousands separators
export const formatNumber = (number: number, language: Language = 'vi'): string => {
  if (language === 'vi') {
    return new Intl.NumberFormat('vi-VN').format(number);
  } else {
    return new Intl.NumberFormat('en-US').format(number);
  }
};

// Format date and time based on language
export const formatDateTime = (dateString: string, language: Language = 'vi'): string => {
  try {
    const date = new Date(dateString);
    // Ensure it's a valid date
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    if (language === 'vi') {
      return date.toLocaleString('vi-VN');
    } else {
      return date.toLocaleString('en-US');
    }
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return dateString;
  }
}; 