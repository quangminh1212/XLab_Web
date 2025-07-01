import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { syncCartFromLocal } from '@/services/cartService';

/**
 * API endpoint xử lý đồng bộ giỏ hàng từ localStorage vào tài khoản người dùng
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
    const { cart: localCart } = req.body;
    
    if (!localCart || !Array.isArray(localCart)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin giỏ hàng hoặc định dạng không hợp lệ' 
      });
    }
    
    // Đồng bộ giỏ hàng từ localStorage
    const success = await syncCartFromLocal(email, localCart);
    
    if (success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Đã đồng bộ giỏ hàng thành công' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Không thể đồng bộ giỏ hàng' 
      });
    }
  } catch (error) {
    console.error('Error syncing cart from local:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi đồng bộ giỏ hàng',
      error: error.message 
    });
  }
} 