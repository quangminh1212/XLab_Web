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
  targetUsers?: string[];
  isRead: { [userId: string]: boolean };
  createdAt: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: string;
}

// Đọc thông báo từ file
async function getNotifications(): Promise<Notification[]> {
  try {
    const data = await fs.readFile(NOTIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Lưu thông báo vào file
async function saveNotifications(notifications: Notification[]) {
  const dataDir = path.dirname(NOTIFICATIONS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
}

// POST - Đánh dấu thông báo đã đọc
export async function POST(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await _request.json();
    const { notificationId, markAll } = body;
    const userId = session.user.email;

    const notifications = await getNotifications();
    let updated = false;

    if (markAll) {
      // Đánh dấu tất cả thông báo đã đọc
      notifications.forEach((notification) => {
        // Chỉ đánh dấu thông báo mà user có thể thấy
        const canSee =
          !notification.targetUsers ||
          notification.targetUsers.length === 0 ||
          notification.targetUsers.includes(userId);

        if (canSee && !notification.isRead[userId]) {
          notification.isRead[userId] = true;
          updated = true;
        }
      });
    } else if (notificationId) {
      // Đánh dấu một thông báo cụ thể đã đọc
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification) {
        // Kiểm tra user có thể thấy thông báo này không
        const canSee =
          !notification.targetUsers ||
          notification.targetUsers.length === 0 ||
          notification.targetUsers.includes(userId);

        if (canSee && !notification.isRead[userId]) {
          notification.isRead[userId] = true;
          updated = true;
        }
      }
    } else {
      return NextResponse.json(
        {
          error: 'Missing required field: notificationId or markAll',
        },
        { status: 400 },
      );
    }

    if (updated) {
      await saveNotifications(notifications);
    }

    return NextResponse.json({
      message: markAll ? 'All notifications marked as read' : 'Notification marked as read',
      success: true,
    });
  } catch (_error) {
    console.error('Error marking notification as read:', _error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
