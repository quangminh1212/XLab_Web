import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { User } from '@/models/UserModel';
import { Transaction } from '@/models/TransactionModel';

// File paths cũ (fallback)
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const TRANSACTIONS_FILE = path.join(process.cwd(), 'data', 'transactions.json');
const BALANCES_FILE = path.join(process.cwd(), 'data', 'balances.json');

// Thư mục lưu dữ liệu user riêng lẻ
const USERS_DIR = path.join(process.cwd(), 'data', 'users');

// Interface cho giỏ hàng
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string[];
  version?: string;
  uniqueKey?: string;
}

// Interface cho dữ liệu user complete
interface UserData {
  profile: User;
  transactions: Transaction[];
  cart: CartItem[];
  settings: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  metadata: {
    lastUpdated: string;
    version: string;
  };
}

// User balance interface
interface UserBalance {
  [email: string]: number;
}

// Tạo tên file từ email
function getFileNameFromEmail(email: string): string {
  // Sử dụng email làm tên file (an toàn hóa)
  return email.replace(/[^a-zA-Z0-9@.-]/g, '_') + '.json';
}

// Đảm bảo thư mục users tồn tại
async function ensureUsersDir(): Promise<void> {
  try {
    await fs.access(USERS_DIR);
  } catch {
    await fs.mkdir(USERS_DIR, { recursive: true });
  }
}

// Đọc dữ liệu user từ file riêng lẻ
async function getUserDataFromFile(email: string): Promise<UserData | null> {
  try {
    await ensureUsersDir();
    const fileName = getFileNameFromEmail(email);
    const filePath = path.join(USERS_DIR, fileName);
    
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`No individual file found for user: ${email}`);
    return null;
  }
}

// Lưu dữ liệu user vào file riêng lẻ
async function saveUserDataToFile(email: string, userData: UserData): Promise<void> {
  try {
    await ensureUsersDir();
    const fileName = getFileNameFromEmail(email);
    const filePath = path.join(USERS_DIR, fileName);
    
    userData.metadata.lastUpdated = new Date().toISOString();
    userData.metadata.version = '1.0';
    
    await fs.writeFile(filePath, JSON.stringify(userData, null, 2), 'utf8');
    console.log(`✅ User data saved for: ${email}`);
  } catch (error) {
    console.error(`❌ Error saving user data for ${email}:`, error);
    throw error;
  }
}

// Tạo dữ liệu user mặc định
function createDefaultUserData(user: User): UserData {
  return {
    profile: user,
    transactions: [],
    cart: [],
    settings: {
      notifications: true,
      language: 'vi',
      theme: 'light'
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    }
  };
}

// Đọc dữ liệu người dùng (fallback từ hệ thống cũ)
export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Lưu dữ liệu người dùng (hệ thống cũ - để tương thích)
export async function saveUsers(users: User[]): Promise<void> {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users file:', error);
    throw error;
  }
}

// Lấy thông tin người dùng theo email (ưu tiên file riêng)
export async function getUserByEmail(email: string): Promise<User | null> {
  // Thử đọc từ file riêng trước
  const userData = await getUserDataFromFile(email);
  if (userData) {
    return userData.profile;
  }
  
  // Fallback về hệ thống cũ
  const users = await getUsers();
  return users.find(user => user.email === email) || null;
}

// Tạo hoặc cập nhật người dùng
export async function createOrUpdateUser(userData: Partial<User> & { email: string }): Promise<User> {
  const existingUserData = await getUserDataFromFile(userData.email);
  
  if (existingUserData) {
    // Cập nhật user data hiện có
    const updatedUser: User = { 
      ...existingUserData.profile, 
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    const updatedUserData: UserData = {
      ...existingUserData,
      profile: updatedUser
    };
    
    await saveUserDataToFile(userData.email, updatedUserData);
    
    // Cập nhật hệ thống cũ để tương thích
    await updateUserInOldSystem(updatedUser);
    
    return updatedUser;
  } else {
    // Tạo user mới
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email,
      image: userData.image,
      isAdmin: userData.isAdmin || false,
      isActive: userData.isActive || true,
      balance: userData.balance || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    const newUserData = createDefaultUserData(newUser);
    await saveUserDataToFile(userData.email, newUserData);
    
    // Cập nhật hệ thống cũ để tương thích
    await updateUserInOldSystem(newUser);
    
    return newUser;
  }
}

// Cập nhật user trong hệ thống cũ (tương thích)
async function updateUserInOldSystem(user: User): Promise<void> {
  try {
    const users = await getUsers();
    const existingUserIndex = users.findIndex(u => u.email === user.email);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    await saveUsers(users);
  } catch (error) {
    console.error('Error updating old system:', error);
  }
}

// Cập nhật số dư người dùng
export async function updateUserBalance(email: string, amount: number): Promise<User | null> {
  const userData = await getUserDataFromFile(email);
  
  if (userData) {
    // Cập nhật trong file riêng
    userData.profile.balance = (userData.profile.balance || 0) + amount;
    userData.profile.updatedAt = new Date().toISOString();
    
    await saveUserDataToFile(email, userData);
    
    // Cập nhật hệ thống cũ để tương thích
    await updateUserInOldSystem(userData.profile);
    await updateBalanceInBalancesFile(email, userData.profile.balance);
    
    return userData.profile;
  } else {
    // Fallback về hệ thống cũ
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex >= 0) {
      users[userIndex].balance = (users[userIndex].balance || 0) + amount;
      users[userIndex].updatedAt = new Date().toISOString();
      await saveUsers(users);
      
      // Tạo file riêng cho user này
      const newUserData = createDefaultUserData(users[userIndex]);
      await saveUserDataToFile(email, newUserData);
      
      return users[userIndex];
    }
  }
  
  return null;
}

// ===== CART FUNCTIONS =====

// Lấy giỏ hàng của user
export async function getUserCart(email: string): Promise<CartItem[]> {
  const userData = await getUserDataFromFile(email);
  return userData?.cart || [];
}

// Cập nhật giỏ hàng của user
export async function updateUserCart(email: string, cart: CartItem[]): Promise<void> {
  let userData = await getUserDataFromFile(email);
  
  if (!userData) {
    // Tạo user data mới nếu chưa có
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    userData = createDefaultUserData(user);
  }
  
  userData.cart = cart;
  await saveUserDataToFile(email, userData);
}

// Thêm sản phẩm vào giỏ hàng
export async function addToUserCart(email: string, item: CartItem): Promise<void> {
  const currentCart = await getUserCart(email);
  
  // Tìm sản phẩm đã tồn tại
  const existingItemIndex = currentCart.findIndex(cartItem => 
    cartItem.uniqueKey === item.uniqueKey || 
    (cartItem.id === item.id && cartItem.version === item.version)
  );
  
  if (existingItemIndex > -1) {
    // Cập nhật số lượng
    currentCart[existingItemIndex].quantity += item.quantity || 1;
  } else {
    // Thêm mới
    currentCart.push({
      ...item,
      uniqueKey: item.uniqueKey || `${item.id}_${item.version || 'default'}_${Date.now()}`
    });
  }
  
  await updateUserCart(email, currentCart);
}

// Xóa sản phẩm khỏi giỏ hàng
export async function removeFromUserCart(email: string, uniqueKey: string): Promise<void> {
  const currentCart = await getUserCart(email);
  const updatedCart = currentCart.filter(item => item.uniqueKey !== uniqueKey);
  await updateUserCart(email, updatedCart);
}

// Xóa toàn bộ giỏ hàng
export async function clearUserCart(email: string): Promise<void> {
  await updateUserCart(email, []);
}

// ===== TRANSACTION FUNCTIONS =====

// Đọc giao dịch (fallback)
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await fs.readFile(TRANSACTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions file:', error);
    return [];
  }
}

// Lưu giao dịch (fallback)
export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving transactions file:', error);
    throw error;
  }
}

// Tạo giao dịch mới
export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
  const newTransaction: Transaction = {
    ...transactionData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Lưu vào file riêng của user (tìm user bằng userId)
  if (transactionData.userId) {
    // Tìm email từ userId
    const users = await getUsers();
    const user = users.find(u => u.id === transactionData.userId);
    if (user) {
      let userData = await getUserDataFromFile(user.email);
      if (userData) {
        userData.transactions.push(newTransaction);
        await saveUserDataToFile(user.email, userData);
      }
    }
  }
  
  // Lưu vào hệ thống cũ để tương thích
  const transactions = await getTransactions();
  transactions.push(newTransaction);
  await saveTransactions(transactions);
  
  return newTransaction;
}

// Lấy giao dịch của người dùng
export async function getUserTransactions(userEmail: string): Promise<Transaction[]> {
  const userData = await getUserDataFromFile(userEmail);
  if (userData) {
    return userData.transactions;
  }
  
  // Fallback về hệ thống cũ - tìm bằng userId
  const user = await getUserByEmail(userEmail);
  if (!user) return [];
  
  const transactions = await getTransactions();
  return transactions.filter(transaction => transaction.userId === user.id);
}

// Sync balance between users.json and balances.json
export async function syncUserBalance(email: string): Promise<number> {
  try {
    // Read from both sources
    let balanceFromUsers = 0;
    let balanceFromBalances = 0;
    let balanceFromUserFile = 0;
    
    // Get from user's individual file
    const userData = await getUserDataFromFile(email);
    if (userData) {
      balanceFromUserFile = userData.profile.balance || 0;
    }
    
    // Get from users.json
    try {
      const users = await getUsers();
      const user = users.find(u => u.email === email);
      balanceFromUsers = user?.balance || 0;
    } catch (error) {
      console.log('Could not read from users.json:', error);
    }
    
    // Get from balances.json
    try {
      const balanceData = await fs.readFile(BALANCES_FILE, 'utf8');
      const balances: UserBalance = JSON.parse(balanceData);
      balanceFromBalances = balances[email] || 0;
    } catch (error) {
      console.log('Could not read from balances.json:', error);
    }
    
    // Use the highest balance and sync
    const finalBalance = Math.max(balanceFromUsers, balanceFromBalances, balanceFromUserFile);
    
    // Update all systems with the final balance
    if (balanceFromUsers !== finalBalance) {
      await updateUserBalanceInFile(email, finalBalance - balanceFromUsers);
    }
    
    if (balanceFromBalances !== finalBalance) {
      await updateBalanceInBalancesFile(email, finalBalance);
    }
    
    if (balanceFromUserFile !== finalBalance) {
      let userData = await getUserDataFromFile(email);
      if (userData) {
        userData.profile.balance = finalBalance;
        await saveUserDataToFile(email, userData);
      }
    }
    
    return finalBalance;
  } catch (error) {
    console.error('Error syncing balance:', error);
    return 0;
  }
}

// Update balance in balances.json
async function updateBalanceInBalancesFile(email: string, newBalance: number): Promise<void> {
  try {
    let balances: UserBalance = {};
    
    try {
      const balanceData = await fs.readFile(BALANCES_FILE, 'utf8');
      balances = JSON.parse(balanceData);
    } catch (error) {
      // File doesn't exist, create new
    }
    
    balances[email] = newBalance;
    await fs.writeFile(BALANCES_FILE, JSON.stringify(balances, null, 2), 'utf8');
  } catch (error) {
    console.error('Error updating balances.json:', error);
  }
}

// Update balance in users.json
async function updateUserBalanceInFile(email: string, amount: number): Promise<void> {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex >= 0) {
      users[userIndex].balance = (users[userIndex].balance || 0) + amount;
      users[userIndex].updatedAt = new Date().toISOString();
      await saveUsers(users);
    }
  } catch (error) {
    console.error('Error updating users.json:', error);
  }
}

// ===== MIGRATION FUNCTIONS =====

// Migrate dữ liệu từ hệ thống cũ sang file riêng lẻ
export async function migrateToIndividualFiles(): Promise<void> {
  console.log('🚀 Starting migration to individual user files...');
  
  try {
    const users = await getUsers();
    const transactions = await getTransactions();
    
    for (const user of users) {
      console.log(`Migrating user: ${user.email}`);
      
      // Tạo dữ liệu user đầy đủ
      const userTransactions = transactions.filter(t => t.userId === user.id);
      
      const userData: UserData = {
        profile: user,
        transactions: userTransactions,
        cart: [], // Giỏ hàng trống ban đầu
        settings: {
          notifications: true,
          language: 'vi',
          theme: 'light'
        },
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: '1.0'
        }
      };
      
      await saveUserDataToFile(user.email, userData);
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Lấy tất cả user emails từ thư mục
export async function getAllUserEmails(): Promise<string[]> {
  try {
    await ensureUsersDir();
    const files = await fs.readdir(USERS_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', '').replace(/_/g, '@')); // Chuyển đổi ngược từ tên file
  } catch (error) {
    console.error('Error reading users directory:', error);
    return [];
  }
}

// Thống kê dữ liệu user
export async function getUserStats(email: string): Promise<any> {
  const userData = await getUserDataFromFile(email);
  if (!userData) {
    return null;
  }
  
  return {
    profile: userData.profile,
    transactionCount: userData.transactions.length,
    cartItemCount: userData.cart.length,
    totalSpent: userData.transactions
      .filter(t => t.type === 'purchase' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    lastActivity: userData.metadata.lastUpdated,
    settings: userData.settings
  };
} 