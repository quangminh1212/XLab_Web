// Định nghĩa các interface liên quan đến giỏ hàng
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  // Các trường khác...
}

export interface Cart {
  items: CartItem[];
  total: number;
  // Các trường khác...
}
