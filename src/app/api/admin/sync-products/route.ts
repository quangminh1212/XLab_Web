import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { synchronizeProducts } from '@/lib/i18n/products';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get parameters from request body
    const body = await request.json();
    const { sourceFile, sourceLang = 'vie', targetLang = 'eng', initFromDefault = false } = body;

    let sourceFilePath;
    
    // If initFromDefault is true, use the default products file from data directory
    if (initFromDefault) {
      // Try to locate the products file in src/data
      const possibleFiles = [
        path.join(process.cwd(), 'src/data/products.json'),
        path.join(process.cwd(), 'data/products.json')
      ];
      
      for (const file of possibleFiles) {
        if (fs.existsSync(file)) {
          sourceFilePath = file;
          break;
        }
      }
      
      if (!sourceFilePath) {
        return NextResponse.json({ 
          error: 'Default products file not found in src/data or data directory' 
        }, { status: 404 });
      }
    } else if (sourceFile) {
      // If a specific source file is provided, construct the full path
      sourceFilePath = path.join(process.cwd(), sourceFile);
    }

    // Synchronize products between languages or from file to i18n structure
    await synchronizeProducts(sourceFilePath, sourceLang, targetLang);

    return NextResponse.json({ 
      success: true, 
      message: `Products synchronized successfully from ${sourceFilePath || sourceLang} to ${targetLang}` 
    });
  } catch (error) {
    console.error('Error synchronizing products:', error);
    return NextResponse.json({ error: 'Failed to synchronize products' }, { status: 500 });
  }
} 