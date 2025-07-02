import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { migrateToIndividualFiles, getAllUserEmails, getUserStats } from '@/lib/userService';

// Migrate data to individual user files
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra admin
    const { getUserByEmail } = await import('@/lib/userService');
    const user = await getUserByEmail(session.user.email);

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('🚀 Starting migration process...');
    await migrateToIndividualFiles();

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message || 'Migration failed' }, { status: 500 });
  }
}

// Get migration status and user stats
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra admin
    const { getUserByEmail } = await import('@/lib/userService');
    const user = await getUserByEmail(session.user.email);

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const userEmails = await getAllUserEmails();
    const stats = [];

    for (const email of userEmails) {
      const userStat = await getUserStats(email);
      if (userStat) {
        stats.push(userStat);
      }
    }

    return NextResponse.json({
      success: true,
      totalUsers: userEmails.length,
      userEmails: userEmails,
      stats: stats,
    });
  } catch (error: any) {
    console.error('Error getting migration status:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
