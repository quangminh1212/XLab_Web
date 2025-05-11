import { Product, Category, Store } from '@/types';

// Mock Categories
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Phần mềm doanh nghiệp',
    slug: 'phan-mem-doanh-nghiep',
    description: 'Các phần mềm phục vụ cho doanh nghiệp như ERP, CRM, thanh toán...',
    imageUrl: '/images/categories/productivity.png',
    productCount: 1
  },
  {
    id: 'cat-2',
    name: 'Ứng dụng văn phòng',
    slug: 'ung-dung-van-phong',
    description: 'Các ứng dụng văn phòng như soạn thảo, bảng tính, thuyết trình...',
    imageUrl: '/images/categories/utilities.png',
    productCount: 1
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
    productCount: 1
  },
  {
    id: 'cat-6',
    name: 'Tài khoản học tập',
    slug: 'tai-khoan-hoc-tap',
    description: 'Các tài khoản premium cho các nền tảng học trực tuyến phổ biến.',
    imageUrl: '/images/categories/accounts.svg',
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

// Danh sách sản phẩm
export const products: Product[] = [
  // VoiceTyping
  {
    id: 'prod-vt',
    name: 'VoiceTyping',
    slug: 'voicetyping',
    description: 'Nhập văn bản bằng giọng nói tại vị trí con trỏ chuột sử dụng Google Speech Recognition.',
    longDescription: `
      <h2>VoiceTyping - Nhập liệu bằng giọng nói</h2>
      <p>VoiceTyping là một ứng dụng Microsoft Office cho phép người dùng nhập văn bản bằng giọng nói tại vị trí con trỏ chuột, tích hợp với bộ công cụ Microsoft Office.</p>

      <h3>Kiến trúc:</h3>
      <ul>
        <li><strong>Frontend:</strong> Giao diện người dùng (GUI) xây dựng tích hợp với Microsoft Office.</li>
        <li><strong>Backend:</strong>
          <ul>
            <li>Mô-đun nhận dạng giọng nói (Microsoft Speech Recognition API).</li>
            <li>Mô-đun xử lý văn bản tích hợp với Word, Excel và PowerPoint.</li>
            <li>Mô-đun điều khiển con trỏ thông minh.</li>
          </ul>
        </li>
      </ul>

      <h3>Công nghệ sử dụng:</h3>
      <ul>
        <li>Microsoft Office Add-in</li>
        <li>Microsoft Speech API</li>
        <li>Office 365 Integration</li>
        <li>Cloud-based processing</li>
      </ul>

      <h3>Cài đặt và Sử dụng:</h3>
      <p>Xem chi tiết trong file README đi kèm hoặc tải về bản cài đặt.</p>
      <p><strong>Yêu cầu:</strong> Microsoft Office 2019 hoặc mới hơn.</p>

      <h3>Giấy phép:</h3>
      <p>Phân phối dưới giấy phép MIT.</p>
    `,
    price: 990000,
    salePrice: 990000,
    categoryId: 'cat-2', // Ứng dụng văn phòng
    imageUrl: '/images/speech-text.svg',
    isFeatured: true,
    isNew: true,
    downloadCount: 150,
    viewCount: 320,
    rating: 4.5,
    version: '1.0.0',
    size: '~50MB',
    licenseType: 'Premium',
    createdAt: new Date('2023-05-15').toISOString(),
    updatedAt: new Date('2023-05-15').toISOString(),
    storeId: '1', // XLab Software
    features: [
      'Nhận dạng giọng nói chính xác với nhiều giọng địa phương',
      'Tích hợp với Microsoft Office',
      'Hỗ trợ điều khiển bằng hotkey',
      'Tự động lưu lịch sử chuyển đổi'
    ]
  },
  
  // Office Suite
  {
    id: 'prod-office',
    name: 'Office Suite',
    slug: 'office-suite',
    description: 'Bộ ứng dụng văn phòng toàn diện với các tính năng xử lý văn bản, bảng tính và thuyết trình.',
    longDescription: `
      <h2>Office Suite - Bộ ứng dụng văn phòng toàn diện</h2>
      <p>Office Suite là bộ ứng dụng văn phòng toàn diện cung cấp các công cụ xử lý văn bản, bảng tính và thuyết trình với đầy đủ tính năng cần thiết cho công việc văn phòng hàng ngày.</p>

      <h3>Tính năng chính:</h3>
      <ul>
        <li><strong>Word Processor:</strong> Tạo và chỉnh sửa tài liệu với nhiều định dạng văn bản.</li>
        <li><strong>Spreadsheet:</strong> Xử lý bảng tính với công thức và biểu đồ.</li>
        <li><strong>Presentation:</strong> Tạo bài thuyết trình chuyên nghiệp với hiệu ứng và templates.</li>
        <li><strong>Cloud Integration:</strong> Đồng bộ hóa tài liệu trên nhiều thiết bị.</li>
      </ul>
    `,
    price: 1200000,
    salePrice: 1200000,
    categoryId: 'cat-2', // Ứng dụng văn phòng
    imageUrl: '/images/products/office-suite-1.jpg',
    isFeatured: true,
    isNew: false,
    downloadCount: 250,
    viewCount: 420,
    rating: 4.8,
    version: '2.1.0',
    size: '~100MB',
    licenseType: 'Premium',
    createdAt: new Date('2023-04-10').toISOString(),
    updatedAt: new Date('2023-04-10').toISOString(),
    storeId: '1',
    features: [
      'Tương thích với nhiều định dạng file',
      'Giao diện người dùng thân thiện',
      'Hỗ trợ đa ngôn ngữ',
      'Cập nhật thường xuyên với tính năng mới'
    ]
  },

  // Backup Pro
  {
    id: 'prod-backup',
    name: 'Backup Pro',
    slug: 'backup-pro',
    description: 'Giải pháp sao lưu dữ liệu tự động, bảo vệ dữ liệu quan trọng của bạn khỏi mất mát.',
    longDescription: `
      <h2>Backup Pro - Giải pháp sao lưu dữ liệu toàn diện</h2>
      <p>Backup Pro cung cấp giải pháp sao lưu dữ liệu tự động và an toàn, giúp bạn bảo vệ các tệp tin quan trọng khỏi mất mát do lỗi phần cứng, phần mềm hoặc tấn công mạng.</p>

      <h3>Tính năng chính:</h3>
      <ul>
        <li><strong>Sao lưu tự động:</strong> Lên lịch sao lưu theo giờ, ngày hoặc tuần.</li>
        <li><strong>Mã hóa dữ liệu:</strong> Bảo vệ dữ liệu sao lưu bằng mã hóa AES-256.</li>
        <li><strong>Cloud Backup:</strong> Sao lưu lên đám mây để truy cập từ mọi nơi.</li>
        <li><strong>Khôi phục nhanh chóng:</strong> Dễ dàng khôi phục dữ liệu từ các bản sao lưu.</li>
      </ul>
    `,
    price: 500000,
    salePrice: 500000,
    categoryId: 'cat-4', // Bảo mật & Antivirus
    imageUrl: '/images/products/backup-pro.jpg',
    isFeatured: false,
    isNew: false,
    downloadCount: 180,
    viewCount: 290,
    rating: 4.6,
    version: '3.0.5',
    size: '~80MB',
    licenseType: 'Premium',
    createdAt: new Date('2023-03-20').toISOString(),
    updatedAt: new Date('2023-03-20').toISOString(),
    storeId: '1',
    features: [
      'Sao lưu tự động và lên lịch',
      'Mã hóa dữ liệu an toàn',
      'Hỗ trợ nhiều định dạng lưu trữ',
      'Khôi phục dữ liệu nhanh chóng'
    ]
  },

  // Secure Vault
  {
    id: 'prod-secure',
    name: 'Secure Vault',
    slug: 'secure-vault',
    description: 'Giải pháp lưu trữ và mã hóa dữ liệu nhạy cảm với bảo mật đa lớp.',
    longDescription: `
      <h2>Secure Vault - Bảo mật dữ liệu nhạy cảm</h2>
      <p>Secure Vault là giải pháp lưu trữ và mã hóa dữ liệu nhạy cảm, giúp bảo vệ thông tin cá nhân và tài liệu quan trọng khỏi truy cập trái phép.</p>

      <h3>Tính năng chính:</h3>
      <ul>
        <li><strong>Mã hóa quân sự:</strong> Sử dụng chuẩn mã hóa AES-256 để bảo vệ dữ liệu.</li>
        <li><strong>Kho mật khẩu:</strong> Quản lý mật khẩu an toàn với tạo mật khẩu mạnh.</li>
        <li><strong>Xác thực hai yếu tố:</strong> Bảo vệ bổ sung với xác thực hai lớp.</li>
        <li><strong>Tự hủy dữ liệu:</strong> Tự động xóa dữ liệu sau nhiều lần nhập sai mật khẩu.</li>
      </ul>
    `,
    price: 850000,
    salePrice: 850000,
    categoryId: 'cat-4', // Bảo mật & Antivirus
    imageUrl: '/images/products/secure-vault-1.jpg',
    isFeatured: false,
    isNew: true,
    downloadCount: 120,
    viewCount: 210,
    rating: 4.7,
    version: '1.5.2',
    size: '~45MB',
    licenseType: 'Premium',
    createdAt: new Date('2023-05-05').toISOString(),
    updatedAt: new Date('2023-05-05').toISOString(),
    storeId: '1',
    features: [
      'Mã hóa dữ liệu chuẩn quân sự',
      'Quản lý mật khẩu an toàn',
      'Xác thực đa yếu tố',
      'Giao diện thân thiện, dễ sử dụng'
    ]
  },

  // Design Master
  {
    id: 'prod-design',
    name: 'Design Master',
    slug: 'design-master',
    description: 'Phần mềm thiết kế đồ họa chuyên nghiệp với đầy đủ công cụ cho các nhà thiết kế.',
    longDescription: `
      <h2>Design Master - Công cụ thiết kế đồ họa chuyên nghiệp</h2>
      <p>Design Master là phần mềm thiết kế đồ họa chuyên nghiệp cung cấp đầy đủ công cụ để tạo ra các tác phẩm thiết kế chất lượng cao cho cả in ấn và web.</p>

      <h3>Tính năng chính:</h3>
      <ul>
        <li><strong>Công cụ vẽ vector:</strong> Tạo và chỉnh sửa hình ảnh vector chất lượng cao.</li>
        <li><strong>Chỉnh sửa ảnh:</strong> Công cụ chỉnh sửa ảnh toàn diện với các bộ lọc và hiệu ứng.</li>
        <li><strong>Thiết kế UI/UX:</strong> Công cụ chuyên dụng cho thiết kế giao diện người dùng.</li>
        <li><strong>Thư viện template:</strong> Nhiều mẫu thiết kế sẵn cho các dự án khác nhau.</li>
      </ul>
    `,
    price: 1500000,
    salePrice: 1500000,
    categoryId: 'cat-3', // Phần mềm đồ họa
    imageUrl: '/images/products/design-master.jpg',
    isFeatured: true,
    isNew: false,
    downloadCount: 200,
    viewCount: 350,
    rating: 4.9,
    version: '2.2.0',
    size: '~200MB',
    licenseType: 'Premium',
    createdAt: new Date('2023-02-15').toISOString(),
    updatedAt: new Date('2023-02-15').toISOString(),
    storeId: '3', // Creative Tools
    features: [
      'Công cụ vẽ vector chuyên nghiệp',
      'Chỉnh sửa ảnh toàn diện',
      'Nhiều template và tài nguyên có sẵn',
      'Hỗ trợ xuất file cho web và in ấn'
    ]
  }
];

// Mock Reviews (Optional - Can add later if needed)
// ... existing code ... 