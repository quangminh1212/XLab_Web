import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    // Lấy thông tin phiên đăng nhập
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Kiểm tra quyền admin - trong thực tế sẽ có logic phức tạp hơn
    // Hiện tại chỉ trả về user đang đăng nhập làm mẫu
    
    // Trong môi trường thực tế:
    // - Kết nối đến database (SQL, MongoDB, ...)
    // - Truy vấn danh sách người dùng
    // - Trả về kết quả
    
    // Hiện tại trả về dữ liệu mẫu chỉ với người dùng hiện tại
    const currentUser = {
      id: '1',
      name: session.user.name || 'Admin',
      email: session.user.email || 'admin@example.com',
      image: session.user.image || undefined,
      isAdmin: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    return NextResponse.json({ 
      users: [currentUser]
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 