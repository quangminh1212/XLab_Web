/**
 * Typography utility functions and constants
 * This file provides helpers for consistent text formatting
 */

import { Characters } from './characters';

// Font families used in the application
export const FontFamilies = {
  PRIMARY: 'Inter, system-ui, sans-serif',
  SECONDARY: 'Poppins, Inter, system-ui, sans-serif',
  MONOSPACE: 'JetBrains Mono, monospace',
};

// Font weights used in the application
export const FontWeights = {
  LIGHT: 300,
  REGULAR: 400, 
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
  EXTRABOLD: 800,
};

// Text transformers for consistent formatting
export const TextFormatters = {
  /**
   * Format a price with currency symbol
   */
  formatPrice: (amount: number, currency: 'VND' | 'USD' = 'VND', options?: Intl.NumberFormatOptions): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'VND' ? 0 : 2,
      maximumFractionDigits: currency === 'VND' ? 0 : 2,
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Intl.NumberFormat('vi-VN', mergedOptions).format(amount);
  },

  /**
   * Format a date in a localized way
   */
  formatDate: (date: Date | string, locale: 'vi' | 'en' = 'vi', options?: Intl.DateTimeFormatOptions): string => {
    const dateObject = date instanceof Date ? date : new Date(date);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', mergedOptions).format(dateObject);
  },

  /**
   * Format a number with thousands separators
   */
  formatNumber: (num: number, locale: 'vi' | 'en' = 'vi'): string => {
    return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(num);
  },

  /**
   * Truncate text with ellipsis
   */
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}${Characters.PUNCTUATION.ELLIPSIS}`;
  },

  /**
   * Convert a string to title case
   */
  toTitleCase: (text: string): string => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Add non-breaking spaces to prevent orphaned words
   */
  preventOrphans: (text: string): string => {
    const words = text.split(' ');
    if (words.length <= 1) return text;
    
    const lastWordIndex = words.length - 1;
    words[lastWordIndex] = `${Characters.SPACES.NON_BREAKING_SPACE}${words[lastWordIndex]}`;
    
    return words.join(' ');
  },

  /**
   * Format a phone number for Vietnam
   */
  formatPhoneNumber: (phoneNumber: string): string => {
    // Remove all non-digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Format based on length
    if (digitsOnly.length === 10) {
      return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (digitsOnly.length === 11) {
      return digitsOnly.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    
    // If the format doesn't match, return the original
    return phoneNumber;
  },
}; 