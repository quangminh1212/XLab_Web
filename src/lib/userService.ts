import fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User } from '@/models/UserModel';
import { Transaction } from '@/models/TransactionModel';

// File paths cũ (fallback)
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const TRANSACTIONS_FILE = path.join(process.cwd(), 'data', 'transactions.json');
const BALANCES_FILE = path.join(process.cwd(), 'data', 'balances.json');

// Đảm bảo file balances.json tồn tại
try {
  if (!fsSync.existsSync(BALANCES_FILE)) {
    // Tạo file balances.json nếu chưa tồn tại
    fsSync.writeFileSync(BALANCES_FILE, JSON.stringify({}, null, 2), 'utf8');
    console.log('Created new balances.json file');
  }
} catch (error) {
  console.error('Error checking/creating balances.json:', error);
}

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

// Interface cho đơn hàng
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  image?: string;
  version?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  couponDiscount?: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  transactionId?: string;
}

// Interface cho dữ liệu user complete
interface UserData {
  profile: User;
  transactions: Transaction[];
  cart: CartItem[];
  orders: Order[];
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
export async function getUserDataFromFile(email: string): Promise<UserData | null> {
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
    orders: [],
    settings: {
      notifications: true,
      language: 'vi',
      theme: 'light',
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: '1.0',
    },
  };
}

// Helper function để tự động tạo user mới từ email
async function createNewUserFromEmail(email: string): Promise<User> {
  console.log(`Creating new user from email: ${email}`);
  const newUser: User = {
    id: Date.now().toString(),
    name: email.split('@')[0],
    email: email,
    image: undefined,
    isAdmin: false,
    isActive: true,
    balance: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // Lưu user mới vào hệ thống
  const allUsers = await getUsers();
  allUsers.push(newUser);
  await saveUsers(allUsers);

  return newUser;
}

// Helper function để đảm bảo user data tồn tại (tạo mới nếu cần)
async function ensureUserDataExists(email: string): Promise<UserData> {
  let userData = await getUserDataFromFile(email);

  if (!userData) {
    let user = await getUserByEmail(email);
    if (!user) {
      user = await createNewUserFromEmail(email);
    }
    userData = createDefaultUserData(user);
    await saveUserDataToFile(email, userData);
  }

  return userData;
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
  return users.find((user) => user.email === email) || null;
}

// Tạo hoặc cập nhật người dùng
export async function createOrUpdateUser(
  userData: Partial<User> & { email: string },
): Promise<User> {
  const existingUserData = await getUserDataFromFile(userData.email);

  if (existingUserData) {
    // Cập nhật user data hiện có
    const updatedUser: User = {
      ...existingUserData.profile,
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    const updatedUserData: UserData = {
      ...existingUserData,
      profile: updatedUser,
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
      lastLogin: new Date().toISOString(),
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
    const existingUserIndex = users.findIndex((u) => u.email === user.email);

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
    const userIndex = users.findIndex((user) => user.email === email);

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
  const userData = await ensureUserDataExists(email);
  return userData.cart || [];
}

// Cập nhật giỏ hàng của user (legacy - sử dụng updateUserCartSync thay thế)
export async function updateUserCart(email: string, cart: CartItem[]): Promise<void> {
  console.log(
    `⚠️  Using legacy updateUserCart - consider using updateUserCartSync for better sync`,
  );
  await updateUserCartSync(email, cart);
}

// Thêm sản phẩm vào giỏ hàng
export async function addToUserCart(email: string, item: CartItem): Promise<void> {
  const currentCart = await getUserCart(email);

  // Tìm sản phẩm đã tồn tại
  const existingItemIndex = currentCart.findIndex(
    (cartItem) =>
      cartItem.uniqueKey === item.uniqueKey ||
      (cartItem.id === item.id && cartItem.version === item.version),
  );

  if (existingItemIndex > -1) {
    // Cập nhật số lượng
    currentCart[existingItemIndex].quantity += item.quantity || 1;
  } else {
    // Thêm mới
    currentCart.push({
      ...item,
      uniqueKey: item.uniqueKey || `${item.id}_${item.version || 'default'}_${Date.now()}`,
    });
  }

  await updateUserCart(email, currentCart);
}

// Xóa sản phẩm khỏi giỏ hàng
export async function removeFromUserCart(email: string, uniqueKey: string): Promise<void> {
  const currentCart = await getUserCart(email);
  const updatedCart = currentCart.filter((item) => item.uniqueKey !== uniqueKey);
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
export async function createTransaction(
  transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Transaction> {
  const newTransaction: Transaction = {
    ...transactionData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Lưu vào file riêng của user (tìm user bằng userId)
  if (transactionData.userId) {
    // Tìm email từ userId
    const users = await getUsers();
    const user = users.find((u) => u.id === transactionData.userId);
    if (user) {
      const userData = await getUserDataFromFile(user.email);
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
  const userData = await ensureUserDataExists(userEmail);
  return userData.transactions || [];
}

// Sync balance between users.json and balances.json
export async function syncUserBalance(email: string): Promise<number> {
  try {
    if (!email) {
      throw new Error('Email is required for syncUserBalance');
    }

    // Read from both sources
    let balanceFromUsers = 0;
    let balanceFromBalances = 0;
    let balanceFromUserFile = 0;
    let errorMessages = [];
    let userData: UserData | null = null;

    // Get from user's individual file
    try {
      userData = await getUserDataFromFile(email);
      if (userData) {
        balanceFromUserFile = userData.profile.balance || 0;
      }
    } catch (error) {
      console.log('Could not read from user file:', error);
      errorMessages.push(`User file error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Get from users.json
    let user: User | null = null;
    try {
      const users = await getUsers();
      user = users.find((u) => u.email === email) || null;
      balanceFromUsers = user?.balance || 0;
    } catch (error) {
      console.log('Could not read from users.json:', error);
      errorMessages.push(`users.json error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Get from balances.json
    try {
      // Kiểm tra xem file có tồn tại không trước khi đọc
      if (fsSync.existsSync(BALANCES_FILE)) {
        const balanceData = await fs.readFile(BALANCES_FILE, 'utf8');
        try {
          const balances: UserBalance = JSON.parse(balanceData);
          balanceFromBalances = balances[email] || 0;
          console.log(`Read balance for ${email} from balances.json: ${balanceFromBalances}`);
        } catch (parseError) {
          console.error('Error parsing balances.json:', parseError);
          // File tồn tại nhưng nội dung không hợp lệ, tạo mới
          await fs.writeFile(BALANCES_FILE, JSON.stringify({}, null, 2), 'utf8');
          console.log('Recreated balances.json file due to invalid content');
          errorMessages.push(`balances.json parse error: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`);
        }
      } else {
        // File không tồn tại, tạo mới
        await fs.writeFile(BALANCES_FILE, JSON.stringify({}, null, 2), 'utf8');
        console.log('Created new balances.json file because it was missing');
        errorMessages.push('balances.json file was missing and has been created');
      }
    } catch (error) {
      console.error('Error checking/reading balances.json:', error);
      errorMessages.push(`balances.json access error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // If no user data exists anywhere, create new user with fallback mechanism
    if (!userData && !user) {
      try {
        user = await createNewUserFromEmail(email);
        const newUserData = createDefaultUserData(user);
        await saveUserDataToFile(email, newUserData);
        return 0; // New user has 0 balance
      } catch (createError) {
        console.error('Failed to create new user:', createError);
        errorMessages.push(`User creation error: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
        // Last resort fallback
        return 0;
      }
    }

    // If we have error messages but still have at least one balance value, continue
    if (errorMessages.length > 0) {
      console.warn(`Continuing with partial data despite errors: ${errorMessages.join('; ')}`);
    }

    // Use the highest balance and sync
    const finalBalance = Math.max(balanceFromUsers, balanceFromBalances, balanceFromUserFile);

    // Update all systems with the final balance - with error handling for each step
    try {
      if (balanceFromUsers !== finalBalance) {
        await updateUserBalanceInFile(email, finalBalance - balanceFromUsers);
      }
    } catch (updateError) {
      console.error('Failed to update users.json:', updateError);
    }

    try {
      if (balanceFromBalances !== finalBalance) {
        await updateBalanceInBalancesFile(email, finalBalance);
      }
    } catch (updateError) {
      console.error('Failed to update balances.json:', updateError);
    }

    try {
      if (balanceFromUserFile !== finalBalance) {
        let userData = await getUserDataFromFile(email);
        if (!userData) {
          // Create user data if it doesn't exist
          const users = await getUsers();
          const existingUser = users.find((u) => u.email === email);
          if (existingUser) {
            userData = createDefaultUserData(existingUser);
          } else if (user) {
            userData = createDefaultUserData(user);
          }
        }
        if (userData) {
          userData.profile.balance = finalBalance;
          await saveUserDataToFile(email, userData);
        }
      }
    } catch (updateError) {
      console.error('Failed to update user file:', updateError);
    }

    return finalBalance;
  } catch (error) {
    console.error('Error syncing balance:', error);
    // Rethrow with more context for better debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to sync balance for ${email}: ${errorMessage}`);
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
    const userIndex = users.findIndex((user) => user.email === email);

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
      const userTransactions = transactions.filter((t) => t.userId === user.id);

      const userData: UserData = {
        profile: user,
        transactions: userTransactions,
        cart: [], // Giỏ hàng trống ban đầu
        orders: [], // Đơn hàng trống ban đầu
        settings: {
          notifications: true,
          language: 'vi',
          theme: 'light',
        },
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: '1.0',
        },
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
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', '').replace(/_/g, '@')); // Chuyển đổi ngược từ tên file
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
      .filter((t) => t.type === 'purchase' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    lastActivity: userData.metadata.lastUpdated,
    settings: userData.settings,
  };
}

// Cập nhật thông tin user và đảm bảo đồng bộ toàn diện
export async function syncAllUserData(
  email: string,
  updateData?: Partial<User>,
): Promise<User | null> {
  try {
    console.log(`🔄 Starting comprehensive sync for user: ${email}`);

    // 1. Lấy dữ liệu từ file riêng (nguồn chính)
    let userData = await getUserDataFromFile(email);
    let user: User | null = null;

    if (userData) {
      user = userData.profile;

      // Apply updates if provided
      if (updateData) {
        user = {
          ...user,
          ...updateData,
          email: email, // Ensure email consistency
          updatedAt: new Date().toISOString(),
        };
        userData.profile = user;
        userData.metadata.lastUpdated = new Date().toISOString();
      }
    } else {
      // 2. Nếu không có file riêng, tìm từ users.json
      const users = await getUsers();
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        user = existingUser;
        if (updateData) {
          user = {
            ...user,
            ...updateData,
            updatedAt: new Date().toISOString(),
          };
        }
        // Tạo file riêng từ dữ liệu cũ
        userData = createDefaultUserData(user);
      } else if (updateData) {
        // 3. Tạo user mới nếu cần
        user = {
          id: Date.now().toString(),
          name: updateData.name || '',
          email: email,
          image: updateData.image,
          isAdmin: updateData.isAdmin || false,
          isActive: updateData.isActive !== undefined ? updateData.isActive : true,
          balance: updateData.balance || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: updateData.lastLogin || new Date().toISOString(),
        };
        userData = createDefaultUserData(user);
      }
    }

    if (!user || !userData) {
      console.log(`❌ No user data to sync for: ${email}`);
      return null;
    }

    // 4. Lưu vào file riêng (nguồn chính)
    await saveUserDataToFile(email, userData);

    // 5. Đồng bộ với users.json
    const allUsers = await getUsers();
    const userIndex = allUsers.findIndex((u) => u.email === email);

    if (userIndex >= 0) {
      allUsers[userIndex] = user;
    } else {
      allUsers.push(user);
    }
    await saveUsers(allUsers);

    // 6. Đồng bộ với balances.json
    await updateBalanceInBalancesFile(email, user.balance);

    console.log(`✅ Comprehensive sync completed for user: ${email}`);
    return user;
  } catch (error) {
    console.error(`❌ Error in comprehensive sync for ${email}:`, error);
    throw error;
  }
}

// Cập nhật wrapper functions để sử dụng sync toàn diện
export async function updateUserProfileData(
  email: string,
  profileData: Partial<User>,
): Promise<User | null> {
  return await syncAllUserData(email, profileData);
}

// Cập nhật cart và đảm bảo metadata được cập nhật
export async function updateUserCartSync(email: string, cart: CartItem[]): Promise<void> {
  try {
    const userData = await ensureUserDataExists(email);

    userData.cart = cart;
    userData.metadata.lastUpdated = new Date().toISOString();
    userData.profile.updatedAt = new Date().toISOString();

    await saveUserDataToFile(email, userData);

    // Trigger sync để đảm bảo consistency
    await syncAllUserData(email);

    console.log(`✅ Cart updated and synced for user: ${email}`);
  } catch (error) {
    console.error(`❌ Error updating cart for ${email}:`, error);
    throw error;
  }
}

// Migrate dữ liệu đơn hàng từ localStorage vào file user data
export async function migrateOrdersFromLocalStorage(email: string): Promise<void> {
  try {
    console.log(`🔄 Migrating orders from localStorage for: ${email}`);

    // Chỉ chạy trên client side
    if (typeof window === 'undefined') {
      return;
    }

    const userData = await ensureUserDataExists(email);

    // Lấy dữ liệu từ localStorage
    const localOrders = JSON.parse(localStorage.getItem(`orders_${email}`) || '[]');

    if (localOrders.length > 0) {
      // Convert localStorage orders to our Order format
      const migratedOrders: Order[] = localOrders.map((localOrder: any) => ({
        id: localOrder.id || `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items:
          localOrder.items?.map((item: any) => ({
            productId: item.productId || item.id,
            productName: item.productName || item.name,
            quantity: item.quantity || 1,
            price: item.price || 0,
            originalPrice: item.originalPrice,
            image: item.image,
            version: item.version || 'default',
          })) || [],
        totalAmount: localOrder.totalAmount || 0,
        couponDiscount: localOrder.couponDiscount || 0,
        status: localOrder.status || 'completed',
        paymentMethod: localOrder.paymentMethod || 'unknown',
        paymentStatus: localOrder.paymentStatus || 'paid',
        createdAt: localOrder.createdAt || new Date().toISOString(),
        updatedAt: localOrder.updatedAt || new Date().toISOString(),
        transactionId: localOrder.transactionId,
      }));

      // Merge với orders hiện có (tránh duplicate)
      const existingOrderIds = userData.orders.map((o) => o.id);
      const newOrders = migratedOrders.filter((o) => !existingOrderIds.includes(o.id));

      if (newOrders.length > 0) {
        userData.orders.push(...newOrders);
        userData.metadata.lastUpdated = new Date().toISOString();

        await saveUserDataToFile(email, userData);
        console.log(`✅ Migrated ${newOrders.length} orders for: ${email}`);
      } else {
        console.log(`ℹ️ No new orders to migrate for: ${email}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error migrating orders for ${email}:`, error);
  }
}

// ===== ORDER MANAGEMENT FUNCTIONS =====

// Lấy danh sách đơn hàng của user
export async function getUserOrders(email: string): Promise<Order[]> {
  try {
    const userData = await getUserDataFromFile(email);
    return userData?.orders || [];
  } catch (error) {
    console.error(`Error getting orders for ${email}:`, error);
    return [];
  }
}

// Thêm đơn hàng mới cho user
export async function addUserOrder(email: string, order: Order): Promise<void> {
  try {
    const userData = await ensureUserDataExists(email);

    userData.orders.push(order);
    userData.metadata.lastUpdated = new Date().toISOString();
    userData.profile.updatedAt = new Date().toISOString();

    await saveUserDataToFile(email, userData);
    console.log(`✅ Order ${order.id} added for user: ${email}`);
  } catch (error) {
    console.error(`❌ Error adding order for ${email}:`, error);
    throw error;
  }
}

// Cập nhật đơn hàng của user
export async function updateUserOrder(
  email: string,
  orderId: string,
  updates: Partial<Order>,
): Promise<void> {
  try {
    const userData = await ensureUserDataExists(email);

    const orderIndex = userData.orders.findIndex((order) => order.id === orderId);
    if (orderIndex >= 0) {
      userData.orders[orderIndex] = {
        ...userData.orders[orderIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      userData.metadata.lastUpdated = new Date().toISOString();
      userData.profile.updatedAt = new Date().toISOString();

      await saveUserDataToFile(email, userData);
      console.log(`✅ Order ${orderId} updated for user: ${email}`);
    } else {
      console.log(`❌ Order ${orderId} not found for user: ${email}`);
    }
  } catch (error) {
    console.error(`❌ Error updating order for ${email}:`, error);
    throw error;
  }
}

// Lấy thống kê đơn hàng của user
export async function getUserOrderStats(email: string): Promise<{
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  totalProducts: number;
}> {
  try {
    const orders = await getUserOrders(email);

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;
    const totalSpent = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalProducts = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.items.length, 0);

    return {
      totalOrders,
      completedOrders,
      totalSpent,
      totalProducts,
    };
  } catch (error) {
    console.error(`Error getting order stats for ${email}:`, error);
    return {
      totalOrders: 0,
      completedOrders: 0,
      totalSpent: 0,
      totalProducts: 0,
    };
  }
}
