import { Product, Category, Store } from '@/types';

// Mock Categories
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Phần mềm doanh nghiệp',
    slug: 'phan-mem-doanh-nghiep',
    description: 'Các phần mềm phục vụ cho doanh nghiệp như ERP, CRM, thanh toán...',
    imageUrl: '/images/categories/productivity.png',
    productCount: 4
  },
  {
    id: 'cat-2',
    name: 'Ứng dụng văn phòng',
    slug: 'ung-dung-van-phong',
    description: 'Các ứng dụng văn phòng như soạn thảo, bảng tính, thuyết trình...',
    imageUrl: '/images/categories/utilities.png',
    productCount: 3
  },
  {
    id: 'cat-3',
    name: 'Phần mềm đồ họa',
    slug: 'phan-mem-do-hoa',
    description: 'Các phần mềm thiết kế, chỉnh sửa ảnh, video và đồ họa...',
    imageUrl: '/images/categories/design.png',
    productCount: 2
  },
  {
    id: 'cat-4',
    name: 'Bảo mật & Antivirus',
    slug: 'bao-mat-antivirus',
    description: 'Các phần mềm bảo mật, diệt virus, mã hóa dữ liệu...',
    imageUrl: '/images/categories/security.png',
    productCount: 1
  },
  {
    id: 'cat-5',
    name: 'Ứng dụng giáo dục',
    slug: 'ung-dung-giao-duc',
    description: 'Các ứng dụng học ngoại ngữ, lập trình, toán học...',
    imageUrl: '/images/categories/education.png',
    productCount: 2
  }
];

// Mock Stores
export const stores: Store[] = [
  {
    id: '1',
    name: 'XLab Software',
    slug: 'xlab-software',
    description: 'Chuyên cung cấp phần mềm chất lượng cao',
    owner: 'admin@xlab.com',
    imageUrl: '/images/categories/development.png',
    website: 'https://xlab.example.com',
    active: true,
    createdAt: new Date('2023-01-15').toISOString()
  },
  {
    id: '2',
    name: 'VN Tech Solutions',
    slug: 'vn-tech-solutions',
    description: 'Giải pháp phần mềm cho doanh nghiệp Việt',
    owner: 'contact@vntech.vn',
    imageUrl: '/images/categories/productivity.png',
    website: 'https://vntech.example.com',
    active: true,
    createdAt: new Date('2023-03-20').toISOString()
  },
  {
    id: '3',
    name: 'Creative Tools',
    slug: 'creative-tools',
    description: 'Công cụ sáng tạo cho designer và họa sĩ',
    owner: 'hello@creative-tools.com',
    imageUrl: '/images/categories/design.png',
    website: 'https://creative-tools.example.com',
    active: true,
    createdAt: new Date('2023-02-10').toISOString()
  }
];

// Mock Products
export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'XLab Office Suite',
    slug: 'xlab-office-suite',
    description: 'Bộ ứng dụng văn phòng toàn diện cho doanh nghiệp Việt Nam.',
    longDescription: `
      <p>XLab Office Suite là bộ ứng dụng văn phòng toàn diện được phát triển bởi đội ngũ XLab dành riêng cho người dùng Việt Nam.</p>
      <p>Bộ phần mềm bao gồm:</p>
      <ul>
        <li>Ứng dụng soạn thảo văn bản với đầy đủ tính năng định dạng</li>
        <li>Ứng dụng bảng tính với các công thức và biểu đồ phong phú</li>
        <li>Ứng dụng trình chiếu với nhiều mẫu đẹp mắt</li>
        <li>Hỗ trợ đầy đủ tiếng Việt và các định dạng văn bản phổ biến</li>
        <li>Tích hợp lưu trữ đám mây để chia sẻ và đồng bộ dữ liệu giữa các thiết bị</li>
      </ul>
      <p>XLab Office Suite là giải pháp hoàn hảo cho doanh nghiệp Việt Nam muốn tối ưu hóa quy trình làm việc văn phòng mà không phụ thuộc vào các giải pháp nước ngoài.</p>
    `,
    price: 1200000,
    salePrice: 990000,
    categoryId: 'cat-2',
    imageUrl: '/images/products/office-pro.png',
    featured: true,
    isNew: false,
    downloadCount: 1500,
    viewCount: 4200,
    rating: 4.5,
    version: '2.5.1',
    size: '250MB',
    license: 'Thương mại',
    createdAt: '2023-05-10T08:00:00.000Z',
    updatedAt: '2023-09-15T10:30:00.000Z',
    storeId: '1'
  },
  {
    id: 'prod-2',
    name: 'XLab ERP System',
    slug: 'xlab-erp-system',
    description: 'Hệ thống quản lý doanh nghiệp toàn diện cho doanh nghiệp vừa và nhỏ.',
    longDescription: `
      <p>XLab ERP System là giải pháp quản lý doanh nghiệp toàn diện được phát triển dành riêng cho các doanh nghiệp vừa và nhỏ tại Việt Nam.</p>
      <p>Tính năng nổi bật:</p>
      <ul>
        <li>Quản lý tài chính: kế toán, thanh toán, báo cáo tài chính</li>
        <li>Quản lý nhân sự: hồ sơ nhân viên, chấm công, lương thưởng</li>
        <li>Quản lý khách hàng: CRM, theo dõi giao dịch, chăm sóc khách hàng</li>
        <li>Quản lý kho: xuất nhập tồn, tồn kho, đặt hàng tự động</li>
        <li>Quản lý bán hàng: hóa đơn, đơn hàng, khuyến mãi</li>
        <li>Báo cáo thống kê đa chiều với giao diện trực quan</li>
      </ul>
      <p>XLab ERP System tối ưu hóa quy trình quản lý của doanh nghiệp, giảm thiểu thời gian và chi phí vận hành, mang lại hiệu quả tối đa trong quản trị doanh nghiệp.</p>
    `,
    price: 15000000,
    salePrice: 12000000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/system-optimizer.png',
    featured: true,
    isNew: true,
    downloadCount: 350,
    viewCount: 1200,
    rating: 4.8,
    version: '1.2.0',
    size: '500MB',
    license: 'Thương mại',
    createdAt: '2023-08-01T09:00:00.000Z',
    updatedAt: '2023-10-20T14:45:00.000Z',
    storeId: '1'
  },
  {
    id: 'prod-3',
    name: 'XLab Secure Vault',
    slug: 'xlab-secure-vault',
    description: 'Phần mềm bảo mật và mã hóa dữ liệu cho cá nhân và doanh nghiệp.',
    longDescription: `
      <p>XLab Secure Vault là giải pháp bảo mật và mã hóa dữ liệu hàng đầu cho cá nhân và doanh nghiệp.</p>
      <p>Tính năng chính:</p>
      <ul>
        <li>Mã hóa dữ liệu AES-256 bit, đảm bảo an toàn tuyệt đối</li>
        <li>Quản lý mật khẩu an toàn với tích hợp sinh mật khẩu mạnh</li>
        <li>Chia sẻ dữ liệu an toàn giữa các thành viên trong tổ chức</li>
        <li>Xác thực hai yếu tố và sinh khóa bảo mật</li>
        <li>Tự động sao lưu và khôi phục dữ liệu</li>
        <li>Xóa dữ liệu từ xa trong trường hợp thiết bị bị mất</li>
      </ul>
      <p>XLab Secure Vault được phát triển bởi đội ngũ chuyên gia bảo mật với hơn 10 năm kinh nghiệm, đảm bảo dữ liệu của bạn luôn được bảo vệ an toàn tuyệt đối.</p>
    `,
    price: 800000,
    salePrice: 690000,
    categoryId: 'cat-4',
    imageUrl: '/images/products/secure-vault.png',
    featured: false,
    isNew: true,
    downloadCount: 950,
    viewCount: 2100,
    rating: 4.7,
    version: '3.0.1',
    size: '120MB',
    license: 'Thương mại',
    createdAt: '2023-06-15T11:20:00.000Z',
    updatedAt: '2023-10-05T09:15:00.000Z',
    storeId: '1'
  },
  {
    id: 'prod-4',
    name: 'XLab Design Master',
    slug: 'xlab-design-master',
    description: 'Phần mềm thiết kế đồ họa chuyên nghiệp với giao diện tiếng Việt.',
    longDescription: `
      <p>XLab Design Master là giải pháp thiết kế đồ họa chuyên nghiệp được phát triển bởi đội ngũ XLab dành cho người dùng Việt Nam.</p>
      <p>Tính năng nổi bật:</p>
      <ul>
        <li>Thiết kế vector chuyên nghiệp với các công cụ vẽ mạnh mẽ</li>
        <li>Chỉnh sửa ảnh chuyên sâu với các bộ lọc và hiệu ứng đa dạng</li>
        <li>Thiết kế giao diện UI/UX với thư viện mẫu phong phú</li>
        <li>Tạo ấn phẩm in ấn với hỗ trợ đầy đủ cho CMYK</li>
        <li>Hỗ trợ các định dạng đồ họa phổ biến: PSD, AI, SVG, EPS...</li>
        <li>Tương thích với các phần mềm thiết kế quốc tế</li>
      </ul>
      <p>XLab Design Master là lựa chọn hoàn hảo cho các nhà thiết kế, họa sĩ và các doanh nghiệp cần giải pháp thiết kế đồ họa chuyên nghiệp với giao diện tiếng Việt thân thiện.</p>
    `,
    price: 2500000,
    salePrice: 1990000,
    categoryId: 'cat-3',
    imageUrl: '/images/products/design-master.png',
    featured: true,
    isNew: false,
    downloadCount: 1200,
    viewCount: 3500,
    rating: 4.6,
    version: '4.2.1',
    size: '850MB',
    license: 'Thương mại',
    createdAt: '2023-04-20T13:45:00.000Z',
    updatedAt: '2023-09-28T16:30:00.000Z',
    storeId: '1'
  },
  {
    id: 'prod-5',
    name: 'XLab Code IDE',
    slug: 'xlab-code-ide',
    description: 'Môi trường phát triển tích hợp cho lập trình viên với đầy đủ tính năng.',
    longDescription: `
      <p>XLab Code IDE là môi trường phát triển tích hợp mạnh mẽ dành cho lập trình viên Việt Nam và quốc tế.</p>
      <p>Tính năng chính:</p>
      <ul>
        <li>Hỗ trợ đa ngôn ngữ lập trình: Java, Python, C/C++, JavaScript, PHP, Ruby...</li>
        <li>Công cụ debug mạnh mẽ với visualizer trực quan</li>
        <li>Tích hợp Git và các hệ thống quản lý phiên bản khác</li>
        <li>IntelliSense thông minh và gợi ý code tự động</li>
        <li>Tích hợp terminal và hệ thống quản lý package</li>
        <li>Tùy biến giao diện và theme với nhiều lựa chọn</li>
        <li>Hỗ trợ extension với kho thư viện phong phú</li>
      </ul>
      <p>XLab Code IDE được phát triển bởi đội ngũ lập trình viên giàu kinh nghiệm, mang đến trải nghiệm phát triển phần mềm hiệu quả và tối ưu cho mọi dự án.</p>
    `,
    price: 1500000,
    salePrice: 1200000,
    categoryId: 'cat-5',
    imageUrl: '/images/products/code-editor.png',
    featured: false,
    isNew: true,
    downloadCount: 850,
    viewCount: 2300,
    rating: 4.9,
    version: '2.1.0',
    size: '350MB',
    license: 'Thương mại',
    createdAt: '2023-07-12T10:30:00.000Z',
    updatedAt: '2023-10-18T09:45:00.000Z',
    storeId: '1'
  },
  {
    id: 'prod-6',
    name: 'XLab Backup Pro',
    slug: 'xlab-backup-pro',
    description: 'Giải pháp sao lưu và khôi phục dữ liệu tự động cho doanh nghiệp.',
    longDescription: `
      <p>XLab Backup Pro là giải pháp sao lưu và khôi phục dữ liệu toàn diện dành cho doanh nghiệp mọi quy mô.</p>
      <p>Tính năng nổi bật:</p>
      <ul>
        <li>Sao lưu tự động theo lịch trình với nhiều cấu hình linh hoạt</li>
        <li>Hỗ trợ sao lưu gia tăng và sao lưu đầy đủ</li>
        <li>Mã hóa dữ liệu sao lưu đảm bảo an toàn tuyệt đối</li>
        <li>Khôi phục nhanh chóng với chế độ instant recovery</li>
        <li>Sao lưu đám mây với tích hợp các nền tảng lưu trữ phổ biến</li>
        <li>Quản lý tập trung với bảng điều khiển trực quan</li>
        <li>Báo cáo chi tiết về trạng thái và lịch sử sao lưu</li>
      </ul>
      <p>XLab Backup Pro giúp doanh nghiệp bảo vệ dữ liệu quan trọng, đảm bảo hoạt động kinh doanh liên tục và khả năng phục hồi sau sự cố.</p>
    `,
    price: 2200000,
    salePrice: 1800000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/backup-pro.png',
    featured: true,
    isNew: false,
    downloadCount: 650,
    viewCount: 1800,
    rating: 4.7,
    version: '3.1.2',
    size: '190MB',
    license: 'Thương mại',
    createdAt: '2023-03-25T14:20:00.000Z',
    updatedAt: '2023-09-10T11:05:00.000Z',
    storeId: '2'
  },
  {
    id: 'prod-7',
    name: 'XLab Photo Editor',
    slug: 'xlab-photo-editor',
    description: 'Phần mềm chỉnh sửa ảnh chuyên nghiệp với giao diện tiếng Việt.',
    longDescription: `
      <p>XLab Photo Editor là giải pháp chỉnh sửa ảnh chuyên nghiệp dành cho nhiếp ảnh gia và người dùng Việt Nam.</p>
      <p>Tính năng chính:</p>
      <ul>
        <li>Chỉnh sửa ảnh chuyên sâu với các công cụ chuyên nghiệp</li>
        <li>Bộ lọc và hiệu ứng đa dạng với khả năng tùy chỉnh</li>
        <li>Xử lý RAW chuyên nghiệp với hỗ trợ đa dạng định dạng máy ảnh</li>
        <li>Tính năng retouching nâng cao: làm mịn da, xóa vết, thay đổi ánh sáng...</li>
        <li>Tích hợp AI để tự động cải thiện chất lượng ảnh</li>
        <li>Quản lý thư viện ảnh với khả năng phân loại và tag</li>
        <li>Xuất ảnh với nhiều định dạng và tùy chọn chất lượng</li>
      </ul>
      <p>XLab Photo Editor là công cụ hoàn hảo cho những người yêu thích nhiếp ảnh và cần một giải pháp chỉnh sửa ảnh chuyên nghiệp với giao diện tiếng Việt thân thiện.</p>
    `,
    price: 1400000,
    salePrice: 1100000,
    categoryId: 'cat-3',
    imageUrl: '/images/products/photo-editor.png',
    featured: false,
    isNew: true,
    downloadCount: 900,
    viewCount: 2700,
    rating: 4.6,
    version: '2.3.0',
    size: '450MB',
    license: 'Thương mại',
    createdAt: '2023-05-30T09:15:00.000Z',
    updatedAt: '2023-10-12T13:40:00.000Z',
    storeId: '2'
  },
  {
    id: 'prod-8',
    name: 'XLab Document Management',
    slug: 'xlab-document-management',
    description: 'Hệ thống quản lý tài liệu và quy trình làm việc cho doanh nghiệp.',
    longDescription: `
      <p>XLab Document Management là giải pháp quản lý tài liệu và quy trình làm việc toàn diện cho doanh nghiệp Việt Nam.</p>
      <p>Tính năng nổi bật:</p>
      <ul>
        <li>Lưu trữ tài liệu tập trung với hệ thống phân loại thông minh</li>
        <li>Tìm kiếm nhanh chóng với công nghệ OCR nhận dạng văn bản</li>
        <li>Quản lý phiên bản tài liệu, theo dõi lịch sử chỉnh sửa</li>
        <li>Phân quyền truy cập chi tiết đến từng tài liệu</li>
        <li>Quy trình làm việc tự động với khả năng tùy chỉnh</li>
        <li>Tích hợp chữ ký điện tử và xác thực tài liệu</li>
        <li>Báo cáo thống kê về quá trình sử dụng và truy cập tài liệu</li>
      </ul>
      <p>XLab Document Management giúp doanh nghiệp tối ưu hóa quy trình quản lý tài liệu, tăng cường bảo mật và nâng cao hiệu quả làm việc.</p>
    `,
    price: 3500000,
    salePrice: 2800000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/office-pro.png',
    featured: true,
    isNew: false,
    downloadCount: 420,
    viewCount: 1500,
    rating: 4.5,
    version: '2.0.1',
    size: '320MB',
    license: 'Thương mại',
    createdAt: '2023-02-18T08:45:00.000Z',
    updatedAt: '2023-08-25T15:20:00.000Z',
    storeId: '3'
  },
  {
    id: 'prod-9',
    name: 'XLab Web Developer Studio',
    slug: 'xlab-web-developer-studio',
    description: 'Môi trường phát triển web tích hợp với nhiều công cụ và framework.',
    longDescription: `
      <p>XLab Web Developer Studio là môi trường phát triển web tích hợp toàn diện dành cho lập trình viên web.</p>
      <p>Tính năng chính:</p>
      <ul>
        <li>Hỗ trợ đầy đủ các ngôn ngữ và framework web phổ biến</li>
        <li>Editor thông minh với gợi ý code và auto-completion</li>
        <li>Live preview với đồng bộ hóa thời gian thực</li>
        <li>Công cụ debug JavaScript và PHP mạnh mẽ</li>
        <li>Tích hợp terminal và quản lý package</li>
        <li>Hỗ trợ Git và các hệ thống quản lý phiên bản</li>
        <li>Công cụ tối ưu hóa và kiểm tra hiệu suất website</li>
        <li>Tích hợp các API và dịch vụ web phổ biến</li>
      </ul>
      <p>XLab Web Developer Studio là giải pháp hoàn hảo cho lập trình viên web muốn nâng cao hiệu suất và chất lượng trong phát triển website và ứng dụng web.</p>
    `,
    price: 1800000,
    salePrice: 1500000,
    categoryId: 'cat-5',
    imageUrl: '/images/products/code-editor.png',
    featured: false,
    isNew: false,
    downloadCount: 750,
    viewCount: 2000,
    rating: 4.8,
    version: '3.2.0',
    size: '480MB',
    license: 'Thương mại',
    createdAt: '2023-04-05T11:30:00.000Z',
    updatedAt: '2023-09-20T10:25:00.000Z',
    storeId: '1'
  },
  {
    id: 'prod-10',
    name: 'XLab Language Master',
    slug: 'xlab-language-master',
    description: 'Phần mềm học ngoại ngữ thông minh với trí tuệ nhân tạo.',
    longDescription: `
      <p>XLab Language Master là giải pháp học ngoại ngữ thông minh dựa trên trí tuệ nhân tạo, đặc biệt phù hợp với người học Việt Nam.</p>
      <p>Tính năng nổi bật:</p>
      <ul>
        <li>Hỗ trợ học 10 ngôn ngữ phổ biến: Anh, Pháp, Đức, Trung, Nhật...</li>
        <li>Phương pháp học dựa trên AI phân tích điểm mạnh, yếu của người học</li>
        <li>Công nghệ nhận dạng giọng nói để luyện phát âm chuẩn xác</li>
        <li>Bài học được thiết kế theo lộ trình từ cơ bản đến nâng cao</li>
        <li>Trò chơi và bài tập tương tác giúp học từ vựng và ngữ pháp hiệu quả</li>
        <li>Tính năng chat với AI để luyện hội thoại thực tế</li>
        <li>Báo cáo tiến độ và đề xuất bài học phù hợp với từng cá nhân</li>
      </ul>
      <p>XLab Language Master giúp người học tiếp thu ngoại ngữ một cách tự nhiên và hiệu quả, phù hợp với mọi lứa tuổi và trình độ.</p>
    `,
    price: 900000,
    salePrice: 750000,
    categoryId: 'cat-5',
    imageUrl: '/images/products/language-master.png',
    featured: true,
    isNew: true,
    downloadCount: 1100,
    viewCount: 3200,
    rating: 4.7,
    version: '1.5.0',
    size: '280MB',
    license: 'Thương mại',
    createdAt: '2023-06-08T12:15:00.000Z',
    updatedAt: '2023-10-15T14:10:00.000Z',
    storeId: '3'
  },
  {
    id: 'prod-11',
    name: 'XLab System Optimizer',
    slug: 'xlab-system-optimizer',
    description: 'Công cụ tối ưu hóa và dọn dẹp hệ thống máy tính hiệu quả.',
    longDescription: `
      <p>XLab System Optimizer là giải pháp tối ưu hóa và dọn dẹp hệ thống máy tính toàn diện.</p>
      <p>Tính năng chính:</p>
      <ul>
        <li>Dọn dẹp file rác, cache và các file tạm không cần thiết</li>
        <li>Tối ưu hóa registry để tăng tốc độ hệ thống</li>
        <li>Quản lý các ứng dụng khởi động cùng Windows</li>
        <li>Phân tích và giải phóng không gian ổ đĩa</li>
        <li>Tối ưu hóa RAM và hiệu suất CPU</li>
        <li>Công cụ gỡ cài đặt ứng dụng triệt để không để lại rác</li>
        <li>Bảo vệ quyền riêng tư với công cụ xóa lịch sử duyệt web</li>
        <li>Chế độ tự động tối ưu hóa định kỳ</li>
      </ul>
      <p>XLab System Optimizer giúp máy tính của bạn luôn hoạt động ổn định, nhanh chóng và hiệu quả, kéo dài tuổi thọ của thiết bị.</p>
    `,
    price: 650000,
    salePrice: 490000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/system-optimizer.png',
    featured: false,
    isNew: false,
    downloadCount: 1800,
    viewCount: 4000,
    rating: 4.4,
    version: '5.2.1',
    size: '85MB',
    license: 'Thương mại',
    createdAt: '2023-01-20T09:40:00.000Z',
    updatedAt: '2023-08-15T10:50:00.000Z',
    storeId: '2'
  },
  {
    id: 'prod-12',
    name: 'XLab Cloud Backup',
    slug: 'xlab-cloud-backup',
    description: 'Giải pháp sao lưu đám mây an toàn với mã hóa đầu cuối.',
    longDescription: `
      <p>XLab Cloud Backup là giải pháp sao lưu đám mây an toàn với mã hóa đầu cuối, bảo vệ dữ liệu của bạn tuyệt đối.</p>
      <p>Tính năng nổi bật:</p>
      <ul>
        <li>Sao lưu tự động các thiết bị: máy tính, điện thoại, máy tính bảng</li>
        <li>Mã hóa đầu cuối AES-256 bit bảo vệ dữ liệu tuyệt đối</li>
        <li>Đồng bộ hóa thời gian thực giữa các thiết bị</li>
        <li>Sao lưu chọn lọc: hình ảnh, tài liệu, video, cấu hình...</li>
        <li>Khôi phục nhanh chóng trên mọi thiết bị</li>
        <li>Quản lý phiên bản với khả năng khôi phục các phiên bản cũ</li>
        <li>Chia sẻ an toàn với liên kết mã hóa và mật khẩu</li>
        <li>Giám sát hoạt động sao lưu từ xa</li>
      </ul>
      <p>XLab Cloud Backup mang lại sự an tâm tuyệt đối về an toàn dữ liệu, bảo vệ những thông tin quan trọng của bạn trong mọi tình huống.</p>
    `,
    price: 1100000,
    salePrice: 890000,
    categoryId: 'cat-4',
    imageUrl: '/images/products/backup-pro.png',
    featured: false,
    isNew: true,
    downloadCount: 550,
    viewCount: 1300,
    rating: 4.9,
    version: '2.0.1',
    size: '110MB',
    license: 'Thương mại',
    createdAt: '2023-07-25T15:30:00.000Z',
    updatedAt: '2023-10-08T11:20:00.000Z',
    storeId: '2'
  }
] 