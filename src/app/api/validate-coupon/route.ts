// ... existing code ...
// Find and update discount code processing logic to add "cashback" type
// In the POST or GET function, update the validation and application of discount codes

// Example: Update Coupon interface

// Set this route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

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

// Update discount calculation logic
// Example:
// if (coupon.type === 'percentage') {
//   // Logic for percentage-based discount
// } else if (coupon.type === 'fixed') {
//   // Logic for fixed amount discount
// } else if (coupon.type === 'cashback') {
//   // Logic for cashback
//   // For cashback, the discount amount is still calculated but will be marked as cashback
//   // to be processed in the post-payment step
export {};
// }
// ... existing code ...