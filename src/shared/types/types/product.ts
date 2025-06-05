// Định nghĩa các interface liên quan đến sản phẩm
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  // Các trường khác...
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  // Các trường khác...
}
