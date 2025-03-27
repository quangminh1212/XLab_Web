export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice: number | null;
  categoryId: string;
  storeId: string;
  imageUrl: string;
  version: string;
  size: string;
  license: string;
  featured: boolean;
  active: boolean;
  downloadCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner: string;
  imageUrl: string;
  website: string;
  active: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN' | 'STORE_OWNER';
  stores?: Store[];
} 