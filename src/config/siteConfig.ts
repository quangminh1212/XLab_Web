/**
 * Cấu hình thông tin trang web
 * File này chứa các thông tin cá nhân và cấu hình chung cho trang web XLab
 */

export const siteConfig = {
    // Thông tin cơ bản
    name: 'XLab',
    description: 'Phần mềm riêng của bạn - Tải về và sử dụng ngay hôm nay',
    url: 'https://xlab.vn',

    // Thông tin liên hệ
    contact: {
        email: 'xlab.rnd@gmail.com',
        phone: '+84 866 528 014', // Thay đổi thành số điện thoại thật
        address: 'Long Biên, Hà Nội',
        workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
    },

    // Mạng xã hội
    social: {
        facebook: 'https://facebook.com/xlabvn',
        twitter: 'https://twitter.com/xlabvn',
        github: 'https://github.com/xlabvn',
        linkedin: 'https://linkedin.com/company/xlabvn',
    },

    // Cấu hình pháp lý
    legal: {
        companyName: 'XLab Technologies',
        taxId: '0123456789', // Thay đổi thành mã số thuế thật
        registrationNumber: 'REG123456789', // Thay đổi thành số đăng ký kinh doanh thật
        termsLastUpdated: '28/03/2025',
        privacyLastUpdated: '28/03/2025',
    },

    // Cấu hình SEO
    seo: {
        titleTemplate: '%s | XLab',
        defaultTitle: 'XLab - Phần mềm riêng của bạn',
        defaultDescription: 'XLab cung cấp các ứng dụng, phần mềm chất lượng cao cho cá nhân và doanh nghiệp.',
        twitterHandle: '@xlabvn',
        ogImage: '/images/og-image.jpg',
    },

    // Cấu hình thanh toán
    payment: {
        currency: 'VND',
        supportedMethods: ['visa', 'mastercard', 'momo', 'zalopay', 'banking'],
        vatRate: 10, // Thuế VAT tính theo %
    },

    // Mã đối tác và tracking
    analytics: {
        googleAnalyticsId: '', // Thêm Google Analytics ID
        facebookPixelId: '', // Thêm Facebook Pixel ID
    },

    // Thông báo JavaScript bị vô hiệu hóa
    noJavaScriptTitle: 'JavaScript Bị Vô Hiệu Hóa',
    noJavaScriptMessage: 'Website này yêu cầu JavaScript để hoạt động đúng. Vui lòng bật JavaScript và tải lại trang.',
}

// Danh sách các trang trong footer
export const footerLinks = [
    {
        title: 'Sản phẩm',
        links: [
            { name: 'Tất cả sản phẩm', href: '/products' },
            { name: 'Mới phát hành', href: '/products?sort=newest' },
            { name: 'Phổ biến nhất', href: '/products?sort=popular' },
            { name: 'Khuyến mãi', href: '/products?onSale=true' },
        ],
    },
    {
        title: 'Hỗ trợ',
        links: [
            { name: 'Liên hệ', href: '/contact' },
            { name: 'FAQ', href: '/faq' },
            { name: 'Hướng dẫn sử dụng', href: '/guides' },
            { name: 'Báo lỗi', href: '/support' },
        ],
    },
    {
        title: 'Về chúng tôi',
        links: [
            { name: 'Giới thiệu', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Tuyển dụng', href: '/careers' },
            { name: 'Đối tác', href: '/partners' },
        ],
    },
    {
        title: 'Pháp lý',
        links: [
            { name: 'Điều khoản dịch vụ', href: '/terms' },
            { name: 'Chính sách bảo mật', href: '/privacy' },
            { name: 'Chính sách hoàn tiền', href: '/refund-policy' },
            { name: 'Quyền sở hữu trí tuệ', href: '/ip-rights' },
        ],
    },
];

// Cấu hình đăng ký nhận tin
export const newsletterConfig = {
    title: 'Đăng ký nhận thông tin mới',
    description: 'Nhận thông tin về sản phẩm mới, khuyến mãi và cập nhật từ XLab',
    privacyText: 'Chúng tôi tôn trọng quyền riêng tư của bạn. Xem Chính sách Bảo mật của chúng tôi.',
}; 