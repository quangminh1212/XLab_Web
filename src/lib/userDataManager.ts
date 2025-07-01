import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User } from '@/models/UserModel';
import { Transaction } from '@/models/TransactionModel';

// Cấu hình bảo mật
const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16; // GCM authentication tag length

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

// Mã hóa dữ liệu với AES-256-GCM
function encryptData(data: string): { encrypted: string; iv: string; tag: string; salt: string } {
  // Generate a random salt for key derivation
  const salt = crypto.randomBytes(16);
  
  // Create a key derived from our main encryption key and the salt
  const keyMaterial = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);
  
  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher with key, iv in GCM mode
  const cipher = crypto.createCipheriv(ALGORITHM, keyMaterial, iv);
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the auth tag for integrity verification (GCM mode specific)
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: authTag.toString('hex'),
    salt: salt.toString('hex')
  };
}

// Giải mã dữ liệu
function decryptData(encryptedData: string, iv: string, tag: string, salt: string): string {
  try {
    // Convert hex strings back to buffers
    const ivBuffer = Buffer.from(iv, 'hex');
    const tagBuffer = Buffer.from(tag, 'hex');
    const saltBuffer = Buffer.from(salt, 'hex');
    
    // Recreate the same key using the same salt
    const keyMaterial = crypto.scryptSync(ENCRYPTION_KEY, saltBuffer, 32);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, keyMaterial, ivBuffer);
    
    // Set auth tag for integrity verification
    decipher.setAuthTag(tagBuffer);
    
    // Decrypt
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Data integrity check failed or decryption error');
  }
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

// File lock management
const fileLocks = new Map<string, Promise<void>>();

async function withFileLock<T>(filePath: string, operation: () => Promise<T>): Promise<T> {
  const lockKey = path.resolve(filePath);

  // Wait for any existing lock on this file
  if (fileLocks.has(lockKey)) {
    await fileLocks.get(lockKey);
  }

  // Create new lock
  let resolveLock: () => void;
  const lockPromise = new Promise<void>((resolve) => {
    resolveLock = resolve;
  });

  fileLocks.set(lockKey, lockPromise);

  try {
    const result = await operation();
    return result;
  } finally {
    // Release lock
    fileLocks.delete(lockKey);
    resolveLock!();
  }
}

// Retry mechanism for Windows file operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  delayMs: number = 100,
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Retry on file system errors
      if (error.code === 'EPERM' || error.code === 'EBUSY' || error.code === 'ENOENT') {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError!;
}

// Tạo backup dữ liệu
async function createBackup(email: string, userData: UserData): Promise<void> {
  try {
    await ensureDirectoryExists(BACKUP_DIR);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = getBackupFilePath(email, timestamp);

    const dataString = JSON.stringify(userData, null, 2);
    const { encrypted, iv, tag, salt } = encryptData(dataString);

    const backupData = {
      email: email,
      timestamp: timestamp,
      data: encrypted,
      iv: iv,
      tag: tag,
      salt: salt,
      checksum: createDataChecksum(userData),
    };

    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`✅ Backup created for user: ${email} at ${backupPath}`);
  } catch (error) {
    console.error(`❌ Error creating backup for ${email}:`, error);
  }
}

// Lưu dữ liệu user
export async function saveUserData(email: string, userData: UserData): Promise<void> {
  await ensureDirectoryExists(USER_DATA_DIR);

  // Create backup before saving
  await createBackup(email, userData);

  const filePath = getUserFilePath(email);
  
  return withFileLock(filePath, async () => {
    await retryOperation(async () => {
      // Update metadata
      userData.metadata = {
        ...userData.metadata,
        lastBackup: new Date().toISOString(),
        dataVersion: '2.0',
        checksum: createDataChecksum(userData),
      };

      const dataString = JSON.stringify(userData, null, 2);
      const { encrypted, iv, tag, salt } = encryptData(dataString);

      const fileData = {
        email: email, // Store hashed email reference
        data: encrypted,
        iv: iv,
        tag: tag,
        salt: salt,
        timestamp: new Date().toISOString(),
        version: '2.0', // Increment version for new encryption
      };

      await fs.writeFile(filePath, JSON.stringify(fileData, null, 2), 'utf8');
      console.log(`✅ User data saved securely for: ${email}`);
    });
  });
}

// Tạo dữ liệu user mới
export async function createUserData(user: User): Promise<UserData> {
  const userData: UserData = {
    profile: user,
    transactions: [],
    sessions: [],
    activities: [
      {
        id: Date.now().toString(),
        type: 'account_created',
        description: 'Tài khoản được tạo',
        timestamp: new Date().toISOString(),
      },
    ],
    settings: {
      notifications: true,
      emailAlerts: true,
      twoFactorAuth: false,
    },
    metadata: {
      lastBackup: new Date().toISOString(),
      dataVersion: '1.0',
      checksum: '',
    },
  };

  userData.metadata.checksum = createDataChecksum(userData);
  return userData;
}

// Cập nhật hoạt động user
export async function addUserActivity(
  email: string,
  type: string,
  description: string,
  metadata?: any,
): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;

    userData.activities.push({
      id: Date.now().toString(),
      type: type,
      description: description,
      timestamp: new Date().toISOString(),
      metadata: metadata,
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
  },
): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;

    // Cập nhật hoặc thêm session mới
    const existingSessionIndex = userData.sessions.findIndex((s) => s.id === sessionData.id);
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
    userData.transactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    await saveUserData(email, userData);

    // Thêm activity log
    await addUserActivity(
      email,
      'transaction',
      `Giao dịch ${transaction.type}: ${transaction.amount.toLocaleString('vi-VN')} VND`,
      { transactionId: transaction.id, amount: transaction.amount, type: transaction.type },
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

// Dọn dẹp files tạm thời và corrupt
export async function cleanupCorruptedFiles(): Promise<void> {
  try {
    await ensureDirectoryExists(USER_DATA_DIR);
    const files = await fs.readdir(USER_DATA_DIR);

    const filesToClean = files.filter(
      (file) => file.endsWith('.tmp') || file.includes('.corrupted.') || file.endsWith('.temp'),
    );

    if (filesToClean.length > 0) {
      console.log(`🧹 Cleaning up ${filesToClean.length} temporary/corrupted files...`);

      for (const file of filesToClean) {
        try {
          const filePath = path.join(USER_DATA_DIR, file);
          const stats = await fs.stat(filePath);

          // Chỉ xóa files cũ hơn 1 giờ
          const oneHourAgo = Date.now() - 60 * 60 * 1000;
          if (stats.mtime.getTime() < oneHourAgo) {
            await fs.unlink(filePath);
            console.log(`🗑️ Deleted old temporary file: ${file}`);
          }
        } catch (error) {
          console.error(`❌ Error deleting file ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Khôi phục từ backup
export async function restoreFromBackup(email: string, backupTimestamp: string): Promise<boolean> {
  try {
    const backupPath = getBackupFilePath(email, backupTimestamp);

    const backupContent = await fs.readFile(backupPath, 'utf8');
    const backupData = JSON.parse(backupContent);

    const decryptedString = decryptData(backupData.data, backupData.iv, backupData.tag, backupData.salt);

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

// Lấy dữ liệu user
export async function getUserData(email: string): Promise<UserData | null> {
  const filePath = getUserFilePath(email);

  return withFileLock(filePath, async () => {
    try {
      const fileData = await retryOperation(async () => {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
      });

      // Validate file structure
      if (!fileData.data || !fileData.iv || !fileData.tag) {
        console.error(`❌ Invalid file format for user: ${email}`);
        return null;
      }

      // Handle the new encryption format (with salt)
      if (fileData.version === '2.0' && fileData.salt) {
        const decryptedData = decryptData(
          fileData.data,
          fileData.iv,
          fileData.tag,
          fileData.salt
        );
        
        const userData = JSON.parse(decryptedData) as UserData;
        
        // Verify data integrity with checksum
        const calculatedChecksum = createDataChecksum({
          ...userData,
          metadata: { ...userData.metadata, checksum: '' },
        });
        
        if (calculatedChecksum !== userData.metadata.checksum) {
          console.error(`❌ Data integrity check failed for user: ${email}`);
          await addSystemAlert(email, 'security', 'Data integrity check failed, possible tampering detected');
          return null;
        }
        
        return userData;
      } 
      // Handle legacy format (without salt) for backward compatibility
      else {
        try {
          // This is the old implementation, kept for backward compatibility
          const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest('hex').slice(0, 32);
          const decipher = crypto.createDecipher('aes-256-cbc', key);
          
          let decrypted = decipher.update(fileData.data, 'hex', 'utf8');
          decrypted += decipher.final('utf8');
          
          const userData = JSON.parse(decrypted) as UserData;
          
          // Schedule migration to new format
          setTimeout(() => {
            saveUserData(email, userData).catch(console.error);
          }, 1000);
          
          return userData;
        } catch (error) {
          console.error(`❌ Error decrypting legacy data for user: ${email}`, error);
          return null;
        }
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist - this is normal for new users
        return null;
      }
      
      console.error(`❌ Error loading user data for ${email}:`, error);
      return null;
    }
  });
}

// Cleanup các file temporary và backup cũ
export async function cleanupOldFiles(): Promise<void> {
  try {
    const userDir = path.dirname(getUserFilePath('dummy'));
    const backupDir = path.dirname(getBackupFilePath('dummy', ''));

    // Cleanup user directory
    try {
      const userFiles = await fs.readdir(userDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of userFiles) {
        if (file.includes('.tmp.') || file.includes('.backup.') || file.includes('.corrupted.')) {
          const filePath = path.join(userDir, file);
          try {
            const stats = await fs.stat(filePath);
            if (now - stats.mtime.getTime() > maxAge) {
              await fs.unlink(filePath);
              console.log(`🧹 Cleaned up old file: ${file}`);
            }
          } catch (error) {
            // Ignore errors for individual files
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning user directory:', error);
    }

    // Cleanup backup directory
    try {
      const backupFiles = await fs.readdir(backupDir);
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      for (const file of backupFiles) {
        if (file.includes('.tmp.')) {
          const filePath = path.join(backupDir, file);
          try {
            const stats = await fs.stat(filePath);
            if (now - stats.mtime.getTime() > maxAge) {
              await fs.unlink(filePath);
              console.log(`🧹 Cleaned up old backup: ${file}`);
            }
          } catch (error) {
            // Ignore errors for individual files
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning backup directory:', error);
    }

    console.log('✅ File cleanup completed');
  } catch (error) {
    console.error('❌ Error during file cleanup:', error);
  }
}

// Auto cleanup khi startup
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  // Run cleanup on startup, but don't wait for it
  cleanupOldFiles().catch(console.error);
}

// Add system security alert
async function addSystemAlert(email: string, type: string, message: string): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;
    
    // Add security alert to user activities
    userData.activities.push({
      id: crypto.randomUUID(),
      type: type,
      description: message,
      timestamp: new Date().toISOString(),
      metadata: { severity: 'high', automated: true }
    });
    
    await saveUserData(email, userData);
  } catch (error) {
    console.error(`❌ Error adding system alert for ${email}:`, error);
  }
}
