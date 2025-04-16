import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/mockData'; // Assuming products array is exported
import { Product } from '@/types'; // Assuming Product type is defined

// Function to generate a unique ID (replace with a better method if needed)
const generateId = () => `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// GET /api/products - Retrieve all products
export async function GET(request: NextRequest) {
    try {
        // In a real app, you would fetch this from a database
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST /api/products - Add a new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation (add more comprehensive validation as needed)
        if (!body.name || !body.price || !body.description || !body.categoryId || !body.storeId) {
            return NextResponse.json({ message: 'Missing required product fields' }, { status: 400 });
        }

        const newProduct: Product = {
            id: generateId(),
            slug: body.name.toLowerCase().replace(/\s+/g, '-'), // Simple slug generation
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFeatured: false, // Default values
            isNew: true,
            downloadCount: 0,
            viewCount: 0,
            rating: 0, // Default rating
            salePrice: body.salePrice || body.price, // Use price if salePrice is not provided
            longDescription: body.longDescription || body.description, // Use description if long description is not provided
            version: body.version || '1.0.0', // Default version
            size: body.size || 'N/A', // Default size
            licenseType: body.licenseType || 'Thương mại', // Default license type
            imageUrl: body.imageUrl || '/images/products/default.png', // Default image
            ...body, // Spread the rest of the body properties
        };

        // In a real app, you would save this to a database
        // For mock data, we just push it to the array (will be lost on server restart)
        products.push(newProduct);

        return NextResponse.json(newProduct, { status: 201 }); // Return the newly created product
    } catch (error) {
        console.error("Failed to create product:", error);
        // Check if the error is due to invalid JSON
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: 'Invalid JSON format in request body' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
} 