import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';
import { Product } from '@/models/ProductModel';
import fs from 'fs';
import path from 'path';

// Hàm tạo ID từ tên sản phẩm
function generateIdFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Loại bỏ ký tự đặc biệt
    .replace(/[\s_-]+/g, '-')   // Thay thế khoảng trắng và gạch dưới bằng gạch ngang
    .replace(/^-+|-+$/g, '');   // Loại bỏ gạch ngang ở đầu/cuối
}

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

    // Đọc dữ liệu hiện tại từ file
    const dataFilePath = path.join(process.cwd(), 'src/data/products.json');
    let currentProducts: Product[] = [];
    
    try {
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        try {
          currentProducts = JSON.parse(fileContent);
        } catch (parseError) {
          console.error('Error parsing products.json:', parseError);
          currentProducts = [];
        }
      }
    } catch (fileError) {
      console.error('Error reading products.json:', fileError);
      // Tạo file mới nếu không tồn tại
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
    }

    // Kiểm tra slug đã tồn tại chưa
    const slugExists = currentProducts.some((p: Product) => p.slug === body.slug);
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

    // Tạo ID mới dựa trên tên sản phẩm
    let newId = generateIdFromName(body.name);
    
    // Kiểm tra xem ID đã tồn tại chưa
    const idExists = currentProducts.some((p: Product) => p.id === newId);
    if (idExists) {
      // Nếu ID đã tồn tại, thêm hậu tố số
      let counter = 1;
      let updatedId = `${newId}-${counter}`;
      while (currentProducts.some((p: Product) => p.id === updatedId)) {
        counter++;
        updatedId = `${newId}-${counter}`;
      }
      console.log(`ID ${newId} đã tồn tại, đã sử dụng ID mới: ${updatedId}`);
      newId = updatedId;
    }

    // Đảm bảo có ít nhất một phiên bản nếu không có
    const versions = body.versions && body.versions.length > 0 
      ? body.versions 
      : [{
          name: 'Default',
          description: 'Phiên bản mặc định',
          price: body.price || 0,
          originalPrice: body.price || 0,
          features: []
        }];

    // Tạo sản phẩm mới
    const now = new Date().toISOString();
    const newProduct: Product = {
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
      versions: versions,
      createdAt: now,
      updatedAt: now,
      rating: body.rating ? Number(body.rating) : undefined,
      weeklyPurchases: body.weeklyPurchases ? Number(body.weeklyPurchases) : undefined,
      type: body.type || 'software',
      isAccount: body.isAccount || false,
      productOptions: body.productOptions || [],
      defaultProductOption: body.defaultProductOption || ''
    };

    // Lưu sản phẩm vào file data/products.json
    try {
      // Thêm sản phẩm mới vào danh sách
      currentProducts.push(newProduct);
      
      // Ghi lại vào file
      fs.writeFileSync(dataFilePath, JSON.stringify(currentProducts, null, 2), 'utf8');
      console.log(`Product saved to ${dataFilePath}`);
      
      // Xác minh rằng sản phẩm đã được lưu bằng cách đọc lại file
      const verifyContent = fs.readFileSync(dataFilePath, 'utf8');
      const verifyProducts: Product[] = JSON.parse(verifyContent);
      const productSaved = verifyProducts.some((p: Product) => p.id === newId);
      
      if (!productSaved) {
        console.error('Product was not saved properly!');
        return NextResponse.json({ 
          error: 'Lỗi khi lưu sản phẩm. Vui lòng thử lại.' 
        }, { status: 500 });
      }
      
      console.log(`Product verified in ${dataFilePath}`);
    } catch (fileError) {
      console.error('Error saving product to file:', fileError);
      return NextResponse.json({ 
        error: 'Lỗi khi lưu sản phẩm vào file. Vui lòng thử lại.' 
      }, { status: 500 });
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