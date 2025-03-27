import { Product, Category, Store } from '@/types';

// Mock Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Productivity',
    slug: 'productivity',
    description: 'Software to help you get more done',
    icon: 'Briefcase',
    imageUrl: '/images/categories/productivity.png'
  },
  {
    id: '2',
    name: 'Development',
    slug: 'development',
    description: 'Tools for developers and programmers',
    icon: 'Code',
    imageUrl: '/images/categories/development.png'
  },
  {
    id: '3',
    name: 'Graphics & Design',
    slug: 'graphics-design',
    description: 'Creative software for designers',
    icon: 'Image',
    imageUrl: '/images/categories/design.png'
  },
  {
    id: '4',
    name: 'Security',
    slug: 'security',
    description: 'Protect your devices and data',
    icon: 'Shield',
    imageUrl: '/images/categories/security.png'
  },
  {
    id: '5',
    name: 'Utilities',
    slug: 'utilities',
    description: 'Essential tools for your computer',
    icon: 'Tool',
    imageUrl: '/images/categories/utilities.png'
  },
  {
    id: '6',
    name: 'Education',
    slug: 'education',
    description: 'Learning software and applications',
    icon: 'BookOpen',
    imageUrl: '/images/categories/education.png'
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
    imageUrl: '/images/stores/xlab.png',
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
    imageUrl: '/images/stores/vntech.png',
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
    imageUrl: '/images/stores/creative.png',
    website: 'https://creative-tools.example.com',
    active: true,
    createdAt: new Date('2023-02-10').toISOString()
  }
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'XLab Office Pro',
    slug: 'xlab-office-pro',
    description: 'Bộ ứng dụng văn phòng toàn diện với trình soạn thảo văn bản, bảng tính và thuyết trình.',
    longDescription: `XLab Office Pro là bộ ứng dụng văn phòng toàn diện với nhiều tính năng mạnh mẽ giúp bạn làm việc hiệu quả:
    
- Trình soạn thảo văn bản với công cụ định dạng hiện đại
- Bảng tính với các công thức và biểu đồ nâng cao
- Ứng dụng thuyết trình với mẫu chuyên nghiệp
- Tích hợp lưu trữ đám mây
- Hỗ trợ làm việc cộng tác thời gian thực
- Giao diện thân thiện người dùng
- Tương thích với nhiều định dạng tập tin khác nhau`,
    price: 299000,
    salePrice: 249000,
    categoryId: '1',
    storeId: '1',
    imageUrl: '/images/products/office-pro.svg',
    version: '2.5.1',
    size: '145MB',
    license: 'Premium',
    featured: true,
    active: true,
    downloadCount: 1250,
    viewCount: 3750,
    rating: 4.8,
    createdAt: new Date('2023-04-10').toISOString(),
    updatedAt: new Date('2023-10-15').toISOString()
  },
  {
    id: '2',
    name: 'CodeEditor X',
    slug: 'code-editor-x',
    description: 'IDE thông minh hỗ trợ nhiều ngôn ngữ lập trình với các tính năng phân tích và gợi ý code.',
    longDescription: `CodeEditor X là IDE hiện đại dành cho lập trình viên chuyên nghiệp:
    
- Hỗ trợ hơn 50 ngôn ngữ lập trình
- IntelliSense thông minh với gợi ý code chính xác
- Debug tích hợp với nhiều công cụ phân tích
- Git tích hợp sẵn
- Terminal đa nền tảng
- Tùy biến giao diện với hơn 100 theme
- Hệ thống plugin mở rộng
- Tự động cập nhật và sao lưu code`,
    price: 650000,
    salePrice: null,
    categoryId: '2',
    storeId: '1',
    imageUrl: '/images/products/code-editor.svg',
    version: '3.1.0',
    size: '210MB',
    license: 'Professional',
    featured: true,
    active: true,
    downloadCount: 3420,
    viewCount: 10260,
    rating: 4.9,
    createdAt: new Date('2023-02-25').toISOString(),
    updatedAt: new Date('2023-09-05').toISOString()
  },
  {
    id: '3',
    name: 'DesignMaster Pro',
    slug: 'design-master-pro',
    description: 'Phần mềm thiết kế đồ họa chuyên nghiệp với công cụ vẽ vector, chỉnh sửa ảnh và thiết kế UI.',
    longDescription: `DesignMaster Pro là giải pháp thiết kế đồ họa toàn diện cho designer:
    
- Công cụ vẽ vector chuyên nghiệp
- Chức năng chỉnh sửa ảnh nâng cao
- Bộ công cụ thiết kế UI/UX
- Thư viện template và asset phong phú
- Export nhiều định dạng (PNG, JPG, SVG, PDF)
- Hỗ trợ layer và mask
- Công cụ text và typography nâng cao
- Hỗ trợ bảng màu Pantone, CMYK, RGB`,
    price: 1200000,
    salePrice: 899000,
    categoryId: '3',
    storeId: '3',
    imageUrl: '/images/products/design-master.svg',
    version: '4.2.3',
    size: '1.2GB',
    license: 'Creative Pro',
    featured: true,
    active: true,
    downloadCount: 5680,
    viewCount: 17040,
    rating: 4.7,
    createdAt: new Date('2023-01-05').toISOString(),
    updatedAt: new Date('2023-11-20').toISOString()
  },
  {
    id: '4',
    name: 'SecureVault',
    slug: 'secure-vault',
    description: 'Giải pháp bảo mật dữ liệu toàn diện với mã hóa 256-bit, quản lý mật khẩu và bảo vệ danh tính.',
    longDescription: `SecureVault bảo vệ dữ liệu và danh tính của bạn một cách toàn diện:
    
- Mã hóa AES 256-bit cho tất cả dữ liệu
- Quản lý mật khẩu thông minh
- Tạo mật khẩu mạnh tự động
- Xác thực hai yếu tố (2FA)
- Bảo vệ khi duyệt web
- Tường lửa cá nhân tích hợp
- Kiểm tra rò rỉ dữ liệu
- Xóa dữ liệu từ xa khi bị mất thiết bị`,
    price: 450000,
    salePrice: 399000,
    categoryId: '4',
    storeId: '2',
    imageUrl: '/images/products/secure-vault.svg',
    version: '2.0.5',
    size: '85MB',
    license: 'Premium',
    featured: false,
    active: true,
    downloadCount: 2840,
    viewCount: 8520,
    rating: 4.6,
    createdAt: new Date('2023-05-15').toISOString(),
    updatedAt: new Date('2023-10-01').toISOString()
  },
  {
    id: '5',
    name: 'SystemOptimizer',
    slug: 'system-optimizer',
    description: 'Tối ưu hóa hệ thống, dọn dẹp tập tin rác và tăng tốc máy tính của bạn.',
    longDescription: `SystemOptimizer giúp máy tính của bạn hoạt động nhanh như ngày đầu:
    
- Tối ưu hóa RAM và CPU
- Dọn dẹp tập tin rác và tạm thời
- Tối ưu hóa ổ đĩa
- Tăng tốc khởi động máy tính
- Quản lý chương trình khởi động
- Tìm và xóa tập tin trùng lặp
- Theo dõi hiệu suất hệ thống
- Gỡ bỏ phần mềm triệt để`,
    price: 199000,
    salePrice: 149000,
    categoryId: '5',
    storeId: '2',
    imageUrl: '/images/products/system-optimizer.svg',
    version: '5.1.2',
    size: '65MB',
    license: 'Standard',
    featured: false,
    active: true,
    downloadCount: 7920,
    viewCount: 23760,
    rating: 4.5,
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2023-11-05').toISOString()
  },
  {
    id: '6',
    name: 'LanguageMaster',
    slug: 'language-master',
    description: 'Ứng dụng học ngoại ngữ với phương pháp học tập thông minh và hơn 30 ngôn ngữ.',
    longDescription: `LanguageMaster giúp bạn học ngoại ngữ hiệu quả:
    
- Hỗ trợ hơn 30 ngôn ngữ phổ biến
- Phương pháp học lặp lại theo khoảng thời gian (spaced repetition)
- Luyện phát âm với công nghệ nhận diện giọng nói
- Bài học tương tác và trò chơi học tập
- Học từ vựng theo chủ đề
- Theo dõi tiến độ học tập
- Nhắc nhở thông minh
- Học offline không cần kết nối internet`,
    price: 350000,
    salePrice: 299000,
    categoryId: '6',
    storeId: '1',
    imageUrl: '/images/products/language-master.svg',
    version: '4.0.1',
    size: '180MB',
    license: 'Premium',
    featured: true,
    active: true,
    downloadCount: 9650,
    viewCount: 28950,
    rating: 4.8,
    createdAt: new Date('2023-06-20').toISOString(),
    updatedAt: new Date('2023-12-10').toISOString()
  },
  {
    id: '7',
    name: 'BackupPro',
    slug: 'backup-pro',
    description: 'Giải pháp sao lưu dữ liệu tự động với lưu trữ đám mây và khôi phục nhanh chóng.',
    longDescription: `BackupPro bảo vệ dữ liệu của bạn khỏi mọi rủi ro mất mát:
    
- Sao lưu tự động theo lịch trình
- Lưu trữ đám mây an toàn
- Mã hóa dữ liệu sao lưu
- Khôi phục dữ liệu nhanh chóng
- Sao lưu chọn lọc theo loại tập tin
- Phiên bản hóa dữ liệu
- Báo cáo sao lưu chi tiết
- Đồng bộ dữ liệu giữa nhiều thiết bị`,
    price: 299000,
    salePrice: null,
    categoryId: '5',
    storeId: '2',
    imageUrl: '/images/products/backup-pro.svg',
    version: '2.8.3',
    size: '95MB',
    license: 'Standard',
    featured: false,
    active: true,
    downloadCount: 3150,
    viewCount: 9450,
    rating: 4.6,
    createdAt: new Date('2023-07-05').toISOString(),
    updatedAt: new Date('2023-11-15').toISOString()
  },
  {
    id: '8',
    name: 'PhotoEditor X',
    slug: 'photo-editor-x',
    description: 'Công cụ chỉnh sửa ảnh chuyên nghiệp với bộ lọc, hiệu ứng và công cụ biên tập nâng cao.',
    longDescription: `PhotoEditor X mang đến trải nghiệm chỉnh sửa ảnh chuyên nghiệp:
    
- Hơn 200 bộ lọc và hiệu ứng
- Công cụ biên tập nâng cao (dodge/burn, healing, clone)
- Hỗ trợ layer và mask
- Điều chỉnh màu sắc chuyên nghiệp
- Công cụ chọn đối tượng thông minh
- Xóa phông nền tự động
- Tạo ảnh ghép và ảnh cắt dán
- Tương thích với các định dạng RAW`,
    price: 599000,
    salePrice: 499000,
    categoryId: '3',
    storeId: '3',
    imageUrl: '/images/products/photo-editor.svg',
    version: '4.0.2',
    size: '850MB',
    license: 'Creative Pro',
    featured: false,
    active: true,
    downloadCount: 4820,
    viewCount: 14460,
    rating: 4.7,
    createdAt: new Date('2023-05-25').toISOString(),
    updatedAt: new Date('2023-12-05').toISOString()
  }
]; 