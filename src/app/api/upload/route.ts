import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Verify file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are supported.'
      }, { status: 400 });
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Create a unique file name
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Define the directory to save the uploaded image
    const dirPath = path.join(process.cwd(), 'public', 'images', 'products');
    const filePath = path.join(dirPath, fileName);
    const publicPath = `/images/products/${fileName}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Convert file to array buffer and save it
    const bytes = await file.arrayBuffer();
    // Use fs.promises.writeFile with a Uint8Array for correct typing
    await fsPromises.writeFile(filePath, new Uint8Array(bytes));

    // Return the public URL path
    return NextResponse.json({
      success: true,
      url: publicPath,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      error: 'Failed to upload file'
    }, { status: 500 });
  }
} 