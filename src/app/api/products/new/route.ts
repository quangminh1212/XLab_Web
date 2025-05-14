import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';
import { Product } from '@/types';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received product data:', body);

    // Kiểm tra dữ liệu đầu vào
    const requiredFields = ['name', 'slug', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Trường ${field} là bắt buộc` 
        }, { status: 400 });
      }
    }

    // Kiểm tra slug đã tồn tại chưa
    const slugExists = products.some(p => p.slug === body.slug);
    if (slugExists) {
      return NextResponse.json({ 
        error: 'Slug đã tồn tại. Vui lòng chọn slug khác.' 
      }, { status: 400 });
    }

    // Chuẩn hóa đường dẫn hình ảnh
    const normalizeImagePath = (imagePath: string) => {
      if (!imagePath) return '';
      if (imagePath.startsWith('/')) return imagePath;
      return `/${imagePath}`;
    };

    // Xử lý đường dẫn hình ảnh
    let images = body.images || [];
    if (Array.isArray(images)) {
      images = images.map(normalizeImagePath).filter(Boolean);
    }

    // Xử lý đường dẫn hình ảnh mô tả
    let descriptionImages = body.descriptionImages || [];
    if (Array.isArray(descriptionImages)) {
      descriptionImages = descriptionImages.map(normalizeImagePath).filter(Boolean);
    }

    // Tạo ID mới (trong trường hợp thực tế, ID sẽ được tạo bởi cơ sở dữ liệu)
    const newId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;

    // Tạo sản phẩm mới
    const now = new Date().toISOString();
    const newProduct = {
      id: newId,
      name: body.name,
      slug: body.slug,
      description: body.description,
      shortDescription: body.shortDescription || '',
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
      images: images,
      descriptionImages: descriptionImages,
      features: body.features || [],
      requirements: body.requirements || [],
      specifications: body.specifications || [],
      categories: body.categories || [],
      versions: body.versions || [],
      createdAt: now,
      updatedAt: now,
      price: body.price || (body.versions && body.versions.length > 0 ? body.versions[0].price : 0),
      salePrice: body.salePrice || 0,
      rating: body.rating || "0",
      weeklyPurchases: body.weeklyPurchases || 0
    };

    // Lưu sản phẩm vào file data/products.json
    try {
      const dataFilePath = path.join(process.cwd(), 'src/data/products.json');
      let currentProducts = [];
      
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        try {
          currentProducts = JSON.parse(fileContent);
        } catch (parseError) {
          console.error('Error parsing products.json:', parseError);
          currentProducts = [];
        }
      }
      
      // Thêm sản phẩm mới vào danh sách
      currentProducts.push(newProduct);
      
      // Ghi lại vào file
      fs.writeFileSync(dataFilePath, JSON.stringify(currentProducts, null, 2), 'utf8');
      console.log(`Product saved to ${dataFilePath}`);
    } catch (fileError) {
      console.error('Error saving product to file:', fileError);
    }

    // Thêm sản phẩm vào danh sách products (in-memory)
    products.push(newProduct as any);

    return NextResponse.json({ 
      success: true, 
      message: 'Sản phẩm đã được tạo thành công',
      data: newProduct
    }, { status: 201 });
  } catch (error: any) {
    console.error('Lỗi khi tạo sản phẩm mới:', error);
    return NextResponse.json({ 
      error: error.message || 'Lỗi máy chủ nội bộ' 
    }, { status: 500 });
  }
} 