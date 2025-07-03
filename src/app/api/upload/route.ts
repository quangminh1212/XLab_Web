import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import sharp from 'sharp';


// Set this route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

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
    const productId = formData.get('productId') as string;
    const productSlug = formData.get('productSlug') as string;
    const productName = formData.get('productName') as string;
    
    // Lấy thông tin resize nếu có
    const width = formData.get('width') ? parseInt(formData.get('width') as string, 10) : null;
    const height = formData.get('height') ? parseInt(formData.get('height') as string, 10) : null;
    const quality = formData.get('quality') ? parseInt(formData.get('quality') as string, 10) : 80;

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

    // Ưu tiên sử dụng productId thay vì slug
    if (productId) {
      targetDir = path.join('products', productId);
    } 
    // Nếu không có productId, sử dụng slug làm backup
    else if (productSlug) {
      targetDir = path.join('products', productSlug);
    }

    const dirPath = path.join(process.cwd(), 'public', 'images', targetDir);
    const filePath = path.join(dirPath, fileName);
    const publicPath = `/images/${targetDir}/${fileName}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Convert file to array buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Xử lý resize ảnh nếu có yêu cầu
    if (width || height) {
      try {
        const sharpInstance = sharp(buffer);
        
        // Cấu hình resize
        if (width && height) {
          sharpInstance.resize(width, height, { fit: 'inside', withoutEnlargement: true });
        } else if (width) {
          sharpInstance.resize(width, null, { withoutEnlargement: true });
        } else if (height) {
          sharpInstance.resize(null, height, { withoutEnlargement: true });
        }
        
        // Giữ định dạng gốc hoặc chuyển đổi sang định dạng phù hợp
        if (fileExtension === 'png') {
          sharpInstance.png({ quality });
        } else if (fileExtension === 'webp') {
          sharpInstance.webp({ quality });
        } else {
          sharpInstance.jpeg({ quality });
        }
        
        // Lưu file đã xử lý
        const resizedBuffer = await sharpInstance.toBuffer();
        await fsPromises.writeFile(filePath, resizedBuffer);
      } catch (err) {
        console.error('Error resizing image:', err);
        // Fallback to original if resizing fails
        await fsPromises.writeFile(filePath, buffer);
      }
    } else {
      // Nếu không resize thì lưu file gốc
      await fsPromises.writeFile(filePath, buffer);
    }

    // Lấy thông tin file đã xử lý
    let imageInfo = null;
    try {
      const metadata = await sharp(filePath).metadata();
      imageInfo = {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(filePath).size
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
    }

    // Log success
    console.log(`File uploaded successfully: ${publicPath}`, imageInfo);

    // Return the public URL path and image info
    return NextResponse.json({
      success: true,
      url: publicPath,
      fileName: fileName,
      imageInfo: imageInfo
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
