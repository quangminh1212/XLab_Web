import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

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

const dataDir = path.join(process.cwd(), 'data');
const couponsFilePath = path.join(dataDir, 'coupons.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, total, productIds } = body as { code: string; total: number; productIds?: string[] };

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    if (!fs.existsSync(couponsFilePath)) {
      return NextResponse.json({ valid: false, reason: 'NO_COUPON_FILE' }, { status: 200 });
    }

    const raw = fs.readFileSync(couponsFilePath, 'utf8');
    const coupons: Coupon[] = JSON.parse(raw);
    const coupon = coupons.find((c) => c.code.toLowerCase() === code.toLowerCase());

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, reason: 'NOT_FOUND_OR_INACTIVE' }, { status: 200 });
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json({ valid: false, reason: 'NOT_STARTED' }, { status: 200 });
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return NextResponse.json({ valid: false, reason: 'EXPIRED' }, { status: 200 });
    }

    if (coupon.minOrder && total < coupon.minOrder) {
      return NextResponse.json({ valid: false, reason: 'MIN_ORDER_NOT_MET', minOrder: coupon.minOrder }, { status: 200 });
    }

    // If applicableProducts specified, ensure at least one in cart
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0 && productIds && productIds.length > 0) {
      const intersects = productIds.some((id) => coupon.applicableProducts!.includes(id));
      if (!intersects) {
        return NextResponse.json({ valid: false, reason: 'NOT_APPLICABLE' }, { status: 200 });
      }
    }

    let discount = 0;
    let mode: 'discount' | 'cashback' = 'discount';

    if (coupon.type === 'percentage') {
      discount = Math.floor((total * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    } else if (coupon.type === 'cashback') {
      // cashback is applied after payment; treat as discount=0 but return cashback amount
      discount = Math.floor((total * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      mode = 'cashback';
    }

    if (discount > total) discount = total;

    return NextResponse.json({ valid: true, discount, mode, coupon: { id: coupon.id, code: coupon.code, type: coupon.type, value: coupon.value } }, { status: 200 });
  } catch (err) {
    console.error('validate-coupon error', err);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}

// ... existing code ...
// Find and update discount code processing logic to add "cashback" type
// In the POST or GET function, update the validation and application of discount codes

// Example: Update Coupon interface
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
// }
// ... existing code ...