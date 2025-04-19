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
    id: 'prod-vt',
    name: 'VoiceTyping',
    slug: 'voicetyping',
    description: 'Nhập văn bản bằng giọng nói tại vị trí con trỏ chuột sử dụng Google Speech Recognition.',
    longDescription: `
      <h2>VoiceTyping - Nhập liệu bằng giọng nói</h2>
      <p>VoiceTyping là một ứng dụng máy tính cho phép người dùng nhập văn bản bằng giọng nói tại vị trí con trỏ chuột, sử dụng công nghệ nhận dạng giọng nói của Google Speech Recognition.</p>

      <h3>Kiến trúc:</h3>
      <ul>
        <li><strong>Frontend:</strong> Giao diện người dùng (GUI) xây dựng bằng PyQt5.</li>
        <li><strong>Backend:</strong>
          <ul>
            <li>Mô-đun nhận dạng giọng nói (SpeechRecognition với Google Speech API).</li>
            <li>Mô-đun xử lý văn bản (NLTK).</li>
            <li>Mô-đun điều khiển con trỏ và nhập liệu (PyAutoGUI, pyperclip, keyboard).</li>
          </ul>
        </li>
      </ul>

      <h3>Công nghệ sử dụng:</h3>
      <ul>
        <li>Python</li>
        <li>PyQt5</li>
        <li>SpeechRecognition</li>
        <li>PyAutoGUI, pyperclip, keyboard</li>
        <li>NLTK</li>
        <li>PyAudio, pydub (yêu cầu FFmpeg)</li>
      </ul>

      <h3>Cài đặt và Sử dụng:</h3>
      <p>Xem chi tiết trong file README đi kèm hoặc tải về bản cài đặt.</p>
      <p><strong>Yêu cầu:</strong> Cần cài đặt FFmpeg.</p>

      <h3>Giấy phép:</h3>
      <p>Phân phối dưới giấy phép MIT.</p>
    `,
    price: 0, // Miễn phí
    salePrice: 0,
    categoryId: 'cat-2', // Ứng dụng văn phòng
    imageUrl: '/images/placeholder-product.jpg', // Sử dụng ảnh placeholder đã có
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
    storeId: '1' // XLab Software
  },
  {
    id: 'prod-xpdf',
    name: 'XLab PDF Editor',
    slug: 'xlab-pdf-editor',
    description: 'Công cụ chỉnh sửa PDF với các tính năng cao cấp: chỉnh sửa văn bản, thêm chữ ký, OCR...',
    longDescription: `
      <h2>XLab PDF Editor - Giải pháp chỉnh sửa PDF toàn diện</h2>
      <p>XLab PDF Editor là công cụ chỉnh sửa PDF mạnh mẽ, cho phép bạn chỉnh sửa văn bản, hình ảnh trong PDF, thêm chữ ký điện tử, và nhiều tính năng khác.</p>

      <h3>Tính năng chính:</h3>
      <ul>
        <li>Chỉnh sửa văn bản và hình ảnh trực tiếp trong file PDF</li>
        <li>Thêm, xóa, di chuyển trang</li>
        <li>Thêm chữ ký điện tử</li>
        <li>Công nghệ OCR nhận dạng văn bản trong ảnh</li>
        <li>Chuyển đổi PDF sang các định dạng khác (Word, Excel, HTML...)</li>
        <li>Bảo vệ PDF bằng mật khẩu</li>
      </ul>

      <h3>Yêu cầu hệ thống:</h3>
      <ul>
        <li>Windows 10/11 (64-bit)</li>
        <li>Mac OS X 10.13 trở lên</li>
        <li>4GB RAM trở lên</li>
        <li>1GB dung lượng ổ cứng</li>
      </ul>
    `,
    price: 1200000, 
    salePrice: 990000,
    categoryId: 'cat-2', // Ứng dụng văn phòng
    imageUrl: '/images/placeholder-product.jpg',
    isFeatured: true,
    isNew: true,
    downloadCount: 450,
    viewCount: 780,
    rating: 4.8,
    version: '2.1.5',
    size: '120MB',
    licenseType: 'Commercial',
    createdAt: new Date('2023-05-10').toISOString(),
    updatedAt: new Date('2023-07-15').toISOString(),
    storeId: '1' // XLab Software
  },
  {
    id: 'prod-xsec',
    name: 'XSecure Antivirus',
    slug: 'xsecure-antivirus',
    description: 'Giải pháp bảo mật toàn diện cho máy tính với khả năng phát hiện và loại bỏ mã độc thời gian thực.',
    longDescription: `
      <h2>XSecure Antivirus - Bảo vệ toàn diện cho thiết bị của bạn</h2>
      <p>XSecure Antivirus là giải pháp bảo mật toàn diện, bảo vệ máy tính của bạn khỏi các mối đe dọa an ninh mạng như virus, malware, ransomware và các cuộc tấn công lừa đảo.</p>

      <h3>Tính năng bảo mật:</h3>
      <ul>
        <li>Quét và bảo vệ thời gian thực</li>
        <li>Tường lửa thông minh</li>
        <li>Phát hiện và ngăn chặn ransomware</li>
        <li>Bảo vệ khi duyệt web</li>
        <li>Bảo vệ giao dịch ngân hàng</li>
        <li>Kiểm soát ứng dụng</li>
        <li>Lá chắn email chống lừa đảo</li>
      </ul>

      <h3>Hiệu suất:</h3>
      <p>XSecure Antivirus được thiết kế để sử dụng tối thiểu tài nguyên hệ thống, đảm bảo máy tính của bạn vẫn hoạt động mượt mà khi được bảo vệ.</p>
    `,
    price: 590000, 
    salePrice: 490000,
    categoryId: 'cat-4', // Bảo mật & Antivirus
    imageUrl: '/images/placeholder-product.jpg',
    isFeatured: true,
    isNew: false,
    downloadCount: 1250,
    viewCount: 2100,
    rating: 4.7,
    version: '3.0.2',
    size: '85MB',
    licenseType: 'Commercial',
    createdAt: new Date('2023-01-20').toISOString(),
    updatedAt: new Date('2023-06-12').toISOString(),
    storeId: '1' // XLab Software
  }
];

// Mock Reviews (Optional - Can add later if needed)
// ... existing code ... 