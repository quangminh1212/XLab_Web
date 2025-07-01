import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { clearUserCart, getUserCart } from '@/services/cartService';

/**
 * API endpoint xử lý xóa toàn bộ giỏ hàng
 */
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  // Kiểm tra người dùng đã đăng nhập chưa
  if (!session || !session.user?.email) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thực hiện thao tác này' });
  }
  
  const email = session.user.email;
  
  // Chỉ cho phép phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
  }
  
  try {
    // Xóa toàn bộ giỏ hàng
    const success = await clearUserCart(email);
    
    if (success) {
      // Lấy giỏ hàng mới nhất (rỗng) để trả về
      const emptyCart = await getUserCart(email);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Đã xóa toàn bộ giỏ hàng',
        cart: emptyCart
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Không thể xóa giỏ hàng' 
      });
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi xóa giỏ hàng',
      error: error.message 
    });
  }
} 