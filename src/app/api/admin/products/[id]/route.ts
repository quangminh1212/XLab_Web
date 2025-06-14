import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';
import { Product, ProductCategory } from '@/models/ProductModel';

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Function to generate ID from product name
function generateIdFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

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

// Function to delete old images
function deleteOldImages(
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
function getCategoryName(categoryId: string): string {
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
function extractIdFromUrl(url: string): string {
  const segments = url.split('/');
  return segments[segments.length - 1];
}

// Handler setup
export const dynamic = 'force-dynamic';

// GET product handler
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Find product
    const products = getProducts();
    const product = products.find((p) => p.id === id);

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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Find product
    const products = getProducts();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Process request data
    const productData = await request.json();

    console.log('PUT API received product data:', {
      id: productData.id,
      name: productData.name,
      images: productData.images,
    });

    // Lưu lại ảnh cũ để xóa sau khi cập nhật
    const oldImages = [...(products[productIndex].images || [])];
    const oldDescriptionImages = [...(products[productIndex].descriptionImages || [])];

    // Ensure all required fields are present
    const requiredFields = ['id', 'name', 'slug', 'description', 'shortDescription'] as const;
    for (const field of requiredFields) {
      if (!productData[field]) {
        // Type-safe field access
        productData[field] =
          productData[field] || products[productIndex][field as keyof Product] || '';
      }
    }

    // Ensure arrays exist
    productData.images = Array.isArray(productData.images)
      ? productData.images
      : products[productIndex].images || [];
    productData.descriptionImages = Array.isArray(productData.descriptionImages)
      ? productData.descriptionImages
      : products[productIndex].descriptionImages || [];
    productData.features = Array.isArray(productData.features)
      ? productData.features
      : products[productIndex].features || [];
    productData.specifications = Array.isArray(productData.specifications)
      ? productData.specifications
      : products[productIndex].specifications || [];
    productData.requirements = Array.isArray(productData.requirements)
      ? productData.requirements
      : products[productIndex].requirements || [];
    productData.categories = Array.isArray(productData.categories)
      ? productData.categories
      : products[productIndex].categories || [];
    productData.versions = Array.isArray(productData.versions)
      ? productData.versions
      : products[productIndex].versions || [];

    // Process categories
    if (productData.categories && Array.isArray(productData.categories)) {
      productData.categories = (productData.categories as unknown as string[]).map(
        (categoryId: string) => ({
          id: categoryId,
          name: getCategoryName(categoryId),
          slug: categoryId,
        }),
      ) as ProductCategory[];
    }

    // Check if name changed and update ID accordingly
    let newId = productData.id;
    if (productData.name !== products[productIndex].name) {
      // Generate new ID from name
      newId = generateIdFromName(productData.name);

      // Check if this ID already exists
      const idExists = products.some((p, idx) => idx !== productIndex && p.id === newId);
      if (idExists) {
        // Add a numeric suffix if needed
        let counter = 1;
        let updatedId = `${newId}-${counter}`;
        while (products.some((p, idx) => idx !== productIndex && p.id === updatedId)) {
          counter++;
          updatedId = `${newId}-${counter}`;
        }
        console.log(`ID ${newId} đã tồn tại, sử dụng ID mới: ${updatedId}`);
        newId = updatedId;
      }

      console.log(
        `Product name changed from "${products[productIndex].name}" to "${productData.name}", updated ID from "${id}" to "${newId}"`,
      );
    }

    // Create updated product
    const updatedProduct = {
      ...products[productIndex],
      ...productData,
      id: newId, // Use new ID based on name
      updatedAt: new Date().toISOString(),
    };

    console.log('Saving product with images:', updatedProduct.images);

    // Save product
    products[productIndex] = updatedProduct;
    saveProducts(products);

    // Xóa ảnh cũ sau khi đã cập nhật thành công
    deleteOldImages(oldImages, updatedProduct.images || []);
    deleteOldImages(oldDescriptionImages, updatedProduct.descriptionImages || []);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product handler
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Find product to get images for deletion
    const products = getProducts();
    const productToDelete = products.find((p) => p.id === id);

    if (!productToDelete) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete all product images
    if (productToDelete.images && productToDelete.images.length > 0) {
      deleteOldImages(productToDelete.images, []);
    }

    if (productToDelete.descriptionImages && productToDelete.descriptionImages.length > 0) {
      deleteOldImages(productToDelete.descriptionImages, []);
    }

    // Remove product
    const newProducts = products.filter((p) => p.id !== id);
    saveProducts(newProducts);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
