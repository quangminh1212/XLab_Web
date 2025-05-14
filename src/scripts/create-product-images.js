/**
 * Script tạo thư mục và các file hình ảnh theo tên sản phẩm
 * Chạy: node src/scripts/create-product-images.js
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục hình ảnh sản phẩm
const IMAGES_DIR = path.resolve(process.cwd(), 'public/images/products');

// Đảm bảo thư mục hình ảnh tồn tại
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`✅ Đã tạo thư mục ${IMAGES_DIR}`);
}

// Hàm chuyển đổi tên sản phẩm thành định dạng URL an toàn
const getImageNameFromProduct = (productName, index = 0) => {
  // Chuyển đổi tên sản phẩm thành định dạng URL an toàn
  const safeName = productName.toLowerCase()
    .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[èéẻẽẹêếềểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[ùúủũụưứừửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
  
  if (index === 0) {
    return `${safeName}.png`;
  }
  return `${safeName}-${index}.png`;
}

// Danh sách tên sản phẩm mẫu
const sampleProducts = [
  'XLab',
  'Phần mềm Speech-to-Text',
  'Bộ Cài Đặt Windows 11',
  'Microsoft Office 365',
  'Photoshop 2024',
  'AutoCAD 2023',
  'Solidworks Premium',
  'Premiere Pro',
  'After Effects',
  'Illustrator',
  'Sony Vegas Pro',
  'SketchUp Pro'
];

// Tạo file hình ảnh cho mỗi sản phẩm
async function createProductImages() {
  let placeholderImagePath = path.resolve(process.cwd(), 'public/images/placeholder/product-placeholder.jpg');
  
  // Kiểm tra xem ảnh placeholder có tồn tại không
  if (!fs.existsSync(placeholderImagePath)) {
    console.error('❌ Không tìm thấy ảnh placeholder');
    placeholderImagePath = null;
  }

  // Tạo các file hình ảnh
  for (const product of sampleProducts) {
    // Tạo hình ảnh chính
    const mainImageName = getImageNameFromProduct(product);
    const mainImagePath = path.join(IMAGES_DIR, mainImageName);
    
    // Kiểm tra xem file đã tồn tại chưa
    if (!fs.existsSync(mainImagePath)) {
      if (placeholderImagePath) {
        // Copy từ ảnh placeholder
        fs.copyFileSync(placeholderImagePath, mainImagePath);
        console.log(`✅ Đã tạo ảnh chính cho sản phẩm: ${product} -> ${mainImagePath}`);
      } else {
        // Tạo file trống nếu không có placeholder
        fs.writeFileSync(mainImagePath, '');
        console.log(`✅ Đã tạo file trống cho sản phẩm: ${product} -> ${mainImagePath}`);
      }
    } else {
      console.log(`⚠️ Ảnh chính đã tồn tại: ${mainImagePath}`);
    }
    
    // Tạo 2 ảnh bổ sung
    for (let i = 1; i <= 2; i++) {
      const additionalImageName = getImageNameFromProduct(product, i);
      const additionalImagePath = path.join(IMAGES_DIR, additionalImageName);
      
      if (!fs.existsSync(additionalImagePath)) {
        if (placeholderImagePath) {
          // Copy từ ảnh placeholder
          fs.copyFileSync(placeholderImagePath, additionalImagePath);
          console.log(`✅ Đã tạo ảnh phụ ${i} cho sản phẩm: ${product} -> ${additionalImagePath}`);
        } else {
          // Tạo file trống nếu không có placeholder
          fs.writeFileSync(additionalImagePath, '');
          console.log(`✅ Đã tạo file trống phụ ${i} cho sản phẩm: ${product} -> ${additionalImagePath}`);
        }
      } else {
        console.log(`⚠️ Ảnh phụ ${i} đã tồn tại: ${additionalImagePath}`);
      }
    }
  }

  console.log('✅ Hoàn thành tạo ảnh sản phẩm theo tên!');
}

// Chạy hàm chính
createProductImages().catch(error => {
  console.error('❌ Lỗi:', error);
}); 