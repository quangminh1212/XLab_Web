export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  options?: string[];
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'momo' | 'zalopay' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  refunded: number;
  revenue: number;
  averageOrderValue: number;
}
