import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
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
  transactionId?: string;
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

    // Trong production, đây sẽ là truy vấn từ database
    // Hiện tại trả về mảng rỗng để client đọc từ localStorage

    // CHÚ Ý: Dữ liệu mẫu cho demo
    // Trong ứng dụng thực tế, đây sẽ là truy vấn đến cơ sở dữ liệu
    const mockOrders: Order[] = [
      {
        id: 'XL-' + Math.floor(100000 + Math.random() * 900000).toString(),
        userId: userEmail || '',
        userName: session.user.name || 'Guest',
        userEmail: userEmail || '',
        items: [
          {
            productId: 'chatgpt',
            productName: 'ChatGPT',
            quantity: 1,
            price: 149000,
            image: '/images/products/chatgpt/8f03b3dc-86a9-49ef-9c61-ae5e6030f44b.png',
          },
        ],
        totalAmount: 149000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 ngày trước
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      },
      {
        id: 'XL-' + Math.floor(100000 + Math.random() * 900000).toString(),
        userId: userEmail || '',
        userName: session.user.name || 'Guest',
        userEmail: userEmail || '',
        items: [
          {
            productId: 'grok',
            productName: 'Grok',
            quantity: 2,
            price: 149000,
            image: '/images/products/grok/95828df2-efbf-4ddf-aed5-ed1584954d69.png',
          },
        ],
        totalAmount: 298000,
        status: 'completed',
        paymentMethod: 'momo',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 ngày trước
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      },
    ];

    // Trả về dữ liệu mẫu và để client merge với localStorage
    return NextResponse.json({
      orders: mockOrders,
      message: 'Orders fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
