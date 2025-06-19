export interface ProductImage {
  url: string;
  alt: string;
  isFeatured?: boolean;
}

export interface ProductRequirement {
  type: 'system' | 'software' | 'hardware';
  description: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductVersion {
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

// Định nghĩa kiểu dữ liệu cho tùy chọn sản phẩm
export type ProductOption = string;

// Định nghĩa kiểu dữ liệu cho giá tùy chọn
export interface OptionPrice {
  price: number;
  originalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: ProductImage[] | string[];
  descriptionImages?: string[];
  specifications?: ProductSpecification[];
  requirements: ProductRequirement[];
  versions: ProductVersion[];
  categories: ProductCategory[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  rating?: number;
  weeklyPurchases?: number;
  type?: 'software' | 'account';
  isAccount?: boolean;
  productOptions?: ProductOption[];
  defaultProductOption?: ProductOption;
  optionPrices?: { [key: string]: OptionPrice };
  startDate?: string; // Ngày bắt đầu hiệu lực
  endDate?: string; // Ngày kết thúc hiệu lực
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: ProductImage[] | string[];
  descriptionImages?: string[];
  specifications?: ProductSpecification[];
  requirements: ProductRequirement[];
  versions: ProductVersion[];
  categories: string[];
  isPublished: boolean;
  rating?: number;
  weeklyPurchases?: number;
  type?: 'software' | 'account';
  isAccount?: boolean;
  productOptions?: ProductOption[];
  defaultProductOption?: ProductOption;
  optionPrices?: { [key: string]: OptionPrice };
  startDate?: string; // Ngày bắt đầu hiệu lực
  endDate?: string; // Ngày kết thúc hiệu lực
}
