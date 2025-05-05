// Tập tin này sẽ được nhúng vào quá trình chạy để ẩn cảnh báo

// Kiểm tra xem script có đang được chạy trực tiếp hay không
if (typeof window === 'undefined') {
  // Mảng chứa các chuỗi cần lọc
  const warningsToFilter = [
    'Invalid next.config.js',
    'Unrecognized key',
    'has been moved to',
    'Search params not available',
    'Expected object, received boolean',
    'The provided export match',
    'EADDRINUSE',
    'address already in use',
    'serverComponentsExternalPackages',
    'prerender',
    'manifest',
    'critters'
  ];

  // Ghi đè console.warn để lọc các cảnh báo không mong muốn
  const originalWarn = console.warn;
  console.warn = function (message) {
    // Kiểm tra nếu thông điệp chứa bất kỳ chuỗi nào trong danh sách lọc
    if (typeof message === 'string' && warningsToFilter.some(str => message.includes(str))) {
      return; // Bỏ qua cảnh báo này
    }
    
    // Gọi hàm warn gốc với các cảnh báo khác
    originalWarn.apply(console, arguments);
  };

  // Ghi đè process.emitWarning để bỏ qua một số cảnh báo
  if (typeof process !== 'undefined' && process.emitWarning) {
    const originalEmitWarning = process.emitWarning;
    process.emitWarning = function (warning, type, code, ...args) {
      // Danh sách các mã lỗi cần lọc
      const codesToFilter = [
        'NEXT_STATIC_OPTIMIZATION_FAIL',
        'NEXT_CONFIG_WARNING',
        'NEXT_EXPORT_STATIC_OPTIMIZATION_FAIL'
      ];
      
      // Lọc theo mã lỗi
      if (codesToFilter.includes(code)) {
        return;
      }
      
      // Lọc theo nội dung cảnh báo
      if (typeof warning === 'string' && warningsToFilter.some(str => warning.includes(str))) {
        return;
      }
      
      // Gửi cảnh báo với các cảnh báo không được lọc
      return originalEmitWarning.call(process, warning, type, code, ...args);
    };
  }

  // Ghi đè console.error để lọc một số lỗi không cần thiết
  const originalError = console.error;
  console.error = function (message) {
    // Kiểm tra nếu thông điệp chứa bất kỳ chuỗi nào trong danh sách lọc
    if (typeof message === 'string' && (
      message.includes('Search params not available') ||
      message.includes('EADDRINUSE') ||
      message.includes('address already in use')
    )) {
      return; // Bỏ qua lỗi này
    }
    
    // Gọi hàm error gốc với các lỗi khác
    originalError.apply(console, arguments);
  };

  // Thông báo khi script được tải
  console.log("\x1b[32m[Next.js]\x1b[0m Warning suppression active");
}

// Xuất module trống (để tương thích với ES modules)
module.exports = {}; 