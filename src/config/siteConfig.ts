/**
 * Cấu hình thông tin trang web
 * File này chứa các thông tin cá nhân và cấu hình chung cho trang web XLab
 */

export const siteConfig = {
  // Thông tin cơ bản
  name: 'XLab',
  description: 'Tối ưu hiệu quả, tối thiểu chi phí!',
  url: 'https://xlab.vn',

  // Thông tin liên hệ
  contact: {
    email: 'xlab.rnd@gmail.com',
    phone: '+84 866 528 014', // Thay đổi thành số điện thoại thật
    address: 'Long Biên, Hà Nội',
    workingHours: ' 24/7',
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
    titleTemplate: '%s | XLab - Giải pháp công nghệ tiên tiến',
    defaultTitle: 'XLab - Tối ưu hiệu quả, tối thiểu chi phí | Công nghệ AI, Cloud & Software',
    defaultDescription:
      'XLab cung cấp giải pháp phần mềm, ứng dụng AI và dịch vụ Cloud chất lượng cao cho cá nhân và doanh nghiệp. Tối ưu hiệu quả, tiết kiệm chi phí.',
    twitterHandle: '@xlabvn',
    ogImage: '/images/og-image.jpg',
    keywords: [
      'XLab',
      'phần mềm',
      'dịch vụ CNTT',
      'giải pháp doanh nghiệp',
      'phát triển phần mềm',
      'cloud services',
      'trí tuệ nhân tạo',
      'AI',
      'công nghệ Việt Nam',
      'chatgpt',
      'grok',
      'canva',
      'dịch vụ đám mây',
      'cloud computing',
      'phần mềm quản lý',
      'giải pháp số',
      'chuyển đổi số',
      'digital transformation',
      'vietnam tech',
      'Vietnam software',
    ],
    localBusiness: {
      type: 'Organization',
      name: 'XLab Technologies',
      description: 'Công ty cung cấp giải pháp công nghệ và phần mềm hiện đại',
      url: 'https://xlab.vn',
      telephone: '+84 866 528 014',
      address: {
        streetAddress: 'Long Biên',
        addressLocality: 'Hà Nội',
        addressRegion: 'Hà Nội',
        postalCode: '100000',
        addressCountry: 'VN',
      },
      geo: {
        latitude: '21.0245', // Thay đổi thành tọa độ thật
        longitude: '105.8412', // Thay đổi thành tọa độ thật
      },
      openingHours: 'Mo,Tu,We,Th,Fr,Sa,Su 00:00-24:00',
    },
    structuredData: {
      organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'XLab Technologies',
        url: 'https://xlab.vn',
        logo: 'https://xlab.vn/images/logo.png',
        sameAs: [
          'https://facebook.com/xlabvn',
          'https://twitter.com/xlabvn',
          'https://linkedin.com/company/xlabvn',
        ],
      },
    },
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
    googleTagManagerId: '', // Thêm Google Tag Manager ID
    googleSearchConsoleId: '', // Thêm Google Search Console ID
  },
};

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
