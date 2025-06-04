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
      console.error('Upload failed: Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    // Lấy thông tin sản phẩm từ formData
    const productSlug = formData.get('productSlug') as string;
    const productName = formData.get('productName') as string;

    if (!file) {
      console.error('Upload failed: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Verify file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      console.error(`Upload failed: Invalid file type ${file.type}`);
      return NextResponse.json(
        {
          error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are supported.',
        },
        { status: 400 },
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    // Create a unique file name with product name if available
    const sanitizedProductName = productName
      ? productName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      : '';
    const fileName = sanitizedProductName
      ? `${sanitizedProductName}-${uuidv4()}.${fileExtension}`
      : `${uuidv4()}.${fileExtension}`;

    // Define the directory to save the uploaded image
    let targetDir = 'products';

    // Nếu có slug sản phẩm, lưu vào thư mục tương ứng
    if (productSlug) {
      targetDir = path.join('products', productSlug);
    }

    const dirPath = path.join(process.cwd(), 'public', 'images', targetDir);
    const filePath = path.join(dirPath, fileName);
    const publicPath = `/images/${targetDir}/${fileName}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Convert file to array buffer and save it
    const bytes = await file.arrayBuffer();
    // Use fs.promises.writeFile with a Uint8Array for correct typing
    await fsPromises.writeFile(filePath, new Uint8Array(bytes));

    // Log success
    console.log(`File uploaded successfully: ${publicPath}`);

    // Return the public URL path
    return NextResponse.json({
      success: true,
      url: publicPath,
      fileName: fileName,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
      },
      { status: 500 },
    );
  }
}
