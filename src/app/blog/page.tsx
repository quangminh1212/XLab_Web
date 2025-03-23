import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | XLab Web',
  description: 'Đọc tin tức mới nhất, hướng dẫn và nhận xét về công nghệ và các sản phẩm của chúng tôi.',
};

export default function BlogPage() {
  // Danh sách bài viết giả định
  const blogPosts = [
    {
      id: 1,
      title: 'Những xu hướng công nghệ hàng đầu năm 2024',
      summary: 'Khám phá những xu hướng công nghệ mới nhất đang định hình tương lai của ngành trong năm nay.',
      date: '15/3/2024',
      author: 'Nguyễn Văn A',
      slug: 'xu-huong-cong-nghe-2024',
    },
    {
      id: 2,
      title: 'Làm thế nào để tối ưu hóa hiệu suất ứng dụng web của bạn',
      summary: 'Hướng dẫn toàn diện về cách cải thiện tốc độ và hiệu suất cho ứng dụng web.',
      date: '10/3/2024',
      author: 'Trần Thị B',
      slug: 'toi-uu-hoa-hieu-suat-ung-dung-web',
    },
    {
      id: 3,
      title: 'Bảo mật trong phát triển phần mềm hiện đại',
      summary: 'Các phương pháp hay nhất và công cụ để đảm bảo ứng dụng của bạn được bảo mật chống lại các mối đe dọa mới nhất.',
      date: '1/3/2024',
      author: 'Phạm Văn C',
      slug: 'bao-mat-phat-trien-phan-mem-hien-dai',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <p className="text-gray-500 text-sm mb-2">{post.date} • {post.author}</p>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.summary}</p>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                Đọc tiếp
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 