import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

import { Transaction } from '@/models/TransactionModel';
import { User } from '@/models/UserModel';

// Cấu hình bảo mật
const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM khuyến nghị 12 bytes

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

// Mã hóa dữ liệu an toàn với AES-256-GCM
function deriveKey(): Buffer {
  // Hash secret thành 32-byte key buffer
  return crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
}

function encryptData(data: string): { encrypted: string; iv: string; tag: string; alg: string } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag,
    alg: 'aes-256-gcm',
  };
}

// Giải mã dữ liệu (hỗ trợ tương thích ngược)
function decryptData(encryptedData: string, iv: string, tag: string, alg?: string): string {
  const key = deriveKey();

  // Nhánh AES-256-GCM mới: ưu tiên nếu alg khai báo, hoặc tag dài 32 hex (16 bytes)
  if (alg === 'aes-256-gcm' || tag?.length === 32) {
    const ivBuf = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuf);
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Legacy: aes-256-cbc với createDecipher (không dùng iv đúng cách)
  const expectedTag = crypto
    .createHash('sha256')
    .update(encryptedData + iv)
    .digest('hex');
  if (expectedTag !== tag) {
    throw new Error('Data integrity check failed');
  }
  const legacyKey = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('hex').slice(0, 32);
  const legacyDecipher = crypto.createDecipher('aes-256-cbc', legacyKey);
  let decrypted = legacyDecipher.update(encryptedData, 'hex', 'utf8');
  decrypted += legacyDecipher.final('utf8');
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
    const { encrypted, iv, tag } = encryptData(dataString);

    const backupData = {
      email: email,
      timestamp: timestamp,
      data: encrypted,
      iv: iv,
      tag: tag,
      alg: 'aes-256-gcm',
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
  const filePath = getUserFilePath(email);

  return withFileLock(filePath, async () => {
    await retryOperation(async () => {
      try {
        // Đảm bảo thư mục tồn tại
        const userDir = path.dirname(filePath);
        await ensureDirectoryExists(userDir);

        // Tạo backup trước khi ghi file mới
        const existingData = await getUserData(email);
        if (existingData) {
          await createBackup(email, existingData);
        }

        // Update metadata trước khi mã hóa
        userData.metadata.lastBackup = new Date().toISOString();
        userData.metadata.checksum = createDataChecksum(userData);

        // Mã hóa dữ liệu
        const dataString = JSON.stringify(userData);
        const { encrypted, iv, tag } = encryptData(dataString);

        const encryptedData = {
          data: encrypted,
          iv: iv,
          tag: tag,
          alg: 'aes-256-gcm',
          timestamp: new Date().toISOString(),
        };

        // Tạo file name duy nhất cho temp file
        const tempFilePath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`;

        try {
          // Ghi vào file tạm thời trước
          await fs.writeFile(tempFilePath, JSON.stringify(encryptedData, null, 2), 'utf8');

          // Kiểm tra file tạm thời có đúng không
          const tempContent = await fs.readFile(tempFilePath, 'utf8');
          JSON.parse(tempContent); // Test parse để chắc chắn JSON hợp lệ

          // Windows-safe file replace
          const backupPath = `${filePath}.backup.${Date.now()}`;

          // Nếu file cũ tồn tại, rename nó thành backup
          try {
            await fs.access(filePath);
            await fs.rename(filePath, backupPath);
          } catch (accessError) {
            // File cũ không tồn tại, không cần backup
          }

          try {
            // Rename file tạm thời thành file chính
            await fs.rename(tempFilePath, filePath);

            // Xóa backup file nếu thành công
            try {
              await fs.unlink(backupPath);
            } catch (unlinkError) {
              // Ignore cleanup errors
            }

            // Chỉ log trong development mode
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ User data saved securely for: ${email}`);
            }
          } catch (renameError) {
            // Khôi phục file cũ nếu rename failed
            try {
              await fs.rename(backupPath, filePath);
            } catch (restoreError) {
              console.error('Failed to restore backup after rename failure:', restoreError);
            }
            throw renameError;
          }
        } catch (writeError) {
          // Xóa file tạm thời nếu có lỗi
          try {
            await fs.unlink(tempFilePath);
          } catch (unlinkError) {
            // Ignore unlink errors
          }
          throw writeError;
        }
      } catch (error) {
        console.error(`❌ Error saving user data for ${email}:`, error);
        throw error;
      }
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

    const decryptedString = decryptData(backupData.data, backupData.iv, backupData.tag, backupData.alg);

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
    return retryOperation(async () => {
      try {
        try {
          await fs.access(filePath);
        } catch {
          return null; // File không tồn tại
        }

        const fileContent = await fs.readFile(filePath, 'utf8');

        // Kiểm tra nội dung file có hợp lệ không
        if (!fileContent || fileContent.trim() === '') {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ Empty or invalid file content for user: ${email}, creating new data`);
          }
          return null;
        }

        // Kiểm tra xem có phải JSON hợp lệ không
        let encryptedData;
        try {
          encryptedData = JSON.parse(fileContent);
        } catch (parseError) {
          console.error(`❌ Invalid JSON in user data file for ${email}:`, parseError);
          // Thử tạo backup của file bị lỗi
          try {
            const corruptedBackupPath = `${filePath}.corrupted.${Date.now()}`;
            await fs.copyFile(filePath, corruptedBackupPath);
            console.log(`📁 Corrupted file backed up to: ${corruptedBackupPath}`);
          } catch (backupError) {
            console.error('Failed to backup corrupted file:', backupError);
          }
          return null;
        }

        // Kiểm tra cấu trúc dữ liệu
        if (!encryptedData.data || !encryptedData.iv || !encryptedData.tag) {
          console.error(`❌ Invalid encrypted data structure for user: ${email}`);
          return null;
        }

        let decryptedString;
        try {
          decryptedString = decryptData(encryptedData.data, encryptedData.iv, encryptedData.tag, encryptedData.alg);
        } catch (decryptError) {
          console.error(`❌ Decryption failed for user ${email}:`, decryptError);
          return null;
        }

        let userData: UserData;
        try {
          userData = JSON.parse(decryptedString);
        } catch (parseError) {
          console.error(`❌ Invalid JSON in decrypted data for user ${email}:`, parseError);
          return null;
        }

        // Kiểm tra checksum nếu có
        if (userData.metadata && userData.metadata.checksum) {
          const currentChecksum = createDataChecksum(userData);
          if (currentChecksum !== userData.metadata.checksum) {
            console.warn(`⚠️ Data integrity warning for user: ${email}`);
          }
        }

        return userData;
      } catch (error) {
        console.error(`❌ Error loading user data for ${email}:`, error);
        return null;
      }
    });
  });
}

// Cleanup các file temporary và backup cũ
export async function cleanupOldFiles(): Promise<void> {
  try {
    const userDir = path.dirname(getUserFilePath('dummy'));
    const backupDir = path.dirname(getBackupFilePath('dummy', ''));

    // Ensure directories exist before reading
    await ensureDirectoryExists(userDir);
    await ensureDirectoryExists(backupDir);

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
