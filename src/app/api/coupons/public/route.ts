import fs from 'fs';
import path from 'path';

import { NextResponse, NextRequest } from 'next/server';

import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';
export const runtime = 'nodejs';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/authOptions';

// Create path to data files
const dataDir = path.join(process.cwd(), 'data');
const couponsFilePath = path.join(dataDir, 'coupons.json');
const usersDir = path.join(dataDir, 'users');

// Define Coupon interface
interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  applicableProducts?: string[];
  isPublic: boolean;
  userLimit?: number;
}

// Interface for user data
interface UserData {
  email: string;
  vouchers?: {
    [couponId: string]: number;
  };
}

// Function to read data from file
function loadCoupons(): Coupon[] {
  try {
    if (fs.existsSync(couponsFilePath)) {
      const data = fs.readFileSync(couponsFilePath, 'utf8');
      try {
        console.log('Loading coupons from file');
        const coupons = JSON.parse(data);
        console.log(`Found ${coupons.length} coupons total`);
        return coupons;
      } catch (parseError) {
        console.error('Error parsing JSON from coupons file:', parseError);
        return [];
      }
    }
    console.log('Coupons file does not exist');
    return [];
  } catch (error) {
    console.error('Error loading coupons:', error);
    return [];
  }
}

// Function to read user data from file
function loadUserData(email: string): UserData | null {
  try {
    const userFilePath = path.join(usersDir, `${email}.json`);
    if (fs.existsSync(userFilePath)) {
      const data = fs.readFileSync(userFilePath, 'utf8');
      try {
        return JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON from user file:', parseError);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req, ['GET', 'OPTIONS']);
}

export async function GET(req: NextRequest) {
  try {
    // Get session information
    const session = await getServerSession(authOptions);

    // Read data from file
    const allCoupons = loadCoupons();

    // Filter to get only public discount codes (including expired ones)
    const now = new Date();
    const publicCoupons = allCoupons.filter((coupon) => {
      const isPublic = coupon.isPublic === true;
      const isActive = coupon.isActive === true;
      const hasStarted = new Date(coupon.startDate) <= now;

      // No longer filtering out expired vouchers
      const result = isPublic && isActive && hasStarted;
      if (!result) {
        console.log(
          `Filtering out coupon ${coupon.code}: isPublic=${isPublic}, isActive=${isActive}, hasStarted=${hasStarted}`,
        );
      }
      return result;
    });

    console.log(`Returning ${publicCoupons.length} public active coupons`);

    // If user is logged in, add information about voucher usage
    let userData: UserData | null = null;
    if (session?.user?.email) {
      userData = loadUserData(session.user.email);
    }

    // Return complete information to display on public vouchers page
    const fullCoupons = publicCoupons.map((coupon) => {
      // Prepare basic voucher information
      const voucherInfo = {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        minOrder: coupon.minOrder,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        userLimit: coupon.userLimit,
        applicableProducts: coupon.applicableProducts,
      };

      // Add usage information if user is logged in
      if (userData && userData.vouchers && coupon.userLimit) {
        const usedCount = userData.vouchers[coupon.id] || 0;
        return {
          ...voucherInfo,
          userUsage: {
            current: usedCount,
            limit: coupon.userLimit,
          },
        };
      }

      return voucherInfo;
    });

    return NextResponse.json(
      {
        success: true,
        coupons: fullCoupons,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          ...getCorsHeaders(req)
        },
      },
    );
  } catch (error) {
    console.error('Error fetching public coupons:', error);
    return NextResponse.json(
      { error: 'An error occurred while loading the discount codes list', details: String(error) },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          ...getCorsHeaders(req)
        },
      },
    );
  }
}
