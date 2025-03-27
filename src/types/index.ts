export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  imageUrl?: string;
  featured: boolean;
  isNew: boolean;
  rating: number;
  downloadCount: number;
  viewCount: number;
  version: string;
  size: string;
  license: string;
  updatedAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount: number;
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
  name: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN';
}

export interface Session {
  user?: User;
  expires: string;
} 