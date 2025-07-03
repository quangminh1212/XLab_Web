import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

// Debug API to directly read user data file

// Set this route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Debug endpoints only available in development' }, { status: 403 });
    }
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Construct the file path
    const fileName = session.user.email.replace(/[^a-zA-Z0-9@.-]/g, '_') + '.json';
    const filePath = path.join(process.cwd(), 'data', 'users', fileName);
    
    let fileData;
    try {
      // Check if file exists
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        fileData = JSON.parse(fileContents);
      } else {
        return NextResponse.json({ error: 'User data file not found' }, { status: 404 });
      }
    } catch (error) {
      console.error('Error reading user file:', error);
      return NextResponse.json({ error: 'Error reading user data file' }, { status: 500 });
    }
    
    // Return direct file information
    return NextResponse.json({
      success: true,
      message: 'User data retrieved directly from file',
      fileName,
      filePath,
      userData: fileData,
      cart: fileData.cart || [],
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 