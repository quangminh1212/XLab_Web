/**
 * Chuyển đổi tên sản phẩm thành định dạng URL an toàn cho hình ảnh
 * @param productName Tên sản phẩm
 * @param imgUrl URL hình ảnh hiện tại (nếu có)
 * @param index Số thứ tự của hình ảnh trong bộ sưu tập (để phân biệt các hình khác nhau)
 * @returns URL hình ảnh mới dựa trên tên sản phẩm
 */
export const getImageNameFromProduct = (
  productName: string, 
  imgUrl: string | null | undefined,
  index: number = 0
): string => {
  // Nếu có đường dẫn hợp lệ và không phải định dạng UUID, giữ nguyên
  if (imgUrl && !imgUrl.startsWith('blob:') && !imgUrl.includes('undefined') && imgUrl.trim() !== '') {
    // Nếu đường dẫn không có UUID mà đã được định dạng theo tên, giữ nguyên
    if (!imgUrl.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)) {
      return imgUrl;
    }
  }
  
  // Chuyển đổi tên sản phẩm thành định dạng URL an toàn cho tên thư mục
  const safeName = productName.toLowerCase()
    .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[èéẻẽẹêếềểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[ùúủũụưứừửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
  
  // Nếu là hình ảnh đầu tiên, sử dụng tên file là main.png
  if (index === 0) {
    return `/images/products/${safeName}/main.png`;
  }
  
  // Nếu là hình ảnh thứ 2 trở đi, thêm số thứ tự vào tên file
  return `/images/products/${safeName}/image-${index}.png`;
}

/**
 * Xử lý mảng hình ảnh sản phẩm, chuyển đổi thành đường dẫn theo tên sản phẩm
 * @param productName Tên sản phẩm
 * @param images Mảng các URL hình ảnh
 * @returns Mảng các URL hình ảnh đã được chuyển đổi
 */
export const processProductImages = (
  productName: string,
  images: (string | {url: string})[] | undefined
): string[] => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    // Nếu không có hình ảnh, trả về mảng rỗng
    return [];
  }
  
  return images.map((img, index) => {
    const imgUrl = typeof img === 'string' ? img : img.url;
    return getImageNameFromProduct(productName, imgUrl, index);
  });
}

/**
 * Xử lý lỗi khi không tải được hình ảnh, thay thế bằng ảnh placeholder
 * @param event Sự kiện lỗi từ thẻ Image
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = '/images/placeholder/placeholder-product.jpg';
} 