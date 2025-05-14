/**
 * Script cập nhật component admin để đồng bộ UI với ảnh trong database
 * Chạy: node src/scripts/admin-image-sync.js
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn component admin
const ADMIN_PRODUCT_EDIT_COMPONENT = path.join(process.cwd(), 'src/app/admin/products/[id]/page.tsx');
const ADMIN_PRODUCT_NEW_COMPONENT = path.join(process.cwd(), 'src/app/admin/products/new/page.tsx');

// Hàm cập nhật file component
const updateComponentFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Không tìm thấy file: ${filePath}`);
    return false;
  }

  console.log(`Đang cập nhật file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Tìm và thay thế phần xử lý hình ảnh
  let updated = false;

  // 1. Thêm import getImageNameFromProduct
  if (!content.includes('getImageNameFromProduct')) {
    content = content.replace(
      /import\s+{([^}]*)}\s+from\s+['"]@\/lib\/utils['"]/,
      "import {$1, getImageNameFromProduct} from '@/lib/utils'"
    );

    if (!content.includes('getImageNameFromProduct')) {
      content = content.replace(
        /import\s+([^;]*)\s+from\s+['"]@\/lib\/utils['"]/,
        "import $1, {getImageNameFromProduct} from '@/lib/utils'"
      );
    }

    if (!content.includes('getImageNameFromProduct')) {
      // Nếu không có import từ utils, thêm mới
      content = `import { getImageNameFromProduct } from '@/lib/imageUtils';\n${content}`;
    }

    updated = true;
  }

  // 2. Cập nhật phần xử lý handleImageUpload
  if (content.includes('handleImageUpload') && !content.includes('getImageNameFromProduct(')) {
    const oldHandleImageUpload = /const\s+handleImageUpload\s*=\s*async\s*\([^)]*\)\s*=>\s*{[^}]*}/gs;
    const newHandleImageUpload = `const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Tạo URL ảnh theo tên sản phẩm
      const productNameForUrl = formData.name || 'product';
      const imageUrl = getImageNameFromProduct(productNameForUrl, null);
      
      // Lưu file tạm thời để hiển thị
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Lỗi khi tải hình ảnh:', error);
      setError('Không thể tải hình ảnh lên');
    }
  }`;

    content = content.replace(oldHandleImageUpload, newHandleImageUpload);
    updated = true;
  }

  // 3. Cập nhật hàm handleFileChange cho ảnh mô tả nếu có
  if (content.includes('handleFileChange') && !content.includes('getImageNameFromProduct(')) {
    const oldHandleFileChange = /const\s+handleFileChange\s*=\s*async\s*\([^)]*\)\s*=>\s*{[^}]*}/gs;
    const newHandleFileChange = `const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const productNameForUrl = formData.name || 'product';
      const newImages = Array.from(files).map((_, index) => {
        return getImageNameFromProduct(productNameForUrl, descriptionImages.length + index);
      });

      setDescriptionImages([...descriptionImages, ...newImages]);
    } catch (error) {
      console.error('Lỗi khi tải hình ảnh mô tả:', error);
      setError('Không thể tải hình ảnh mô tả');
    }
  }`;

    content = content.replace(oldHandleFileChange, newHandleFileChange);
    updated = true;
  }

  // Lưu file nếu có cập nhật
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Đã cập nhật thành công file: ${filePath}`);
    return true;
  } else {
    console.log(`⚠️ Không có thay đổi nào trong file: ${filePath}`);
    return false;
  }
};

// Cập nhật file utils để thêm hàm getImageNameFromProduct nếu chưa có
const updateUtilsFile = () => {
  const UTILS_FILE = path.join(process.cwd(), 'src/lib/utils.ts');
  
  if (!fs.existsSync(UTILS_FILE)) {
    console.error(`❌ Không tìm thấy file utils: ${UTILS_FILE}`);
    return false;
  }
  
  console.log(`Đang kiểm tra file utils: ${UTILS_FILE}`);
  let content = fs.readFileSync(UTILS_FILE, 'utf8');
  
  // Kiểm tra xem đã có hàm getImageNameFromProduct chưa
  if (!content.includes('getImageNameFromProduct')) {
    const imageUtilsImport = `import { getImageNameFromProduct } from './imageUtils';\n`;
    if (!content.includes('from \'./imageUtils\'')) {
      content = imageUtilsImport + content;
    }
    
    // Export lại hàm getImageNameFromProduct
    const exportStatement = `\nexport { getImageNameFromProduct };\n`;
    content += exportStatement;
    
    fs.writeFileSync(UTILS_FILE, content, 'utf8');
    console.log(`✅ Đã cập nhật file utils để export hàm getImageNameFromProduct`);
    return true;
  }
  
  return false;
};

// Cập nhật file admin UI
console.log("Bắt đầu đồng bộ hóa giao diện admin...");
let updatedFilesCount = 0;

// 1. Cập nhật file utils trước
if (updateUtilsFile()) {
  updatedFilesCount++;
}

// 2. Cập nhật các component admin
if (updateComponentFile(ADMIN_PRODUCT_EDIT_COMPONENT)) {
  updatedFilesCount++;
}

if (updateComponentFile(ADMIN_PRODUCT_NEW_COMPONENT)) {
  updatedFilesCount++;
}

console.log(`\n✅ Hoàn thành! Đã cập nhật ${updatedFilesCount} file.`);
console.log("❗ Lưu ý: Nếu có các component admin khác xử lý hình ảnh, bạn nên kiểm tra và cập nhật thủ công.");
console.log("🔄 Khởi động lại server để áp dụng các thay đổi."); 