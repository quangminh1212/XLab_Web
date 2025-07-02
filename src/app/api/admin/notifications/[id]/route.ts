import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

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
  updatedAt?: string;
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
    return [];
  }
}

// Lưu thông báo vào file
async function saveNotifications(notifications: Notification[]) {
  await ensureDataDir();
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
}

// GET - Lấy thông báo theo ID
export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const params = await paramsPromise;

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const notifications = await getNotifications();
    const notification = notifications.find((n) => n.id === params.id);

    if (!notification) {
      return NextResponse.json({ error: 'Không tìm thấy thông báo' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi tải thông báo' }, { status: 500 });
  }
}

// PUT - Cập nhật thông báo
export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const params = await paramsPromise;

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, type, link, priority, expiresAt, targetUsers } = body;

    // Validation
    if (!title || !content || !type || !priority) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 },
      );
    }

    const notifications = await getNotifications();
    const notificationIndex = notifications.findIndex((n) => n.id === params.id);

    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Không tìm thấy thông báo' }, { status: 404 });
    }

    // Cập nhật thông báo
    const updatedNotification: Notification = {
      ...notifications[notificationIndex],
      title,
      content,
      type,
      link: link || undefined,
      priority,
      expiresAt: expiresAt || undefined,
      targetUsers: targetUsers || [],
      updatedAt: new Date().toISOString(),
    };

    notifications[notificationIndex] = updatedNotification;
    await saveNotifications(notifications);

    return NextResponse.json({
      success: true,
      message: 'Thông báo đã được cập nhật thành công',
      notification: updatedNotification,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi cập nhật thông báo' }, { status: 500 });
  }
}

// DELETE - Xóa thông báo
export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const params = await paramsPromise;

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const notifications = await getNotifications();
    const notificationIndex = notifications.findIndex((n) => n.id === params.id);

    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Không tìm thấy thông báo' }, { status: 404 });
    }

    // Xóa thông báo
    const deletedNotification = notifications[notificationIndex];
    notifications.splice(notificationIndex, 1);
    await saveNotifications(notifications);

    return NextResponse.json({
      success: true,
      message: 'Thông báo đã được xóa thành công',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi xóa thông báo' }, { status: 500 });
  }
}
