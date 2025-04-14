import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
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
    
    // Trong môi trường thực tế, bạn sẽ lưu sản phẩm vào database
    // Ví dụ: await db.products.create({ data: productData });
    
    // Mô phỏng thành công
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 