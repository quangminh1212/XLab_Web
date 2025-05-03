<<<<<<< HEAD
import { Product, Category, Store } from '@/types';
=======
import { Product, Category, Store, User } from '@/types';
>>>>>>> 2aea817a

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
    imageUrl: '/speech-text.png',
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
  }
];

<<<<<<< HEAD
=======
// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: '/images/avatar-1.png',
    role: 'ADMIN',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: '/images/avatar-2.png',
    role: 'USER',
    createdAt: '2023-01-05',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    image: '/images/avatar-3.png',
    role: 'USER',
    createdAt: '2023-01-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    image: '/images/avatar-4.png',
    role: 'USER',
    createdAt: '2023-01-15',
  },
];

>>>>>>> 2aea817a
// Mock Reviews (Optional - Can add later if needed)
// ... existing code ... 