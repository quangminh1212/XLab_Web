const fs = require('fs');
const path = require('path');

// Kiểm tra sản phẩm
async function verifyProducts() {
  try {
    console.log('Bắt đầu kiểm tra dữ liệu sản phẩm...');

    // Đường dẫn đến file products.json
    const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(dataFilePath)) {
      console.error('File products.json không tồn tại!');
      console.log('Tạo file products.json mới...');
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      console.log('Đã tạo file products.json trống.');
      return;
    }

    // Đọc dữ liệu từ file
    console.log(`Đọc dữ liệu từ ${dataFilePath}...`);
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');

    if (!fileContent.trim()) {
      console.log('File products.json hiện đang trống.');
      return;
    }

    // Parse dữ liệu JSON
    try {
      const products = JSON.parse(fileContent);
      console.log(`Đã đọc thành công ${products.length} sản phẩm.`);

      if (products.length === 0) {
        console.log('Không có sản phẩm nào trong file.');
        return;
      }

      // Hiển thị danh sách sản phẩm
      console.log('\nDanh sách sản phẩm:');
      console.log('--------------------------------------------------');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (ID: ${product.id}, Slug: ${product.slug})`);
        console.log(`   - Trạng thái: ${product.isPublished ? 'Đã công khai' : 'Chưa công khai'}`);
        if (product.versions && product.versions.length > 0) {
          const firstVersion = product.versions[0];
          console.log(
            `   - Giá: ${firstVersion.price.toLocaleString('vi-VN')}đ (Gốc: ${firstVersion.originalPrice.toLocaleString('vi-VN')}đ)`,
          );
        }
        console.log(`   - Ngày tạo: ${new Date(product.createdAt).toLocaleDateString('vi-VN')}`);
        console.log('--------------------------------------------------');
      });

      // Kiểm tra tính toàn vẹn dữ liệu
      console.log('\nKiểm tra tính toàn vẹn dữ liệu:');
      let hasErrors = false;

      products.forEach((product, index) => {
        const issues = [];

        // Kiểm tra các trường bắt buộc
        if (!product.id) issues.push('Thiếu ID');
        if (!product.name) issues.push('Thiếu tên');
        if (!product.slug) issues.push('Thiếu slug');
        if (!product.description) issues.push('Thiếu mô tả');

        // Kiểm tra mảng hình ảnh
        if (!product.images || !Array.isArray(product.images)) {
          issues.push('Thiếu hoặc sai định dạng hình ảnh');
        }

        // Kiểm tra phiên bản sản phẩm
        if (
          !product.versions ||
          !Array.isArray(product.versions) ||
          product.versions.length === 0
        ) {
          issues.push('Thiếu phiên bản sản phẩm');
        } else {
          // Kiểm tra thông tin giá cả
          product.versions.forEach((version, vIndex) => {
            if (version.price === undefined || version.price === null) {
              issues.push(`Phiên bản ${vIndex + 1} thiếu giá`);
            }
          });
        }

        if (issues.length > 0) {
          console.log(`Sản phẩm "${product.name}" (index ${index}) có các vấn đề sau:`);
          issues.forEach((issue) => console.log(`   - ${issue}`));
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        console.log('Tất cả sản phẩm đều hợp lệ!');
      }
    } catch (parseError) {
      console.error('Lỗi khi parse file JSON:', parseError);
      // Hiển thị một phần nội dung file để debug
      console.log('Nội dung file (50 ký tự đầu tiên):');
      console.log(fileContent.substring(0, 50) + '...');
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra sản phẩm:', error);
  }
}

// Thực thi hàm kiểm tra
verifyProducts().then(() => {
  console.log('\nHoàn thành kiểm tra sản phẩm.');
});
