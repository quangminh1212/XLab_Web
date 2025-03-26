export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    price: string;
    priceNumeric: number; // Giá số để sắp xếp
    category: string;
    industry: string[];
    features: string[];
    imageUrl?: string;
    isBestSeller?: boolean;
    isNew?: boolean;
}

export const industries = [
    { id: 'all', name: 'Tất cả ngành' },
    { id: 'education', name: 'Giáo dục' },
    { id: 'finance', name: 'Tài chính - Ngân hàng' },
    { id: 'healthcare', name: 'Y tế - Sức khỏe' },
    { id: 'retail', name: 'Bán lẻ' },
    { id: 'manufacturing', name: 'Sản xuất' },
    { id: 'real-estate', name: 'Bất động sản' },
    { id: 'services', name: 'Dịch vụ' },
    { id: 'technology', name: 'Công nghệ' },
];

export const categories = [
    { id: 'all', name: 'Tất cả danh mục' },
    { id: 'business', name: 'Quản lý doanh nghiệp' },
    { id: 'security', name: 'Bảo mật' },
    { id: 'development', name: 'Phát triển phần mềm' },
    { id: 'design', name: 'Thiết kế' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'data', name: 'Dữ liệu' },
];

// Dữ liệu mẫu cho sản phẩm
export const products: Product[] = [
    {
        id: 'analytics',
        name: 'XLab Analytics',
        description: 'Giải pháp phân tích dữ liệu hiện đại giúp doanh nghiệp ra quyết định thông minh.',
        shortDescription: 'Biến dữ liệu thành thông tin hữu ích cho doanh nghiệp của bạn.',
        price: '1.990.000đ',
        priceNumeric: 1990000,
        category: 'data',
        industry: ['finance', 'retail', 'education', 'manufacturing', 'technology'],
        features: [
            'Phân tích dữ liệu thời gian thực',
            'Báo cáo tùy chỉnh',
            'Tích hợp với nhiều nguồn dữ liệu',
            'Giao diện trực quan dễ sử dụng',
            'Hỗ trợ xuất báo cáo nhiều định dạng',
        ],
        imageUrl: '/images/products/analytics.svg',
        isBestSeller: true,
    },
    {
        id: 'security',
        name: 'XLab Security',
        description: 'Bảo vệ dữ liệu quan trọng của bạn với giải pháp bảo mật toàn diện.',
        shortDescription: 'Giải pháp bảo mật toàn diện cho doanh nghiệp.',
        price: '2.490.000đ',
        priceNumeric: 2490000,
        category: 'security',
        industry: ['finance', 'healthcare', 'technology', 'services'],
        features: [
            'Mã hóa dữ liệu đầu cuối',
            'Xác thực đa yếu tố',
            'Phát hiện xâm nhập thời gian thực',
            'Quản lý quyền truy cập',
            'Sao lưu tự động và phục hồi dữ liệu',
        ],
        imageUrl: '/images/products/security.svg',
    },
    {
        id: 'developer',
        name: 'XLab Developer',
        description: 'Bộ công cụ phát triển phần mềm cao cấp cho các lập trình viên chuyên nghiệp.',
        shortDescription: 'Nâng cao năng suất phát triển phần mềm.',
        price: '1.790.000đ',
        priceNumeric: 1790000,
        category: 'development',
        industry: ['technology'],
        features: [
            'Môi trường phát triển tích hợp',
            'Hỗ trợ nhiều ngôn ngữ lập trình',
            'Công cụ phân tích mã nguồn',
            'Tự động hóa quy trình CI/CD',
            'Quản lý phiên bản và hợp tác',
        ],
        imageUrl: '/images/products/developer.svg',
    },
    {
        id: 'design',
        name: 'XLab Design',
        description: 'Công cụ thiết kế chuyên nghiệp cho các nhà thiết kế và doanh nghiệp.',
        shortDescription: 'Thiết kế đẹp mắt, chuyên nghiệp với giao diện dễ sử dụng.',
        price: '1.590.000đ',
        priceNumeric: 1590000,
        category: 'design',
        industry: ['technology', 'services', 'retail'],
        features: [
            'Thiết kế giao diện người dùng',
            'Thư viện mẫu và biểu tượng phong phú',
            'Công cụ tạo prototype tương tác',
            'Hỗ trợ thiết kế đáp ứng',
            'Xuất thiết kế sang nhiều định dạng',
        ],
        imageUrl: '/images/products/design.svg',
    },
    {
        id: 'crm',
        name: 'XLab CRM',
        description: 'Quản lý quan hệ khách hàng hiệu quả với giao diện thân thiện.',
        shortDescription: 'Tối ưu hóa quy trình bán hàng và chăm sóc khách hàng.',
        price: '2.190.000đ',
        priceNumeric: 2190000,
        category: 'business',
        industry: ['retail', 'services', 'real-estate', 'finance'],
        features: [
            'Quản lý thông tin khách hàng',
            'Theo dõi cơ hội bán hàng',
            'Tự động hóa email marketing',
            'Báo cáo hiệu suất bán hàng',
            'Tích hợp với nhiều nền tảng',
        ],
        imageUrl: '/images/products/crm.svg',
        isBestSeller: true,
    },
    {
        id: 'erp',
        name: 'XLab ERP',
        description: 'Giải pháp hoạch định nguồn lực doanh nghiệp toàn diện.',
        shortDescription: 'Tối ưu quy trình kinh doanh và tăng hiệu quả quản lý.',
        price: '3.290.000đ',
        priceNumeric: 3290000,
        category: 'business',
        industry: ['manufacturing', 'retail', 'services'],
        features: [
            'Quản lý tài chính kế toán',
            'Quản lý nhân sự và tiền lương',
            'Quản lý chuỗi cung ứng',
            'Quản lý sản xuất',
            'Báo cáo phân tích kinh doanh',
        ],
        imageUrl: '/images/products/erp.svg',
    },
    {
        id: 'edu-platform',
        name: 'XLab Education',
        description: 'Nền tảng học trực tuyến cho các tổ chức giáo dục và đào tạo doanh nghiệp.',
        shortDescription: 'Chuyển đổi số cho lĩnh vực giáo dục và đào tạo.',
        price: '2.390.000đ',
        priceNumeric: 2390000,
        category: 'business',
        industry: ['education'],
        features: [
            'Hệ thống quản lý học tập (LMS)',
            'Công cụ tạo bài giảng tương tác',
            'Phòng học trực tuyến',
            'Đánh giá và theo dõi tiến độ học tập',
            'Tích hợp với các nền tảng học tập khác',
        ],
        imageUrl: '/images/products/education.svg',
        isNew: true,
    },
    {
        id: 'healthcare-suite',
        name: 'XLab Healthcare',
        description: 'Bộ giải pháp quản lý y tế toàn diện cho bệnh viện và phòng khám.',
        shortDescription: 'Nâng cao chất lượng chăm sóc y tế với công nghệ hiện đại.',
        price: '3.490.000đ',
        priceNumeric: 3490000,
        category: 'business',
        industry: ['healthcare'],
        features: [
            'Hồ sơ bệnh án điện tử',
            'Quản lý lịch hẹn và đặt khám',
            'Quản lý thuốc và thiết bị y tế',
            'Báo cáo và thống kê y tế',
            'Tích hợp với thiết bị y tế',
        ],
        imageUrl: '/images/products/healthcare.svg',
        isNew: true,
    },
    {
        id: 'realestate-manager',
        name: 'XLab RealEstate',
        description: 'Giải pháp quản lý và kinh doanh bất động sản chuyên nghiệp.',
        shortDescription: 'Tối ưu hoạt động kinh doanh bất động sản.',
        price: '2.790.000đ',
        priceNumeric: 2790000,
        category: 'business',
        industry: ['real-estate'],
        features: [
            'Quản lý thông tin bất động sản',
            'Quản lý giao dịch và hợp đồng',
            'Marketing và quảng cáo bất động sản',
            'Báo cáo và phân tích thị trường',
            'Tích hợp với cổng thông tin BĐS',
        ],
        imageUrl: '/images/products/realestate.svg',
        isNew: true,
    },
]; 