import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserByEmail, updateUserBalance, createTransaction } from '@/lib/userService';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, productName, productId, orderId } = await request.json();

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Số tiền thanh toán không hợp lệ' }, { status: 400 });
    }

    if (!productName) {
      return NextResponse.json({ error: 'Thông tin sản phẩm không hợp lệ' }, { status: 400 });
    }

    // Lấy thông tin người dùng
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin người dùng' }, { status: 404 });
    }

    // Kiểm tra số dư có đủ không
    if ((user.balance || 0) < amount) {
      return NextResponse.json(
        { error: 'Số dư tài khoản không đủ để thực hiện giao dịch' },
        { status: 400 },
      );
    }

    // Tạo giao dịch mua sản phẩm
    const transaction = await createTransaction({
      userId: user.id,
      type: 'purchase',
      amount: amount,
      description: `Mua sản phẩm: ${productName}`,
      status: 'completed',
      productId: productId,
      orderId: orderId,
    });

    // Trừ tiền từ tài khoản
    const updatedUser = await updateUserBalance(session.user.email, -amount);

    return NextResponse.json({
      success: true,
      transaction: transaction,
      newBalance: updatedUser?.balance || 0,
      message: 'Thanh toán thành công',
    });
  } catch (error) {
    console.error('Error processing balance payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
