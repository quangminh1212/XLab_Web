import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3>XLab</h3>
                        <p>Công ty phát triển phần mềm chất lượng cao tại Việt Nam</p>
                        <div className="social-links">
                            <Link href="https://facebook.com/xlabvn" aria-label="Facebook">
                                <i className="fab fa-facebook"></i>
                            </Link>
                            <Link href="https://twitter.com/xlabvn" aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </Link>
                            <Link href="https://linkedin.com/company/xlabvn" aria-label="LinkedIn">
                                <i className="fab fa-linkedin"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Sản phẩm</h4>
                        <ul>
                            <li><Link href="/products/analytics">XLab Analytics</Link></li>
                            <li><Link href="/products/security">XLab Security</Link></li>
                            <li><Link href="/products/developer">XLab Developer</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Hỗ trợ</h4>
                        <ul>
                            <li><Link href="/support/documentation">Tài liệu</Link></li>
                            <li><Link href="/support/faq">FAQ</Link></li>
                            <li><Link href="/support/community">Cộng đồng</Link></li>
                            <li><Link href="/support/ticket">Gửi yêu cầu hỗ trợ</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Liên hệ</h4>
                        <address>
                            <p>Số 10, Đường Trần Phú, Hà Nội</p>
                            <p>Email: info@xlab.vn</p>
                            <p>Điện thoại: +84 123 456 789</p>
                        </address>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} XLab. Tất cả quyền được bảo lưu.</p>
                    <div className="footer-links">
                        <Link href="/privacy">Chính sách bảo mật</Link>
                        <Link href="/terms">Điều khoản sử dụng</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
} 