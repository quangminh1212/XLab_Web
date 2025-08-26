import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/authOptions';
import { getProductById, updateProduct, deleteProduct } from '@/lib/i18n/products';
import { Product } from '@/models/ProductModel';


export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Function to generate ID from product name
function _generateIdFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Read product data
function _getProducts(): Product[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
}

// Save product data
function _saveProducts(products: Product[]): void {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving products data:', error);
  }
}

// Function to delete old images
function _deleteOldImages(
  oldImages: (string | { url: string })[],
  newImages: (string | { url: string })[],
): void {
  try {
    // Chỉ xử lý xóa nếu có ảnh cũ và ảnh mới
    if (!oldImages || !newImages || oldImages.length === 0 || newImages.length === 0) {
      return;
    }

    // Chuyển đổi mảng để có được các URL dạng chuỗi
    const oldImageUrls = oldImages.map((img) => (typeof img === 'string' ? img : img.url));
    const newImageUrls = newImages.map((img) => (typeof img === 'string' ? img : img.url));

    // Tìm các ảnh cũ không còn xuất hiện trong danh sách ảnh mới
    const imagesToDelete = oldImageUrls.filter((oldImg) => !newImageUrls.includes(oldImg));

    // Xóa từng ảnh
    for (const imageUrl of imagesToDelete) {
      // Chỉ xóa ảnh trong thư mục images
      if (imageUrl && imageUrl.startsWith('/images/')) {
        const imagePath = path.join(process.cwd(), 'public', imageUrl);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted old image: ${imagePath}`);
        } else {
          console.log(`Image not found for deletion: ${imagePath}`);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting old images:', error);
  }
}

// Category lookup
function _getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    'office-software': 'Phần mềm văn phòng',
    'business-solutions': 'Giải pháp doanh nghiệp',
    'security-software': 'Phần mềm bảo mật',
    'data-protection': 'Bảo vệ dữ liệu',
    'design-software': 'Phần mềm thiết kế',
  };
  return categories[categoryId] || categoryId;
}

// Extract product ID from URL
function _extractIdFromUrl(url: string): string {
  const segments = url.split('/');
  return segments[segments.length - 1] ?? '';
}

// Handler setup

/**
 * Normalize language code from Accept-Language header to internal codes
 * Maps 'en' -> 'eng', others -> 'vie'
 */
function normalizeLanguageHeader(lang: string | null): 'eng' | 'vie' {
  if (!lang) return 'vie';
  const primary = lang.split(',')[0]?.split('-')[0]?.toLowerCase() ?? 'vi';
  return primary === 'en' ? 'eng' : 'vie';
}

// GET product handler
export async function GET(request: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get params and normalized language
    const { id } = await paramsPromise;

    const acceptLanguage = request.headers.get('accept-language');
    const language = normalizeLanguageHeader(acceptLanguage);
    console.log(`Fetching product ${id} with language: ${language}`);

    // Find product using i18n product function
    const product = await getProductById(id, language);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (_error) {
    // console.error('Error fetching product:', _error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT product handler
export async function PUT(request: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get params and normalized language
    const { id } = await paramsPromise;

    const acceptLanguage = request.headers.get('accept-language');
    const language = normalizeLanguageHeader(acceptLanguage);
    // console.debug(`Updating product ${id} with language: ${language}`);

    // Get the updated product data from the request
    const updatedProductData = await request.json();

    // Get the existing product
    const existingProduct = await getProductById(id, language);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Merge existing and updated data
    const mergedProduct: Product = {
      ...existingProduct,
      ...updatedProductData,
      updatedAt: new Date().toISOString(),
    };

    // Check if ID was changed in the updated data
    const isIdChanged = updatedProductData.id !== id;

    // Update product using i18n product function
    const updateResult = await updateProduct(mergedProduct, language);

    if (!updateResult) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    // If ID was changed, we need to delete the old product after successful update
    if (isIdChanged) {
      // Log the ID change
      // console.debug(`Product ID changed from ${id} to ${updatedProductData.id}`);

      try {
        // Move the images from old product folder to new product folder
        const oldImagesDir = path.join(process.cwd(), 'public', 'images', 'products', id);
        const newImagesDir = path.join(process.cwd(), 'public', 'images', 'products', updatedProductData.id);

        // Check if old images directory exists
        if (fs.existsSync(oldImagesDir)) {
          // Create new directory if it doesn't exist
          if (!fs.existsSync(newImagesDir)) {
            fs.mkdirSync(newImagesDir, { recursive: true });
          }

          // Read all files in the old directory
          const files = fs.readdirSync(oldImagesDir);

          // Move each file to the new directory
          for (const file of files) {
            const oldFilePath = path.join(oldImagesDir, file);
            const newFilePath = path.join(newImagesDir, file);

            // Copy the file to new location
            fs.copyFileSync(oldFilePath, newFilePath);
            // console.debug(`Copied image from ${oldFilePath} to ${newFilePath}`);
          }

          // console.debug(`All images moved from ${oldImagesDir} to ${newImagesDir}`);

          // Update image paths in the product data
          if (mergedProduct.images && Array.isArray(mergedProduct.images)) {
            mergedProduct.images = mergedProduct.images.map((img: any) => {
              if (typeof img === 'string') {
                // Replace old product ID with new product ID in image paths
                return img.replace(`/images/products/${id}/`, `/images/products/${updatedProductData.id}/`);
              } else if (img && typeof img === 'object' && img.url) {
                return {
                  ...img,
                  url: img.url.replace(`/images/products/${id}/`, `/images/products/${updatedProductData.id}/`)
                };
              }
              return img;
            });
          }

          // Update description image paths
          if (mergedProduct.descriptionImages && Array.isArray(mergedProduct.descriptionImages)) {
            mergedProduct.descriptionImages = mergedProduct.descriptionImages.map((img: string) => {
              return img.replace(`/images/products/${id}/`, `/images/products/${updatedProductData.id}/`);
            });
          }
        }
      } catch (_error) {
        // console.error('Error moving product images:', _error);
      }

      // Delete the old product version with the old ID
      await deleteProduct(id, language);
    }

    return NextResponse.json(mergedProduct);
  } catch (_error) {
    // console.error('Error updating product:', _error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product handler
export async function DELETE(request: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get params and (optional) normalized language
    const { id } = await paramsPromise;

    const acceptLanguage = request.headers.get('accept-language');
    const language = acceptLanguage ? normalizeLanguageHeader(acceptLanguage) : undefined;
    // console.debug(`Deleting product ${id} ${language ? `for language: ${language}` : 'for all languages'}`);

    // Delete product using i18n product function (if language is specified, only delete that language version)
    const deleteResult = await deleteProduct(id, language);

    if (!deleteResult) {
      return NextResponse.json({ error: 'Product not found or failed to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (_error) {
    // console.error('Error deleting product:', _error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
