import { useState, useEffect } from 'react';
import { safeJSONParse, safeJSONStringify } from '@/utils/safeJSON';
import { errorLog } from '@/utils/debugHelper';

/**
 * Custom hook an toàn để đọc/ghi localStorage
 * @param key Khóa lưu trữ
 * @param initialValue Giá trị ban đầu
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Hàm tải giá trị ban đầu từ localStorage
  const readValue = (): T => {
    // Chỉ thực hiện ở phía client
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Lấy từ localStorage
      const item = window.localStorage.getItem(key);
      // Parse giá trị nhận được hoặc trả về initialValue
      return item ? (safeJSONParse(item) as T) || initialValue : initialValue;
    } catch (error) {
      errorLog(`Lỗi đọc từ localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State để lưu trữ giá trị hiện tại
  const [storedValue, setStoredValue] = useState<T>(readValue());

  // Trả về một wrapped version của hàm useState
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Cho phép giá trị là một function
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Lưu state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, safeJSONStringify(valueToStore, '{}'));
      }
    } catch (error) {
      errorLog(`Lỗi ghi vào localStorage key "${key}":`, error);
    }
  };

  // Đồng bộ giá trị từ localStorage khi component mount
  useEffect(() => {
    try {
      setStoredValue(readValue());
    } catch (error) {
      errorLog(`Lỗi khi đồng bộ từ localStorage key "${key}":`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Theo dõi sự thay đổi của localStorage bởi các tab/cửa sổ khác
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const newValue = safeJSONParse<T>(event.newValue);
          if (newValue !== null) {
            setStoredValue(newValue);
          }
        } catch (error) {
          errorLog(`Lỗi xử lý sự kiện storage cho key "${key}":`, error);
        }
      }
    };
    
    // Đăng ký lắng nghe sự kiện
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    return undefined;
  }, [key]);

  return [storedValue, setValue];
} 