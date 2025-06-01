import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getAllUserEmails, getUserDataFromFile, syncAllUserData } from '@/lib/userService';

export async function POST() {
  try {
    // Kiểm tra quyền admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentUser = await getUserDataFromFile(session.user.email);
    if (!currentUser || !currentUser.profile.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Lấy danh sách tất cả user emails
    const userEmails = await getAllUserEmails();
    
    const updatedUsers: string[] = [];
    const skippedUsers: string[] = [];
    const errors: { email: string; error: string }[] = [];

    for (const email of userEmails) {
      try {
        const userData = await getUserDataFromFile(email);
        
        if (!userData) {
          errors.push({ email, error: 'User data not found' });
          continue;
        }

        // Skip if user already has an image
        if (userData.profile.image) {
          skippedUsers.push(email);
          continue;
        }

        // Trigger session sync to get the latest image from Google OAuth
        // This will happen when user logs in next time and session callback runs
        console.log(`📝 Marked for avatar update on next login: ${email}`);
        
        // For now, we can't directly fetch Google images without user consent
        // The image will be updated when user logs in next time
        skippedUsers.push(email);
        
      } catch (error) {
        console.error(`Error processing user ${email}:`, error);
        errors.push({ 
          email, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar update process completed',
      results: {
        total: userEmails.length,
        updated: updatedUsers.length,
        skipped: skippedUsers.length,
        errors: errors.length
      },
      details: {
        updatedUsers,
        skippedUsers,
        errors
      },
      note: 'User avatars will be automatically updated when they log in next time via Google OAuth'
    });
    
  } catch (error) {
    console.error('Error updating user avatars:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 