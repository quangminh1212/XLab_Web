import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm | XLab - Phần mềm chất lượng cao',
  description: 'Khám phá danh sách sản phẩm phần mềm chất lượng cao của XLab. Tìm giải pháp phù hợp cho doanh nghiệp của bạn.',
};

// Dữ liệu mẫu cho sản phẩm
const products = [
  {
    id: 'analytics',
    name: 'XLab Analytics',
    description: 'Giải pháp phân tích dữ liệu hiện đại giúp doanh nghiệp ra quyết định thông minh.',
    shortDescription: 'Biến dữ liệu thành thông tin hữu ích cho doanh nghiệp của bạn.',
    price: '1.990.000đ',
    features: [
      'Phân tích dữ liệu thời gian thực',
      'Báo cáo tùy chỉnh',
      'Tích hợp với nhiều nguồn dữ liệu',
      'Giao diện trực quan dễ sử dụng',
      'Hỗ trợ xuất báo cáo nhiều định dạng',
    ],
  },
  {
    id: 'security',
    name: 'XLab Security',
    description: 'Bảo vệ dữ liệu quan trọng của bạn với giải pháp bảo mật toàn diện.',
    shortDescription: 'Giải pháp bảo mật toàn diện cho doanh nghiệp.',
    price: '2.490.000đ',
    features: [
      'Mã hóa dữ liệu đầu cuối',
      'Xác thực đa yếu tố',
      'Phát hiện xâm nhập thời gian thực',
      'Quản lý quyền truy cập',
      'Sao lưu tự động và phục hồi dữ liệu',
    ],
  },
  {
    id: 'developer',
    name: 'XLab Developer',
    description: 'Bộ công cụ phát triển phần mềm cao cấp cho các lập trình viên chuyên nghiệp.',
    shortDescription: 'Nâng cao năng suất phát triển phần mềm.',
    price: '1.790.000đ',
    features: [
      'Môi trường phát triển tích hợp',
      'Hỗ trợ nhiều ngôn ngữ lập trình',
      'Công cụ phân tích mã nguồn',
      'Tự động hóa quy trình CI/CD',
      'Quản lý phiên bản và hợp tác',
    ],
  },
  {
    id: 'design',
    name: 'XLab Design',
    description: 'Công cụ thiết kế chuyên nghiệp cho các nhà thiết kế và doanh nghiệp.',
    shortDescription: 'Thiết kế đẹp mắt, chuyên nghiệp với giao diện dễ sử dụng.',
    price: '1.590.000đ',
    features: [
      'Thiết kế giao diện người dùng',
      'Thư viện mẫu và biểu tượng phong phú',
      'Công cụ tạo prototype tương tác',
      'Hỗ trợ thiết kế đáp ứng',
      'Xuất thiết kế sang nhiều định dạng',
    ],
  },
  {
    id: 'crm',
    name: 'XLab CRM',
    description: 'Quản lý quan hệ khách hàng hiệu quả với giao diện thân thiện.',
    shortDescription: 'Tối ưu hóa quy trình bán hàng và chăm sóc khách hàng.',
    price: '2.190.000đ',
    features: [
      'Quản lý thông tin khách hàng',
      'Theo dõi cơ hội bán hàng',
      'Tự động hóa email marketing',
      'Báo cáo hiệu suất bán hàng',
      'Tích hợp với nhiều nền tảng',
    ],
  },
  {
    id: 'erp',
    name: 'XLab ERP',
    description: 'Giải pháp hoạch định nguồn lực doanh nghiệp toàn diện.',
    shortDescription: 'Tối ưu quy trình kinh doanh và tăng hiệu quả quản lý.',
    price: '3.290.000đ',
    features: [
      'Quản lý tài chính kế toán',
      'Quản lý nhân sự và tiền lương',
      'Quản lý chuỗi cung ứng',
      'Quản lý sản xuất',
      'Báo cáo phân tích kinh doanh',
    ],
  },
];

export default function ProductsPage() {
  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Sản phẩm phần mềm</h1>
          <p>Khám phá các giải pháp phần mềm chất lượng cao của XLab</p>
        </div>
        
        <div className="products-filter">
          <div className="filter-options">
            <select name="category" id="category">
              <option value="">Tất cả danh mục</option>
              <option value="business">Quản lý doanh nghiệp</option>
              <option value="security">Bảo mật</option>
              <option value="development">Phát triển phần mềm</option>
            </select>
            <select name="price" id="price">
              <option value="">Tất cả giá</option>
              <option value="low">Dưới 2 triệu</option>
              <option value="medium">2 - 3 triệu</option>
              <option value="high">Trên 3 triệu</option>
            </select>
          </div>
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." />
            <button className="btn btn-primary">Tìm kiếm</button>
          </div>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                {/* Placeholder for product image */}
              </div>
              <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.shortDescription}</p>
                <ul className="product-features">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <div className="product-price">
                  <span className="price">{product.price}</span>
                  <Link href={`/products/${product.id}`} className="btn btn-primary">Chi tiết</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pagination">
          <button className="btn btn-light">Trước</button>
          <div className="page-numbers">
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
          </div>
          <button className="btn btn-light">Sau</button>
        </div>
      </div>
    </div>
  );
} 