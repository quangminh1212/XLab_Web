import { Product, Category, Store } from '@/types';

// Mock Categories
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Phần mềm doanh nghiệp',
    slug: 'phan-mem-doanh-nghiep',
    description: 'Phần mềm quản lý doanh nghiệp toàn diện',
    imageUrl: '/images/categories/productivity.png',
    productCount: 4
  },
  {
    id: 'cat-2',
    name: 'Ứng dụng văn phòng',
    slug: 'ung-dung-van-phong',
    description: 'Các ứng dụng phục vụ công việc văn phòng',
    imageUrl: '/images/categories/utilities.png',
    productCount: 3
  },
  {
    id: 'cat-3',
    name: 'Phần mềm đồ họa',
    slug: 'phan-mem-do-hoa',
    description: 'Phần mềm thiết kế và xử lý đồ họa chuyên nghiệp',
    imageUrl: '/images/categories/design.png',
    productCount: 2
  },
  {
    id: 'cat-4',
    name: 'Bảo mật & Antivirus',
    slug: 'bao-mat-antivirus',
    description: 'Phần mềm bảo mật và diệt virus hàng đầu',
    imageUrl: '/images/categories/security.png',
    productCount: 2
  },
  {
    id: 'cat-5',
    name: 'Ứng dụng giáo dục',
    slug: 'ung-dung-giao-duc',
    description: 'Phần mềm phục vụ giảng dạy và học tập',
    imageUrl: '/images/categories/education.png',
    productCount: 1
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
    description: 'Bộ ứng dụng văn phòng toàn diện, thay thế hoàn hảo cho Microsoft Office',
    longDescription: `XLab Office Suite là bộ ứng dụng văn phòng toàn diện, được thiết kế để thay thế hoàn hảo cho Microsoft Office. Với đầy đủ các tính năng cần thiết cho công việc văn phòng hàng ngày, XLab Office Suite giúp bạn làm việc hiệu quả hơn mà không cần phải trả phí bản quyền đắt đỏ.

Bộ ứng dụng bao gồm:
- XLab Writer: Soạn thảo văn bản chuyên nghiệp
- XLab Calc: Bảng tính với các công thức mạnh mẽ
- XLab Present: Tạo bài thuyết trình ấn tượng
- XLab Database: Quản lý dữ liệu một cách dễ dàng

Các tính năng nổi bật:
- Tương thích hoàn toàn với các định dạng của Microsoft Office
- Giao diện thân thiện, dễ sử dụng
- Hỗ trợ lưu trữ đám mây
- Cập nhật thường xuyên và miễn phí
- Bảo mật cao, an toàn dữ liệu`,
    price: 1200000,
    salePrice: 990000,
    categoryId: 'cat-2',
    imageUrl: '/images/products/office-pro.png',
    featured: true,
    isNew: false,
    downloadCount: 15240,
    viewCount: 45720,
    rating: 4.7,
    version: '2.5.1',
    size: '245MB',
    license: 'Thương mại',
    createdAt: '2022-02-15T00:00:00Z',
    updatedAt: '2023-07-10T00:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'XLab ERP System',
    slug: 'xlab-erp-system',
    description: 'Phần mềm quản lý doanh nghiệp toàn diện, tích hợp mọi phòng ban',
    longDescription: `XLab ERP System là giải pháp quản lý doanh nghiệp toàn diện, được thiết kế để tối ưu hóa quy trình làm việc và nâng cao hiệu suất của doanh nghiệp. Hệ thống tích hợp tất cả các phòng ban trong doanh nghiệp, từ kế toán, nhân sự đến bán hàng và sản xuất.

Các module chính:
- Quản lý tài chính kế toán
- Quản lý nhân sự tiền lương
- Quản lý bán hàng và khách hàng (CRM)
- Quản lý chuỗi cung ứng (SCM)
- Quản lý sản xuất
- Báo cáo quản trị

Lợi ích khi sử dụng XLab ERP:
- Tự động hóa quy trình làm việc
- Cung cấp thông tin quản trị toàn diện
- Tối ưu hóa việc ra quyết định
- Giảm thiểu chi phí vận hành
- Nâng cao hiệu suất làm việc
- Dễ dàng mở rộng theo quy mô doanh nghiệp`,
    price: 30000000,
    salePrice: 25000000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/system-optimizer.png',
    featured: true,
    isNew: true,
    downloadCount: 5240,
    viewCount: 18450,
    rating: 4.9,
    version: '3.0.2',
    size: '1.2GB',
    license: 'Thương mại',
    createdAt: '2022-01-20T00:00:00Z',
    updatedAt: '2023-08-05T00:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'XLab Antivirus Pro',
    slug: 'xlab-antivirus-pro',
    description: 'Phần mềm diệt virus mạnh mẽ, bảo vệ máy tính khỏi các mối đe dọa',
    longDescription: `XLab Antivirus Pro là giải pháp bảo mật toàn diện, bảo vệ máy tính của bạn khỏi tất cả các loại mối đe dọa trực tuyến. Với công nghệ quét thời gian thực và trí tuệ nhân tạo, XLab Antivirus Pro phát hiện và ngăn chặn virus, malware, ransomware và các phần mềm độc hại khác trước khi chúng có thể gây hại cho hệ thống của bạn.

Tính năng chính:
- Bảo vệ thời gian thực
- Quét virus thông minh và nhanh chóng
- Tường lửa thông minh
- Bảo vệ email và web
- Bảo vệ dữ liệu cá nhân
- Bảo vệ giao dịch ngân hàng
- Cập nhật cơ sở dữ liệu virus tự động

Ưu điểm:
- Sử dụng ít tài nguyên hệ thống
- Giao diện đơn giản, dễ sử dụng
- Tỷ lệ phát hiện virus cao
- Hỗ trợ kỹ thuật 24/7
- Cập nhật liên tục cơ sở dữ liệu virus`,
    price: 750000,
    salePrice: 590000,
    categoryId: 'cat-4',
    imageUrl: '/images/products/secure-vault.png',
    featured: false,
    isNew: false,
    downloadCount: 25600,
    viewCount: 68420,
    rating: 4.6,
    version: '5.2.3',
    size: '125MB',
    license: 'Thương mại',
    createdAt: '2021-12-10T00:00:00Z',
    updatedAt: '2023-09-15T00:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'XLab Design Studio',
    slug: 'xlab-design-studio',
    description: 'Phần mềm thiết kế đồ họa chuyên nghiệp dành cho designer',
    longDescription: `XLab Design Studio là phần mềm thiết kế đồ họa chuyên nghiệp, cung cấp đầy đủ công cụ cần thiết cho các nhà thiết kế. Từ thiết kế web, thiết kế in ấn đến chỉnh sửa ảnh và vẽ vector, XLab Design Studio đáp ứng mọi nhu cầu sáng tạo của bạn.

Các tính năng nổi bật:
- Thiết kế vector chuyên nghiệp
- Chỉnh sửa ảnh mạnh mẽ
- Thiết kế UI/UX
- Thiết kế ấn phẩm
- Thư viện mẫu và template phong phú
- Hỗ trợ xuất file với nhiều định dạng

Ưu điểm:
- Giao diện thân thiện, dễ sử dụng
- Hiệu suất cao, xử lý mượt mà
- Hỗ trợ màn hình Retina và độ phân giải cao
- Tương thích với nhiều định dạng file
- Cộng đồng người dùng lớn
- Cập nhật thường xuyên với tính năng mới`,
    price: 3600000,
    salePrice: 2790000,
    categoryId: 'cat-3',
    imageUrl: '/images/products/design-master.png',
    featured: true,
    isNew: false,
    downloadCount: 12480,
    viewCount: 37950,
    rating: 4.8,
    version: '4.1.0',
    size: '1.8GB',
    license: 'Thương mại',
    createdAt: '2022-03-05T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'XLab CRM',
    slug: 'xlab-crm',
    description: 'Phần mềm quản lý khách hàng thông minh, tối ưu quy trình bán hàng',
    longDescription: `XLab CRM là giải pháp quản lý khách hàng toàn diện, giúp doanh nghiệp tối ưu hóa quy trình bán hàng và chăm sóc khách hàng. Với giao diện thân thiện và tính năng thông minh, XLab CRM là công cụ không thể thiếu cho các đội ngũ sales và marketing.

Tính năng chính:
- Quản lý thông tin khách hàng
- Theo dõi cơ hội bán hàng
- Quản lý đội ngũ bán hàng
- Tự động hóa marketing
- Phân tích và báo cáo
- Tích hợp email và cuộc gọi
- Quản lý hợp đồng và đơn hàng

Lợi ích:
- Tăng hiệu suất bán hàng
- Cải thiện trải nghiệm khách hàng
- Tối ưu hóa quy trình làm việc
- Giảm chi phí quản lý
- Phân tích dữ liệu khách hàng
- Dễ dàng mở rộng theo quy mô doanh nghiệp`,
    price: 15000000,
    salePrice: 12000000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/code-editor.png',
    featured: false,
    isNew: true,
    downloadCount: 8750,
    viewCount: 24680,
    rating: 4.5,
    version: '2.3.5',
    size: '450MB',
    license: 'Thương mại',
    createdAt: '2022-04-15T00:00:00Z',
    updatedAt: '2023-08-25T00:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'XLab Data Recovery',
    slug: 'xlab-data-recovery',
    description: 'Phần mềm khôi phục dữ liệu đã xóa, hỗ trợ nhiều định dạng',
    longDescription: `XLab Data Recovery là giải pháp khôi phục dữ liệu chuyên nghiệp, giúp bạn lấy lại dữ liệu đã bị xóa do vô tình hay sự cố. Phần mềm hỗ trợ khôi phục dữ liệu từ nhiều nguồn khác nhau như ổ cứng, thẻ nhớ, USB và các thiết bị lưu trữ khác.

Tính năng chính:
- Khôi phục file đã xóa
- Khôi phục phân vùng bị mất
- Khôi phục dữ liệu từ thiết bị bị hỏng
- Khôi phục dữ liệu sau khi format
- Hỗ trợ nhiều định dạng file
- Quét nhanh và quét sâu
- Xem trước file trước khi khôi phục

Ưu điểm:
- Tỷ lệ khôi phục dữ liệu cao
- Giao diện đơn giản, dễ sử dụng
- Tốc độ quét nhanh
- An toàn, không ghi đè dữ liệu
- Hỗ trợ nhiều hệ thống file
- Cập nhật thường xuyên`,
    price: 1800000,
    salePrice: 1490000,
    categoryId: 'cat-4',
    imageUrl: '/images/products/backup-pro.png',
    featured: false,
    isNew: false,
    downloadCount: 18200,
    viewCount: 42560,
    rating: 4.4,
    version: '3.6.2',
    size: '180MB',
    license: 'Thương mại',
    createdAt: '2021-11-28T00:00:00Z',
    updatedAt: '2023-07-30T00:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'XLab Video Editor',
    slug: 'xlab-video-editor',
    description: 'Phần mềm biên tập video chuyên nghiệp với nhiều hiệu ứng',
    longDescription: `XLab Video Editor là phần mềm biên tập video chuyên nghiệp với đầy đủ công cụ cần thiết cho việc sản xuất video chất lượng cao. Từ cắt ghép đơn giản đến hiệu ứng chuyên nghiệp, XLab Video Editor đáp ứng mọi nhu cầu sáng tạo của bạn.

Tính năng chính:
- Chỉnh sửa video đa track
- Thư viện hiệu ứng và transition phong phú
- Chỉnh màu chuyên nghiệp
- Mixing âm thanh
- Hỗ trợ text và subtitle
- Xuất video với nhiều định dạng và độ phân giải
- Tích hợp các công cụ color grading

Ưu điểm:
- Giao diện thân thiện, dễ sử dụng
- Hiệu suất cao, render nhanh
- Hỗ trợ nhiều định dạng video
- Cộng đồng người dùng lớn
- Cập nhật thường xuyên với tính năng mới
- Tài nguyên học tập phong phú`,
    price: 2800000,
    salePrice: 2490000,
    categoryId: 'cat-3',
    imageUrl: '/images/products/photo-editor.png',
    featured: true,
    isNew: false,
    downloadCount: 14560,
    viewCount: 37820,
    rating: 4.7,
    version: '3.2.1',
    size: '2.1GB',
    license: 'Thương mại',
    createdAt: '2022-05-18T00:00:00Z',
    updatedAt: '2023-09-05T00:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'XLab Accounting',
    slug: 'xlab-accounting',
    description: 'Phần mềm kế toán đơn giản, đầy đủ tính năng cho doanh nghiệp vừa và nhỏ',
    longDescription: `XLab Accounting là phần mềm kế toán toàn diện, được thiết kế đặc biệt cho các doanh nghiệp vừa và nhỏ tại Việt Nam. Phần mềm tuân thủ đầy đủ các quy định về kế toán và thuế hiện hành, giúp doanh nghiệp quản lý tài chính hiệu quả.

Tính năng chính:
- Quản lý chứng từ kế toán
- Quản lý mua hàng, bán hàng
- Quản lý công nợ
- Quản lý kho
- Báo cáo tài chính
- Báo cáo thuế
- Quản lý tài sản cố định
- Quản lý ngân quỹ

Ưu điểm:
- Tuân thủ chuẩn mực kế toán Việt Nam
- Giao diện thân thiện, dễ sử dụng
- Tự động hóa nhiều quy trình
- Báo cáo đa dạng, trực quan
- Bảo mật dữ liệu cao
- Hỗ trợ kỹ thuật 24/7
- Cập nhật thường xuyên theo quy định mới`,
    price: 5500000,
    salePrice: 4800000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/office-pro.png',
    featured: false,
    isNew: true,
    downloadCount: 9800,
    viewCount: 26450,
    rating: 4.6,
    version: '2.8.3',
    size: '350MB',
    license: 'Thương mại',
    createdAt: '2022-06-10T00:00:00Z',
    updatedAt: '2023-08-15T00:00:00Z'
  },
  {
    id: 'prod-9',
    name: 'XLab PDF Master',
    slug: 'xlab-pdf-master',
    description: 'Phần mềm xử lý file PDF toàn diện: chỉnh sửa, chuyển đổi, nén',
    longDescription: `XLab PDF Master là giải pháp toàn diện cho việc làm việc với file PDF. Từ chỉnh sửa nội dung, chuyển đổi định dạng đến nén dung lượng, XLab PDF Master đáp ứng mọi nhu cầu xử lý PDF của bạn.

Tính năng chính:
- Chỉnh sửa văn bản và hình ảnh trong PDF
- Chuyển đổi PDF sang Word, Excel, PowerPoint
- Chuyển đổi từ nhiều định dạng sang PDF
- Nén dung lượng file PDF
- Tách và ghép file PDF
- Thêm chữ ký điện tử
- Bảo vệ PDF bằng mật khẩu
- OCR (nhận dạng ký tự quang học)

Ưu điểm:
- Giao diện thân thiện, dễ sử dụng
- Tốc độ xử lý nhanh
- Chất lượng đầu ra cao
- Hỗ trợ xử lý hàng loạt
- Bảo mật dữ liệu
- Tiết kiệm chi phí so với Adobe Acrobat`,
    price: 1200000,
    salePrice: 990000,
    categoryId: 'cat-2',
    imageUrl: '/images/products/code-editor.png',
    featured: false,
    isNew: false,
    downloadCount: 22400,
    viewCount: 58760,
    rating: 4.5,
    version: '4.0.2',
    size: '210MB',
    license: 'Thương mại',
    createdAt: '2021-10-05T00:00:00Z',
    updatedAt: '2023-06-10T00:00:00Z'
  },
  {
    id: 'prod-10',
    name: 'XLab Learning Management',
    slug: 'xlab-learning-management',
    description: 'Hệ thống quản lý học tập trực tuyến cho trường học và doanh nghiệp',
    longDescription: `XLab Learning Management là hệ thống quản lý học tập trực tuyến toàn diện, được thiết kế để đáp ứng nhu cầu đào tạo của các trường học, trung tâm đào tạo và doanh nghiệp. Hệ thống cung cấp môi trường học tập trực tuyến hiệu quả, giúp người dạy và người học tương tác dễ dàng.

Tính năng chính:
- Quản lý khóa học và học liệu
- Tạo bài giảng, bài kiểm tra trực tuyến
- Quản lý học viên và giảng viên
- Giao bài tập và chấm điểm tự động
- Thống kê tiến độ học tập
- Diễn đàn trao đổi và phòng chat
- Cấp chứng chỉ tự động
- Tích hợp video conference

Lợi ích:
- Tiết kiệm chi phí đào tạo
- Mở rộng quy mô đào tạo không giới hạn
- Theo dõi tiến độ học tập chi tiết
- Nâng cao hiệu quả học tập
- Tùy biến theo nhu cầu cụ thể
- Trải nghiệm học tập đa phương tiện`,
    price: 18000000,
    salePrice: 15000000,
    categoryId: 'cat-5',
    imageUrl: '/images/products/language-master.png',
    featured: false,
    isNew: true,
    downloadCount: 6200,
    viewCount: 18640,
    rating: 4.8,
    version: '2.2.0',
    size: '680MB',
    license: 'Thương mại',
    createdAt: '2022-07-25T00:00:00Z',
    updatedAt: '2023-09-20T00:00:00Z'
  },
  {
    id: 'prod-11',
    name: 'XLab Mail Client',
    slug: 'xlab-mail-client',
    description: 'Ứng dụng email hiện đại, hỗ trợ nhiều tài khoản và bảo mật cao',
    longDescription: `XLab Mail Client là ứng dụng email hiện đại với đầy đủ tính năng cần thiết cho việc quản lý email cá nhân và doanh nghiệp. Ứng dụng hỗ trợ nhiều tài khoản email từ các nhà cung cấp khác nhau, giúp bạn dễ dàng quản lý tất cả email trong một giao diện thống nhất.

Tính năng chính:
- Hỗ trợ nhiều tài khoản email (Gmail, Outlook, Yahoo, IMAP/POP3)
- Giao diện người dùng hiện đại, dễ sử dụng
- Lọc và phân loại email thông minh
- Lên lịch gửi email
- Nhắc nhở theo dõi email
- Bảo mật hai lớp
- Chống spam hiệu quả
- Tìm kiếm email nhanh chóng

Ưu điểm:
- Tốc độ load email nhanh
- Tiết kiệm dung lượng lưu trữ
- Bảo mật cao
- Đồng bộ hóa trên nhiều thiết bị
- Làm việc offline
- Giao diện tùy biến
- Hỗ trợ PGP mã hóa`,
    price: 850000,
    salePrice: 690000,
    categoryId: 'cat-2',
    imageUrl: '/images/products/system-optimizer.png',
    featured: false,
    isNew: false,
    downloadCount: 19800,
    viewCount: 42560,
    rating: 4.3,
    version: '3.5.2',
    size: '95MB',
    license: 'Thương mại',
    createdAt: '2021-09-15T00:00:00Z',
    updatedAt: '2023-05-10T00:00:00Z'
  },
  {
    id: 'prod-12',
    name: 'XLab Inventory Management',
    slug: 'xlab-inventory-management',
    description: 'Phần mềm quản lý kho hàng chuyên nghiệp cho doanh nghiệp',
    longDescription: `XLab Inventory Management là giải pháp quản lý kho hàng toàn diện dành cho các doanh nghiệp vừa và nhỏ. Phần mềm giúp doanh nghiệp theo dõi hàng tồn kho, quản lý nhập xuất, và tối ưu hóa quy trình kho hàng một cách hiệu quả.

Tính năng chính:
- Quản lý nhập xuất kho
- Theo dõi tồn kho thời gian thực
- Quản lý nhiều kho hàng
- Báo cáo hàng tồn kho chi tiết
- Quản lý vị trí hàng trong kho
- Quét mã vạch và QR code
- Cảnh báo hàng sắp hết
- Đặt hàng tự động khi dưới ngưỡng

Lợi ích:
- Giảm thiểu thất thoát hàng hóa
- Tối ưu hóa không gian kho
- Tiết kiệm thời gian kiểm kê
- Cải thiện dự báo nhu cầu
- Tăng tốc độ xử lý đơn hàng
- Dễ dàng mở rộng theo quy mô
- Tương thích với các thiết bị di động`,
    price: 8500000,
    salePrice: 7200000,
    categoryId: 'cat-1',
    imageUrl: '/images/products/backup-pro.png',
    featured: false,
    isNew: false,
    downloadCount: 7840,
    viewCount: 22360,
    rating: 4.5,
    version: '2.4.1',
    size: '320MB',
    license: 'Thương mại',
    createdAt: '2022-03-20T00:00:00Z',
    updatedAt: '2023-07-15T00:00:00Z'
  }
] 