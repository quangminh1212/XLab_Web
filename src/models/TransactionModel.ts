export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  productId?: string; // Cho giao dịch mua sản phẩm
  orderId?: string; // Cho giao dịch mua sản phẩm
}

export interface DepositRequest {
  userId: string;
  amount: number;
  method: 'bank_transfer' | 'momo' | 'zalopay' | 'credit_card';
  note?: string;
}
