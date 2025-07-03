import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserData, verifyDataIntegrity } from '@/lib/userDataManager';
import { getUserStats } from '@/lib/sessionTracker';


// Set this route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const action = searchParams.get('action') || 'info';

    if (!userEmail) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    switch (action) {
      case 'info':
        const userData = await getUserData(userEmail);
        if (!userData) {
          return NextResponse.json({ error: 'User data not found' }, { status: 404 });
        }

        const stats = await getUserStats(userEmail);
        const isValid = await verifyDataIntegrity(userEmail);

        return NextResponse.json({
          profile: {
            ...userData.profile,
            // Không trả về sensitive info
          },
          sessions: userData.sessions.slice(0, 10), // 10 sessions gần nhất
          activities: userData.activities.slice(0, 20), // 20 activities gần nhất
          transactions: userData.transactions.slice(0, 10), // 10 transactions gần nhất
          settings: userData.settings,
          stats: stats,
          metadata: {
            ...userData.metadata,
            dataIntegrity: isValid,
          },
        });

      case 'integrity':
        const integrityResult = await verifyDataIntegrity(userEmail);
        return NextResponse.json({
          email: userEmail,
          isValid: integrityResult,
          checkedAt: new Date().toISOString(),
        });

      case 'stats':
        const userStats = await getUserStats(userEmail);
        return NextResponse.json({
          email: userEmail,
          stats: userStats,
        });

      default:
        return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in admin user-data API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
