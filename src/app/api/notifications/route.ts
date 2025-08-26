import fs from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/authOptions';

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json');

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'promotion' | 'update' | 'order' | 'system';
  targetUsers?: string[]; // Nếu không có thì gửi cho tất cả
  isRead: { [userId: string]: boolean };
  createdAt: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: string;
}

// Đảm bảo thư mục data tồn tại
async function ensureDataDir() {
  const dataDir = path.dirname(NOTIFICATIONS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Đọc thông báo từ file
async function getNotifications(): Promise<Notification[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(NOTIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Nếu file không tồn tại, tạo với dữ liệu mẫu
    const defaultNotifications: Notification[] = [
      {
        id: '1',
        title: 'Khuyến mãi đặc biệt',
        content: 'Giảm 50% tất cả sản phẩm phần mềm trong tuần này!',
        type: 'promotion',
        isRead: {},
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 giờ trước
        link: '/products',
        priority: 'high',
        expiresAt: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), // 7 ngày sau
      },
      {
        id: '2',
        title: 'Cập nhật mới',
        content: 'Phiên bản 2.0 đã ra mắt với nhiều tính năng mới',
        type: 'update',
        isRead: {},
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
        link: '/products/1',
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Thông báo hệ thống',
        content: 'Hệ thống sẽ bảo trì vào lúc 22:00 tối nay. Xin lỗi vì sự bất tiện này.',
        type: 'system',
        isRead: {},
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 ngày trước
        priority: 'high',
      },
    ];
    await saveNotifications(defaultNotifications);
    return defaultNotifications;
  }
}

// Lưu thông báo vào file
async function saveNotifications(notifications: Notification[]) {
  await ensureDataDir();
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
}

// Format thời gian hiển thị
function formatTimeAgo(dateString: string, language: string = 'vie'): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return language === 'eng' ? 'Just now' : 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return language === 'eng' ? `${minutes} minutes ago` : `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return language === 'eng' ? `${hours} hours ago` : `${hours} giờ trước`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return language === 'eng' ? `${days} days ago` : `${days} ngày trước`;
  }
}

// GET - Lấy thông báo cho người dùng
export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Get user language preference
    const language = _request.headers.get('x-user-language') || 'vie';

    // Trong development mode, nếu không có session hợp lệ, trả về thông báo mặc định
    if (!session?.user?.email) {
      if (process.env.NODE_ENV === 'development') {
        // Trả về thông báo demo cho development
        const demoNotifications = [
          {
            id: 'demo-1',
            title: language === 'eng' ? 'Welcome to XLab!' : 'Chào mừng đến với XLab!',
            content: language === 'eng' 
              ? 'This is a demo notification. Please sign in to see your actual notifications.' 
              : 'Đây là thông báo demo. Vui lòng đăng nhập để xem thông báo thực.',
            type: 'system',
            time: language === 'eng' ? 'Just now' : 'Vừa xong',
            isRead: false,
            priority: 'medium',
          },
        ];
        return NextResponse.json({ notifications: demoNotifications });
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await getNotifications();
    const userId = session.user.email;
    // Get user language preference from session if available
    // Using safer access since language property may not be defined in the session type
    const userLanguage = (session.user as any)?.language || language || 'vie';

    // Lọc thông báo theo người dùng và chưa hết hạn
    const now = new Date();
    const userNotifications = notifications
      .filter((notification) => {
        // Kiểm tra hết hạn
        if (notification.expiresAt && new Date(notification.expiresAt) < now) {
          return false;
        }
        // Kiểm tra target users (nếu không có thì hiển thị cho tất cả)
        if (notification.targetUsers && notification.targetUsers.length > 0) {
          return notification.targetUsers.includes(userId);
        }
        return true;
      })
      .map((notification) => ({
        id: notification.id,
        title: notification.title,
        content: notification.content,
        type: notification.type,
        time: formatTimeAgo(notification.createdAt, userLanguage),
        isRead: notification.isRead[userId] || false,
        link: notification.link,
        priority: notification.priority,
      }))
      .sort((a, b) => {
        // Sắp xếp theo độ ưu tiên và thời gian
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        // Nếu cùng độ ưu tiên, chưa đọc sẽ lên trước
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1;
        }

        return 0;
      });

    return NextResponse.json({ notifications: userNotifications });
  } catch (_error) {
    console.error('Error fetching notifications:', _error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Tạo thông báo mới (chỉ admin)
export async function POST(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra quyền admin
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await _request.json();
    const { title, content, type, targetUsers, link, priority, expiresAt } = body;

    // Validate input
    if (!title || !content || !type) {
      return NextResponse.json(
        {
          error: 'Missing required fields: title, content, type',
        },
        { status: 400 },
      );
    }

    if (!['promotion', 'update', 'order', 'system'].includes(type)) {
      return NextResponse.json(
        {
          error: 'Invalid type. Must be one of: promotion, update, order, system',
        },
        { status: 400 },
      );
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json(
        {
          error: 'Invalid priority. Must be one of: low, medium, high',
        },
        { status: 400 },
      );
    }

    const notifications = await getNotifications();

    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      content,
      type,
      targetUsers: targetUsers || [],
      isRead: {},
      createdAt: new Date().toISOString(),
      link,
      priority: priority || 'medium',
      expiresAt,
    };

    notifications.unshift(newNotification); // Thêm vào đầu danh sách
    await saveNotifications(notifications);

    return NextResponse.json({
      message: 'Notification created successfully',
      notification: newNotification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
