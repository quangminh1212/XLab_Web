import fs from 'fs/promises';
import path from 'path';
import { User } from '@/models/UserModel';
import { Transaction } from '@/models/TransactionModel';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const TRANSACTIONS_FILE = path.join(process.cwd(), 'data', 'transactions.json');
const BALANCES_FILE = path.join(process.cwd(), 'data', 'balances.json');

// User balance interface
interface UserBalance {
  [email: string]: number;
}

// Đọc dữ liệu người dùng
export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Lưu dữ liệu người dùng
export async function saveUsers(users: User[]): Promise<void> {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users file:', error);
    throw error;
  }
}

// Lấy thông tin người dùng theo email
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(user => user.email === email) || null;
}

// Tạo hoặc cập nhật người dùng
export async function createOrUpdateUser(userData: Partial<User> & { email: string }): Promise<User> {
  const users = await getUsers();
  const existingUserIndex = users.findIndex(user => user.email === userData.email);
  
  if (existingUserIndex >= 0) {
    // Cập nhật người dùng hiện có
    users[existingUserIndex] = { ...users[existingUserIndex], ...userData };
    await saveUsers(users);
    return users[existingUserIndex];
  } else {
    // Tạo người dùng mới
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
    users.push(newUser);
    await saveUsers(users);
    return newUser;
  }
}

// Cập nhật số dư người dùng
export async function updateUserBalance(email: string, amount: number): Promise<User | null> {
  const users = await getUsers();
  const userIndex = users.findIndex(user => user.email === email);
  
  if (userIndex >= 0) {
    users[userIndex].balance = (users[userIndex].balance || 0) + amount;
    users[userIndex].updatedAt = new Date().toISOString();
    await saveUsers(users);
    return users[userIndex];
  }
  
  return null;
}

// Đọc giao dịch
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await fs.readFile(TRANSACTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions file:', error);
    return [];
  }
}

// Lưu giao dịch
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
  const transactions = await getTransactions();
  const newTransaction: Transaction = {
    ...transactionData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  await saveTransactions(transactions);
  return newTransaction;
}

// Lấy giao dịch của người dùng
export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const transactions = await getTransactions();
  return transactions.filter(transaction => transaction.userId === userId);
}

// Sync balance between users.json and balances.json
export async function syncUserBalance(email: string): Promise<number> {
  try {
    // Read from both sources
    let balanceFromUsers = 0;
    let balanceFromBalances = 0;
    
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
    
    // Use the higher balance and sync
    const finalBalance = Math.max(balanceFromUsers, balanceFromBalances);
    
    // Update both systems with the final balance
    if (balanceFromUsers !== finalBalance) {
      await updateUserBalanceInFile(email, finalBalance - balanceFromUsers);
    }
    
    if (balanceFromBalances !== finalBalance) {
      await updateBalanceInBalancesFile(email, finalBalance);
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