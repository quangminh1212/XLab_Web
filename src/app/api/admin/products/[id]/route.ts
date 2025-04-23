import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Product } from '@/models/ProductModel';
import fs from 'fs/promises';
import path from 'path';

const productsPath = path.join(process.cwd(), 'src/data/products.json');

// Hàm helper để đọc dữ liệu sản phẩm từ file JSON
async function getProducts(): Promise<Product[]> {
    try {
        const data = await fs.readFile(productsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
}

// Hàm helper để lưu dữ liệu sản phẩm vào file JSON
async function saveProducts(products: Product[]): Promise<boolean> {
    try {
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving products:', error);
        return false;
    }
}

// Hàm kiểm tra quyền admin
async function isAdmin(request: NextRequest) {
    const session = await getServerSession();
    return session?.user?.email === 'xlab.rnd@gmail.com';
}

// GET: Lấy thông tin chi tiết một sản phẩm
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await getProducts();
        const product = products.find(p => p.id === params.id);

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

// PUT: Cập nhật thông tin sản phẩm
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const productData = await request.json();
        const products = await getProducts();

        const productIndex = products.findIndex(p => p.id === params.id);

        if (productIndex === -1) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Cập nhật thông tin sản phẩm
        const updatedProduct: Product = {
            ...products[productIndex],
            ...productData,
            id: params.id, // Đảm bảo ID không thay đổi
            updatedAt: new Date().toISOString(),
        };

        products[productIndex] = updatedProduct;

        const success = await saveProducts(products);

        if (success) {
            return NextResponse.json(updatedProduct);
        } else {
            return NextResponse.json(
                { error: 'Failed to update product' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE: Xóa sản phẩm
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await getProducts();
        const productIndex = products.findIndex(p => p.id === params.id);

        if (productIndex === -1) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Xóa sản phẩm khỏi danh sách
        products.splice(productIndex, 1);

        const success = await saveProducts(products);

        if (success) {
            return NextResponse.json({ message: 'Product deleted successfully' });
        } else {
            return NextResponse.json(
                { error: 'Failed to delete product' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
} 