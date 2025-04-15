import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadToCloudinary } from '@/utils/cloudinary';

export async function POST(request: NextRequest) {
  try {
    console.log('--------------- START POST /api/products ---------------');
    console.log('Received POST request to /api/products');
    
    // Kiểm tra Content-Type
    const contentType = request.headers.get('Content-Type') || '';
    console.log('Content-Type:', contentType);
    
    let productData: any = {};
    let fileData = null;
    
    // Xử lý dữ liệu dựa trên Content-Type
    if (contentType.includes('application/json')) {
      // Nếu là JSON
      console.log('Processing as JSON data');
      productData = await request.json().catch(err => {
        console.error('Error parsing JSON:', err);
        throw new Error('Invalid JSON data');
      });
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      // Nếu là form data
      console.log('Processing as form data');
      const formData = await request.formData().catch(err => {
        console.error('Error parsing form data:', err);
        throw new Error('Invalid form data');
      });
      
      // Tách file và các trường dữ liệu khác
      const file = formData.get('file') as File | null;
      
      if (file) {
        console.log('File received:', file.name, file.type, file.size);
        try {
          // Upload file lên Cloudinary
          const uploadResult = await uploadToCloudinary(file);
          console.log('File uploaded to Cloudinary:', uploadResult);
          
          // Lưu thông tin file từ Cloudinary
          fileData = {
            fileName: file.name,
            fileUrl: uploadResult.secure_url,
            fileSize: file.size,
            fileType: file.type,
            publicId: uploadResult.public_id
          };
        } catch (error) {
          console.error('Error uploading file to Cloudinary:', error);
          throw new Error('Failed to upload file');
        }
      }
      
      // Chuyển đổi FormData thành đối tượng (trừ file đã xử lý)
      formData.forEach((value, key) => {
        if (key !== 'file') {
          productData[key] = value;
          console.log(`Form field: ${key} = ${value}`);
        }
      });
      
      // Xử lý các trường boolean và số
      productData.price = Number(productData.price || 0);
      productData.salePrice = Number(productData.salePrice || 0);
      productData.isFeatured = productData.isFeatured === 'on';
      productData.isNew = productData.isNew === 'on';
      productData.downloadCount = 0;
      productData.viewCount = 0;
      productData.rating = 0;
      
      // Thêm thông tin file vào productData nếu có
      if (fileData) {
        productData.fileUrl = fileData.fileUrl;
        productData.fileName = fileData.fileName;
        productData.fileSize = fileData.fileSize;
        productData.fileType = fileData.fileType;
        productData.filePublicId = fileData.publicId;
      }
    } else {
      console.error('Unsupported Content-Type:', contentType);
      return NextResponse.json(
        { success: false, message: 'Không hỗ trợ Content-Type này' },
        { status: 415 }
      );
    }
    
    console.log('Processed product data:', productData);
    
    // Kiểm tra các trường bắt buộc
    if (!productData.name || !productData.slug || !productData.description) {
      console.error('Missing required fields');
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
    
    console.log('Returning successful response with status 201');
    console.log('--------------- END POST /api/products ---------------');
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: resultData
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('--------------- END POST /api/products WITH ERROR ---------------');
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
    console.log(`Returning ${products.length} products`);
    
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