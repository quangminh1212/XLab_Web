import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import * as cartService from '@/services/cartService';

/**
 * API endpoint xử lý các thao tác với giỏ hàng
 */
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  // Kiểm tra người dùng đã đăng nhập chưa
  if (!session || !session.user?.email) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thực hiện thao tác này' });
  }
  
  const email = session.user.email;
  const { method } = req;
  
  try {
    // GET: Lấy giỏ hàng của người dùng
    if (method === 'GET') {
      const cart = await cartService.getUserCart(email);
      return res.status(200).json({ success: true, cart });
    }
    
    // POST: Thêm sản phẩm vào giỏ hàng
    if (method === 'POST') {
      const product = req.body;
      
      if (!product || !product.id || !product.name || !product.price) {
        return res.status(400).json({ 
          success: false, 
          message: 'Thiếu thông tin sản phẩm' 
        });
      }
      
      // Tạo uniqueKey nếu chưa có
      if (!product.uniqueKey) {
        product.uniqueKey = `${product.id}_${product.version || 'default'}_${product.options ? product.options.join('_') : ''}`;
      }
      
      // Đảm bảo số lượng mặc định
      if (!product.quantity || product.quantity < 1) {
        product.quantity = 1;
      }
      
      const success = await cartService.addToUserCart(email, product);
      
      if (success) {
        // Lấy giỏ hàng mới nhất sau khi thêm sản phẩm
        const updatedCart = await cartService.getUserCart(email);
        return res.status(200).json({ 
          success: true, 
          message: 'Đã thêm sản phẩm vào giỏ hàng',
          cart: updatedCart 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          message: 'Không thể thêm sản phẩm vào giỏ hàng' 
        });
      }
    }
    
    // PUT: Cập nhật số lượng sản phẩm trong giỏ hàng
    if (method === 'PUT') {
      const { uniqueKey, quantity } = req.body;
      
      if (!uniqueKey || quantity === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: 'Thiếu thông tin cập nhật' 
        });
      }
      
      const success = await cartService.updateUserCartItemQuantity(email, uniqueKey, quantity);
      
      if (success) {
        // Lấy giỏ hàng mới nhất sau khi cập nhật
        const updatedCart = await cartService.getUserCart(email);
        return res.status(200).json({ 
          success: true, 
          message: 'Đã cập nhật giỏ hàng',
          cart: updatedCart 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          message: 'Không thể cập nhật giỏ hàng' 
        });
      }
    }
    
    // DELETE: Xóa sản phẩm khỏi giỏ hàng
    if (method === 'DELETE') {
      const { uniqueKey } = req.query;
      
      if (!uniqueKey) {
        return res.status(400).json({ 
          success: false, 
          message: 'Thiếu thông tin sản phẩm cần xóa' 
        });
      }
      
      const success = await cartService.removeFromUserCart(email, uniqueKey);
      
      if (success) {
        // Lấy giỏ hàng mới nhất sau khi xóa sản phẩm
        const updatedCart = await cartService.getUserCart(email);
        return res.status(200).json({ 
          success: true, 
          message: 'Đã xóa sản phẩm khỏi giỏ hàng',
          cart: updatedCart 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          message: 'Không thể xóa sản phẩm khỏi giỏ hàng' 
        });
      }
    }
    
    // Phương thức không được hỗ trợ
    return res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
  } catch (error) {
    console.error('Error handling cart operation:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi xử lý giỏ hàng',
      error: error.message 
    });
  }
} 