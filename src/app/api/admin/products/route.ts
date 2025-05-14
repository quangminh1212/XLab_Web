import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Product, ProductCategory } from '@/models/ProductModel';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processProductImages } from '@/lib/imageUtils';

const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Hàm đọc dữ liệu từ file JSON
const getProducts = (): Product[] => {
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

// Function to get category name
const getCategoryName = (categoryId: string): string => {
    // Map category IDs to names
    const categoryMap: Record<string, string> = {
        'phan-mem': 'Phần mềm',
        'tai-khoan-hoc-tap': 'Tài khoản học tập',
        'khoa-hoc-online': 'Khóa học online',
        'windows': 'Windows',
        'office': 'Office',
        'design': 'Design',
        'development': 'Development',
        'other': 'Khác'
    };
    
    return categoryMap[categoryId] || categoryId;
};

// GET - Lấy danh sách sản phẩm
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const products = getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST - Thêm sản phẩm mới
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const productData = await request.json();

        // Ensure images is always in the correct format
        if (productData.images) {
            // Convert string array to required format if needed
            if (Array.isArray(productData.images) && productData.images.length > 0) {
                // If the array contains strings (direct URLs), convert to the expected format
                if (typeof productData.images[0] === 'string') {
                    // Xử lý đường dẫn hình ảnh dựa trên tên sản phẩm
                    productData.images = processProductImages(productData.name, productData.images);
                }
            }
        } else {
            productData.images = [];
        }
        
        // Xử lý đường dẫn hình ảnh mô tả dựa trên tên sản phẩm nếu có
        if (productData.descriptionImages && Array.isArray(productData.descriptionImages)) {
            productData.descriptionImages = processProductImages(productData.name, productData.descriptionImages);
        }

        // Thêm ID và ngày tạo
        const newProduct: Product = {
            id: uuidv4(),
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Chuyển đổi categories từ mảng string sang mảng object
        if (Array.isArray(newProduct.categories) && typeof newProduct.categories[0] === 'string') {
            newProduct.categories = (newProduct.categories as unknown as string[]).map(categoryId => ({
                id: categoryId,
                name: getCategoryName(categoryId),
                slug: categoryId
            })) as ProductCategory[];
        }

        // Đọc dữ liệu hiện tại
        const products = getProducts();

        // Thêm sản phẩm mới
        products.push(newProduct);

        // Lưu lại vào file
        saveProducts(products);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json(
            { error: 'Failed to add product' },
            { status: 500 }
        );
    }
} 