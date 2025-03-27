export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Chuyển đổi số trong doanh nghiệp vừa và nhỏ: Lợi ích và thách thức',
      excerpt: 'Tìm hiểu về cách các doanh nghiệp vừa và nhỏ có thể tận dụng công nghệ để nâng cao hiệu quả hoạt động và khả năng cạnh tranh...',
      category: 'Chuyển đổi số',
      date: '15/07/2023',
      author: 'Nguyễn Văn An',
      imageUrl: '/images/blog-placeholder.jpg',
      slug: 'chuyen-doi-so-doanh-nghiep-vua-va-nho',
    },
    {
      id: 2,
      title: '5 xu hướng công nghệ định hình tương lai của phát triển phần mềm',
      excerpt: 'Khám phá những xu hướng công nghệ đang và sẽ tác động mạnh mẽ đến cách chúng ta phát triển phần mềm trong những năm tới...',
      category: 'Công nghệ',
      date: '03/06/2023',
      author: 'Trần Thị Bình',
      imageUrl: '/images/blog-placeholder.jpg',
      slug: 'xu-huong-cong-nghe-phat-trien-phan-mem',
    },
    {
      id: 3,
      title: 'Bảo mật dữ liệu trong kỷ nguyên AI: Những điều doanh nghiệp cần biết',
      excerpt: 'Trong thời đại AI phát triển mạnh mẽ, các doanh nghiệp cần thay đổi cách tiếp cận về bảo mật dữ liệu để đảm bảo an toàn...',
      category: 'Bảo mật',
      date: '21/05/2023',
      author: 'Lê Văn Cường',
      imageUrl: '/images/blog-placeholder.jpg',
      slug: 'bao-mat-du-lieu-trong-ky-nguyen-ai',
    },
    {
      id: 4,
      title: 'Cloud Computing vs. On-Premise: Lựa chọn nào phù hợp cho doanh nghiệp của bạn?',
      excerpt: 'So sánh chi tiết giữa giải pháp đám mây và tại chỗ, giúp bạn đưa ra quyết định đúng đắn cho chiến lược công nghệ của doanh nghiệp...',
      category: 'Đám mây',
      date: '14/04/2023',
      author: 'Phạm Thị Dung',
      imageUrl: '/images/blog-placeholder.jpg',
      slug: 'cloud-computing-vs-on-premise',
    },
    {
      id: 5,
      title: 'Tối ưu hóa quy trình kinh doanh với ERP: Nghiên cứu điển hình',
      excerpt: 'Phân tích cách một doanh nghiệp sản xuất đã cải thiện hiệu suất hoạt động sau khi triển khai hệ thống ERP toàn diện...',
      category: 'ERP',
      date: '02/03/2023',
      author: 'Hoàng Văn Em',
      imageUrl: '/images/blog-placeholder.jpg',
      slug: 'toi-uu-hoa-quy-trinh-kinh-doanh-voi-erp',
    },
    {
      id: 6,
      title: 'Phát triển phần mềm Agile: Cách áp dụng hiệu quả trong doanh nghiệp Việt Nam',
      excerpt: 'Những bài học kinh nghiệm và cách thực tiễn để áp dụng phương pháp phát triển Agile thành công trong bối cảnh doanh nghiệp Việt Nam...',
      category: 'Phát triển phần mềm',
      date: '18/02/2023',
      author: 'Nguyễn Thị Phương',
      imageUrl: '/images/blog-placeholder.jpg',
      slug: 'phat-trien-phan-mem-agile-doanh-nghiep-viet-nam',
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog & Kiến thức</h1>
          <p className="text-xl max-w-3xl">
            Cập nhật tin tức, xu hướng công nghệ và chia sẻ kiến thức từ đội ngũ chuyên gia của XLab
          </p>
        </div>
      </section>

      {/* Blog Categories */}
      <section className="py-8 border-b border-gray-200">
        <div className="container">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#" className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium">
              Tất cả
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              Công nghệ
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              Phát triển phần mềm
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              Chuyển đổi số
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              Đám mây
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              Bảo mật
            </a>
            <a href="#" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              AI & ML
            </a>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Hình ảnh bài viết</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 hover:text-primary-600">
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <a 
                    href={`/blog/${post.slug}`} 
                    className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                  >
                    Đọc tiếp
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <a 
                href="#" 
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <a 
                href="#" 
                className="px-4 py-2 rounded-md bg-primary-600 text-white"
              >
                1
              </a>
              <a 
                href="#" 
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                2
              </a>
              <a 
                href="#" 
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                3
              </a>
              <span className="px-4 py-2 text-gray-600">...</span>
              <a 
                href="#" 
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                8
              </a>
              <a 
                href="#" 
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Đăng ký nhận bản tin</h2>
            <p className="text-gray-600 mb-6">
              Cập nhật những bài viết mới nhất và kiến thức công nghệ hữu ích từ chúng tôi
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="px-4 py-3 rounded-md border border-gray-300 flex-grow max-w-md"
                required
              />
              <button type="submit" className="btn btn-primary px-6 py-3">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
} 