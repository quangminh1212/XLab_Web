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
    price: 0, // Miễn phí
    salePrice: 0,
    categoryId: 'cat-2', // Ứng dụng văn phòng
    imageUrl: '/images/speech-text.svg',
    isFeatured: true, // Đặt thành true để hiển thị trong mục sản phẩm nổi bật
    isNew: true,
    downloadCount: 150,
    viewCount: 320,
    rating: 4.5,
    version: '1.0.0',
    size: '~50MB',
    licenseType: 'MIT',
    createdAt: new Date('2023-08-25').toISOString(),
    updatedAt: new Date('2023-08-25').toISOString(),
    storeId: '1', // XLab Software
    features: [
      'Nhận dạng giọng nói chính xác với nhiều giọng địa phương',
      'Tích hợp với Microsoft Office',
      'Hỗ trợ điều khiển bằng hotkey',
      'Tự động lưu lịch sử chuyển đổi'
    ]
  },
  
  // Tài khoản Coursera Plus
  {
    id: 'prod-coursera',
    name: 'Tài khoản Coursera Plus',
    slug: 'tai-khoan-coursera-plus',
    description: 'Truy cập không giới hạn hơn 7.000 khóa học từ các trường đại học và đối tác hàng đầu thế giới.',
    longDescription: `
      <h2>Tài khoản Coursera Plus - Học từ những nguồn tốt nhất</h2>
      <p>Coursera Plus là dịch vụ đăng ký thuê bao cao cấp từ nền tảng học trực tuyến Coursera. Với Coursera Plus, bạn có thể học không giới hạn trong số hơn 7.000 khóa học và nhận chứng chỉ từ các trường đại học và đối tác hàng đầu thế giới.</p>

      <h3>Tính năng nổi bật:</h3>
      <ul>
        <li><strong>Truy cập không giới hạn</strong>: Học hơn 7.000 khóa học từ các trường top thế giới.</li>
        <li><strong>Chứng chỉ được công nhận</strong>: Nhận chứng chỉ mang tên bạn sau khi hoàn thành khóa học.</li>
        <li><strong>Đa dạng lĩnh vực</strong>: Từ CNTT, kinh doanh, đến khoa học dữ liệu, marketing và nhiều lĩnh vực khác.</li>
        <li><strong>Học theo lộ trình</strong>: Các khóa học được tổ chức theo lộ trình phát triển sự nghiệp.</li>
        <li><strong>Bài tập thực hành</strong>: Dự án thực tế giúp bạn áp dụng kiến thức đã học.</li>
      </ul>

      <h3>Bảng giá tài khoản:</h3>
      <ul>
        <li><strong>Gói 3 tháng</strong>: 590.000đ (tiết kiệm 59% so với giá gốc)</li>
        <li><strong>Gói 6 tháng</strong>: 890.000đ (tiết kiệm 63% so với giá gốc)</li>
        <li><strong>Gói 1 năm</strong>: 1.190.000đ (tiết kiệm 75% so với giá gốc)</li>
      </ul>

      <h3>Lưu ý quan trọng:</h3>
      <p>- Tài khoản được nâng cấp trực tiếp từ tài khoản Coursera của bạn.<br>
      - Bảo hành trọn thời gian sử dụng.<br>
      - Nhận chứng chỉ mang tên bạn sau khi hoàn thành khóa học.</p>
    `,
    price: 1190000,
    salePrice: 890000,
    categoryId: 'cat-6', // Tài khoản học tập
    imageUrl: '/images/coursera-plus.svg',
    isFeatured: true,
    isNew: true,
    downloadCount: 320,
    viewCount: 580,
    rating: 4.9,
    version: '2023',
    size: 'N/A',
    licenseType: 'Premium',
    createdAt: new Date('2023-11-20').toISOString(),
    updatedAt: new Date('2023-11-20').toISOString(),
    storeId: '1', // XLab Software
    isAccount: true,
    type: 'account',
    features: [
      'Truy cập không giới hạn hơn 7.000 khóa học',
      'Chứng chỉ được công nhận từ trường đại học hàng đầu',
      'Học từ các đối tác như Google, IBM, Meta và nhiều tổ chức khác',
      'Cập nhật nội dung mới liên tục',
      'Học linh hoạt mọi lúc, mọi nơi',
      'Bảo hành 1 đổi 1 trong thời gian sử dụng'
    ],
    options: [
      { name: '3 Tháng', price: 590000 },
      { name: '6 Tháng', price: 890000 },
      { name: '1 Năm', price: 1190000 }
    ]
  },
  
  // Tài khoản Udemy Premium
  {
    id: 'prod-udemy',
    name: 'Tài khoản Udemy Premium',
    slug: 'tai-khoan-udemy-premium',
    description: 'Truy cập hàng ngàn khóa học thực hành từ các chuyên gia trong ngành.',
    longDescription: `
      <h2>Tài khoản Udemy Premium - Phát triển kỹ năng không giới hạn</h2>
      <p>Udemy là nền tảng học trực tuyến hàng đầu với hơn 185.000 khóa học về gần như mọi chủ đề. Với tài khoản Udemy Premium, bạn có thể truy cập không giới hạn các khóa học chất lượng cao từ các chuyên gia hàng đầu trong ngành.</p>

      <h3>Tính năng nổi bật:</h3>
      <ul>
        <li><strong>Đa dạng chủ đề</strong>: Lập trình, thiết kế, marketing, kinh doanh, phát triển cá nhân và nhiều lĩnh vực khác.</li>
        <li><strong>Nội dung chất lượng cao</strong>: Video HD, bài tập thực hành và tài liệu đi kèm.</li>
        <li><strong>Chứng nhận hoàn thành</strong>: Nhận chứng chỉ sau khi hoàn thành khóa học.</li>
        <li><strong>Cập nhật trọn đời</strong>: Tiếp cận các cập nhật mới nhất của khóa học.</li>
        <li><strong>Học theo tốc độ riêng</strong>: Không giới hạn thời gian, học bất cứ khi nào bạn muốn.</li>
      </ul>

      <h3>Bảng giá tài khoản:</h3>
      <ul>
        <li><strong>Gói 6 tháng</strong>: 450.000đ (tiết kiệm 70% so với giá gốc)</li>
        <li><strong>Gói 1 năm</strong>: 750.000đ (tiết kiệm 75% so với giá gốc)</li>
      </ul>

      <h3>Lưu ý quan trọng:</h3>
      <p>- Tài khoản được cấp, có thể đổi mật khẩu.<br>
      - Bảo hành trong suốt thời gian sử dụng.<br>
      - Có thể tải khóa học để học offline.</p>
    `,
    price: 750000,
    salePrice: 450000,
    categoryId: 'cat-6', // Tài khoản học tập
    imageUrl: '/images/udemy-premium.svg',
    isFeatured: true,
    isNew: false,
    downloadCount: 280,
    viewCount: 450,
    rating: 4.7,
    version: '2023',
    size: 'N/A',
    licenseType: 'Premium',
    createdAt: new Date('2023-10-15').toISOString(),
    updatedAt: new Date('2023-10-15').toISOString(),
    storeId: '2', // VN Tech Solutions
    isAccount: true,
    type: 'account',
    features: [
      'Truy cập không giới hạn tất cả khóa học',
      'Nội dung chất lượng cao từ các chuyên gia',
      'Chứng chỉ hoàn thành được công nhận',
      'Truy cập trọn đời các khóa học đã mua',
      'Tải về học offline',
      'Bảo hành trọn thời gian sử dụng'
    ],
    options: [
      { name: '6 Tháng', price: 450000 },
      { name: '1 Năm', price: 750000 }
    ]
  },
  
  // Sản phẩm mới: VideoEditor Pro
  {
    id: 'prod-ve',
    name: 'VideoEditor Pro',
    slug: 'videoeditor-pro',
    description: 'Phần mềm biên tập video chuyên nghiệp với các tính năng hiện đại và giao diện dễ sử dụng.',
    longDescription: `
      <h2>VideoEditor Pro - Giải pháp biên tập video toàn diện</h2>
      <p>VideoEditor Pro là phần mềm biên tập video cao cấp với đầy đủ công cụ và hiệu ứng chuyên nghiệp, giúp người dùng tạo ra các video chất lượng cao.</p>

      <h3>Tính năng chính:</h3>
      <ul>
        <li><strong>Biên tập đa track</strong>: Hỗ trợ nhiều track video, audio và overlay đồng thời.</li>
        <li><strong>Thư viện hiệu ứng phong phú</strong>: Hơn 500 hiệu ứng và transition được phân loại.</li>
        <li><strong>Công cụ chỉnh màu</strong>: Chỉnh màu chuyên nghiệp với LUTs và color grading.</li>
        <li><strong>Xuất video đa định dạng</strong>: MP4, AVI, MOV với chất lượng lên đến 4K.</li>
        <li><strong>Xử lý âm thanh</strong>: Công cụ điều chỉnh và xử lý âm thanh tích hợp.</li>
      </ul>

      <h3>Yêu cầu hệ thống:</h3>
      <ul>
        <li>Windows 10, 11 (64-bit)</li>
        <li>CPU: Intel i5 hoặc AMD Ryzen 5 trở lên</li>
        <li>RAM: 8GB (khuyến nghị 16GB)</li>
        <li>GPU: NVIDIA/AMD với 2GB VRAM</li>
        <li>Ổ cứng: 5GB dung lượng trống</li>
      </ul>
    `,
    price: 299000,
    salePrice: 199000,
    categoryId: 'cat-3', // Phần mềm đồ họa
    imageUrl: '/capcut.png',
    isFeatured: true,
    isNew: true,
    downloadCount: 425,
    viewCount: 780,
    rating: 4.7,
    version: '2.1.0',
    size: '~300MB',
    licenseType: 'Commercial',
    createdAt: new Date('2023-09-12').toISOString(),
    updatedAt: new Date('2023-10-05').toISOString(),
    storeId: '3', // Creative Tools
    features: [
      'Biên tập video đa track chuyên nghiệp',
      'Thư viện hiệu ứng và transition phong phú',
      'Công cụ chỉnh màu nâng cao với LUTs',
      'Xử lý âm thanh tích hợp',
      'Xuất video chất lượng cao đến 4K',
      'Tối ưu hóa hiệu suất với GPU acceleration'
    ]
  },
  
  // Sản phẩm mới: SmartAI Assistant
  {
    id: 'prod-ai',
    name: 'SmartAI Assistant',
    slug: 'smartai-assistant',
    description: 'Trợ lý ảo thông minh giúp tự động hóa công việc, trả lời câu hỏi và tối ưu quy trình làm việc.',
    longDescription: `
      <h2>SmartAI Assistant - Trợ lý AI cá nhân</h2>
      <p>SmartAI Assistant là ứng dụng trợ lý thông minh sử dụng trí tuệ nhân tạo để hỗ trợ người dùng trong công việc hàng ngày, tăng năng suất và tự động hóa các tác vụ lặp đi lặp lại.</p>

      <h3>Khả năng của SmartAI:</h3>
      <ul>
        <li><strong>Trả lời câu hỏi</strong>: Tìm kiếm và tổng hợp thông tin từ nhiều nguồn.</li>
        <li><strong>Viết và chỉnh sửa văn bản</strong>: Soạn thảo email, báo cáo, và văn bản với nhiều phong cách.</li>
        <li><strong>Tự động hóa</strong>: Lập lịch, nhắc nhở và thực hiện các tác vụ lặp lại.</li>
        <li><strong>Phân tích dữ liệu</strong>: Trích xuất insight và tạo báo cáo từ dữ liệu.</li>
        <li><strong>Tích hợp đa nền tảng</strong>: Làm việc trên Windows, macOS, iOS và Android.</li>
      </ul>

      <h3>Công nghệ cốt lõi:</h3>
      <p>SmartAI được xây dựng dựa trên mô hình ngôn ngữ GPT tiên tiến, được tối ưu để chạy trên máy tính cá nhân mà không cần kết nối liên tục đến cloud. Dữ liệu người dùng được mã hóa đầu cuối và được lưu trữ cục bộ để đảm bảo quyền riêng tư.</p>

      <h3>Phiên bản:</h3>
      <p>Phiên bản Premium bao gồm tất cả tính năng và cập nhật miễn phí trong 1 năm.</p>
    `,
    price: 499000,
    salePrice: 399000,
    categoryId: 'cat-1', // Phần mềm doanh nghiệp
    imageUrl: '/chatgpt.png',
    isFeatured: true,
    isNew: true,
    downloadCount: 890,
    viewCount: 1250,
    rating: 4.8,
    version: '1.5.0',
    size: '~200MB',
    licenseType: 'Commercial',
    createdAt: new Date('2023-11-01').toISOString(),
    updatedAt: new Date('2023-11-15').toISOString(),
    storeId: '1', // XLab Software
    features: [
      'Trợ lý AI cá nhân với khả năng xử lý ngôn ngữ tự nhiên',
      'Tự động hóa các tác vụ văn phòng và cá nhân',
      'Tích hợp với email, lịch và ứng dụng văn phòng',
      'Xử lý dữ liệu cục bộ đảm bảo quyền riêng tư',
      'Hoạt động đa nền tảng với đồng bộ liền mạch',
      'Giao diện người dùng trực quan và thân thiện'
    ]
  },
  
  // Sản phẩm mới: DesignStudio
  {
    id: 'prod-ds',
    name: 'DesignStudio',
    slug: 'designstudio',
    description: 'Ứng dụng thiết kế đồ họa toàn diện với công cụ vẽ vector, chỉnh sửa ảnh và thiết kế giao diện.',
    longDescription: `
      <h2>DesignStudio - Công cụ thiết kế đồ họa chuyên nghiệp</h2>
      <p>DesignStudio là giải pháp thiết kế đồ họa trọn gói dành cho designer chuyên nghiệp và người dùng thông thường, cung cấp đầy đủ công cụ từ thiết kế vector đến chỉnh sửa ảnh bitmap.</p>

      <h3>Bộ công cụ đa dạng:</h3>
      <ul>
        <li><strong>Thiết kế vector</strong>: Các công cụ vẽ vector chính xác và linh hoạt.</li>
        <li><strong>Chỉnh sửa ảnh</strong>: Công cụ xử lý ảnh bitmap với nhiều bộ lọc và hiệu ứng.</li>
        <li><strong>Thiết kế UI/UX</strong>: Thư viện component và grid system cho thiết kế giao diện.</li>
        <li><strong>Mockup và prototype</strong>: Tạo bản mẫu tương tác cho website và ứng dụng.</li>
        <li><strong>Thư viện tài nguyên</strong>: Kho hình ảnh, font chữ, icon và template đồng bộ.</li>
      </ul>

      <h3>Dành cho:</h3>
      <p>Graphic designer, UI/UX designer, digital marketer và các doanh nghiệp cần tạo nội dung hình ảnh chất lượng cao.</p>

      <h3>Tương thích:</h3>
      <p>Nhập và xuất file với nhiều định dạng phổ biến như AI, PSD, SVG, PNG, JPEG, PDF và hỗ trợ cả Windows và macOS.</p>
    `,
    price: 599000,
    salePrice: 499000,
    categoryId: 'cat-3', // Phần mềm đồ họa
    imageUrl: '/canva.png',
    isFeatured: false,
    isNew: true,
    downloadCount: 560,
    viewCount: 920,
    rating: 4.6,
    version: '3.0.2',
    size: '~450MB',
    licenseType: 'Commercial',
    createdAt: new Date('2023-10-20').toISOString(),
    updatedAt: new Date('2023-11-05').toISOString(),
    storeId: '3', // Creative Tools
    features: [
      'Thiết kế vector chuyên nghiệp với pen tool và shape builder',
      'Chỉnh sửa ảnh với layer và adjustment layers',
      'Thư viện template và asset phong phú',
      'Công cụ thiết kế UI/UX với component và grid system',
      'Tương thích với nhiều định dạng file thiết kế phổ biến',
      'Tính năng cloud sync để đồng bộ dự án giữa các thiết bị'
    ]
  },
  
  // Sản phẩm mới: SecureGuard Pro
  {
    id: 'prod-sg',
    name: 'SecureGuard Pro',
    slug: 'secureguard-pro',
    description: 'Giải pháp bảo mật toàn diện với tường lửa, chống virus và bảo vệ dữ liệu cá nhân trên mọi thiết bị.',
    longDescription: `
      <h2>SecureGuard Pro - Bảo vệ toàn diện cho mọi thiết bị</h2>
      <p>SecureGuard Pro là giải pháp bảo mật đa lớp giúp bảo vệ dữ liệu và thiết bị của bạn khỏi các mối đe dọa trực tuyến như virus, malware, ransomware và các cuộc tấn công lừa đảo.</p>

      <h3>Các lớp bảo vệ:</h3>
      <ul>
        <li><strong>Chống virus và malware</strong>: Quét và loại bỏ mã độc với công nghệ phát hiện hành vi.</li>
        <li><strong>Tường lửa thông minh</strong>: Kiểm soát lưu lượng mạng và ngăn chặn kết nối độc hại.</li>
        <li><strong>Bảo vệ web</strong>: Ngăn chặn các trang web lừa đảo và khai thác bảo mật.</li>
        <li><strong>Bảo vệ dữ liệu</strong>: Mã hóa dữ liệu nhạy cảm và sao lưu tự động.</li>
        <li><strong>Kiểm soát thiết bị</strong>: Quản lý các thiết bị kết nối vào hệ thống.</li>
      </ul>

      <h3>Bảo mật đa thiết bị:</h3>
      <p>Một giấy phép SecureGuard Pro bảo vệ đến 5 thiết bị cùng lúc, bao gồm Windows, macOS, Android và iOS.</p>

      <h3>Hiệu suất tối ưu:</h3>
      <p>Được thiết kế để bảo vệ mà không làm chậm hệ thống, với công nghệ quét thông minh chỉ sử dụng tài nguyên tối thiểu khi cần thiết.</p>
    `,
    price: 399000,
    salePrice: 299000,
    categoryId: 'cat-4', // Bảo mật & Antivirus
    imageUrl: '/secure.png',
    isFeatured: true,
    isNew: false,
    downloadCount: 1200,
    viewCount: 1850,
    rating: 4.6,
    version: '2.5.1',
    size: '~120MB',
    licenseType: 'Commercial',
    createdAt: new Date('2023-06-15').toISOString(),
    updatedAt: new Date('2023-10-10').toISOString(),
    storeId: '2', // VN Tech Solutions
    features: [
      'Bảo vệ đa lớp chống virus, malware và ransomware',
      'Tường lửa thông minh giám sát lưu lượng mạng',
      'Công nghệ phát hiện hành vi tấn công',
      'Bảo vệ web với chống lừa đảo và theo dõi',
      'Mã hóa và quản lý mật khẩu tích hợp',
      'Bảo vệ đồng thời 5 thiết bị với 1 giấy phép'
    ]
  },
  
  // Sản phẩm mới: LearnCode Academy
  {
    id: 'prod-lc',
    name: 'LearnCode Academy',
    slug: 'learncode-academy',
    description: 'Nền tảng học lập trình tương tác với hơn 50 khóa học từ cơ bản đến nâng cao cho nhiều ngôn ngữ và công nghệ.',
    longDescription: `
      <h2>LearnCode Academy - Nền tảng học lập trình toàn diện</h2>
      <p>LearnCode Academy là ứng dụng học lập trình tương tác với hơn 50 khóa học được thiết kế bởi các chuyên gia trong ngành, giúp người học từ mới bắt đầu đến chuyên gia nâng cao kỹ năng của mình.</p>

      <h3>Khóa học đa dạng:</h3>
      <ul>
        <li><strong>Lập trình web</strong>: HTML, CSS, JavaScript, React, Angular, Vue, Node.js...</li>
        <li><strong>Lập trình di động</strong>: React Native, Flutter, Android, iOS...</li>
        <li><strong>Backend và cơ sở dữ liệu</strong>: Python, PHP, Java, C#, SQL, MongoDB...</li>
        <li><strong>Data Science & AI</strong>: Python, R, Machine Learning, Data Analysis...</li>
        <li><strong>DevOps</strong>: Docker, Kubernetes, CI/CD, AWS, Azure...</li>
      </ul>

      <h3>Phương pháp học:</h3>
      <ul>
        <li><strong>Học tương tác</strong>: Biên tập code trực tiếp trong ứng dụng.</li>
        <li><strong>Dự án thực tế</strong>: Xây dựng portfolio với các dự án thực tế.</li>
        <li><strong>Theo lộ trình</strong>: Các khóa học được sắp xếp theo lộ trình phát triển kỹ năng.</li>
        <li><strong>Cộng đồng</strong>: Kết nối với học viên khác và nhận hỗ trợ từ mentor.</li>
      </ul>

      <h3>Tính năng nổi bật:</h3>
      <p>Truy cập không giới hạn đến tất cả khóa học, môi trường phát triển tích hợp, code playground và chứng chỉ hoàn thành khóa học được công nhận bởi nhiều doanh nghiệp.</p>
    `,
    price: 899000,
    salePrice: 699000,
    categoryId: 'cat-5', // Ứng dụng giáo dục
    imageUrl: '/education.png',
    isFeatured: false,
    isNew: true,
    downloadCount: 750,
    viewCount: 1100,
    rating: 4.9,
    version: '4.1.0',
    size: '~350MB',
    licenseType: 'Educational',
    createdAt: new Date('2023-09-30').toISOString(),
    updatedAt: new Date('2023-11-20').toISOString(),
    storeId: '1', // XLab Software
    features: [
      'Hơn 50 khóa học lập trình đa dạng từ cơ bản đến nâng cao',
      'IDE tích hợp và code playground ngay trong ứng dụng',
      'Lộ trình học được cá nhân hóa theo mục tiêu',
      'Dự án thực tế với hướng dẫn chi tiết',
      'Cộng đồng hỗ trợ và mentor chuyên nghiệp',
      'Chứng chỉ hoàn thành được công nhận bởi doanh nghiệp'
    ]
  },

  // Thêm tài khoản cho demo
  {
    id: 'acc-capcut',
    name: 'CapCut Pro',
    slug: 'capcut-pro',
    description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp.',
    longDescription: `
      <h2>CapCut Pro - Tài khoản cao cấp</h2>
      <p>Tài khoản CapCut Pro chính hãng với đầy đủ tính năng chỉnh sửa video chuyên nghiệp, không giới hạn thời gian sử dụng.</p>
      
      <h3>Tính năng:</h3>
      <ul>
        <li><strong>Xuất video 4K</strong>: Xuất video chất lượng cao không giới hạn</li>
        <li><strong>Hiệu ứng chuyên nghiệp</strong>: Truy cập toàn bộ hiệu ứng và template</li>
        <li><strong>Không watermark</strong>: Video không có logo</li>
        <li><strong>Tích hợp AI</strong>: Công cụ chỉnh sửa tự động bằng AI</li>
      </ul>
    `,
    price: 290000,
    salePrice: 199000,
    categoryId: 'cat-3',
    imageUrl: '/capcut.png',
    isFeatured: true,
    isNew: true,
    downloadCount: 280,
    viewCount: 450,
    rating: 4.8,
    version: '1.0',
    size: 'N/A',
    licenseType: 'Premium',
    createdAt: new Date('2023-11-20').toISOString(),
    updatedAt: new Date('2023-11-20').toISOString(),
    storeId: '3',
    isAccount: true,
    type: 'account',
    features: [
      'Tất cả hiệu ứng chuyên nghiệp',
      'Xuất video 4K không giới hạn',
      'Không watermark',
      'Công cụ chỉnh sửa AI',
      'Sử dụng trên nhiều thiết bị',
      'Đồng bộ cloud'
    ]
  },

  {
    id: 'acc-chatgpt-plus',
    name: 'Tài khoản ChatGPT Plus – OpenAI',
    slug: 'tai-khoan-chatgpt-plus-openai',
    description: 'Tài khoản ChatGPT Plus chính hãng với đầy đủ tính năng cao cấp từ OpenAI, luôn cập nhật tính năng mới.',
    longDescription: `
      <h2>ChatGPT là một chat bot cực mạnh hiện nay</h2>
      <p>Có thể trả lời được rất nhiều các câu hỏi cả tiếng anh và tiếng việt. Có thể hỗ trợ cả lập trình từ Front-end cho tới Back-end. Ngoài ra, tài khoản ChatGPT có khả năng trả lời nhiều loại câu hỏi khác nhau, bao gồm cả câu hỏi có liên quan đến lĩnh vực tri thức, văn hóa, xã hội và các lĩnh vực khác.</p>

      <h3>I. Bảng giá Tài khoản ChatGPT Plus – OpenAI</h3>
      <p>– Công nghệ GPT-4o, chuẩn bị cập nhật GPT-5 mới nhất.<br/>
      – Tài khoản chính hãng, đầy đủ tính năng Plus<br/>
      – Bảo hành trọn thời gian sử dụng</p>

      <p><strong>1) Gói dùng chung: 149.000đ/ 1 tháng, 399.000đ/ 3 tháng</strong></p>
      <p>– Tài khoản cấp dùng chung<br/>
      – Đăng nhập 1-2 thiết bị cố định.<br/>
      – Không đổi mật khẩu</p>

      <p><strong>2) Gói dùng riêng/ nâng cấp: 449.000đ / 1 tháng</strong></p>
      <p>– Nhận tài khoản tạo sẵn hoặc Nâng cấp tài khoản chính chủ, dùng riêng 100%.<br/>
      – Dùng nhiều thiết bị.<br/>
      – Được đổi mật khẩu.</p>

      <h3>II. Giới thiệu tài khoản ChatGPT – OpenAI</h3>
      <p>ChatGPT là một mô hình ngôn ngữ được huấn luyện bằng công nghệ transformer và được phát triển bởi OpenAI. Nó có khả năng học từ dữ liệu văn bản lớn và tự động sinh các câu trả lời liên quan đến các câu hỏi được đặt ra. Tài khoản ChatGPT có thể được sử dụng trong các ứng dụng chatbot, trò chuyện tự động và các hệ thống tư vấn khác. Nó cũng có khả năng tự động hoá các tác vụ như dịch văn bản, tự động điền vào mẫu và các tác vụ khác liên quan đến ngôn ngữ.</p>

      <p>ChatGPT có khả năng trả lời nhiều loại câu hỏi khác nhau, bao gồm cả câu hỏi có liên quan đến lĩnh vực tri thức, văn hóa, xã hội và các lĩnh vực khác. Nó cũng có thể trả lời các câu hỏi có tính chất hỏi đáp và câu hỏi yêu cầu phân tích sâu hơn. Tuy nhiên, Tài khoản ChatGPT không phải là một người hoặc hệ thống chuyên gia và không thể cung cấp các lời khuyên hoặc đưa ra các quyết định chuyên sâu trong các lĩnh vực cụ thể. Nó chỉ có thể trả lời các câu hỏi dựa trên dữ liệu văn bản mà nó được huấn luyện và không thể đưa ra các lời khuyên hoặc đưa ra các quyết định chuyên sâu.</p>

      <h3>III. Thông tin sản phẩm tài khoản OpenAI – ChatGPT</h3>
      <p>Đây là tài khoản đã được kích hoạt số điện thoại để sử dụng được ở mọi nơi.</p>

      <p>Để đăng nhập vào tài khoản bạn truy cập: <a href="https://chat.openai.com/chat/">https://chat.openai.com/chat/</a></p>

      <p>Trong tài khoản cũng có sẵn 5$ để có thể sử dụng các ứng dụng các ứng dụng khác của OpenAI thông qua API.</p>

      <p>Ví dụ: – Ứng dụng AI tự tạo hình ảnh: DALL-E</p>

      <p>– Kết nối các chức năng của OpenAI ra ứng dụng bên ngoài thông qua API.</p>

      <h3>IV. Câu hỏi thường gặp</h3>
      <p><strong>1. ChatGPT là gì?</strong></p>
      <p>ChatGPT là một mô hình ngôn ngữ được huấn luyện bằng công nghệ transformer và được phát triển bởi OpenAI. Nó có khả năng học từ dữ liệu văn bản lớn và tự động sinh các câu trả lời liên quan đến các câu hỏi được đặt ra. Tài khoản ChatGPT có thể được sử dụng trong các ứng dụng chatbot, trò chuyện tự động và các hệ thống tư vấn khác. Nó cũng có khả năng tự động hoá các tác vụ như dịch văn bản, tự động điền vào mẫu và các tác vụ khác liên quan đến ngôn ngữ.</p>

      <p><strong>2. ChatGPT có thể trả lời những câu hỏi gì?</strong></p>
      <p>Tài khoản Premium ChatGPT Plus có khả năng trả lời nhiều loại câu hỏi khác nhau, bao gồm cả câu hỏi có liên quan đến lĩnh vực tri thức, văn hóa, xã hội và các lĩnh vực khác. Nó cũng có thể trả lời các câu hỏi có tính chất hỏi đáp và câu hỏi yêu cầu phân tích sâu hơn.</p>

      <p><strong>3. ChatGPT có thể trả lời tiếng Việt không?</strong></p>
      <p>Tài khoản ChatGPT có khả năng trả lời Tiếng Việt. Nếu ChatGPT không trả lời Tiếng Việt bạn có thể bắt đầu cuộc hội thoại mới và bắt đầu với câu hỏi "Bạn có thể nói tiếng Việt không?" sau đó chat bình thường bằng tiếng Việt. Tuy nhiên ChatGPT sẽ trả lời tốt nhất bằng tiếng Anh vì vậy bạn nên hỏi bằng Tiếng Anh sau đó yêu cầu "Translate to Vietnamese" để dịch nội dung tiếng Anh qua tiếng Việt</p>

      <p><strong>4. ChatGPT bị ngắt khi chưa trả lời hết câu thì làm như thế nào?</strong></p>
      <p>Khi nội dung trả lời quá dài thì thường ChatGPT sẽ bị dừng giữa chừng và chưa đưa ra hết câu trả lời. Vấn đề này thường gặp khi hỏi đáp bằng tiếng Việt. Để AI đưa ra câu trả lời đầy đủ, bạn chat "Continue" hoặc "Tiếp tục" để AI viết tiếp nội dung đang trả lời. Nếu vẫn không được bạn nhấn vào "Regenerate response" để AI tạo lại nội dung.</p>

      <p><strong>5. Làm thế nào để ChatGPT theo sát một chủ đề mà tôi hỏi?</strong></p>
      <p>Bạn nên tạo các cuộc hội thoại theo từng chủ đề mà bạn muốn để Tài khoản ChatGPT có thể theo sát nhất từng chủ đề. Đồng thời việc này sẽ lưu lại các chủ đề bạn hỏi để sau này có thể hỏi tiếp. Đặc biệt hữu ích khi bạn hỏi đáp chuyên sâu về Lập Trình, AI sẽ hiểu được các lỗi bạn gặp phải ở chủ đề đó và đưa ra gợi ý chính xác hơn.</p>

      <p><strong>6. ChatGPT có miễn phí không?</strong></p>
      <p>Hiện tại chức năng chat với AI đang được miễn phí hoàn toàn. Bạn sẽ chỉ phải trả phí nếu sử dụng các tính năng nâng cao như: Kết nối API ra bên ngoài, Tự Training dữ liệu trả lời riêng. Chính sách miễn phí có thể thay đổi tùy theo định hướng của công ty OpenAI.</p>

      <p><strong>7. Tôi vào chat nhưng nhận được thông báo We're experiencing exceptionally high demand. Please hang tight as we work on scaling our systems. Sau đó tôi chat nhưng Bot trả lời rất chậm, tại sao lại như vậy?</strong></p>
      <p>Thông báo đó có nghĩa là chat OpenAI đang phải xử lý lượng truy cập quá lớn, hệ thống của họ chưa đáp ứng được nên sẽ có thể xảy ra hiện tượng lag, chậm. Nếu bạn gặp thông báo này thì có thể kiên nhẫn thử lại sau ạ.</p>
    `,
    price: 449000,
    salePrice: 149000,
    categoryId: 'cat-6', // Tài khoản học tập
    imageUrl: '/chatgpt.png',
    isFeatured: true,
    isNew: true,
    downloadCount: 820,
    viewCount: 1580,
    rating: 4.9,
    version: '2024',
    size: 'N/A',
    licenseType: 'Premium Account',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
    storeId: '1', // XLab Software
    isAccount: true,
    type: 'account',
    features: [
      'Tài khoản chính hãng, luôn update tính năng mới',
      'Nhiều loại tài khoản để bạn chọn theo nhu cầu',
      'Đăng nhập sử dụng trực tiếp tại Việt Nam không cần VPN',
      'Bảo hành 1 đổi 1 ngay khi có lỗi',
      'Công nghệ GPT-4o, chuẩn bị cập nhật GPT-5 mới nhất',
      'Truy cập đầy đủ tính năng Plus như DALL-E'
    ],
    options: [
      { name: 'Dùng chung - 1 tháng', price: 149000 },
      { name: 'Dùng chung - 3 tháng', price: 399000 },
      { name: 'Dùng riêng - 1 tháng', price: 449000 },
      { name: 'Nâng cấp - 1 tháng', price: 449000 }
    ]
  },

  {
    id: 'acc-adobe',
    name: 'Adobe Creative Cloud',
    slug: 'adobe-creative-cloud',
    description: 'Tài khoản Adobe Creative Cloud với đầy đủ ứng dụng thiết kế và chỉnh sửa chuyên nghiệp.',
    longDescription: `
      <h2>Adobe Creative Cloud - Tài khoản cao cấp</h2>
      <p>Truy cập toàn bộ bộ ứng dụng Adobe Creative Cloud với tài khoản chính hãng. Sử dụng Photoshop, Illustrator, Premiere Pro và nhiều ứng dụng khác.</p>
      
      <h3>Bao gồm:</h3>
      <ul>
        <li><strong>Photoshop</strong>: Chỉnh sửa ảnh chuyên nghiệp</li>
        <li><strong>Illustrator</strong>: Thiết kế vector</li>
        <li><strong>Premiere Pro</strong>: Biên tập video</li>
        <li><strong>After Effects</strong>: Hiệu ứng và motion graphics</li>
        <li><strong>Nhiều ứng dụng khác</strong>: InDesign, XD, Lightroom...</li>
      </ul>
    `,
    price: 1290000,
    salePrice: 1290000,
    categoryId: 'cat-3',
    imageUrl: '/adobe.png',
    isFeatured: true,
    isNew: false,
    downloadCount: 310,
    viewCount: 450,
    rating: 4.8,
    version: '1.0',
    size: 'N/A',
    licenseType: 'Premium',
    createdAt: new Date('2023-08-15').toISOString(),
    updatedAt: new Date('2023-10-10').toISOString(),
    storeId: '3',
    isAccount: true,
    type: 'account',
    features: [
      'Truy cập toàn bộ bộ ứng dụng Adobe',
      'Cập nhật phiên bản mới nhất',
      'Lưu trữ cloud 100GB',
      'Thư viện font, template và asset',
      'Các công cụ AI tích hợp',
      'Đồng bộ giữa các thiết bị'
    ]
  }
];

// Mock Reviews (Optional - Can add later if needed)
// ... existing code ... 