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
    // Nếu là stream (FormData)
    if (file.arrayBuffer) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'xlab',
            resource_type: 'auto',
          },
          (error: Error | undefined, result: CloudinaryUploadResult | undefined) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("No result returned from Cloudinary"));
            resolve(result);
          }
        ).end(buffer);
      });
    }
    
    // Nếu là buffer
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'xlab',
          resource_type: 'auto',
        },
        (error: Error | undefined, result: CloudinaryUploadResult | undefined) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("No result returned from Cloudinary"));
          resolve(result);
        }
      ).end(file);
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