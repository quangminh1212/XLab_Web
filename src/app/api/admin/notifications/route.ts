import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs/promises';
import path from 'path';
import { notifications as vieNotifications } from '@/locales/vie/notifications';
import { notifications as engNotifications } from '@/locales/eng/notifications';
import { notifications as spaNotifications } from '@/locales/spa/notifications';

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json');

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'promotion' | 'update' | 'order' | 'system';
  targetUsers?: string[];
  isRead: { [userId: string]: boolean };
  createdAt: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: string;
  metadata?: {
    es?: {
      title?: string;
      content?: string;
    };
    en?: {
      title?: string;
      content?: string;
    };
    readCount?: number;
  };
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
        title: vieNotifications['notifications.default.promotion.title'],
        content: vieNotifications['notifications.default.promotion.content'],
        type: 'promotion',
        isRead: {},
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 giờ trước
        link: '/products',
        priority: 'high',
        expiresAt: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), // 7 ngày sau
        metadata: {
          en: {
            title: engNotifications['notifications.default.promotion.title'],
            content: engNotifications['notifications.default.promotion.content']
          },
          es: {
            title: spaNotifications['notifications.default.promotion.title'],
            content: spaNotifications['notifications.default.promotion.content']
          }
        }
      },
      {
        id: '2',
        title: vieNotifications['notifications.default.update.title'],
        content: vieNotifications['notifications.default.update.content'],
        type: 'update',
        isRead: {},
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
        link: '/products/1',
        priority: 'medium',
        metadata: {
          en: {
            title: engNotifications['notifications.default.update.title'],
            content: engNotifications['notifications.default.update.content']
          },
          es: {
            title: spaNotifications['notifications.default.update.title'],
            content: spaNotifications['notifications.default.update.content']
          }
        }
      },
      {
        id: '3',
        title: vieNotifications['notifications.default.system.title'],
        content: vieNotifications['notifications.default.system.content'],
        type: 'system',
        isRead: {},
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 ngày trước
        priority: 'high',
        metadata: {
          en: {
            title: engNotifications['notifications.default.system.title'],
            content: engNotifications['notifications.default.system.content']
          },
          es: {
            title: spaNotifications['notifications.default.system.title'],
            content: spaNotifications['notifications.default.system.content']
          }
        }
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

// GET - Lấy tất cả thông báo cho admin
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra quyền admin
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const notifications = await getNotifications();

    // Sắp xếp theo thời gian tạo (mới nhất trước)
    const sortedNotifications = notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({
      notifications: sortedNotifications,
      total: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - Xóa thông báo (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra quyền admin
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        {
          error: 'Missing notification ID',
        },
        { status: 400 },
      );
    }

    const notifications = await getNotifications();
    const filteredNotifications = notifications.filter((n) => n.id !== notificationId);

    if (filteredNotifications.length === notifications.length) {
      return NextResponse.json(
        {
          error: 'Notification not found',
        },
        { status: 404 },
      );
    }

    await saveNotifications(filteredNotifications);

    return NextResponse.json({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
