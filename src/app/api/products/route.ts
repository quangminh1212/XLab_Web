import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST request to /api/products');
    // Bỏ phần kiểm tra xác thực để cho phép đăng mà không cần đăng nhập
    // const session = await getServerSession(authOptions);
    // if (!session || session.user?.email !== 'xlab.rnd@gmail.com') {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Xử lý dữ liệu từ request
    const productData = await request.json();
    console.log('Received product data:', productData);
    
    // Kiểm tra các trường bắt buộc
    if (!productData.name || !productData.slug || !productData.description) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }
    
    // Trong môi trường thực tế, bạn sẽ lưu sản phẩm vào database
    // Ví dụ: await db.products.create({ data: productData });
    
    // Mô phỏng thành công
    const resultData = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('Created product:', resultData);
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: resultData
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: `Lỗi khi tạo sản phẩm: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Received GET request to /api/products');
    // Trong môi trường thực tế, bạn sẽ lấy sản phẩm từ database
    // Ví dụ: const products = await db.products.findMany();
    
    // Mô phỏng sản phẩm từ dữ liệu giả
    const { products } = await import('@/data/mockData');
    
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: `Lỗi khi lấy danh sách sản phẩm: ${errorMessage}` },
      { status: 500 }
    );
  }
} 