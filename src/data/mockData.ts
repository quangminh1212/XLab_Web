import { Product, Category, Store } from '@/types';

// Mock Categories
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Phần mềm doanh nghiệp',
    slug: 'phan-mem-doanh-nghiep',
    description: 'Các phần mềm phục vụ cho doanh nghiệp như ERP, CRM, thanh toán...',
    imageUrl: '/images/categories/productivity.png',
    productCount: 0
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
    productCount: 0
  },
  {
    id: 'cat-4',
    name: 'Bảo mật & Antivirus',
    slug: 'bao-mat-antivirus',
    description: 'Các phần mềm bảo mật, diệt virus, mã hóa dữ liệu...',
    imageUrl: '/images/categories/security.png',
    productCount: 0
  },
  {
    id: 'cat-5',
    name: 'Ứng dụng giáo dục',
    slug: 'ung-dung-giao-duc',
    description: 'Các ứng dụng học ngoại ngữ, lập trình, toán học...',
    imageUrl: '/images/categories/education.png',
    productCount: 0
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
    imageUrl: '/voicetyping.png',
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
  }
];

// Mock Reviews (Optional - Can add later if needed)
// ... existing code ... 