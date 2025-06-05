// ... existing code ...
// Tìm và cập nhật logic xử lý mã giảm giá để thêm loại "cashback"
// Trong hàm POST hoặc GET, cập nhật phần kiểm tra và áp dụng mã giảm giá

// Ví dụ: Cập nhật interface Coupon
interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'cashback';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  userLimit?: number;
  usedCount: number;
  userUsage?: { [email: string]: number };
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  applicableProducts?: string[];
  isPublic: boolean;
}

// Cập nhật logic tính toán số tiền giảm
// Ví dụ:
// if (coupon.type === 'percentage') {
//   // Logic tính giảm theo phần trăm
// } else if (coupon.type === 'fixed') {
//   // Logic tính giảm theo số tiền cố định
// } else if (coupon.type === 'cashback') {
//   // Logic tính hoàn tiền
//   // Đối với cashback, số tiền giảm vẫn được tính nhưng sẽ được đánh dấu là cashback
//   // để xử lý ở bước sau khi thanh toán
// }
// ... existing code ... 