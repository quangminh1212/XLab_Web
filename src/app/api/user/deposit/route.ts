import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getUserByEmail, updateUserBalance, createTransaction } from '@/lib/userService';
import { updateUserDataBalance, trackUserActivity } from '@/lib/sessionTracker';
import { addUserTransaction } from '@/lib/userDataManager';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, method, note } = await request.json();

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền nạp không hợp lệ' },
        { status: 400 }
      );
    }

    if (!method) {
      return NextResponse.json(
        { error: 'Phương thức thanh toán không hợp lệ' },
        { status: 400 }
      );
    }

    // Lấy thông tin người dùng
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy thông tin người dùng' },
        { status: 404 }
      );
    }

    // Tạo giao dịch nạp tiền
    const transaction = await createTransaction({
      userId: user.id,
      type: 'deposit',
      amount: amount,
      description: `Nạp tiền qua ${method}${note ? ` - ${note}` : ''}`,
      status: 'completed', // Trong thực tế sẽ là 'pending' và cần xác nhận
      productId: undefined,
      orderId: undefined
    });

    // Cập nhật số dư người dùng (old system)
    const updatedUser = await updateUserBalance(session.user.email, amount);
    
    // Cập nhật secure user data system
    const newBalance = updatedUser?.balance || 0;
    await updateUserDataBalance(session.user.email, newBalance);
    
    // Lưu transaction vào secure system
    await addUserTransaction(session.user.email, transaction);
    
    // Track activity
    await trackUserActivity(
      session.user.email,
      'deposit',
      `Nạp tiền thành công: ${amount.toLocaleString('vi-VN')} VND qua ${method}`,
      { amount, method, transactionId: transaction.id }
    );

    return NextResponse.json({
      success: true,
      transaction: transaction,
      newBalance: newBalance,
      message: 'Nạp tiền thành công'
    });
    
  } catch (error) {
    console.error('Error processing deposit:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 