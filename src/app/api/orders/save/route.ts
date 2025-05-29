import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

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