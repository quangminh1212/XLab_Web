import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import path from 'path';

// Tạo đường dẫn đến file lưu dữ liệu
const dataDir = path.join(process.cwd(), 'data');
const couponsFilePath = path.join(dataDir, 'coupons.json');

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
      const couponUpdated = await updateCouponUsage(orderData.couponCode, orderData.userEmail);
      if (!couponUpdated) {
        console.warn(`Failed to update usage for coupon: ${orderData.couponCode}`);
      } else {
        console.log(`Successfully updated usage for coupon ${orderData.couponCode} by user ${orderData.userEmail}`);
      }
    }

    // Trong môi trường production, đây sẽ là nơi lưu vào database
    // Ví dụ: MongoDB, PostgreSQL, etc.
    console.log('Saving order to database:', orderData);

    // Mô phỏng lưu vào database thành công
    // Trong thực tế, bạn sẽ sử dụng ORM hoặc truy vấn database
    /*
    Example with MongoDB:
    const db = await connectToDatabase();
    const result = await db.collection('orders').insertOne(orderData);
    
    Example with PostgreSQL:
    const result = await db.query(
      'INSERT INTO orders (id, user_email, items, total_amount, status, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [orderData.id, orderData.userEmail, JSON.stringify(orderData.items), orderData.totalAmount, orderData.status, orderData.createdAt]
    );
    */

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