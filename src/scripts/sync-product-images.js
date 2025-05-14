/**
 * Script đồng bộ hóa ảnh sản phẩm trong database với định dạng tên theo sản phẩm
 * Chạy: node src/scripts/sync-product-images.js
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục và file
const PRODUCTS_DIR = path.resolve(process.cwd(), 'public/images/products');
const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/products.json');

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
    return `/images/products/${safeName}.png`;
  }
  return `/images/products/${safeName}-${index}.png`;
}

// Hàm kiểm tra xem URL có chứa UUID không
const containsUuid = (url) => {
  if (!url) return false;
  return !!url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
}

// Hàm chuyển đổi đường dẫn ảnh uuid thành đường dẫn theo tên sản phẩm
const convertImagePath = (productName, oldPath, index = 0) => {
  if (!oldPath) return null;
  if (!containsUuid(oldPath)) return oldPath;
  
  return getImageNameFromProduct(productName, index);
}

// Hàm xử lý mảng hình ảnh của sản phẩm
const processProductImages = (productName, images) => {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map((img, index) => {
    const imgUrl = typeof img === 'string' ? img : (img.url || '');
    return convertImagePath(productName, imgUrl, index);
  });
}

// Đọc dữ liệu sản phẩm
console.log("Đọc dữ liệu sản phẩm từ file...");
let products = [];
try {
  const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
  products = JSON.parse(fileContent);
  console.log(`Đã đọc ${products.length} sản phẩm từ file.`);
} catch (error) {
  console.error('Lỗi khi đọc file sản phẩm:', error);
  process.exit(1);
}

// Kiểm tra và cập nhật đường dẫn ảnh
let updatedCount = 0;
let skippedCount = 0;

console.log("Bắt đầu cập nhật đường dẫn ảnh sản phẩm...");
for (let i = 0; i < products.length; i++) {
  const product = products[i];
  let updated = false;
  
  // Kiểm tra và cập nhật ảnh chính
  if (product.images && Array.isArray(product.images)) {
    const oldImages = [...product.images];
    product.images = processProductImages(product.name, product.images);
    
    // Kiểm tra xem có thay đổi không
    if (JSON.stringify(oldImages) !== JSON.stringify(product.images)) {
      updated = true;
      console.log(`Đã cập nhật ảnh chính cho sản phẩm "${product.name}"`);
      console.log(`  - Cũ: ${JSON.stringify(oldImages)}`);
      console.log(`  - Mới: ${JSON.stringify(product.images)}`);
    }
  }
  
  // Kiểm tra và cập nhật ảnh mô tả
  if (product.descriptionImages && Array.isArray(product.descriptionImages)) {
    const oldDescImages = [...product.descriptionImages];
    product.descriptionImages = processProductImages(product.name, product.descriptionImages);
    
    // Kiểm tra xem có thay đổi không
    if (JSON.stringify(oldDescImages) !== JSON.stringify(product.descriptionImages)) {
      updated = true;
      console.log(`Đã cập nhật ảnh mô tả cho sản phẩm "${product.name}"`);
    }
  }
  
  // Đếm số sản phẩm đã cập nhật
  if (updated) {
    updatedCount++;
  } else {
    skippedCount++;
  }
}

// Lưu lại file dữ liệu
if (updatedCount > 0) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
    console.log(`\n✅ Hoàn thành! Đã cập nhật ${updatedCount} sản phẩm, bỏ qua ${skippedCount} sản phẩm.`);
  } catch (error) {
    console.error('Lỗi khi lưu file dữ liệu:', error);
    process.exit(1);
  }
} else {
  console.log(`\n✅ Hoàn thành! Không có sản phẩm nào cần cập nhật.`);
}

// Xem tình trạng ảnh trong thư mục
const productFiles = fs.readdirSync(PRODUCTS_DIR);
console.log(`\nĐã tìm thấy ${productFiles.length} file ảnh trong thư mục ${PRODUCTS_DIR}`);

const uuidFiles = productFiles.filter(file => containsUuid(file));
if (uuidFiles.length > 0) {
  console.log(`⚠️ Có ${uuidFiles.length} file ảnh còn chứa UUID:`);
  uuidFiles.forEach(file => console.log(`  - ${file}`));
} 