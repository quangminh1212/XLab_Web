import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  getUserData, 
  saveUserData, 
  createUserData, 
  updateUserSession, 
  addUserActivity,
  cleanupCorruptedFiles 
} from './userDataManager';
import { User } from '@/models/UserModel';
import { NextRequest } from 'next/server';

// Interface cho thông tin session
interface SessionInfo {
  id: string;
  loginTime: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

// Lấy thông tin IP từ request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// Chạy cleanup mỗi giờ
let lastCleanupTime = 0;
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 giờ

async function runPeriodicCleanup(): Promise<void> {
  const now = Date.now();
  if (now - lastCleanupTime > CLEANUP_INTERVAL) {
    await cleanupCorruptedFiles();
    lastCleanupTime = now;
  }
}

// Theo dõi session user
export async function trackUserSession(request?: NextRequest): Promise<void> {
  try {
    // Chạy cleanup định kỳ
    await runPeriodicCleanup();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return;
    }

    const userEmail = session.user.email;
    
    // Lấy hoặc tạo dữ liệu user
    let userData = await getUserData(userEmail);
    
    if (!userData) {
      // Tạo user mới
      const newUser: User = {
        id: session.user.id || Date.now().toString(),
        name: session.user.name || '',
        email: userEmail,
                 image: session.user.image || undefined,
        isAdmin: session.user.isAdmin || false,
        isActive: true,
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      userData = await createUserData(newUser);
      await saveUserData(userEmail, userData);
      
      console.log(`✅ Created new user data for: ${userEmail}`);
    } else {
      // Cập nhật thông tin user
      userData.profile.lastLogin = new Date().toISOString();
      userData.profile.updatedAt = new Date().toISOString();
      
      // Cập nhật thông tin từ session nếu có thay đổi
      if (session.user.name && session.user.name !== userData.profile.name) {
        userData.profile.name = session.user.name;
      }
      if (session.user.image && session.user.image !== userData.profile.image) {
        userData.profile.image = session.user.image;
      }
      if (session.user.isAdmin !== undefined) {
        userData.profile.isAdmin = session.user.isAdmin;
      }
    }

    // Tạo thông tin session
    const sessionInfo: SessionInfo = {
      id: Date.now().toString(),
      loginTime: new Date().toISOString(),
      ipAddress: request ? getClientIP(request) : undefined,
      userAgent: request ? request.headers.get('user-agent') || undefined : undefined,
      isActive: true
    };

    // Cập nhật session
    await updateUserSession(userEmail, sessionInfo);
    
    // Thêm activity log
    await addUserActivity(
      userEmail,
      'login',
      'Đăng nhập vào hệ thống',
      {
        sessionId: sessionInfo.id,
        ip: sessionInfo.ipAddress,
        userAgent: sessionInfo.userAgent
      }
    );

    console.log(`✅ Session tracked for user: ${userEmail}`);
  } catch (error) {
    console.error('❌ Error tracking user session:', error);
  }
}

// Theo dõi hoạt động của user
export async function trackUserActivity(
  email: string,
  type: string,
  description: string,
  metadata?: any
): Promise<void> {
  try {
    await addUserActivity(email, type, description, metadata);
  } catch (error) {
    console.error('❌ Error tracking user activity:', error);
  }
}

// Cập nhật thông tin user balance
export async function updateUserDataBalance(email: string, newBalance: number): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;
    
    const oldBalance = userData.profile.balance;
    userData.profile.balance = newBalance;
    userData.profile.updatedAt = new Date().toISOString();
    
    await saveUserData(email, userData);
    
    // Thêm activity log
    await addUserActivity(
      email,
      'balance_update',
      `Số dư được cập nhật từ ${oldBalance.toLocaleString('vi-VN')} VND thành ${newBalance.toLocaleString('vi-VN')} VND`,
      { oldBalance, newBalance, difference: newBalance - oldBalance }
    );
    
    console.log(`✅ Balance updated for user: ${email} - New balance: ${newBalance}`);
  } catch (error) {
    console.error('❌ Error updating user balance:', error);
  }
}

// Đánh dấu session kết thúc
export async function endUserSession(email: string, sessionId?: string): Promise<void> {
  try {
    const userData = await getUserData(email);
    if (!userData) return;
    
    // Đánh dấu tất cả session hoặc session cụ thể là không hoạt động
    userData.sessions.forEach(session => {
      if (!sessionId || session.id === sessionId) {
        session.isActive = false;
      }
    });
    
    await saveUserData(email, userData);
    
    // Thêm activity log
    await addUserActivity(
      email,
      'logout',
      'Đăng xuất khỏi hệ thống',
      { sessionId: sessionId || 'all' }
    );
    
    console.log(`✅ Session ended for user: ${email}`);
  } catch (error) {
    console.error('❌ Error ending user session:', error);
  }
}

// Lấy thống kê user
export async function getUserStats(email: string): Promise<any> {
  try {
    const userData = await getUserData(email);
    if (!userData) return null;
    
    const activeSessions = userData.sessions.filter(s => s.isActive).length;
    const totalActivities = userData.activities.length;
    const totalTransactions = userData.transactions.length;
    const lastLogin = userData.profile.lastLogin;
    
    return {
      activeSessions,
      totalActivities,
      totalTransactions,
      lastLogin,
      memberSince: userData.profile.createdAt,
      currentBalance: userData.profile.balance
    };
  } catch (error) {
    console.error('❌ Error getting user stats:', error);
    return null;
  }
} 