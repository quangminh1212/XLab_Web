import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';
import { Product } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Kiểm tra dữ liệu đầu vào
    const requiredFields = ['name', 'slug', 'price', 'description', 'categoryId', 'imageUrl', 'version', 'size', 'licenseType'];
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

    // Tạo ID mới (trong trường hợp thực tế, ID sẽ được tạo bởi cơ sở dữ liệu)
    const newId = `prod-${Date.now()}`;

    // Tạo sản phẩm mới
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: newId,
      name: body.name,
      slug: body.slug,
      description: body.description,
      longDescription: body.longDescription || body.description,
      price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : Number(body.price),
      categoryId: body.categoryId,
      imageUrl: body.imageUrl,
      isFeatured: body.isFeatured || false,
      isNew: body.isNew || true,
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
      version: body.version,
      size: body.size,
      licenseType: body.licenseType,
      createdAt: now,
      updatedAt: now,
      storeId: body.storeId || '1', // Mặc định là XLab Software
      features: body.features || [],
    };

    // Thêm sản phẩm vào danh sách (trong thực tế, sẽ lưu vào cơ sở dữ liệu)
    products.push(newProduct);

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