import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';
import { Product, ProductCategory } from '@/models/ProductModel';

// Đường dẫn đến file lưu trữ dữ liệu
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Hàm đọc dữ liệu từ file JSON
const getProducts = (): Product[] => {
    try {
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        try {
            return fileContent ? JSON.parse(fileContent) : [];
        } catch (parseError) {
            console.error('Error parsing products JSON:', parseError);
            // Trả về mảng rỗng nếu có lỗi parse
            return [];
        }
    } catch (error) {
        console.error('Error reading products data:', error);
        return [];
    }
};

// Hàm lưu dữ liệu vào file JSON
const saveProducts = (products: Product[]) => {
    try {
        const dirPath = path.dirname(dataFilePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving products data:', error);
    }
};

// Get category name helper function
function getCategoryName(categoryId: string) {
    const categories: Record<string, string> = {
        'office-software': 'Phần mềm văn phòng',
        'business-solutions': 'Giải pháp doanh nghiệp',
        'security-software': 'Phần mềm bảo mật',
        'data-protection': 'Bảo vệ dữ liệu',
        'design-software': 'Phần mềm thiết kế'
    };

    return categories[categoryId] || categoryId;
}

// GET - Lấy chi tiết sản phẩm theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const productId = params.id;
        const products = getProducts();
        const product = products.find((p: Product) => p.id === productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT - Cập nhật sản phẩm
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const productId = params.id;
        const products = getProducts();
        const productIndex = products.findIndex((p: Product) => p.id === productId);

        if (productIndex === -1) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        const productData = await request.json();

        // Convert categories to proper format with name
        if (productData.categories && Array.isArray(productData.categories)) {
            productData.categories = (productData.categories as unknown as string[]).map((categoryId: string) => ({
                id: categoryId,
                name: getCategoryName(categoryId),
                slug: categoryId
            })) as ProductCategory[];
        }

        // Update the product with new data but keep the original ID
        const updatedProduct = {
            ...productData,
            id: productId,
            updatedAt: new Date().toISOString()
        };

        products[productIndex] = updatedProduct;

        saveProducts(products);

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE - Xóa sản phẩm
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const productId = params.id;
        const products = getProducts();
        const newProducts = products.filter((p: Product) => p.id !== productId);

        if (products.length === newProducts.length) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        saveProducts(newProducts);

        return NextResponse.json(
            { message: 'Product deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
} 