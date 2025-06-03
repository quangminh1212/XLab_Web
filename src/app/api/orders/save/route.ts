import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import path from 'path';
import { addUsedCouponToUser } from '@/lib/userService';

// Tạo đường dẫn đến file lưu dữ liệu
const dataDir = path.join(process.cwd(), 'data');
const couponsFilePath = path.join(dataDir, 'coupons.json');
const usersDir = path.join(dataDir, 'users');

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  transactionId?: string;
  couponCode?: string;
  couponDiscount?: number;
}

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
  userLimit?: number;
  usedCount: number;
  userUsage?: { [email: string]: number };
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  applicableProducts?: string[];
  isPublic: boolean;
  forUsers?: string[];
}

// Hàm đọc dữ liệu từ file
function loadCoupons(): Coupon[] {
  try {
    if (fs.existsSync(couponsFilePath)) {
      const data = fs.readFileSync(couponsFilePath, 'utf8');
      try {
        return JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON from coupons file:', parseError);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error('Error loading coupons:', error);
    return [];
  }
}

// Hàm lưu dữ liệu vào file
function saveCoupons(data: Coupon[]): boolean {
  try {
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Validate data là mảng trước khi lưu
    if (!Array.isArray(data)) {
      console.error('Invalid coupon data format - expected array');
      return false;
    }
    
    // Tạo backup trước khi ghi đè
    if (fs.existsSync(couponsFilePath)) {
      const backupDir = path.join(dataDir, 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const backupPath = path.join(backupDir, `coupons-${timestamp}.bak`);
      fs.copyFileSync(couponsFilePath, backupPath);
    }
    
    fs.writeFileSync(couponsFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving coupons:', error);
    return false;
  }
}

// Hàm cập nhật số lần sử dụng của mã giảm giá
async function updateCouponUsage(couponCode: string, userEmail: string): Promise<boolean> {
  if (!couponCode || !userEmail) return false;
  
  try {
    // Tải dữ liệu mã giảm giá
    const coupons = loadCoupons();
    
    // Tìm mã giảm giá cần cập nhật
    const couponIndex = coupons.findIndex(c => c.code === couponCode);
    if (couponIndex === -1) return false;
    
    // Cập nhật số lần sử dụng tổng cộng
    coupons[couponIndex].usedCount = (coupons[couponIndex].usedCount || 0) + 1;
    
    // Khởi tạo đối tượng userUsage nếu chưa có
    if (!coupons[couponIndex].userUsage) {
      coupons[couponIndex].userUsage = {};
    }
    
    // Cập nhật số lần sử dụng của người dùng
    const currentUserUsage = coupons[couponIndex].userUsage![userEmail] || 0;
    coupons[couponIndex].userUsage![userEmail] = currentUserUsage + 1;
    
    // Cập nhật thời gian chỉnh sửa
    coupons[couponIndex].updatedAt = new Date().toISOString();
    
    // Lưu lại dữ liệu
    return saveCoupons(coupons);
  } catch (error) {
    console.error("Error updating coupon usage:", error);
    return false;
  }
}

// Hàm lưu đơn hàng vào file JSON của người dùng
async function saveOrderToUserFile(orderData: OrderData): Promise<boolean> {
  try {
    if (!fs.existsSync(usersDir)) {
      fs.mkdirSync(usersDir, { recursive: true });
    }
    
    const userFilePath = path.join(usersDir, `${orderData.userEmail}.json`);
    let userData: any = {};
    
    // Kiểm tra xem file đã tồn tại chưa
    if (fs.existsSync(userFilePath)) {
      const fileContent = fs.readFileSync(userFilePath, 'utf8');
      try {
        userData = JSON.parse(fileContent);
      } catch (parseError) {
        console.error(`Error parsing JSON from user file ${orderData.userEmail}:`, parseError);
        return false;
      }
    }
    
    // Khởi tạo mảng orders nếu chưa có
    if (!userData.orders) {
      userData.orders = [];
    }
    
    // Thêm đơn hàng mới vào mảng
    userData.orders.push(orderData);
    
    // Cập nhật thời gian chỉnh sửa
    if (!userData.metadata) {
      userData.metadata = {};
    }
    userData.metadata.lastUpdated = new Date().toISOString();
    
    // Lưu lại dữ liệu
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), 'utf8');
    console.log(`Order ${orderData.id} saved to user file: ${orderData.userEmail}`);
    return true;
  } catch (error) {
    console.error(`Error saving order to user file ${orderData.userEmail}:`, error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderData: OrderData = await request.json();

    // Validate dữ liệu
    if (!orderData.id || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Kiểm tra email của người dùng có khớp với session không
    if (orderData.userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }

    // Cập nhật số lần sử dụng mã giảm giá nếu có
    if (orderData.couponCode) {
      // Cập nhật trong file coupons.json
      const couponUpdated = await updateCouponUsage(orderData.couponCode, orderData.userEmail);
      if (!couponUpdated) {
        console.warn(`Failed to update usage for coupon: ${orderData.couponCode}`);
      } else {
        console.log(`Successfully updated usage for coupon ${orderData.couponCode} by user ${orderData.userEmail}`);
      }
      
      // Lưu thông tin mã giảm giá đã sử dụng vào dữ liệu người dùng
      await addUsedCouponToUser(orderData.userEmail, {
        code: orderData.couponCode,
        discount: orderData.couponDiscount || 0,
        orderId: orderData.id
      });
    }

    // Lưu đơn hàng vào file JSON của người dùng
    const orderSaved = await saveOrderToUserFile(orderData);
    if (!orderSaved) {
      console.error(`Failed to save order ${orderData.id} to user file ${orderData.userEmail}`);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }

    // Trả về phản hồi thành công
    return NextResponse.json({ 
      success: true, 
      message: 'Order saved successfully',
      orderId: orderData.id 
    });

  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 