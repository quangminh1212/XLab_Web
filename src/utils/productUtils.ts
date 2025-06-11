/**
 * Utility functions dành cho việc xử lý sản phẩm
 */

/**
 * Lấy URL hình ảnh hợp lệ từ đối tượng sản phẩm
 * @param product Đối tượng sản phẩm
 * @returns URL hình ảnh hợp lệ
 */
export const getValidImageUrl = (product: any): string => {
  if (!product) return '/images/placeholder/product-placeholder.jpg';

  // Kiểm tra nếu có hình ảnh trong mảng hình ảnh
  if (product.images && product.images.length > 0) {
    const imageUrl = product.images[0];
    // Kiểm tra xem đây là string hay object
    if (typeof imageUrl === 'string') {
      return imageUrl;
    } else if (imageUrl.url) {
      return imageUrl.url;
    }
  }

  // Kiểm tra nếu có thuộc tính imageUrl
  if (product.imageUrl) {
    return product.imageUrl;
  }

  return '/images/placeholder/product-placeholder.jpg';
};

/**
 * Định dạng tiền tệ theo VND
 * @param amount Số tiền cần định dạng
 * @returns Chuỗi đã định dạng (vd: "100.000 ₫")
 */
export const formatCurrency = (amount: number) => {
  // Đảm bảo amount là số
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(safeAmount);
};

/**
 * Tính phần trăm giảm giá
 * @param originalPrice Giá gốc
 * @param salePrice Giá bán
 * @returns Phần trăm giảm giá
 */
export const calculateDiscountPercentage = (originalPrice?: number, salePrice?: number) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Rút gọn văn bản nếu quá dài
 * @param text Văn bản cần rút gọn
 * @param maxLength Độ dài tối đa
 * @returns Văn bản đã rút gọn
 */
export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Lấy slug từ chuỗi
 * @param text Chuỗi cần chuyển đổi
 * @returns Slug đã tạo
 */
export const slugify = (text: string) => {
  if (!text) return '';
  
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * Sắp xếp sản phẩm theo trường chỉ định
 * @param products Danh sách sản phẩm
 * @param field Trường cần sắp xếp
 * @param order Thứ tự sắp xếp (asc/desc)
 * @returns Danh sách đã sắp xếp
 */
export const sortProducts = (products: any[], field: string, order: 'asc' | 'desc' = 'desc') => {
  if (!products || !Array.isArray(products)) return [];
  
  return [...products].sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];
    
    // Xử lý trường hợp date
    if (field === 'createdAt' || field === 'updatedAt') {
      valueA = new Date(valueA || 0).getTime();
      valueB = new Date(valueB || 0).getTime();
    }
    
    // Xử lý sắp xếp theo thứ tự
    if (order === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

/**
 * Lọc sản phẩm theo danh mục
 * @param products Danh sách sản phẩm
 * @param categoryId ID danh mục
 * @returns Danh sách sản phẩm đã lọc
 */
export const filterProductsByCategory = (products: any[], categoryId: string) => {
  if (!products || !Array.isArray(products) || !categoryId) return products;
  
  return products.filter(product => {
    // Trường hợp category là string
    if (typeof product.category === 'string') {
      return product.category === categoryId;
    }
    
    // Trường hợp category là object
    if (typeof product.category === 'object' && product.category) {
      if (product.category.id) {
        return product.category.id === categoryId;
      }
    }
    
    // Trường hợp categoryId là mảng
    if (Array.isArray(product.categories)) {
      return product.categories.some((cat: any) => {
        if (typeof cat === 'string') return cat === categoryId;
        if (typeof cat === 'object' && cat) return cat.id === categoryId;
        return false;
      });
    }
    
    return false;
  });
}; 