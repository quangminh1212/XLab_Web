// Re-export all utilities
export * from './utils'

/**
 * Xử lý URL ảnh đại diện từ Google để đảm bảo load được
 * @param imageUrl URL ảnh từ Google 
 * @param fallbackUrl URL ảnh dự phòng
 * @returns URL ảnh đã được xử lý
 */
export function processGoogleAvatarUrl(imageUrl?: string | null, fallbackUrl: string = '/images/avatar-placeholder.svg'): string {
  if (!imageUrl) {
    return fallbackUrl;
  }

  try {
    // Kiểm tra xem có phải URL hợp lệ không
    const url = new URL(imageUrl);
    
    // Nếu là URL từ Google, đảm bảo sử dụng HTTPS
    if (url.hostname.includes('googleusercontent.com') || url.hostname.includes('googleapis.com')) {
      url.protocol = 'https:';
      
      // Thêm size parameter nếu chưa có để tối ưu hóa
      if (!url.searchParams.has('sz') && !url.searchParams.has('s')) {
        url.searchParams.set('sz', '96');
      }
      
      return url.toString();
    }
    
    // Đối với các URL khác, trả về như cũ nhưng đảm bảo HTTPS
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
    }
    
    return url.toString();
  } catch (error) {
    console.warn('Invalid image URL:', imageUrl, error);
    return fallbackUrl;
  }
}

/**
 * Xử lý lỗi load ảnh và thử lại với URL dự phòng
 * @param originalUrl URL gốc
 * @param fallbackUrl URL dự phòng
 * @returns Function xử lý lỗi
 */
export function createImageErrorHandler(originalUrl?: string | null, fallbackUrl: string = '/images/avatar-placeholder.svg') {
  return (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    
    // Nếu đang load URL gốc và bị lỗi, thử URL dự phòng
    if (img.src !== fallbackUrl && originalUrl) {
      console.warn('Failed to load image:', img.src, 'Trying fallback...');
      img.src = fallbackUrl;
    }
  };
} 