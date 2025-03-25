import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Không tìm thấy trang | XLab',
  description: 'Trang bạn đang tìm kiếm không tồn tại.',
};

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Không tìm thấy trang</h2>
          <p>Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
          <div className="not-found-actions">
            <Link href="/" className="btn btn-primary">Quay lại trang chủ</Link>
            <Link href="/products" className="btn btn-outline">Xem sản phẩm</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 