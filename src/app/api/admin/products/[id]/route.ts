import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';
import { Product, ProductCategory } from '@/models/ProductModel';

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Read product data
function getProducts(): Product[] {
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
function saveProducts(products: Product[]): void {
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

// Category lookup
function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    'office-software': 'Phần mềm văn phòng',
    'business-solutions': 'Giải pháp doanh nghiệp',
    'security-software': 'Phần mềm bảo mật',
    'data-protection': 'Bảo vệ dữ liệu',
    'design-software': 'Phần mềm thiết kế'
  };
  return categories[categoryId] || categoryId;
}

// Extract product ID from URL
function extractIdFromUrl(url: string): string {
  const segments = url.split('/');
  return segments[segments.length - 1];
}

// Handler setup
export const dynamic = 'force-dynamic';

// GET product handler
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before accessing its properties
    const safeParams = await params;
    const id = safeParams.id;
    
    // Find product
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// UPDATE product handler
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before accessing its properties
    const safeParams = await params;
    const id = safeParams.id;
    
    // Find product
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Process request data
    const productData = await request.json();
    
    console.log("PUT API received product data:", {
      id: productData.id,
      name: productData.name,
      images: productData.images
    });
    
    // Ensure all required fields are present
    const requiredFields = ['id', 'name', 'slug', 'description', 'shortDescription'] as const;
    for (const field of requiredFields) {
      if (!productData[field]) {
        // Type-safe field access
        productData[field] = productData[field] || products[productIndex][field as keyof Product] || '';
      }
    }
    
    // Ensure arrays exist
    productData.images = Array.isArray(productData.images) ? productData.images : (products[productIndex].images || []);
    productData.descriptionImages = Array.isArray(productData.descriptionImages) ? productData.descriptionImages : (products[productIndex].descriptionImages || []);
    productData.features = Array.isArray(productData.features) ? productData.features : (products[productIndex].features || []);
    productData.specifications = Array.isArray(productData.specifications) ? productData.specifications : (products[productIndex].specifications || []);
    productData.requirements = Array.isArray(productData.requirements) ? productData.requirements : (products[productIndex].requirements || []);
    productData.categories = Array.isArray(productData.categories) ? productData.categories : (products[productIndex].categories || []);
    productData.versions = Array.isArray(productData.versions) ? productData.versions : (products[productIndex].versions || []);
    
    // Process categories
    if (productData.categories && Array.isArray(productData.categories)) {
      productData.categories = (productData.categories as unknown as string[]).map(
        (categoryId: string) => ({
          id: categoryId,
          name: getCategoryName(categoryId),
          slug: categoryId
        })
      ) as ProductCategory[];
    }
    
    // Create updated product
    const updatedProduct = {
      ...products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    console.log("Saving product with images:", updatedProduct.images);
    
    // Save product
    products[productIndex] = updatedProduct;
    saveProducts(products);
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before accessing its properties
    const safeParams = await params;
    const id = safeParams.id;
    
    // Remove product
    const products = getProducts();
    const newProducts = products.filter(p => p.id !== id);
    
    if (products.length === newProducts.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    saveProducts(newProducts);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 