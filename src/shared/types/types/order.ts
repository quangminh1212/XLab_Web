// Định nghĩa các interface liên quan đến đơn hàng
export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  // Các trường khác...
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  // Các trường khác...
}
