import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createDirectory } from '@/lib/fileSystem';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
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
    const productId = formData.get('productId') as string;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    let imageBuffer;
    let originalFilename;

    // Check if image is a local path or external URL
    if (imageUrl.startsWith('/')) {
      // Local path - read from filesystem
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
        
        // Extract filename from URL
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
    
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products', productId);
    await createDirectory(uploadDir);
    
    // Save the processed image
    const outputPath = path.join(uploadDir, resizedFilename);
    const publicPath = `/uploads/products/${productId}/${resizedFilename}`;
    
    await sharpInstance.toFile(path.join(process.cwd(), 'public', publicPath));
    
    // Get the metadata of the resized image
    const resizedImageInfo = await sharp(path.join(process.cwd(), 'public', publicPath)).metadata();
    const stats = fs.statSync(path.join(process.cwd(), 'public', publicPath));
    
    return NextResponse.json({
      url: publicPath,
      imageInfo: {
        width: resizedImageInfo.width,
        height: resizedImageInfo.height,
        format: resizedImageInfo.format,
        size: stats.size
      }
    });
    
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 