import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Danh sách bài viết giả định (nên được chuyển vào data service thực tế)
const blogPosts = [
  {
    id: 1,
    title: 'Những xu hướng công nghệ hàng đầu năm 2024',
    content: `
      <p>Năm 2024 đánh dấu sự phát triển mạnh mẽ của nhiều xu hướng công nghệ mới, định hình lại cách chúng ta làm việc, sống và tương tác. Dưới đây là những xu hướng nổi bật nhất:</p>
      
      <h2>1. Trí tuệ nhân tạo tạo sinh (Generative AI)</h2>
      <p>AI tạo sinh đã tiến xa hơn rất nhiều so với năm 2023, với khả năng tạo ra nội dung chất lượng cao từ văn bản, hình ảnh đến mã nguồn. Các công ty đang tích hợp AI tạo sinh vào quy trình làm việc để tăng năng suất và sáng tạo.</p>
      
      <h2>2. Điện toán lượng tử</h2>
      <p>Các đột phá trong lĩnh vực điện toán lượng tử đang mở ra khả năng giải quyết các bài toán phức tạp mà máy tính thông thường không thể xử lý. Ứng dụng trong các lĩnh vực như dược phẩm, tối ưu hóa logistics và mật mã học.</p>
      
      <h2>3. Web3 và công nghệ phi tập trung</h2>
      <p>Các ứng dụng phi tập trung (dApps) và công nghệ blockchain tiếp tục phát triển, hướng tới một internet phi tập trung hơn, người dùng có quyền kiểm soát dữ liệu của mình tốt hơn.</p>
      
      <h2>4. Thực tế mở rộng (XR)</h2>
      <p>Sự kết hợp giữa AR, VR và MR đang tạo ra những trải nghiệm kỹ thuật số mới mẻ trong giáo dục, y tế, và giải trí. Các thiết bị đeo như kính thông minh đang trở nên phổ biến hơn.</p>
      
      <h2>5. Bảo mật zero-trust</h2>
      <p>Mô hình bảo mật "không tin tưởng trước" đang được áp dụng rộng rãi, yêu cầu xác thực liên tục và giới hạn quyền truy cập dựa trên nguyên tắc đặc quyền tối thiểu.</p>
      
      <p>Các xu hướng này không chỉ thay đổi cách chúng ta tương tác với công nghệ mà còn định hình lại toàn bộ ngành công nghiệp và xã hội trong những năm tới.</p>
    `,
    date: '15/3/2024',
    author: 'Nguyễn Văn A',
    slug: 'xu-huong-cong-nghe-2024',
  },
  {
    id: 2,
    title: 'Làm thế nào để tối ưu hóa hiệu suất ứng dụng web của bạn',
    content: `
      <p>Hiệu suất ứng dụng web là yếu tố quan trọng ảnh hưởng trực tiếp đến trải nghiệm người dùng và tỷ lệ chuyển đổi. Dưới đây là những phương pháp hiệu quả để tối ưu hóa hiệu suất:</p>
      
      <h2>1. Tối ưu hóa tài nguyên</h2>
      <p>Nén và tối ưu hình ảnh, JS, CSS. Sử dụng định dạng hình ảnh hiện đại như WebP. Kết hợp và minify các file JavaScript và CSS để giảm số lượng HTTP requests.</p>
      
      <h2>2. Lazy loading</h2>
      <p>Chỉ tải các tài nguyên khi cần thiết. Áp dụng lazy loading cho hình ảnh, video và các thành phần không nằm trong khung nhìn ban đầu.</p>
      
      <h2>3. Caching thông minh</h2>
      <p>Sử dụng các chiến lược caching hiệu quả ở cả client và server. Áp dụng service workers để caching và tạo trải nghiệm offline.</p>
      
      <h2>4. Sử dụng CDN</h2>
      <p>Phân phối nội dung thông qua mạng lưới CDN để giảm độ trễ và tăng tốc độ tải cho người dùng ở các vị trí địa lý khác nhau.</p>
      
      <h2>5. Tối ưu hóa rendering</h2>
      <p>Giảm thiểu DOM reflow và repaint. Sử dụng CSS Transform thay vì điều chỉnh layout. Tối ưu hóa Critical Rendering Path.</p>
      
      <h2>6. Sử dụng công cụ đo lường hiệu suất</h2>
      <p>Giám sát liên tục hiệu suất với các công cụ như Lighthouse, WebPageTest, và Core Web Vitals để xác định vấn đề và đánh giá cải tiến.</p>
      
      <p>Áp dụng những phương pháp này sẽ giúp ứng dụng web của bạn tải nhanh hơn, phản hồi tốt hơn và mang lại trải nghiệm người dùng vượt trội.</p>
    `,
    date: '10/3/2024',
    author: 'Trần Thị B',
    slug: 'toi-uu-hoa-hieu-suat-ung-dung-web',
  },
  {
    id: 3,
    title: 'Bảo mật trong phát triển phần mềm hiện đại',
    content: `
      <p>Bảo mật không còn là một tính năng bổ sung mà đã trở thành yêu cầu cốt lõi trong quá trình phát triển phần mềm hiện đại. Dưới đây là những phương pháp và công cụ quan trọng để đảm bảo bảo mật:</p>
      
      <h2>1. Shift Left Security</h2>
      <p>Đưa bảo mật vào từ giai đoạn đầu của quy trình phát triển. Thực hiện đánh giá rủi ro và mô hình hóa mối đe dọa ngay từ giai đoạn thiết kế.</p>
      
      <h2>2. DevSecOps</h2>
      <p>Tích hợp bảo mật vào quy trình CI/CD. Tự động hóa kiểm tra bảo mật trong pipeline để phát hiện lỗ hổng sớm.</p>
      
      <h2>3. Quản lý bí mật an toàn</h2>
      <p>Sử dụng các giải pháp vault để quản lý khóa và bí mật. Không bao giờ hard-code thông tin nhạy cảm vào mã nguồn.</p>
      
      <h2>4. Sử dụng các frameworks và thư viện bảo mật</h2>
      <p>Áp dụng các frameworks đã được kiểm chứng và cập nhật thường xuyên. Giảm thiểu việc tự phát triển các giải pháp bảo mật riêng.</p>
      
      <h2>5. Xác thực và ủy quyền mạnh mẽ</h2>
      <p>Triển khai xác thực đa yếu tố. Áp dụng nguyên tắc đặc quyền tối thiểu và kiểm soát truy cập dựa trên vai trò (RBAC).</p>
      
      <h2>6. Kiểm thử bảo mật thường xuyên</h2>
      <p>Thực hiện kiểm thử xâm nhập, quét lỗ hổng và rà soát mã nguồn định kỳ. Tham gia các chương trình bug bounty.</p>
      
      <p>Trong thời đại các cuộc tấn công mạng ngày càng tinh vi, việc áp dụng những phương pháp bảo mật chủ động này là điều cần thiết để bảo vệ phần mềm và dữ liệu người dùng.</p>
    `,
    date: '1/3/2024',
    author: 'Phạm Văn C',
    slug: 'bao-mat-phat-trien-phan-mem-hien-dai',
  },
];

// Tạo metadata động dựa trên slug
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Bài viết không tồn tại | XLab Web',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }
  
  return {
    title: `${post.title} | XLab Web Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  // Nếu không tìm thấy bài viết, chuyển hướng đến trang 404
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
        <svg className="w-4 h-4 mr-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
        Quay lại Blog
      </Link>
      
      <article className="bg-white rounded-lg shadow-md p-6 mt-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-6">{post.date} • Tác giả: {post.author}</p>
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h3>
          <div className="flex space-x-4">
            <button className="text-blue-600 hover:text-blue-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="text-blue-400 hover:text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button className="text-blue-700 hover:text-blue-900">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
} 