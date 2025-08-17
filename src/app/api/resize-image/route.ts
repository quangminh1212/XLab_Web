import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const imageUrl = formData.get('imageUrl') as string;
    const width = formData.get('width') ? parseInt(formData.get('width') as string, 10) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string, 10) : undefined;
    const quality = formData.get('quality') ? parseInt(formData.get('quality') as string, 10) : 80;
    const productId = (formData.get('productId') as string) || 'misc';

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    let imageBuffer: Buffer;
    let originalFilename: string | undefined;

    // Check if image is a local path or external URL
    if (imageUrl.startsWith('/')) {
      // Local path - read from filesystem (dev only)
      try {
        const filePath = path.join(process.cwd(), 'public', imageUrl);
        imageBuffer = fs.readFileSync(filePath);
        originalFilename = path.basename(imageUrl);
      } catch (error) {
        console.error('Error reading local file:', error);
        return NextResponse.json(
          { error: 'Could not read local image file' },
          { status: 500 }
        );
      }
    } else {
      // External URL - fetch image
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
        imageBuffer = Buffer.from(await response.arrayBuffer());
        const urlParts = new URL(imageUrl).pathname.split('/');
        originalFilename = urlParts[urlParts.length - 1];
      } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json(
          { error: 'Could not fetch external image' },
          { status: 500 }
        );
      }
    }

    // Get image info
    const metadata = await sharp(imageBuffer).metadata();

    // Process image with sharp
    let sharpInstance = sharp(imageBuffer);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Set quality and format
    const outputFormat = metadata.format === 'png' ? 'png' : 'jpeg';
    if (outputFormat === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality });
    } else {
      sharpInstance = sharpInstance.png({ quality });
    }

    // Generate output filename
    const timestamp = Date.now();
    const uniqueId = uuidv4().slice(0, 8);
    const fileExtension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    const resizedFilename = `${path.parse(originalFilename || 'image').name}-resized-${timestamp}-${uniqueId}.${fileExtension}`;

    // Upload to Vercel Blob first
    const key = `uploads/products/${productId}/${resizedFilename}`.replace(/\\/g, '/');
    const processedBuffer = await sharpInstance.toBuffer();

    try {
      const blob = await put(key, processedBuffer, {
        access: 'public',
        contentType: outputFormat === 'png' ? 'image/png' : 'image/jpeg',
      });
      return NextResponse.json({
        url: blob.url,
        imageInfo: {
          width: metadata.width,
          height: metadata.height,
          format: outputFormat,
          size: processedBuffer.length,
        }
      });
    } catch (err) {
      console.warn('Blob upload failed, falling back to local file write (dev only):', err);

      // Fallback local write (dev only)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products', productId);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const outputPath = path.join(uploadDir, resizedFilename);
      fs.writeFileSync(outputPath, processedBuffer);
      const publicPath = `/uploads/products/${productId}/${resizedFilename}`;

      return NextResponse.json({
        url: publicPath,
        imageInfo: {
          width: metadata.width,
          height: metadata.height,
          format: outputFormat,
          size: processedBuffer.length,
        }
      });
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
