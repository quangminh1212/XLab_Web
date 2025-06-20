import { products as mockProducts } from '@/data/mockData';
import ProductDetail from '@/app/products/[id]/ProductDetail';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';
import { productsData } from '@/locales/productsData';

// Đảm bảo trang được render động với mỗi request
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Đọc dữ liệu sản phẩm từ locale files
function getProducts(): any[] {
  try {
    // Lấy danh sách sản phẩm từ tất cả các ngôn ngữ và gộp lại
    // Ưu tiên tiếng Việt làm ngôn ngữ chính
    const allProducts = [
      ...productsData.vie,
      ...productsData.eng,
      ...productsData.spa
    ];
    
    // Lọc các sản phẩm trùng lặp theo ID
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );
    
    return uniqueProducts;
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
}

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params trước khi sử dụng thuộc tính của nó
  const { id: accountId } = await params;

  console.log(`Đang tìm kiếm dịch vụ với ID hoặc slug: ${accountId}`);

  // Lấy danh sách sản phẩm từ locale files
  const productsFromLocale = getProducts();

  // Tìm kiếm trong locale files trước
  let selectedProduct: any = productsFromLocale.find(
    (p) => p.slug === accountId && (p.isAccount || p.type === 'account'),
  );

  if (!selectedProduct) {
    selectedProduct = productsFromLocale.find(
      (p) => p.id === accountId && (p.isAccount || p.type === 'account'),
    );
  }

  // Nếu không tìm thấy, tìm trong mockData
  if (!selectedProduct) {
    // Tìm theo slug trước
    selectedProduct = mockProducts.find(
      (p) => p.slug === accountId && (p.isAccount || p.type === 'account'),
    );

    // Sau đó tìm theo id nếu không tìm thấy theo slug
    if (!selectedProduct) {
      selectedProduct = mockProducts.find(
        (p) => p.id === accountId && (p.isAccount || p.type === 'account'),
      );
    }
  }

  // Thêm dữ liệu mẫu cho các sản phẩm CapCut Pro
  const sampleAccounts = [
    {
      id: 'capcut-pro',
      slug: 'capcut-pro',
      name: 'CapCut Pro',
      description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp.',
      longDescription: `
        <h2>CapCut Pro - Giải pháp chỉnh sửa video hàng đầu</h2>
        <p>CapCut Pro cung cấp trải nghiệm chỉnh sửa video chuyên nghiệp với đầy đủ công cụ, hiệu ứng và tính năng cao cấp.</p>
        
        <h3>Lợi ích khi sử dụng tài khoản Pro:</h3>
        <ul>
          <li>Bỏ qua tất cả giới hạn của phiên bản miễn phí</li>
          <li>Truy cập thư viện hiệu ứng, nhạc và sticker cao cấp</li>
          <li>Xuất video chất lượng cao không có watermark</li>
          <li>Công cụ AI tiên tiến để tạo nội dung độc đáo</li>
          <li>Đồng bộ hóa dự án trên nhiều thiết bị</li>
        </ul>
        
        <h3>Hỗ trợ đa nền tảng:</h3>
        <p>Sử dụng CapCut Pro trên điện thoại, máy tính bảng và máy tính với cùng một tài khoản.</p>
      `,
      imageUrl: '/capcut.png',
      price: 290000,
      salePrice: 199000,
      rating: 4.8,
      downloadCount: 280,
      viewCount: 1200,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Sử dụng trên cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7',
        'Cập nhật tính năng mới ngay khi phát hành',
      ],
    },
    {
      id: 'capcut-pro-7days',
      slug: 'capcut-pro-7days',
      name: 'CapCut Pro - 7 Ngày',
      description:
        'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 7 ngày lý tưởng để thử nghiệm hoặc hoàn thành dự án ngắn hạn.',
      longDescription: `
        <h2>CapCut Pro - Gói 7 ngày</h2>
        <p>Trải nghiệm đầy đủ các tính năng cao cấp của CapCut Pro trong 7 ngày với giá cực kỳ hấp dẫn.</p>
        
        <h3>Phù hợp cho:</h3>
        <ul>
          <li>Người muốn thử nghiệm trước khi mua dài hạn</li>
          <li>Dự án video ngắn hạn cần hoàn thành nhanh chóng</li>
          <li>Người làm video không thường xuyên</li>
        </ul>
      `,
      imageUrl: '/capcut.png',
      price: 99000,
      salePrice: 69000,
      rating: 4.7,
      downloadCount: 120,
      viewCount: 500,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7',
      ],
    },
    {
      id: 'capcut-pro-1month',
      slug: 'capcut-pro-1month',
      name: 'CapCut Pro - 1 Tháng',
      description:
        'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 1 tháng phù hợp cho các nhà sáng tạo nội dung thường xuyên.',
      longDescription: `
        <h2>CapCut Pro - Gói 1 tháng</h2>
        <p>Gói đăng ký 1 tháng phù hợp với những người làm nội dung thường xuyên nhưng không muốn cam kết dài hạn.</p>
        
        <h3>Lợi ích:</h3>
        <ul>
          <li>Linh hoạt với chi phí hàng tháng hợp lý</li>
          <li>Hủy bất cứ lúc nào</li>
          <li>Cập nhật tính năng mới thường xuyên</li>
        </ul>
      `,
      imageUrl: '/capcut.png',
      price: 290000,
      salePrice: 199000,
      rating: 4.8,
      downloadCount: 280,
      viewCount: 890,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7',
        'Cập nhật tính năng mới ngay khi phát hành',
      ],
    },
    {
      id: 'capcut-pro-2years',
      slug: 'capcut-pro-2years',
      name: 'CapCut Pro - 2 Năm',
      description:
        'Tài khoản CapCut Pro dài hạn với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 2 năm tiết kiệm tối đa, phù hợp cho các studio và nhà sáng tạo nội dung chuyên nghiệp.',
      longDescription: `
        <h2>CapCut Pro - Gói 2 năm</h2>
        <p>Giải pháp tiết kiệm nhất dành cho các nhà sáng tạo nội dung chuyên nghiệp và studio làm phim.</p>
        
        <h3>Ưu điểm vượt trội:</h3>
        <ul>
          <li>Tiết kiệm hơn 70% so với mua hàng tháng</li>
          <li>Không lo về việc gia hạn thường xuyên</li>
          <li>Đảm bảo hoàn tiền trong 30 ngày</li>
          <li>Hỗ trợ kỹ thuật ưu tiên</li>
        </ul>
      `,
      imageUrl: '/capcut.png',
      price: 1990000,
      salePrice: 1290000,
      rating: 4.9,
      downloadCount: 350,
      viewCount: 1100,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn với độ phân giải 4K',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ và cập nhật thường xuyên',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật ưu tiên 24/7',
        'Cập nhật tính năng mới ngay khi phát hành',
        'Đảm bảo hoàn tiền 30 ngày',
        'Hỗ trợ đồng bộ đám mây không giới hạn',
        'Tiết kiệm hơn 70% so với mua hàng tháng',
      ],
    },
  ];

  // Tìm kiếm trong mảng sampleAccounts nếu không tìm thấy trong mockData và locale files
  if (!selectedProduct) {
    // Tìm theo slug trước
    selectedProduct = sampleAccounts.find((p) => p.slug === accountId);

    // Sau đó tìm theo id nếu cần
    if (!selectedProduct) {
      selectedProduct = sampleAccounts.find((p) => p.id === accountId);
    }
  }

  // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
  if (!selectedProduct) {
    console.log(`Không tìm thấy tài khoản với ID hoặc slug: ${accountId}`);
    return notFound();
  }

  // Ghi log thông tin truy cập
  console.log(
    `Người dùng đang xem tài khoản: ${selectedProduct.name} (ID: ${selectedProduct.id}, Slug: ${selectedProduct.slug})`,
  );

  // Truyền dữ liệu sản phẩm sang client component
  return <ProductDetail product={selectedProduct} />;
}
