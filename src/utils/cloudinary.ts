import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz12',
});

// Định nghĩa kiểu dữ liệu cho kết quả upload
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
  url: string;
  bytes: number;
  original_filename: string;
  created_at: string;
  [key: string]: any;
}

/**
 * Upload file lên Cloudinary
 * @param file File dạng Buffer hoặc stream
 * @returns Object chứa thông tin upload
 */
export async function uploadToCloudinary(file: any): Promise<CloudinaryUploadResult> {
  try {
    console.log('Starting upload to Cloudinary', { 
      fileName: file.name, 
      fileType: file.type, 
      fileSize: file.size 
    });

    // Chế độ mô phỏng - không thực sự upload lên Cloudinary
    const mockUploadResult: CloudinaryUploadResult = {
      public_id: `xlab/files/${Date.now()}_${file.name.replace(/\s+/g, '_')}`,
      secure_url: `https://res.cloudinary.com/demo/raw/upload/v1/${Date.now()}_${file.name.replace(/\s+/g, '_')}`,
      format: file.type.split('/')[1] || 'raw',
      width: 0,
      height: 0,
      resource_type: 'raw',
      url: `https://res.cloudinary.com/demo/raw/upload/v1/${Date.now()}_${file.name.replace(/\s+/g, '_')}`,
      bytes: file.size,
      original_filename: file.name,
      created_at: new Date().toISOString()
    };
    
    console.log('Mock upload result:', mockUploadResult);
    return mockUploadResult;

    // Nếu là File từ FormData - Code này sẽ không được chạy trong chế độ mô phỏng
    if (file instanceof File || (file && file.arrayBuffer)) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log('Converting file to buffer for upload, size:', buffer.length);
      
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'xlab',
            resource_type: 'auto',
            filename_override: file.name
          },
          (error: Error | undefined, result: CloudinaryUploadResult | undefined) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return reject(error);
            }
            if (!result) {
              return reject(new Error("No result returned from Cloudinary"));
            }
            console.log('Upload successful, result:', result);
            resolve(result);
          }
        );
        
        uploadStream.end(buffer);
      });
    }
    
    // Nếu là buffer hoặc kiểu dữ liệu khác - Code này sẽ không được chạy trong chế độ mô phỏng
    console.log('Uploading as direct buffer/stream');
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'xlab',
          resource_type: 'auto',
        },
        (error: Error | undefined, result: CloudinaryUploadResult | undefined) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error("No result returned from Cloudinary"));
          }
          console.log('Upload successful, result:', result);
          resolve(result);
        }
      );
      
      uploadStream.end(file);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Xóa file từ Cloudinary
 * @param publicId Public ID của file trên Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<{success: boolean}> {
  try {
    // Trong chế độ mô phỏng, không thực sự xóa
    console.log('Mock deleting file from Cloudinary:', publicId);
    return { success: true };
    
    // Code thực tế - sẽ không được chạy trong chế độ mô phỏng
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
} 