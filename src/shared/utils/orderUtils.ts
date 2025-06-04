/**
 * Tạo orderId chi tiết với ngày tháng năm giờ phút giây để tránh trùng lặp
 * Format: XL-YYYYMMDDHHMMSS
 *
 * @returns {string} orderId với format chi tiết
 */
export const generateDetailedOrderId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  // Format: XL-YYYYMMDDHHMMSS
  return `XL-${year}${month}${day}${hour}${minute}${second}`;
};

/**
 * Tạo transaction ID với format chi tiết
 * Format: TXN-YYYYMMDDHHMMSS
 *
 * @returns {string} transactionId với format chi tiết
 */
export const generateDetailedTransactionId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  // Format: TXN-YYYYMMDDHHMMSS
  return `TXN-${year}${month}${day}${hour}${minute}${second}`;
};

/**
 * Tạo nội dung chuyển khoản với thời gian chi tiết
 * Format: XL-YYYYMMDDHHMMSS-PRODUCT
 *
 * @param {string} productName - Tên sản phẩm (tùy chọn)
 * @returns {string} nội dung chuyển khoản
 */
export const generateTransferContent = (productName?: string): string => {
  const orderId = generateDetailedOrderId();

  if (productName) {
    // Rút gọn tên sản phẩm để tránh quá dài
    const shortProductName = productName.replace(/\s+/g, '').toUpperCase().substring(0, 6);
    return `${orderId}-${shortProductName}`;
  }

  return orderId;
};
