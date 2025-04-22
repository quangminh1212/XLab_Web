import { useState, useEffect } from 'react';

// Hook an toàn để sử dụng localStorage trong Next.js tránh lỗi hydration
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State để lưu giá trị của chúng ta
  // Truyền vào một hàm state initializer nên nó chỉ thực thi một lần
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // State để kiểm tra xem chúng ta đang ở phía client hay server
  const [isClient, setIsClient] = useState(false);
  
  // Thiết lập isClient khi component mount
  useEffect(() => {
    setIsClient(true);
    
    // Khởi tạo state từ localStorage
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Lỗi khi đọc từ localStorage:", error);
    }
  }, [key]);

  // Hàm trả về để lưu state và cập nhật localStorage
  const setValue = (value: T) => {
    try {
      // Cho phép value là một function giống như useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Lưu state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage nếu đang ở phía client
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Lỗi khi lưu vào localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage; 