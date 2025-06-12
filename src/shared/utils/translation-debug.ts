// Translation Debugging Utility
// File này cung cấp các công cụ để kiểm tra và gỡ lỗi hệ thống dịch

export function logTranslationState(language: string, key: string, result: string) {
  console.log(`[TRANSLATION DEBUG] Language: ${language}, Key: ${key}, Result: ${result}`);
}

export function checkTranslationExists(translations: any, language: string, key: string): boolean {
  if (!translations || !translations[language]) {
    console.error(`[TRANSLATION ERROR] Language "${language}" not found in translations`);
    return false;
  }

  if (!translations[language][key]) {
    console.error(`[TRANSLATION ERROR] Key "${key}" not found in language "${language}"`);
    return false;
  }

  return true;
}

export function logAllAvailableTranslations(translations: any, language: string) {
  if (!translations || !translations[language]) {
    console.error(`[TRANSLATION ERROR] Language "${language}" not found in translations`);
    return;
  }

  console.log(`[TRANSLATION DEBUG] Available keys for language "${language}":`);
  Object.keys(translations[language]).forEach(key => {
    console.log(`  - ${key}: ${translations[language][key].substring(0, 50)}${translations[language][key].length > 50 ? '...' : ''}`);
  });
}

export function refreshTranslations() {
  if (typeof window !== 'undefined') {
    // Thêm timestamp để đảm bảo trình duyệt không cache
    const timestamp = new Date().getTime();
    window.location.href = `${window.location.pathname}?refresh=${timestamp}`;
  }
} 