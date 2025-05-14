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
    const productName = formData.get('productName') as string || 'unknown';

    if (!file) {
      console.error('Upload failed: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Verify file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      console.error(`Upload failed: Invalid file type ${file.type}`);
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are supported.'
      }, { status: 400 });
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Chuyển đổi tên sản phẩm thành định dạng URL an toàn cho tên thư mục
    const safeFolderName = productName.toLowerCase()
      .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, 'a')
      .replace(/[èéẻẽẹêếềểễệ]/g, 'e')
      .replace(/[ìíỉĩị]/g, 'i')
      .replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o')
      .replace(/[ùúủũụưứừửữự]/g, 'u')
      .replace(/[ỳýỷỹỵ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    
    // Create a unique file name (sử dụng UUID cho phần upload tạm thời)
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Define the directory to save the uploaded image (sử dụng thư mục con theo tên sản phẩm)
    const productDirPath = path.join(process.cwd(), 'public', 'images', 'products', safeFolderName);
    const filePath = path.join(productDirPath, fileName);
    const publicPath = `/images/products/${safeFolderName}/${fileName}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(productDirPath)) {
      fs.mkdirSync(productDirPath, { recursive: true });
      console.log(`Created product directory: ${productDirPath}`);
    }

    // Convert file to array buffer and save it
    const bytes = await file.arrayBuffer();
    // Use fs.promises.writeFile with a Uint8Array for correct typing
    await fsPromises.writeFile(filePath, new Uint8Array(bytes));

    console.log(`File uploaded to: ${filePath}`);
    
    return NextResponse.json({ url: publicPath });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
} 