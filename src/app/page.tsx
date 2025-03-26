import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'XLab - Phần mềm chất lượng cao',
  description: 'XLab cung cấp các phần mềm chất lượng cao với giá cả phải chăng. Khám phá ngay!',
};

// Tách các SVG icons thành components để tái sử dụng và tối ưu hóa
const InfinityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const UpdateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="16 12 12 8 8 12"></polyline>
    <line x1="12" y1="16" x2="12" y2="8"></line>
  </svg>
);

// Định nghĩa interfaces cho props của components
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  link: string;
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

// Tách thành các components riêng biệt để dễ quản lý và bảo trì
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const ProductCard = ({ title, description, price, link }: ProductCardProps) => (
  <div className="product-card">
    <div className="product-image">
      {/* Placeholder for product image */}
    </div>
    <div className="product-content">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="product-price">
        <span className="price">{price}</span>
        <Link href={link} className="btn btn-primary">Chi tiết</Link>
      </div>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, role, company }: TestimonialCardProps) => (
  <div className="testimonial-card">
    <p>"{quote}"</p>
    <div className="testimonial-author">
      <div className="author-avatar">
        {/* Avatar placeholder */}
      </div>
      <div className="author-info">
        <h4>{author}</h4>
        <p>{role}, {company}</p>
      </div>
    </div>
  </div>
);

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
            <FeatureCard 
              icon={<InfinityIcon />}
              title="Thiết kế hiện đại"
              description="Giao diện người dùng trực quan, thân thiện và đáp ứng trên mọi thiết bị."
            />
            <FeatureCard 
              icon={<ShieldIcon />}
              title="Bảo mật tối đa"
              description="Chúng tôi ưu tiên bảo mật dữ liệu với các công nghệ mã hóa và kiểm soát truy cập tiên tiến."
            />
            <FeatureCard 
              icon={<UpdateIcon />}
              title="Cập nhật liên tục"
              description="Phần mềm của chúng tôi luôn được cập nhật với các tính năng mới và cải tiến hiệu suất."
            />
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
            <ProductCard 
              title="XLab Analytics"
              description="Giải pháp phân tích dữ liệu hiện đại giúp doanh nghiệp ra quyết định thông minh."
              price="1.990.000đ"
              link="/products/analytics"
            />
            <ProductCard 
              title="XLab Security"
              description="Bảo vệ dữ liệu quan trọng của bạn với giải pháp bảo mật toàn diện."
              price="2.490.000đ"
              link="/products/security"
            />
            <ProductCard 
              title="XLab Developer"
              description="Bộ công cụ phát triển phần mềm cao cấp cho các lập trình viên chuyên nghiệp."
              price="1.790.000đ"
              link="/products/developer"
            />
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
            <TestimonialCard 
              quote="XLab Analytics đã giúp công ty chúng tôi hiểu rõ hơn về hành vi khách hàng và tối ưu hóa chiến lược kinh doanh. Một công cụ tuyệt vời!"
              author="Nguyễn Văn A"
              role="Giám đốc Marketing"
              company="Công ty ABC"
            />
            <TestimonialCard 
              quote="Bảo mật là ưu tiên hàng đầu của chúng tôi, và XLab Security cung cấp giải pháp toàn diện mà chúng tôi cần. Đáng đồng tiền bát gạo!"
              author="Trần Thị B"
              role="Giám đốc CNTT"
              company="Công ty XYZ"
            />
            <TestimonialCard 
              quote="XLab Developer đã tăng hiệu suất của team lập trình chúng tôi lên đáng kể. Giao diện trực quan, tính năng đa dạng và hiệu suất cao."
              author="Lê Văn C"
              role="Tech Lead"
              company="Startup DEF"
            />
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