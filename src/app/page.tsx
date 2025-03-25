import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XLab - Phần mềm chất lượng cao',
  description: 'XLab cung cấp các phần mềm chất lượng cao với giá cả phải chăng. Khám phá ngay!',
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Phần mềm hiệu quả cho doanh nghiệp của bạn</h1>
            <p>XLab cung cấp các giải pháp phần mềm hiện đại, tối ưu hóa quy trình và tăng hiệu suất cho doanh nghiệp mọi quy mô.</p>
            <div className="hero-buttons">
              <Link href="/products" className="btn btn-light">Khám phá sản phẩm</Link>
              <Link href="/contact" className="btn btn-outline">Liên hệ ngay</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Tại sao chọn XLab?</h2>
            <p>Chúng tôi phát triển phần mềm với sự tập trung vào trải nghiệm người dùng, hiệu suất và bảo mật.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                </svg>
              </div>
              <h3>Thiết kế hiện đại</h3>
              <p>Giao diện người dùng trực quan, thân thiện và đáp ứng trên mọi thiết bị.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Bảo mật tối đa</h3>
              <p>Chúng tôi ưu tiên bảo mật dữ liệu với các công nghệ mã hóa và kiểm soát truy cập tiên tiến.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="16 12 12 8 8 12"></polyline>
                  <line x1="12" y1="16" x2="12" y2="8"></line>
                </svg>
              </div>
              <h3>Cập nhật liên tục</h3>
              <p>Phần mềm của chúng tôi luôn được cập nhật với các tính năng mới và cải tiến hiệu suất.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products">
        <div className="container">
          <div className="section-title">
            <h2>Sản phẩm nổi bật</h2>
            <p>Khám phá các giải pháp phần mềm chuyên nghiệp của chúng tôi.</p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                {/* Placeholder for product image */}
              </div>
              <div className="product-content">
                <h3>XLab Analytics</h3>
                <p>Giải pháp phân tích dữ liệu hiện đại giúp doanh nghiệp ra quyết định thông minh.</p>
                <div className="product-price">
                  <span className="price">1.990.000đ</span>
                  <Link href="/products/analytics" className="btn btn-primary">Chi tiết</Link>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                {/* Placeholder for product image */}
              </div>
              <div className="product-content">
                <h3>XLab Security</h3>
                <p>Bảo vệ dữ liệu quan trọng của bạn với giải pháp bảo mật toàn diện.</p>
                <div className="product-price">
                  <span className="price">2.490.000đ</span>
                  <Link href="/products/security" className="btn btn-primary">Chi tiết</Link>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                {/* Placeholder for product image */}
              </div>
              <div className="product-content">
                <h3>XLab Developer</h3>
                <p>Bộ công cụ phát triển phần mềm cao cấp cho các lập trình viên chuyên nghiệp.</p>
                <div className="product-price">
                  <span className="price">1.790.000đ</span>
                  <Link href="/products/developer" className="btn btn-primary">Chi tiết</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>Khách hàng nói gì về chúng tôi</h2>
            <p>Những đánh giá từ khách hàng đã sử dụng sản phẩm của XLab.</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"XLab Analytics đã giúp công ty chúng tôi hiểu rõ hơn về hành vi khách hàng và tối ưu hóa chiến lược kinh doanh. Một công cụ tuyệt vời!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {/* Avatar placeholder */}
                </div>
                <div className="author-info">
                  <h4>Nguyễn Văn A</h4>
                  <p>Giám đốc Marketing, Công ty ABC</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"Bảo mật là ưu tiên hàng đầu của chúng tôi, và XLab Security cung cấp giải pháp toàn diện mà chúng tôi cần. Đáng đồng tiền bát gạo!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {/* Avatar placeholder */}
                </div>
                <div className="author-info">
                  <h4>Trần Thị B</h4>
                  <p>Giám đốc CNTT, Công ty XYZ</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"XLab Developer đã tăng hiệu suất của team lập trình chúng tôi lên đáng kể. Giao diện trực quan, tính năng đa dạng và hiệu suất cao."</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {/* Avatar placeholder */}
                </div>
                <div className="author-info">
                  <h4>Lê Văn C</h4>
                  <p>Tech Lead, Startup DEF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng nâng cao hiệu suất doanh nghiệp của bạn?</h2>
            <p>Đăng ký ngay hôm nay để trải nghiệm các giải pháp phần mềm chất lượng cao của XLab.</p>
            <Link href="/signup" className="btn">Đăng ký ngay</Link>
          </div>
        </div>
      </section>
    </>
  );
} 