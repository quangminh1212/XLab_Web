'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductTabsInit } from './product-tabs';

// Dữ liệu mẫu cho sản phẩm (giống trang products, sẽ được thay bằng dữ liệu thực tế từ API/DB)
const products = [
  {
    id: 'analytics',
    name: 'XLab Analytics',
    description: 'Giải pháp phân tích dữ liệu hiện đại giúp doanh nghiệp ra quyết định thông minh.',
    longDescription: `
      <p>XLab Analytics là giải pháp phân tích dữ liệu hiện đại được thiết kế dành cho doanh nghiệp mọi quy mô. Với công nghệ xử lý dữ liệu tiên tiến, XLab Analytics giúp biến đổi dữ liệu thô thành thông tin hữu ích, hỗ trợ người dùng đưa ra quyết định kinh doanh thông minh và hiệu quả.</p>
      <p>Giao diện trực quan, dễ sử dụng cùng với khả năng tùy chỉnh báo cáo linh hoạt, XLab Analytics cho phép bạn khai thác tối đa giá trị từ dữ liệu của mình mà không cần kiến thức chuyên sâu về phân tích dữ liệu.</p>
    `,
    price: '1.990.000đ',
    oldPrice: '2.490.000đ',
    sales: 1250,
    rating: 4.8,
    reviews: [
      {
        id: 1,
        user: 'Nguyễn Văn A',
        avatar: '/images/avatars/user1.jpg',
        rating: 5,
        date: '2024-03-15',
        content: 'Sản phẩm rất tốt, dễ sử dụng và có nhiều tính năng hữu ích. Tôi đã sử dụng được 6 tháng và rất hài lòng.',
        likes: 12,
        replies: [
          {
            id: 2,
            user: 'XLab Support',
            avatar: '/images/avatars/support.jpg',
            date: '2024-03-16',
            content: 'Cảm ơn bạn đã đánh giá tích cực về sản phẩm. Chúng tôi sẽ tiếp tục cải thiện để phục vụ bạn tốt hơn.',
            likes: 3
          }
        ]
      },
      {
        id: 3,
        user: 'Trần Thị B',
        avatar: '/images/avatars/user2.jpg',
        rating: 4,
        date: '2024-03-10',
        content: 'Tốt nhưng cần thêm một số tính năng nâng cao. Hy vọng sẽ được cập nhật trong phiên bản tiếp theo.',
        likes: 8
      }
    ],
    features: [
      'Phân tích dữ liệu thời gian thực',
      'Báo cáo tùy chỉnh',
      'Tích hợp với nhiều nguồn dữ liệu',
      'Giao diện trực quan dễ sử dụng',
      'Hỗ trợ xuất báo cáo nhiều định dạng',
      'Theo dõi xu hướng và dự báo',
      'Cảnh báo thông minh',
      'Phân quyền người dùng chi tiết',
      'Hỗ trợ đa ngôn ngữ',
      'Sao lưu và khôi phục dữ liệu tự động',
    ],
    specifications: {
      'Hệ điều hành hỗ trợ': 'Windows, macOS, Linux',
      'Yêu cầu hệ thống': 'CPU 2GHz, RAM 4GB, 500MB dung lượng trống',
      'Định dạng xuất dữ liệu': 'PDF, Excel, CSV, JSON',
      'Kết nối dữ liệu': 'API, SQL, CSV, Excel',
      'Hỗ trợ đa ngôn ngữ': 'Tiếng Việt, Tiếng Anh, Tiếng Trung, Tiếng Nhật',
      'Bảo mật': 'Mã hóa AES-256, xác thực hai yếu tố',
      'Cập nhật': 'Tự động, hàng tháng',
      'Hỗ trợ kỹ thuật': '24/7 qua email và điện thoại',
    },
    faq: [
      {
        question: 'XLab Analytics có yêu cầu cài đặt phức tạp không?',
        answer: 'Không, XLab Analytics cung cấp quy trình cài đặt đơn giản với trình cài đặt tự động. Bạn cũng có thể lựa chọn phiên bản đám mây không cần cài đặt.'
      },
      {
        question: 'Tôi có thể tích hợp XLab Analytics với các phần mềm khác không?',
        answer: 'Có, XLab Analytics cung cấp API đầy đủ cho phép tích hợp với hầu hết các phần mềm quản lý doanh nghiệp, CRM, ERP và các nguồn dữ liệu phổ biến.'
      },
      {
        question: 'Dữ liệu của tôi có được bảo mật khi sử dụng XLab Analytics không?',
        answer: 'Tuyệt đối, XLab Analytics sử dụng mã hóa tiêu chuẩn ngành AES-256 cho dữ liệu và hỗ trợ xác thực hai yếu tố để đảm bảo chỉ những người được ủy quyền mới có thể truy cập dữ liệu của bạn.'
      },
      {
        question: 'XLab Analytics có phù hợp với doanh nghiệp nhỏ không?',
        answer: 'Có, chúng tôi cung cấp các gói dịch vụ khác nhau phù hợp với mọi quy mô doanh nghiệp, từ startup đến doanh nghiệp lớn.'
      },
    ],
  },
  {
    id: 'security',
    name: 'XLab Security',
    description: 'Bảo vệ dữ liệu quan trọng của bạn với giải pháp bảo mật toàn diện.',
    longDescription: `
      <p>XLab Security là giải pháp bảo mật toàn diện giúp bảo vệ dữ liệu và hệ thống của doanh nghiệp trước các mối đe dọa ngày càng phức tạp. Với kiến trúc bảo mật nhiều lớp, XLab Security cung cấp sự bảo vệ mạnh mẽ mà không làm ảnh hưởng đến hiệu suất hệ thống.</p>
      <p>Phần mềm được trang bị công nghệ phát hiện mối đe dọa tiên tiến, có khả năng phát hiện và ngăn chặn các cuộc tấn công mới nhất, đồng thời cung cấp các công cụ quản lý quyền truy cập chi tiết, giúp kiểm soát chặt chẽ việc truy cập vào tài nguyên quan trọng.</p>
    `,
    price: '2.490.000đ',
    oldPrice: '2.990.000đ',
    sales: 1000,
    rating: 4.7,
    reviews: [
      {
        id: 4,
        user: 'Nguyễn Thị C',
        avatar: '/images/avatars/user3.jpg',
        rating: 5,
        date: '2024-03-12',
        content: 'Sản phẩm rất tốt, bảo mật mạnh mẽ và hiệu quả. Tôi đã sử dụng được 3 tháng và rất hài lòng.',
        likes: 15
      },
      {
        id: 5,
        user: 'Trần Văn D',
        avatar: '/images/avatars/user4.jpg',
        rating: 4,
        date: '2024-03-05',
        content: 'Tốt nhưng cần thêm một số tính năng nâng cao. Hy vọng sẽ được cập nhật trong phiên bản tiếp theo.',
        likes: 10
      }
    ],
    features: [
      'Mã hóa dữ liệu đầu cuối',
      'Xác thực đa yếu tố',
      'Phát hiện xâm nhập thời gian thực',
      'Quản lý quyền truy cập',
      'Sao lưu tự động và phục hồi dữ liệu',
      'Bảo vệ chống ransomware',
      'Quét lỗ hổng bảo mật',
      'Tường lửa ứng dụng web',
      'Kiểm tra tuân thủ bảo mật',
      'Giám sát hành vi người dùng',
    ],
    specifications: {
      'Hệ điều hành hỗ trợ': 'Windows, macOS, Linux',
      'Yêu cầu hệ thống': 'CPU 2.5GHz, RAM 8GB, 1GB dung lượng trống',
      'Chuẩn mã hóa': 'AES-256, RSA-2048',
      'Tích hợp': 'Active Directory, LDAP, OAuth',
      'Giám sát': 'Thời gian thực, 24/7',
      'Bảo mật': 'Zero Trust Architecture, MFA',
      'Cập nhật': 'Tự động, hàng tuần',
      'Hỗ trợ kỹ thuật': '24/7 qua email, điện thoại và chat',
    },
    faq: [
      {
        question: 'XLab Security có thể bảo vệ doanh nghiệp khỏi các cuộc tấn công ransomware không?',
        answer: 'Có, XLab Security cung cấp nhiều lớp bảo vệ chống ransomware, bao gồm giám sát hành vi tệp, bảo vệ thời gian thực và các bản sao lưu tự động với khả năng khôi phục nhanh chóng.'
      },
      {
        question: 'XLab Security có ảnh hưởng đến hiệu suất máy tính không?',
        answer: 'XLab Security được thiết kế để có tác động tối thiểu đến hiệu suất hệ thống. Công nghệ quét thông minh và tối ưu hóa tài nguyên đảm bảo bảo mật mạnh mẽ mà không làm chậm các hoạt động của người dùng.'
      },
      {
        question: 'Làm thế nào XLab Security có thể giúp doanh nghiệp tuân thủ các quy định về bảo mật?',
        answer: 'XLab Security bao gồm các công cụ kiểm tra tuân thủ và báo cáo tự động giúp doanh nghiệp duy trì tuân thủ các tiêu chuẩn và quy định bảo mật như GDPR, PCI DSS, HIPAA và các quy định khác.'
      },
      {
        question: 'XLab Security có thể tích hợp với hệ thống quản lý danh tính hiện có không?',
        answer: 'Có, XLab Security tích hợp liền mạch với các hệ thống quản lý danh tính như Active Directory, LDAP, và các giải pháp SSO phổ biến khác.'
      },
    ],
  },
  {
    id: 'developer',
    name: 'XLab Developer',
    description: 'Bộ công cụ phát triển phần mềm cao cấp cho các lập trình viên chuyên nghiệp.',
    longDescription: `
      <p>XLab Developer là bộ công cụ phát triển phần mềm toàn diện, được thiết kế để tăng năng suất và chất lượng code cho các lập trình viên và team phát triển. Với môi trường phát triển tích hợp thông minh và nhiều tính năng tự động hóa, XLab Developer giúp rút ngắn thời gian phát triển và cải thiện chất lượng sản phẩm cuối cùng.</p>
      <p>Hỗ trợ đa dạng ngôn ngữ lập trình, tích hợp sâu với các công cụ CI/CD hiện đại và cung cấp những công cụ phân tích mã nguồn mạnh mẽ, XLab Developer là giải pháp lý tưởng cho các nhóm phát triển phần mềm chuyên nghiệp.</p>
    `,
    price: '1.790.000đ',
    oldPrice: '2.290.000đ',
    sales: 800,
    rating: 4.6,
    reviews: [
      {
        id: 6,
        user: 'Nguyễn Thị E',
        avatar: '/images/avatars/user5.jpg',
        rating: 5,
        date: '2024-03-08',
        content: 'Sản phẩm rất tốt, giúp tăng năng suất và chất lượng code. Tôi đã sử dụng được 2 tháng và rất hài lòng.',
        likes: 10
      },
      {
        id: 7,
        user: 'Trần Văn F',
        avatar: '/images/avatars/user6.jpg',
        rating: 4,
        date: '2024-03-02',
        content: 'Tốt nhưng cần thêm một số tính năng nâng cao. Hy vọng sẽ được cập nhật trong phiên bản tiếp theo.',
        likes: 7
      }
    ],
    features: [
      'Môi trường phát triển tích hợp',
      'Hỗ trợ nhiều ngôn ngữ lập trình',
      'Công cụ phân tích mã nguồn',
      'Tự động hóa quy trình CI/CD',
      'Quản lý phiên bản và hợp tác',
      'Gỡ lỗi mạnh mẽ',
      'Tích hợp kiểm thử tự động',
      'Tối ưu hóa hiệu suất code',
      'Hoàn thành code thông minh',
      'Đề xuất cải thiện code',
    ],
    specifications: {
      'Hệ điều hành hỗ trợ': 'Windows, macOS, Linux',
      'Yêu cầu hệ thống': 'CPU 2GHz, RAM 8GB, 2GB dung lượng trống',
      'Ngôn ngữ hỗ trợ': 'JavaScript, TypeScript, Python, Java, C#, C++, PHP, Ruby',
      'Tích hợp': 'Git, GitHub, GitLab, Bitbucket, Jenkins, Docker',
      'Kiểm thử': 'Unit Testing, Integration Testing, E2E Testing',
      'CI/CD': 'Jenkins, GitHub Actions, GitLab CI, Azure DevOps',
      'Cập nhật': 'Tự động, hàng tháng',
      'Hỗ trợ kỹ thuật': '24/7 qua email và chat đặc biệt cho nhà phát triển',
    },
    faq: [
      {
        question: 'XLab Developer có phù hợp với dự án quy mô lớn không?',
        answer: 'Có, XLab Developer được thiết kế để xử lý các dự án quy mô lớn với hiệu suất cao và các công cụ quản lý code mạnh mẽ. Nó bao gồm các tính năng quản lý phiên bản, phân nhánh và hợp nhất code hiệu quả.'
      },
      {
        question: 'Tôi có thể tích hợp XLab Developer với các công cụ CI/CD hiện có không?',
        answer: 'Có, XLab Developer tích hợp liền mạch với các công cụ CI/CD phổ biến như Jenkins, GitHub Actions, GitLab CI, Azure DevOps và nhiều hệ thống khác.'
      },
      {
        question: 'XLab Developer có hỗ trợ phát triển ứng dụng di động không?',
        answer: 'Có, XLab Developer hỗ trợ phát triển ứng dụng di động cho iOS và Android, bao gồm cả các framework phổ biến như React Native, Flutter và các SDK gốc.'
      },
      {
        question: 'XLab Developer có hỗ trợ làm việc nhóm không?',
        answer: 'Tuyệt đối có. XLab Developer bao gồm các công cụ hợp tác mạnh mẽ như code sharing, pair programming, code review, và tích hợp với các nền tảng quản lý dự án.'
      },
    ],
  },
];

type Props = {
  params: { id: string }
};

// Cung cấp các đường dẫn tĩnh cho Next.js build
export async function generateStaticParams() {
  return products.map(product => ({
    id: product.id,
  }));
}

export default function ProductDetail({ params }: Props) {
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-breadcrumb">
          <Link href="/">Trang chủ</Link> &gt; <Link href="/products">Sản phẩm</Link> &gt; <span>{product.name}</span>
        </div>

        <div className="product-hero">
          <div className="product-image-container">
            <div className="product-image">
              {/* Placeholder for product image */}
            </div>
            <div className="product-thumbnails">
              <div className="thumbnail active"></div>
              <div className="thumbnail"></div>
              <div className="thumbnail"></div>
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="product-description">{product.description}</p>

            <div className="product-meta">
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <span className="rating-value">{product.rating}</span>
                <span className="rating-count">({product.reviews.length} đánh giá)</span>
              </div>
              <div className="product-sales">
                <span className="sales-count">{product.sales.toLocaleString()}</span>
                <span className="sales-label">lượt bán</span>
              </div>
            </div>

            <div className="product-price-container">
              <div className="price-box">
                <span className="current-price">{product.price}</span>
                {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
              </div>

              <div className="product-actions">
                <button className="btn btn-primary">Mua ngay</button>
                <button className="btn btn-outline">Thêm vào giỏ hàng</button>
              </div>
            </div>

            <div className="product-features-highlight">
              <h3>Tính năng nổi bật</h3>
              <ul>
                {product.features.slice(0, 5).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <div className="tabs-header">
            <button className="tab-btn active">Mô tả</button>
            <button className="tab-btn">Thông số kỹ thuật</button>
            <button className="tab-btn">Tính năng</button>
            <button className="tab-btn">Đánh giá ({product.reviews.length})</button>
            <button className="tab-btn">FAQ</button>
          </div>

          <div className="tab-content active">
            <div className="product-description-full" dangerouslySetInnerHTML={{ __html: product.longDescription }}></div>
          </div>

          <div className="tab-content">
            <div className="product-specifications">
              <h3>Thông số kỹ thuật</h3>
              <table>
                <tbody>
                  {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                    <tr key={index}>
                      <td className="spec-name">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tab-content">
            <div className="product-features-full">
              <h3>Tất cả tính năng</h3>
              <ul className="features-list">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tab-content">
            <div className="product-reviews">
              <div className="reviews-summary">
                <div className="rating-overview">
                  <div className="rating-average">
                    <span className="rating-number">{product.rating}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                    <span className="rating-count">{product.reviews.length} đánh giá</span>
                  </div>
                  <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = product.reviews.filter(r => r.rating === star).length;
                      const percentage = (count / product.reviews.length) * 100;
                      return (
                        <div key={star} className="rating-bar">
                          <span className="star-label">{star} sao</span>
                          <div className="bar-container">
                            <div className="bar" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="bar-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="reviews-list">
                {product.reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="review-user">
                        <img src={review.avatar} alt={review.user} className="user-avatar" />
                        <div className="user-info">
                          <span className="user-name">{review.user}</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="review-content">
                      <p>{review.content}</p>
                      <div className="review-actions">
                        <button className="btn-like">
                          <span className="icon">👍</span>
                          <span className="count">{review.likes}</span>
                        </button>
                        <button className="btn-reply">Trả lời</button>
                      </div>
                    </div>
                    {review.replies && review.replies.map((reply) => (
                      <div key={reply.id} className="review-reply">
                        <div className="reply-header">
                          <div className="reply-user">
                            <img src={reply.avatar} alt={reply.user} className="user-avatar" />
                            <div className="user-info">
                              <span className="user-name">{reply.user}</span>
                            </div>
                          </div>
                          <span className="reply-date">{new Date(reply.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="reply-content">
                          <p>{reply.content}</p>
                          <div className="reply-actions">
                            <button className="btn-like">
                              <span className="icon">👍</span>
                              <span className="count">{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="review-form">
                <h3>Viết đánh giá của bạn</h3>
                <form>
                  <div className="form-group">
                    <label>Đánh giá sao</label>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" className="star-btn">★</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nội dung đánh giá</label>
                    <textarea rows={5} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Gửi đánh giá</button>
                </form>
              </div>
            </div>
          </div>

          <div className="tab-content">
            <div className="product-faq">
              <h3>Câu hỏi thường gặp</h3>
              <div className="faq-list">
                {product.faq && product.faq.map((item, index) => (
                  <div className="faq-item" key={index}>
                    <div className="faq-question">
                      <h4>{item.question}</h4>
                      <span className="faq-toggle">+</span>
                    </div>
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="related-products">
          <h2>Sản phẩm liên quan</h2>
          <div className="products-grid">
            {products
              .filter(p => p.id !== params.id)
              .slice(0, 3)
              .map(relatedProduct => (
                <div className="product-card" key={relatedProduct.id}>
                  <div className="product-image">
                    {/* Placeholder for product image */}
                  </div>
                  <div className="product-content">
                    <h3>{relatedProduct.name}</h3>
                    <p>{relatedProduct.description}</p>
                    <div className="product-meta">
                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < Math.floor(relatedProduct.rating) ? 'filled' : ''}`}>★</span>
                          ))}
                        </div>
                        <span className="rating-value">{relatedProduct.rating}</span>
                      </div>
                      <div className="product-sales">
                        <span className="sales-count">{relatedProduct.sales.toLocaleString()}</span>
                        <span className="sales-label">lượt bán</span>
                      </div>
                    </div>
                    <div className="product-price">
                      <span className="price">{relatedProduct.price}</span>
                      <Link href={`/products/${relatedProduct.id}`} className="btn btn-primary">Chi tiết</Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <ProductTabsInit />
    </div>
  );
} 