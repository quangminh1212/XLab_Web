import fs from 'fs';
import path from 'path';
import { 
  getUserByEmail,
  getUserDataFromFile,
  updateUserCart,
  addToUserCart as addItemToUserCart,
  removeFromUserCart as removeItemFromUserCart,
  clearUserCart as clearCart
} from '../lib/userService';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');

/**
 * Lấy giỏ hàng của người dùng
 * @param {string} email - Email của người dùng
 * @returns {Promise<Array>} - Mảng các sản phẩm trong giỏ hàng
 */
export async function getUserCart(email) {
  try {
    const userData = await getUserDataFromFile(email);
    return userData?.cart || [];
  } catch (error) {
    console.error('Error getting user cart:', error);
    return [];
  }
}

/**
 * Thêm sản phẩm vào giỏ hàng của người dùng
 * @param {string} email - Email của người dùng
 * @param {Object} product - Thông tin sản phẩm
 * @returns {Promise<boolean>} - Trạng thái thành công
 */
export async function addToUserCart(email, product) {
  try {
    // Sử dụng hàm từ userService
    await addItemToUserCart(email, product);
    return true;
  } catch (error) {
    console.error('Error adding to user cart:', error);
    return false;
  }
}

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {string} email - Email của người dùng
 * @param {string} uniqueKey - Khóa định danh sản phẩm
 * @param {number} quantity - Số lượng mới
 * @returns {Promise<boolean>} - Trạng thái thành công
 */
export async function updateUserCartItemQuantity(email, uniqueKey, quantity) {
  try {
    const userData = await getUserDataFromFile(email);
    if (!userData || !userData.cart) return false;

    // Tìm vị trí sản phẩm trong giỏ hàng
    const cart = [...userData.cart];
    const productIndex = cart.findIndex(item => item.uniqueKey === uniqueKey);
    if (productIndex === -1) return false;

    if (quantity <= 0) {
      // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
      cart.splice(productIndex, 1);
    } else {
      // Cập nhật số lượng
      cart[productIndex].quantity = quantity;
    }

    // Cập nhật giỏ hàng
    await updateUserCart(email, cart);
    return true;
  } catch (error) {
    console.error('Error updating user cart item quantity:', error);
    return false;
  }
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {string} email - Email của người dùng
 * @param {string} uniqueKey - Khóa định danh sản phẩm
 * @returns {Promise<boolean>} - Trạng thái thành công
 */
export async function removeFromUserCart(email, uniqueKey) {
  try {
    // Sử dụng hàm từ userService
    await removeItemFromUserCart(email, uniqueKey);
    return true;
  } catch (error) {
    console.error('Error removing from user cart:', error);
    return false;
  }
}

/**
 * Xóa toàn bộ giỏ hàng
 * @param {string} email - Email của người dùng
 * @returns {Promise<boolean>} - Trạng thái thành công
 */
export async function clearUserCart(email) {
  try {
    // Sử dụng hàm từ userService
    await clearCart(email);
    return true;
  } catch (error) {
    console.error('Error clearing user cart:', error);
    return false;
  }
}

/**
 * Đồng bộ giỏ hàng từ localStorage vào tài khoản người dùng
 * @param {string} email - Email của người dùng
 * @param {Array} localCart - Giỏ hàng từ localStorage
 * @returns {Promise<boolean>} - Trạng thái thành công
 */
export async function syncCartFromLocal(email, localCart) {
  try {
    if (!localCart || !Array.isArray(localCart) || localCart.length === 0) {
      return false;
    }

    const userData = await getUserDataFromFile(email);
    if (!userData) return false;

    // Nếu người dùng chưa có giỏ hàng, sử dụng giỏ hàng local
    if (!userData.cart || userData.cart.length === 0) {
      await updateUserCart(email, localCart);
      return true;
    } 
    
    // Nếu đã có giỏ hàng, hợp nhất hai giỏ hàng
    const mergedCart = [...userData.cart];
    
    for (const localItem of localCart) {
      const existingItemIndex = mergedCart.findIndex(
        userItem => userItem.uniqueKey === localItem.uniqueKey
      );

      if (existingItemIndex >= 0) {
        // Sản phẩm đã tồn tại, cập nhật số lượng
        mergedCart[existingItemIndex].quantity += localItem.quantity;
      } else {
        // Thêm sản phẩm mới
        mergedCart.push(localItem);
      }
    }

    // Cập nhật giỏ hàng
    await updateUserCart(email, mergedCart);
    return true;
  } catch (error) {
    console.error('Error syncing cart from local:', error);
    return false;
  }
}

/**
 * Kiểm tra trạng thái đăng nhập và đồng bộ giỏ hàng
 * @param {Object} session - Phiên đăng nhập
 * @param {Array} localCart - Giỏ hàng từ localStorage
 * @returns {Promise<Object>} - Đối tượng chứa giỏ hàng đã đồng bộ và thông tin đăng nhập
 */
export async function checkAuthAndSyncCart(session, localCart) {
  try {
    const isLoggedIn = !!session?.user?.email;
    let cart = localCart || [];
    
    if (isLoggedIn) {
      const email = session.user.email;
      
      // Nếu có giỏ hàng local, đồng bộ với tài khoản
      if (localCart && localCart.length > 0) {
        await syncCartFromLocal(email, localCart);
      }
      
      // Lấy giỏ hàng từ tài khoản
      cart = await getUserCart(email);
    }
    
    return {
      isLoggedIn,
      cart,
      userEmail: session?.user?.email || null
    };
  } catch (error) {
    console.error('Error checking auth and syncing cart:', error);
    return {
      isLoggedIn: false,
      cart: localCart || [],
      userEmail: null
    };
  }
} 