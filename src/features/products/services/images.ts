export type ImageLike = string | { url?: string | null } | null | undefined;

export interface ImageProductLike {
  images?: ImageLike[];
  imageUrl?: string | null;
}

/**
 * Chuẩn hoá và chọn URL ảnh hiển thị cho sản phẩm
 * - Ưu tiên images[0]
 * - Fallback sang imageUrl
 * - Cuối cùng dùng placeholder
 */
export function getValidImageUrl(product: ImageProductLike | null | undefined): string {
  const PLACEHOLDER = '/images/placeholder/product-placeholder.svg';
  if (!product) return PLACEHOLDER;

  // 1) From images[0]
  const first = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
  if (first) {
    if (typeof first === 'string') {
      return normalizePath(first);
    }
    if (typeof first === 'object' && first.url) {
      return normalizePath(String(first.url));
    }
  }

  // 2) From imageUrl
  if (product.imageUrl && typeof product.imageUrl === 'string') {
    return normalizePath(product.imageUrl);
  }

  return PLACEHOLDER;
}

function normalizePath(input: string): string {
  if (!input) return '/images/placeholder/product-placeholder.svg';
  const fixed = input.replace(/\\/g, '/');
  if (fixed.startsWith('blob:')) return '/images/placeholder/product-placeholder.svg';
  if (fixed.includes('undefined')) return '/images/placeholder/product-placeholder.svg';
  if (fixed.trim() === '') return '/images/placeholder/product-placeholder.svg';
  return fixed;
}

