import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { products as mockProductsImport } from '@/data/mockData';

// Tạo một bản sao của mockProducts để làm việc với dữ liệu trong bộ nhớ
let mockProducts = [...mockProductsImport];

export async function POST(request: NextRequest) {
  try {
    console.log('--------------- START POST /api/products ---------------');
    console.log('Received POST request to /api/products');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Current products count:', mockProducts.length);
    
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
      let formData;
      
      try {
        formData = await request.formData();
        console.log('Form data parsed successfully');
      } catch (err) {
        console.error('Error parsing form data:', err);
        throw new Error('Invalid form data: ' + (err instanceof Error ? err.message : String(err)));
      }
      
      // Debug: Log tất cả các keys trong formData
      const formDataKeys = Array.from(formData.keys());
      console.log('Form data keys:', formDataKeys);
      
      // Tách file và các trường dữ liệu khác
      const file = formData.get('file') as File | null;
      
      if (file) {
        console.log('File received:', file.name, file.type, file.size);
        
        if (file.size === 0) {
          console.warn('Received file with 0 bytes size, skipping upload');
        } else {
          try {
            // Sử dụng hàm uploadToCloudinary đã được cập nhật để mô phỏng upload
            console.log('Uploading file to Cloudinary (mock mode)...');
            const uploadResult = await uploadToCloudinary(file);
            console.log('Upload result:', uploadResult);
            
            // Lưu thông tin file từ kết quả upload
            fileData = {
              fileName: uploadResult.original_filename,
              fileUrl: uploadResult.secure_url,
              fileSize: uploadResult.bytes,
              fileType: file.type,
              publicId: uploadResult.public_id
            };
            
            console.log('File data processed:', fileData);
          } catch (error) {
            console.error('Error uploading file:', error);
            return NextResponse.json(
              { success: false, message: `Lỗi khi xử lý file: ${error instanceof Error ? error.message : 'Unknown error'}` },
              { status: 500 }
            );
          }
        }
      } else {
        console.log('No file found in the request');
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
      productData.salePrice = productData.salePrice ? Number(productData.salePrice) : 0;
      productData.isFeatured = productData.isFeatured === 'on';
      productData.isNew = productData.isNew === 'on';
      productData.downloadCount = 0;
      productData.viewCount = 0;
      productData.rating = 0;
      
      console.log('Processed fields:');
      console.log('- price:', productData.price);
      console.log('- salePrice:', productData.salePrice);
      console.log('- isFeatured:', productData.isFeatured);
      console.log('- isNew:', productData.isNew);
      
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
    const requiredFields = ['name', 'slug', 'description'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { success: false, message: `Thiếu các trường bắt buộc: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Tạo sản phẩm mới với ID ngẫu nhiên
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Thêm vào mảng mockProducts để hiển thị trong giao diện
    mockProducts.unshift(newProduct);
    
    console.log('Created product:', newProduct);
    console.log('Total products after adding:', mockProducts.length);
    
    console.log('Returning successful response with status 201');
    console.log('--------------- END POST /api/products ---------------');
    
    return NextResponse.json({
      success: true,
      message: 'Sản phẩm đã được tạo thành công',
      data: newProduct
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
    console.log(`Returning ${mockProducts.length} products from memory (not from import)`);
    
    return NextResponse.json({
      success: true,
      data: mockProducts
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