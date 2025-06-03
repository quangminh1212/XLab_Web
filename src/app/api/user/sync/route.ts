import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncAllUserData, getUserDataFromFile, getUserUsedCoupons } from '@/lib/userService';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Force sync toàn bộ dữ liệu user
    const syncedUser = await syncAllUserData(userEmail);
    
    if (!syncedUser) {
      return NextResponse.json(
        { error: 'Không thể đồng bộ dữ liệu user' },
        { status: 500 }
      );
    }

    // Lấy dữ liệu user đầy đủ sau khi sync
    const userData = await getUserDataFromFile(userEmail);
    const usedCoupons = await getUserUsedCoupons(userEmail);

    return NextResponse.json({
      success: true,
      message: 'Dữ liệu đã được đồng bộ thành công',
      user: syncedUser,
      syncTime: new Date().toISOString(),
      dataIntegrity: {
        hasUserFile: !!userData,
        cartItems: userData?.cart?.length || 0,
        transactionCount: userData?.transactions?.length || 0,
        usedCouponsCount: usedCoupons.length,
        lastUpdated: userData?.metadata?.lastUpdated
      }
    });
    
  } catch (error) {
    console.error('Error syncing user data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Kiểm tra trạng thái đồng bộ
    const userData = await getUserDataFromFile(userEmail);
    const usedCoupons = await getUserUsedCoupons(userEmail);
    
    return NextResponse.json({
      email: userEmail,
      syncStatus: {
        hasUserFile: !!userData,
        lastUpdated: userData?.metadata?.lastUpdated,
        version: userData?.metadata?.version,
        cartItems: userData?.cart?.length || 0,
        balance: userData?.profile?.balance || 0,
        transactionCount: userData?.transactions?.length || 0,
        usedCoupons: usedCoupons.length
      },
      recommendations: userData ? [] : ['Dữ liệu user chưa được khởi tạo, cần sync']
    });
    
  } catch (error) {
    console.error('Error checking sync status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 