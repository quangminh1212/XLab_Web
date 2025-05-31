import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { User } from '@/models/UserModel';
import { Transaction } from '@/models/TransactionModel';

// Cấu hình bảo mật
const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// Đường dẫn lưu trữ
const USER_DATA_DIR = path.join(process.cwd(), 'data', 'users');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');

// Interface cho dữ liệu user
export interface UserData {
  profile: User;
  transactions: Transaction[];
  sessions: Array<{
    id: string;
    loginTime: string;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
  }>;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    metadata?: any;
  }>;
  settings: {
    notifications: boolean;
    emailAlerts: boolean;
    twoFactorAuth: boolean;
    lastPasswordChange?: string;
  };
  metadata: {
    lastBackup: string;
    dataVersion: string;
    checksum: string;
  };
}

// Tạo checksum cho dữ liệu
function createDataChecksum(data: any): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// Mã hóa dữ liệu đơn giản với Base64
function encryptData(data: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest('hex').slice(0, 32);
  const cipher = crypto.createCipher(ALGORITHM, key);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: crypto.createHash('sha256').update(encrypted + iv.toString('hex')).digest('hex')
  };
}

// Giải mã dữ liệu
function decryptData(encryptedData: string, iv: string, tag: string): string {
  // Kiểm tra tính toàn vẹn
  const expectedTag = crypto.createHash('sha256').update(encryptedData + iv).digest('hex');
  if (expectedTag !== tag) {
    throw new Error('Data integrity check failed');
  }
  
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest('hex').slice(0, 32);
  const decipher = crypto.createDecipher(ALGORITHM, key);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Tạo tên file an toàn từ email
function createSafeFileName(email: string): string {
  const hash = crypto.createHash('sha256').update(email).digest('hex');
  return `user_${hash.substring(0, 16)}.json`;
}

// Đảm bảo thư mục tồn tại
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Lấy đường dẫn file user
function getUserFilePath(email: string): string {
  const fileName = createSafeFileName(email);
  return path.join(USER_DATA_DIR, fileName);
}

// Lấy đường dẫn backup
function getBackupFilePath(email: string, timestamp: string): string {
  const fileName = createSafeFileName(email);
  const backupFileName = `${timestamp}_${fileName}`;
  return path.join(BACKUP_DIR, backupFileName);
}

// Tạo backup dữ liệu
async function createBackup(email: string, userData: UserData): Promise<void> {
  try {
    await ensureDirectoryExists(BACKUP_DIR);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = getBackupFilePath(email, timestamp);
    
    const dataString = JSON.stringify(userData, null, 2);
    const { encrypted, iv, tag } = encryptData(dataString);
    
    const backupData = {
      email: email,
      timestamp: timestamp,
      data: encrypted,
      iv: iv,
      tag: tag,
      checksum: createDataChecksum(userData)
    };
    
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`✅ Backup created for user: ${email} at ${backupPath}`);
  } catch (error) {
    console.error(`❌ Error creating backup for ${email}:`, error);
  }
}

// Lưu dữ liệu user
export async function saveUserData(email: string, userData: UserData): Promise<void> {
  try {
    await ensureDirectoryExists(USER_DATA_DIR);
    
    // Tạo backup trước khi lưu
    const existingData = await getUserData(email);
    if (existingData) {
      await createBackup(email, existingData);
    }
    
    // Cập nhật metadata
    userData.metadata.lastBackup = new Date().toISOString();
    userData.metadata.dataVersion = '1.0';
    userData.metadata.checksum = createDataChecksum(userData);
    
    const filePath = getUserFilePath(email);
    const dataString = JSON.stringify(userData, null, 2);
    const { encrypted, iv, tag } = encryptData(dataString);
    
    const encryptedData = {
      email: email,
      data: encrypted,
      iv: iv,
      tag: tag,
      lastModified: new Date().toISOString(),
      checksum: userData.metadata.checksum
    };
    
    await fs.writeFile(filePath, JSON.stringify(encryptedData, null, 2), 'utf8');
    console.log(`✅ User data saved securely for: ${email}`);
  } catch (error) {
    console.error(`❌ Error saving user data for ${email}:`, error);
    throw error;
  }
}

// Lấy dữ liệu user
export async function getUserData(email: string): Promise<UserData | null> {
  try {
    const filePath = getUserFilePath(email);
    
    try {
      await fs.access(filePath);
    } catch {
      return null; // File không tồn tại
    }
    
    const fileContent = await fs.readFile(filePath, 'utf8');
    const encryptedData = JSON.parse(fileContent);
    
    const decryptedString = decryptData(
      encryptedData.data,
      encryptedData.iv,
      encryptedData.tag
    );
    
    const userData: UserData = JSON.parse(decryptedString);
    
    // Kiểm tra checksum
    const currentChecksum = createDataChecksum(userData);
    if (currentChecksum !== userData.metadata.checksum) {
      console.warn(`⚠️ Data integrity warning for user: ${email}`);
    }
    
    return userData;
  } catch (error) {
    console.error(`❌ Error loading user data for ${email}:`, error);
    return null;
  }
}

// Tạo dữ liệu user mới
export async function createUserData(user: User): Promise<UserData> {
  const userData: UserData = {
    profile: user,
    transactions: [],
    sessions: [],
    activities: [{
      id: Date.now().toString(),
      type: 'account_created',
      description: 'Tài khoản được tạo',
      timestamp: new Date().toISOString()
    }],
    settings: {
      notifications: true,
      emailAlerts: true,
      twoFactorAuth: false
    },
    metadata: {
      lastBackup: new Date().toISOString(),
      dataVersion: '1.0',
      checksum: ''
    }
  };
  
  userData.metadata.checksum = createDataChecksum(userData);
  return userData;
}

// Cập nhật hoạt động user
export async function addUserActivity(
  email: string, 
  type: string, 
  description: string, 
  metadata?: any
): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;
    
    userData.activities.push({
      id: Date.now().toString(),
      type: type,
      description: description,
      timestamp: new Date().toISOString(),
      metadata: metadata
    });
    
    // Giới hạn số lượng activities (giữ 1000 hoạt động gần nhất)
    if (userData.activities.length > 1000) {
      userData.activities = userData.activities.slice(-1000);
    }
    
    await saveUserData(email, userData);
  } catch (error) {
    console.error(`❌ Error adding activity for ${email}:`, error);
  }
}

// Cập nhật session user
export async function updateUserSession(
  email: string,
  sessionData: {
    id: string;
    loginTime: string;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
  }
): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;
    
    // Cập nhật hoặc thêm session mới
    const existingSessionIndex = userData.sessions.findIndex(s => s.id === sessionData.id);
    if (existingSessionIndex >= 0) {
      userData.sessions[existingSessionIndex] = sessionData;
    } else {
      userData.sessions.push(sessionData);
    }
    
    // Giới hạn số lượng sessions (giữ 100 sessions gần nhất)
    if (userData.sessions.length > 100) {
      userData.sessions = userData.sessions.slice(-100);
    }
    
    await saveUserData(email, userData);
  } catch (error) {
    console.error(`❌ Error updating session for ${email}:`, error);
  }
}

// Thêm transaction vào dữ liệu user
export async function addUserTransaction(email: string, transaction: Transaction): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;
    
    userData.transactions.push(transaction);
    
    // Sắp xếp theo thời gian mới nhất trước
    userData.transactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    await saveUserData(email, userData);
    
    // Thêm activity log
    await addUserActivity(
      email,
      'transaction',
      `Giao dịch ${transaction.type}: ${transaction.amount.toLocaleString('vi-VN')} VND`,
      { transactionId: transaction.id, amount: transaction.amount, type: transaction.type }
    );
  } catch (error) {
    console.error(`❌ Error adding transaction for ${email}:`, error);
  }
}

// Kiểm tra tính toàn vẹn dữ liệu
export async function verifyDataIntegrity(email: string): Promise<boolean> {
  try {
    const userData = await getUserData(email);
    if (!userData) return false;
    
    const currentChecksum = createDataChecksum(userData);
    return currentChecksum === userData.metadata.checksum;
  } catch (error) {
    console.error(`❌ Error verifying data integrity for ${email}:`, error);
    return false;
  }
}

// Khôi phục từ backup
export async function restoreFromBackup(email: string, backupTimestamp: string): Promise<boolean> {
  try {
    const backupPath = getBackupFilePath(email, backupTimestamp);
    
    const backupContent = await fs.readFile(backupPath, 'utf8');
    const backupData = JSON.parse(backupContent);
    
    const decryptedString = decryptData(
      backupData.data,
      backupData.iv,
      backupData.tag
    );
    
    const userData: UserData = JSON.parse(decryptedString);
    
    // Kiểm tra checksum
    const currentChecksum = createDataChecksum(userData);
    if (currentChecksum !== backupData.checksum) {
      console.error(`❌ Backup data integrity check failed for ${email}`);
      return false;
    }
    
    await saveUserData(email, userData);
    console.log(`✅ Successfully restored data from backup for ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error restoring backup for ${email}:`, error);
    return false;
  }
} 