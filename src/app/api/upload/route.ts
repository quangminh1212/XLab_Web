import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

import { authOptions } from '@/lib/authOptions';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      console.error('Upload failed: Forbidden');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Giới hạn kích thước file (5MB)
    const contentLength = request.headers.get('content-length');
    const maxBytes = 5 * 1024 * 1024;
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 });
    }

    // Kiểm tra MIME an toàn (ảnh phổ biến)
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    // Lấy thông tin sản phẩm từ formData
    const productId = (formData.get('productId') as string) || '';
    const productSlug = (formData.get('productSlug') as string) || '';
    const productName = (formData.get('productName') as string) || '';

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

    // Đường dẫn/khóa lưu trữ theo sản phẩm
    let targetDir = 'products';
    if (productId) {
      targetDir = path.join('products', productId);
    } else if (productSlug) {
      targetDir = path.join('products', productSlug);
    }

    // Chuẩn bị buffer dữ liệu (có thể resize)
    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    let processedBuffer: Buffer = originalBuffer;
    try {
      if (width || height) {
        const sharpInstance = sharp(originalBuffer);
        if (width && height) {
          sharpInstance.resize(width, height, { fit: 'inside', withoutEnlargement: true });
        } else if (width) {
          sharpInstance.resize(width, null, { withoutEnlargement: true });
        } else if (height) {
          sharpInstance.resize(null, height, { withoutEnlargement: true });
        }
        if (fileExtension === 'png') {
          sharpInstance.png({ quality });
        } else if (fileExtension === 'webp') {
          sharpInstance.webp({ quality });
        } else {
          sharpInstance.jpeg({ quality });
        }
        processedBuffer = await sharpInstance.toBuffer();
      }
    } catch (err) {
      console.error('Error resizing image (will use original):', err);
      processedBuffer = originalBuffer;
    }

    // Metadata
    let imageInfo: any = null;
    try {
      const metadata = await sharp(processedBuffer).metadata();
      imageInfo = {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: processedBuffer.length,
      };
    } catch (err) {
      console.error('Error reading image metadata:', err);
    }

    // Ưu tiên upload lên Vercel Blob; nếu thất bại thì fallback lưu local (dev)
    const blobKey = `${targetDir.replace(/\\/g, '/')}/${fileName}`.replace(/\+/g, '/');
    const contentType = file.type || `image/${fileExtension}`;

    try {
      const blob = await put(blobKey, processedBuffer, { access: 'public', contentType });
      console.log('Uploaded to Vercel Blob:', blob.url);
      return NextResponse.json({ success: true, url: blob.url, fileName, imageInfo });
    } catch (err) {
      console.warn('Blob upload failed, falling back to local file write (dev only):', err);

      // Local fallback (development): write into public/images
      const dirPath = path.join(process.cwd(), 'public', 'images', targetDir);
      const filePath = path.join(dirPath, fileName);
      const publicPath = `/images/${targetDir}/${fileName}`.replace(/\\/g, '/');

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      await fsPromises.writeFile(filePath, processedBuffer);

      console.log(`File uploaded locally: ${publicPath}`, imageInfo);
      return NextResponse.json({ success: true, url: publicPath, fileName, imageInfo });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
