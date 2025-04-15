import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

    // Nếu là File từ FormData
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
    
    // Nếu là buffer hoặc kiểu dữ liệu khác
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
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
} 