import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Danh sách các trang đang phát triển
const validSlugs = ['pricing', 'about', 'contact', 'support', 'terms', 'privacy', 'login', 'signup'];

type Props = {
  params: { slug: string[] }
};

// Tạo metadata động dựa trên slug
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug[0];
  
  if (!validSlugs.includes(slug)) {
    return {
      title: 'Trang không tồn tại | XLab',
    };
  }
  
  // Chuyển đổi slug thành title (vd: about -> Giới thiệu)
  const slugToTitle: Record<string, string> = {
    pricing: 'Bảng giá',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    support: 'Hỗ trợ',
    terms: 'Điều khoản sử dụng',
    privacy: 'Chính sách bảo mật',
    login: 'Đăng nhập',
    signup: 'Đăng ký',
  };
  
  return {
    title: `${slugToTitle[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)} | XLab`,
    description: `Trang ${slugToTitle[slug]} của XLab - Phần mềm chất lượng cao`,
  };
}

export default function ComingSoonPage({ params }: Props) {
  const slug = params.slug[0];
  
  if (!validSlugs.includes(slug)) {
    notFound();
  }
  
  const slugToTitle: Record<string, string> = {
    pricing: 'Bảng giá',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    support: 'Hỗ trợ',
    terms: 'Điều khoản sử dụng',
    privacy: 'Chính sách bảo mật',
    login: 'Đăng nhập',
    signup: 'Đăng ký',
  };
  
  return (
    <div className="coming-soon-page">
      <div className="container">
        <div className="coming-soon-content">
          <h1>{slugToTitle[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
          <p>Trang này đang được phát triển và sẽ sớm ra mắt!</p>
          <div className="coming-soon-actions">
            <Link href="/" className="btn btn-primary">Quay lại trang chủ</Link>
            <Link href="/products" className="btn btn-outline">Xem sản phẩm</Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .coming-soon-page {
          padding: 5rem 0;
          text-align: center;
        }
        .coming-soon-content {
          max-width: 600px;
          margin: 0 auto;
        }
        .coming-soon-content h1 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          color: var(--primary-color);
        }
        .coming-soon-content p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          color: var(--dark-gray);
        }
        .coming-soon-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
      `}</style>
    </div>
  );
} 