import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
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
}

export async function GET() {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lấy thông tin user
    const userEmail = session.user.email;

    // CHÚ Ý: Đây là dữ liệu mẫu
    // Trong ứng dụng thực tế, đây sẽ là truy vấn đến cơ sở dữ liệu
    // để lấy đơn hàng của người dùng hiện tại
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        userId: '1',
        userName: 'Nguyễn Văn A',
        userEmail: 'nguyenvana@example.com',
        items: [
          {
            productId: 'prod-vt',
            productName: 'VoiceTyping',
            quantity: 1,
            price: 990000
          }
        ],
        totalAmount: 990000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        createdAt: '2023-05-20T15:30:00Z',
        updatedAt: '2023-05-20T15:30:00Z'
      },
      {
        id: 'ORD-002',
        userId: '2',
        userName: 'Trần Thị B',
        userEmail: 'tranthib@example.com',
        items: [
          {
            productId: 'prod-office',
            productName: 'Office Suite',
            quantity: 1,
            price: 1200000
          },
          {
            productId: 'prod-backup',
            productName: 'Backup Pro',
            quantity: 1,
            price: 500000
          }
        ],
        totalAmount: 1700000,
        status: 'processing',
        paymentMethod: 'momo',
        paymentStatus: 'paid',
        createdAt: '2023-05-28T21:20:00Z',
        updatedAt: '2023-05-28T21:20:00Z'
      }
    ];

    // Lọc đơn hàng của người dùng hiện tại
    // Trong thực tế, truy vấn DB sẽ lọc dựa trên userEmail hoặc userId
    const userOrders = mockOrders.filter(order => order.userEmail === userEmail);

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 