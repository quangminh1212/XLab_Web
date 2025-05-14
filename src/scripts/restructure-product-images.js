/**
 * Script phân chia tài nguyên sản phẩm thành thư mục con trong public/images/products
 * Chạy: node src/scripts/restructure-product-images.js
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục và file
const PRODUCTS_DIR = path.resolve(process.cwd(), 'public/images/products');
const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/products.json');

// Hàm chuyển đổi tên sản phẩm thành định dạng URL an toàn
const getProductFolderName = (productName) => {
  return productName.toLowerCase()
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
}

// Hàm tạo đường dẫn ảnh mới theo cấu trúc thư mục con
const getNewImagePath = (productName, originalPath, index = 0) => {
  if (!originalPath) return null;
  
  const folderName = getProductFolderName(productName);
  
  // Xác định tên file ảnh trong thư mục con
  let fileName;
  if (index === 0) {
    fileName = 'main.png'; // Ảnh chính
  } else {
    fileName = `image-${index}.png`; // Ảnh phụ
  }
  
  return `/images/products/${folderName}/${fileName}`;
}

// Hàm kiểm tra xem URL có chứa UUID không
const containsUuid = (url) => {
  if (!url) return false;
  return !!url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
}

// Hàm tạo thư mục cho sản phẩm nếu chưa tồn tại
const createProductFolder = (folderName) => {
  const folderPath = path.join(PRODUCTS_DIR, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Đã tạo thư mục: ${folderPath}`);
  }
  return folderPath;
}

// Hàm sao chép file ảnh từ vị trí cũ sang vị trí mới
const copyImageFile = (oldPath, newPath) => {
  // Chuyển đổi từ URL sang đường dẫn file thực tế
  const oldFilePath = path.join(process.cwd(), 'public', oldPath.replace(/^\//, ''));
  const newFilePath = path.join(process.cwd(), 'public', newPath.replace(/^\//, ''));
  
  // Kiểm tra xem file nguồn có tồn tại không
  if (!fs.existsSync(oldFilePath)) {
    console.log(`⚠️ File nguồn không tồn tại: ${oldFilePath}`);
    return false;
  }
  
  // Đảm bảo thư mục đích tồn tại
  const newFileDir = path.dirname(newFilePath);
  if (!fs.existsSync(newFileDir)) {
    fs.mkdirSync(newFileDir, { recursive: true });
  }
  
  // Sao chép file
  try {
    fs.copyFileSync(oldFilePath, newFilePath);
    console.log(`✅ Đã sao chép từ ${oldFilePath} tới ${newFilePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi sao chép file: ${error.message}`);
    return false;
  }
}

// Hàm xử lý mảng hình ảnh của sản phẩm
const processProductImages = (productName, images) => {
  if (!images || !Array.isArray(images)) return [];
  
  const folderName = getProductFolderName(productName);
  createProductFolder(folderName);
  
  return images.map((img, index) => {
    const imgUrl = typeof img === 'string' ? img : (img.url || '');
    const newPath = getNewImagePath(productName, imgUrl, index);
    
    // Sao chép file ảnh
    if (imgUrl && imgUrl.startsWith('/images/')) {
      copyImageFile(imgUrl, newPath);
    }
    
    return newPath;
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

console.log("Bắt đầu cập nhật cấu trúc thư mục ảnh sản phẩm...");
for (let i = 0; i < products.length; i++) {
  const product = products[i];
  let updated = false;
  
  console.log(`\nĐang xử lý sản phẩm: ${product.name} (${i+1}/${products.length})`);
  
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