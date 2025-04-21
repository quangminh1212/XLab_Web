import { products as mockProducts } from '@/data/mockData';
import ProductDetail from '@/app/products/[id]/ProductDetail';
import { notFound } from 'next/navigation';

export default function AccountPage({ params }: { params: { id: string } }) {
  // Tìm sản phẩm từ mockData
  const product = mockProducts.find((p) => p.slug === params.id && (p.isAccount || p.type === 'account'));

  // Thêm dữ liệu mẫu cho các sản phẩm CapCut Pro
  const sampleAccounts = [
    {
      id: 'capcut-pro-7days',
      slug: 'capcut-pro-7days',
      name: 'CapCut Pro - 7 Ngày',
      description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 7 ngày lý tưởng để thử nghiệm hoặc hoàn thành dự án ngắn hạn.',
      imageUrl: '/images/products/photo-editor.png',
      price: 99000,
      salePrice: 69000,
      rating: 4.7,
      downloadCount: 120,
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7'
      ]
    },
    {
      id: 'capcut-pro-1month',
      slug: 'capcut-pro-1month',
      name: 'CapCut Pro - 1 Tháng',
      description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 1 tháng phù hợp cho các nhà sáng tạo nội dung thường xuyên.',
      imageUrl: '/images/products/photo-editor.png',
      price: 290000,
      salePrice: 199000,
      rating: 4.8,
      downloadCount: 280,
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7',
        'Cập nhật tính năng mới ngay khi phát hành'
      ]
    },
    {
      id: 'capcut-pro-2years',
      slug: 'capcut-pro-2years',
      name: 'CapCut Pro - 2 Năm',
      description: 'Tài khoản CapCut Pro dài hạn với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 2 năm tiết kiệm tối đa, phù hợp cho các studio và nhà sáng tạo nội dung chuyên nghiệp.',
      imageUrl: '/images/products/photo-editor.png',
      price: 1990000,
      salePrice: 1290000,
      rating: 4.9,
      downloadCount: 350,
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
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
        'Tiết kiệm hơn 70% so với mua hàng tháng'
      ]
    }
  ];

  // Tìm kiếm trong mảng sampleAccounts nếu không tìm thấy trong mockData
  let selectedProduct = product;
  if (!selectedProduct) {
    selectedProduct = sampleAccounts.find(p => p.slug === params.id);
  }

  // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
  if (!selectedProduct) {
    return notFound();
  }

  // Truyền dữ liệu sản phẩm sang client component
  return <ProductDetail product={selectedProduct} />;
} 