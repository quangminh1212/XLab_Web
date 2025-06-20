const fs = require('fs');
const path = require('path');

// Đọc file productsData.ts
const productsDataPath = path.join(__dirname, 'src', 'locales', 'vie', 'productsData.ts');
const productTsPath = path.join(__dirname, 'src', 'locales', 'vie', 'product.ts');

console.log('Đường dẫn file productsData.ts:', productsDataPath);
console.log('Đường dẫn file product.ts:', productTsPath);

try {
  // Kiểm tra các file có tồn tại không
  if (!fs.existsSync(productTsPath)) {
    console.error('File product.ts không tồn tại!');
    process.exit(1);
  }
  
  if (!fs.existsSync(productsDataPath)) {
    console.error('File productsData.ts không tồn tại!');
    process.exit(1);
  }

  // Đọc nội dung từ product.ts để lấy mô tả đầy đủ
  const productTsContent = fs.readFileSync(productTsPath, 'utf8');
  console.log('Đã đọc file product.ts, độ dài:', productTsContent.length);
  
  // Tìm mô tả ChatGPT trong product.ts
  const descriptionMatch = productTsContent.match(/chatgpt:\s*{\s*['"]description['"]:\s*`([\s\S]*?)`\s*,/m);
  
  if (!descriptionMatch) {
    console.error('Không tìm thấy mô tả ChatGPT trong file product.ts');
    console.log('Đoạn đầu file product.ts:', productTsContent.substring(0, 300));
    process.exit(1);
  }
  
  // Lấy mô tả đầy đủ từ product.ts
  const fullDescription = descriptionMatch[1];
  console.log('Đã tìm thấy mô tả ChatGPT, độ dài:', fullDescription.length);
  
  // Đọc nội dung file productsData.ts
  const productsDataContent = fs.readFileSync(productsDataPath, 'utf8');
  console.log('Đã đọc file productsData.ts, độ dài:', productsDataContent.length);
  
  // Tìm đoạn mô tả hiện tại trong productsData.ts
  const currentDescriptionMatch = productsDataContent.match(/"id":\s*"chatgpt",\s*"name":\s*"ChatGPT",\s*"slug":\s*"chatgpt",\s*"description":\s*"([\s\S]*?)"/m);
  
  if (!currentDescriptionMatch) {
    console.error('Không tìm thấy mô tả hiện tại trong file productsData.ts');
    console.log('Đoạn đầu file productsData.ts:', productsDataContent.substring(0, 300));
    process.exit(1);
  }
  
  console.log('Đã tìm thấy mô tả hiện tại, độ dài:', currentDescriptionMatch[1].length);
  
  // Tạo chuỗi mô tả mới - phải escape các ký tự đặc biệt
  const escapedFullDescription = fullDescription
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`');
  
  console.log('Đã tạo mô tả mới, độ dài:', escapedFullDescription.length);
  
  // Thay thế mô tả hiện tại bằng mô tả mới
  const newProductsDataContent = productsDataContent.replace(
    /"id":\s*"chatgpt",\s*"name":\s*"ChatGPT",\s*"slug":\s*"chatgpt",\s*"description":\s*"([\s\S]*?)"/m,
    `"id": "chatgpt", "name": "ChatGPT", "slug": "chatgpt", "description": "${escapedFullDescription}"`
  );
  
  // Kiểm tra xem đã thay thế thành công chưa
  if (newProductsDataContent === productsDataContent) {
    console.error('Không thay thế được nội dung!');
    process.exit(1);
  }
  
  console.log('Đã thay thế thành công, độ dài nội dung mới:', newProductsDataContent.length);
  
  // Ghi nội dung mới vào file
  fs.writeFileSync(productsDataPath, newProductsDataContent, 'utf8');
  
  console.log('Đã cập nhật thành công mô tả ChatGPT trong file productsData.ts');
} catch (error) {
  console.error('Lỗi:', error);
  process.exit(1);
} 