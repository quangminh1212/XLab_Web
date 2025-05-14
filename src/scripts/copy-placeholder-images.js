/**
 * Script copy hình ảnh placeholder vào thư mục products với tên sản phẩm
 * Chạy: node src/scripts/copy-placeholder-images.js
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục
const PRODUCTS_DIR = path.resolve(process.cwd(), 'public/images/products');
const PLACEHOLDER_PATH = path.resolve(process.cwd(), 'public/images/placeholder/placeholder-product.jpg');

// Đảm bảo thư mục sản phẩm tồn tại
if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  console.log(`✅ Đã tạo thư mục ${PRODUCTS_DIR}`);
}

// Kiểm tra placeholder
if (!fs.existsSync(PLACEHOLDER_PATH)) {
  console.error('❌ Lỗi: Không tìm thấy file placeholder-product.jpg');
  process.exit(1);
}

// Đọc danh sách file trong thư mục sản phẩm
const productFiles = fs.readdirSync(PRODUCTS_DIR);

// Danh sách tên sản phẩm mẫu (giống như trong script tạo hình ảnh)
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

// Kiểm tra nội dung file có rỗng không
function isFileEmpty(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size === 0;
  } catch (err) {
    return true;
  }
}

// Copy ảnh placeholder vào các file với tên sản phẩm
let copiedCount = 0;
let skippedCount = 0;

// Xử lý từng sản phẩm
for (const product of sampleProducts) {
  // Tạo các biến thể file ảnh (file chính + 2 file phụ)
  for (let i = 0; i <= 2; i++) {
    const fileName = getImageNameFromProduct(product, i);
    const targetPath = path.join(PRODUCTS_DIR, fileName);
    
    // Kiểm tra file đã tồn tại chưa hoặc có rỗng không
    if (!fs.existsSync(targetPath) || isFileEmpty(targetPath)) {
      // Copy file placeholder vào
      fs.copyFileSync(PLACEHOLDER_PATH, targetPath);
      console.log(`✅ Đã copy placeholder vào: ${fileName}`);
      copiedCount++;
    } else {
      console.log(`⏩ Bỏ qua file đã tồn tại và không rỗng: ${fileName}`);
      skippedCount++;
    }
  }
}

console.log(`\n✅ Hoàn thành! Đã copy ${copiedCount} file hình ảnh, bỏ qua ${skippedCount} file.`);

// Copy hình ảnh placeholder vào file product-placeholder.jpg
const productPlaceholderPath = path.resolve(process.cwd(), 'public/images/placeholder/product-placeholder.jpg');
if (!fs.existsSync(productPlaceholderPath) || isFileEmpty(productPlaceholderPath)) {
  fs.copyFileSync(PLACEHOLDER_PATH, productPlaceholderPath);
  console.log('✅ Đã copy placeholder vào: product-placeholder.jpg');
} 