export interface ProductImage {
  url: string;
  alt: string;
  isFeatured?: boolean;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon?: string;
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
  features: string[];
}

export interface ProductCategory {
  id: string | { id: string };
  name: string | { id: string };
  slug: string | { id: string };
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
  shortDescription?: string;
  images?: ProductImage[] | string[];
  imageUrl?: string;
  descriptionImages?: string[];
  features?: ProductFeature[] | any[];
  specifications?: ProductSpecification[] | any[];
  requirements?: ProductRequirement[] | any[];
  versions?: ProductVersion[];
  categories?: ProductCategory[] | any;
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
  rating?: number | string;
  weeklyPurchases?: number | string;
  type?: string;
  isAccount?: boolean;
  productOptions?: ProductOption[];
  defaultProductOption?: ProductOption;
  optionPrices?: { [key: string]: OptionPrice };
  startDate?: string; // Ngày bắt đầu hiệu lực
  endDate?: string; // Ngày kết thúc hiệu lực
  options?: string[];
  quantity?: number;
  details?: string;
  price?: number;
  salePrice?: number;
  totalSold?: number;
  specs?: string;
  totalPurchases?: string | number;
  optionDurations?: any;
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: ProductImage[] | string[];
  descriptionImages?: string[];
  features: ProductFeature[];
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
  options?: string[];
  quantity?: number;
  details?: string;
}
