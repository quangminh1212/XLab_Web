import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncAllUserData } from '@/lib/userService';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    
    // Force sync với thông tin từ session hiện tại
    const updateData: any = {
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Cập nhật ảnh đại diện nếu có từ session
    if (session.user.image) {
      updateData.image = session.user.image;
      console.log(`🔄 Force refreshing avatar for user: ${userEmail}`);
    }
    
    // Cập nhật name nếu có thay đổi
    if (session.user.name) {
      updateData.name = session.user.name;
    }

    // Sync tất cả dữ liệu
    const updatedUser = await syncAllUserData(userEmail, updateData);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar refreshed successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        updatedAt: updatedUser.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error refreshing avatar:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 