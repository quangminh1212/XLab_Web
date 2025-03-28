/**
 * Các bản dịch phổ biến trên toàn bộ trang web
 */

const translations = {
    // Trang chủ
    home: {
        heroSubtitle: {
            vi: 'Các giải pháp phần mềm và dịch vụ công nghệ chất lượng cao cho doanh nghiệp của bạn',
            en: 'High-quality software solutions and technology services for your business'
        },
        featuredProducts: {
            vi: 'Sản phẩm nổi bật',
            en: 'Featured Products'
        },
        newProducts: {
            vi: 'Sản phẩm mới',
            en: 'New Products'
        },
        popularProducts: {
            vi: 'Sản phẩm phổ biến',
            en: 'Popular Products'
        }
    },

    // Phần header và navigation
    navigation: {
        home: {
            vi: 'Trang chủ',
            en: 'Home'
        },
        products: {
            vi: 'Sản phẩm',
            en: 'Products'
        },
        services: {
            vi: 'Dịch vụ',
            en: 'Services'
        },
        about: {
            vi: 'Giới thiệu',
            en: 'About'
        },
        contact: {
            vi: 'Liên hệ',
            en: 'Contact'
        },
        login: {
            vi: 'Đăng nhập',
            en: 'Login'
        },
        register: {
            vi: 'Đăng ký',
            en: 'Register'
        },
        myAccount: {
            vi: 'Tài khoản của tôi',
            en: 'My Account'
        },
        settings: {
            vi: 'Cài đặt',
            en: 'Settings'
        },
        logout: {
            vi: 'Đăng xuất',
            en: 'Logout'
        },
        loggedInAs: {
            vi: 'Đăng nhập bằng',
            en: 'Logged in as'
        },
        skipToContent: {
            vi: 'Bỏ qua phần điều hướng',
            en: 'Skip to content'
        },
        categories: {
            vi: 'Danh mục',
            en: 'Categories'
        }
    },

    // Actions (hành động)
    actions: {
        search: {
            vi: 'Tìm kiếm...',
            en: 'Search...'
        },
        viewAll: {
            vi: 'Xem tất cả',
            en: 'View all'
        },
        readMore: {
            vi: 'Đọc tiếp',
            en: 'Read more'
        },
        learnMore: {
            vi: 'Tìm hiểu thêm',
            en: 'Learn more'
        },
        addToCart: {
            vi: 'Thêm vào giỏ hàng',
            en: 'Add to cart'
        },
        buyNow: {
            vi: 'Mua ngay',
            en: 'Buy now'
        },
        submit: {
            vi: 'Gửi',
            en: 'Submit'
        },
        cancel: {
            vi: 'Hủy',
            en: 'Cancel'
        },
        save: {
            vi: 'Lưu',
            en: 'Save'
        },
        edit: {
            vi: 'Sửa',
            en: 'Edit'
        },
        delete: {
            vi: 'Xóa',
            en: 'Delete'
        },
        download: {
            vi: 'Tải xuống',
            en: 'Download'
        },
        viewDetails: {
            vi: 'Xem chi tiết',
            en: 'View details'
        }
    },

    // Thông báo và thông điệp hệ thống
    messages: {
        loading: {
            vi: 'Đang tải...',
            en: 'Loading...'
        },
        error: {
            vi: 'Đã xảy ra lỗi',
            en: 'An error occurred'
        },
        success: {
            vi: 'Thành công!',
            en: 'Success!'
        },
        required: {
            vi: 'Trường này là bắt buộc',
            en: 'This field is required'
        },
        invalidEmail: {
            vi: 'Email không hợp lệ',
            en: 'Invalid email address'
        },
        javascriptDisabled: {
            vi: 'JavaScript Bị Vô Hiệu Hóa',
            en: 'JavaScript Disabled'
        },
        jsRequiredMessage: {
            vi: 'Website này yêu cầu JavaScript để hoạt động đúng. Vui lòng bật JavaScript và tải lại trang.',
            en: 'This website requires JavaScript to function properly. Please enable JavaScript and reload the page.'
        },
        productComingSoon: {
            vi: 'Sản phẩm sắp ra mắt',
            en: 'Product coming soon'
        },
        systemUpdating: {
            vi: 'Hệ thống đang được cập nhật. Vui lòng quay lại sau.',
            en: 'System is being updated. Please check back later.'
        }
    },

    // Các trường trong form
    forms: {
        email: {
            vi: 'Email',
            en: 'Email'
        },
        password: {
            vi: 'Mật khẩu',
            en: 'Password'
        },
        confirmPassword: {
            vi: 'Xác nhận mật khẩu',
            en: 'Confirm password'
        },
        firstName: {
            vi: 'Tên',
            en: 'First name'
        },
        lastName: {
            vi: 'Họ',
            en: 'Last name'
        },
        fullName: {
            vi: 'Họ và tên',
            en: 'Full name'
        },
        phone: {
            vi: 'Số điện thoại',
            en: 'Phone number'
        },
        address: {
            vi: 'Địa chỉ',
            en: 'Address'
        },
        city: {
            vi: 'Thành phố',
            en: 'City'
        },
        state: {
            vi: 'Tỉnh/Thành phố',
            en: 'State/Province'
        },
        country: {
            vi: 'Quốc gia',
            en: 'Country'
        },
        postalCode: {
            vi: 'Mã bưu điện',
            en: 'Postal code'
        },
        company: {
            vi: 'Công ty',
            en: 'Company'
        },
        message: {
            vi: 'Nội dung',
            en: 'Message'
        },
        subject: {
            vi: 'Tiêu đề',
            en: 'Subject'
        }
    },

    // Phần footer
    footer: {
        products: {
            vi: 'Sản phẩm',
            en: 'Products'
        },
        allProducts: {
            vi: 'Tất cả sản phẩm',
            en: 'All products'
        },
        newReleases: {
            vi: 'Mới phát hành',
            en: 'New releases'
        },
        mostPopular: {
            vi: 'Phổ biến nhất',
            en: 'Most popular'
        },
        onSale: {
            vi: 'Khuyến mãi',
            en: 'On sale'
        },
        support: {
            vi: 'Hỗ trợ',
            en: 'Support'
        },
        contact: {
            vi: 'Liên hệ',
            en: 'Contact'
        },
        faq: {
            vi: 'FAQ',
            en: 'FAQ'
        },
        userGuides: {
            vi: 'Hướng dẫn sử dụng',
            en: 'User guides'
        },
        reportBug: {
            vi: 'Báo lỗi',
            en: 'Report a bug'
        },
        aboutUs: {
            vi: 'Về chúng tôi',
            en: 'About us'
        },
        blog: {
            vi: 'Blog',
            en: 'Blog'
        },
        careers: {
            vi: 'Tuyển dụng',
            en: 'Careers'
        },
        partners: {
            vi: 'Đối tác',
            en: 'Partners'
        },
        legal: {
            vi: 'Pháp lý',
            en: 'Legal'
        },
        termsOfService: {
            vi: 'Điều khoản dịch vụ',
            en: 'Terms of service'
        },
        privacyPolicy: {
            vi: 'Chính sách bảo mật',
            en: 'Privacy policy'
        },
        refundPolicy: {
            vi: 'Chính sách hoàn tiền',
            en: 'Refund policy'
        },
        intellectualProperty: {
            vi: 'Quyền sở hữu trí tuệ',
            en: 'Intellectual property'
        },
        newsletter: {
            vi: 'Đăng ký nhận thông tin mới',
            en: 'Sign up for newsletter'
        },
        newsletterDescription: {
            vi: 'Nhận thông tin về sản phẩm mới, khuyến mãi và cập nhật từ XLab',
            en: 'Get updates on new products, promotions, and news from XLab'
        },
        subscribeButton: {
            vi: 'Đăng ký',
            en: 'Subscribe'
        },
        copyright: {
            vi: 'Bản quyền',
            en: 'Copyright'
        },
        allRightsReserved: {
            vi: 'Tất cả quyền được bảo lưu',
            en: 'All rights reserved'
        },
        companyDescription: {
            vi: 'XLab cung cấp các giải pháp phần mềm và dịch vụ CNTT chất lượng cao, giúp doanh nghiệp của bạn phát triển trong kỷ nguyên số.',
            en: 'XLab provides high-quality software solutions and IT services, helping your business thrive in the digital era.'
        },
        emailPlaceholder: {
            vi: 'Email của bạn',
            en: 'Your email'
        }
    },

    // Trang liên hệ
    contact: {
        pageTitle: {
            vi: 'Liên hệ với chúng tôi',
            en: 'Contact Us'
        },
        pageDescription: {
            vi: 'Bạn có câu hỏi hoặc yêu cầu? Hãy liên hệ ngay với chúng tôi.',
            en: 'Have questions or requests? Contact us right away.'
        },
        sendMessage: {
            vi: 'Gửi tin nhắn cho chúng tôi',
            en: 'Send us a message'
        },
        name: {
            vi: 'Họ tên của bạn',
            en: 'Your name'
        },
        email: {
            vi: 'Email của bạn',
            en: 'Your email'
        },
        phone: {
            vi: 'Số điện thoại',
            en: 'Phone number'
        },
        subject: {
            vi: 'Tiêu đề',
            en: 'Subject'
        },
        selectSubject: {
            vi: 'Chọn tiêu đề',
            en: 'Select subject'
        },
        generalInquiry: {
            vi: 'Thắc mắc chung',
            en: 'General inquiry'
        },
        technicalSupport: {
            vi: 'Hỗ trợ kỹ thuật',
            en: 'Technical support'
        },
        salesInquiry: {
            vi: 'Thông tin bán hàng',
            en: 'Sales inquiry'
        },
        partnership: {
            vi: 'Hợp tác',
            en: 'Partnership'
        },
        message: {
            vi: 'Tin nhắn của bạn',
            en: 'Your message'
        },
        send: {
            vi: 'Gửi tin nhắn',
            en: 'Send message'
        },
        contactInfo: {
            vi: 'Thông tin liên hệ',
            en: 'Contact information'
        },
        address: {
            vi: 'Địa chỉ',
            en: 'Address'
        },
        businessHours: {
            vi: 'Giờ làm việc',
            en: 'Business hours'
        },
        weekdays: {
            vi: 'Thứ Hai - Thứ Sáu: 8:00 - 17:00',
            en: 'Monday - Friday: 8:00 AM - 5:00 PM'
        },
        weekend: {
            vi: 'Thứ Bảy: 9:00 - 12:00',
            en: 'Saturday: 9:00 AM - 12:00 PM'
        },
        closed: {
            vi: 'Chủ Nhật: Đóng cửa',
            en: 'Sunday: Closed'
        },
        findUs: {
            vi: 'Tìm chúng tôi tại',
            en: 'Find us at'
        },
        mapPlaceholder: {
            vi: 'Bản đồ tới văn phòng của chúng tôi',
            en: 'Map to our office'
        }
    },

    // Trạng thái tải
    loading: {
        title: {
            vi: 'Đang tải dữ liệu',
            en: 'Loading data'
        },
        message: {
            vi: 'Vui lòng đợi trong giây lát...',
            en: 'Please wait a moment...'
        }
    }
};

export default translations; 