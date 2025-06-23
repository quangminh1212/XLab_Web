import eng from './eng/index';
import vie from './vie/index';

// Helper function to flatten nested objects
const flattenTranslations = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'string') {
      return { ...acc, [prefixedKey]: obj[key] };
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      return { ...acc, ...flattenTranslations(obj[key], prefixedKey) };
    }
    
    return acc;
  }, {} as Record<string, string>);
};

// Flatten all translations
const flattenedEng = Object.keys(eng).reduce((acc, module) => {
  if (typeof eng[module as keyof typeof eng] === 'object') {
    const moduleTranslations = flattenTranslations(eng[module as keyof typeof eng], '');
    return { ...acc, ...moduleTranslations };
  }
  return acc;
}, {} as Record<string, string>);

const flattenedVie = Object.keys(vie).reduce((acc, module) => {
  if (typeof vie[module as keyof typeof vie] === 'object') {
    const moduleTranslations = flattenTranslations(vie[module as keyof typeof vie], '');
    return { ...acc, ...moduleTranslations };
  }
  return acc;
}, {} as Record<string, string>);

// Create the final translations object with both nested and flattened keys
const translations = {
  eng: { ...eng, _flat: flattenedEng },
  vie: { ...vie, _flat: flattenedVie }
};

export type Language = 'eng' | 'vie';
export default translations; 