/**
 * Các bản dịch phổ biến trên toàn bộ trang web
 */

const translations = {
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
            vi: 'Sản phẩm sẽ được thêm sau',
            en: 'Products coming soon'
        },
        systemUpdating: {
            vi: 'Hệ thống đang cập nhật',
            en: 'System is updating'
        }
    },

    // Nút và hành động chung
    actions: {
        search: {
            vi: 'Tìm kiếm',
            en: 'Search'
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
        download: {
            vi: 'Tải xuống',
            en: 'Download'
        },
        learnMore: {
            vi: 'Tìm hiểu thêm',
            en: 'Learn more'
        },
        viewDetails: {
            vi: 'Xem chi tiết',
            en: 'View details'
        },
        buyNow: {
            vi: 'Mua ngay',
            en: 'Buy now'
        },
        addToCart: {
            vi: 'Thêm vào giỏ hàng',
            en: 'Add to cart'
        },
        continue: {
            vi: 'Tiếp tục',
            en: 'Continue'
        },
        backToHome: {
            vi: 'Quay lại trang chủ',
            en: 'Back to home'
        },
        switchToEnglish: {
            vi: 'Switch to English',
            en: 'Chuyển sang tiếng Việt'
        },
        viewAll: {
            vi: 'Xem tất cả',
            en: 'View all'
        }
    },

    // Trang chủ
    home: {
        welcomeMessage: {
            vi: 'Chào mừng đến với XLab',
            en: 'Welcome to XLab'
        },
        heroTitle: {
            vi: 'Giải pháp công nghệ cho doanh nghiệp của bạn',
            en: 'Technology solutions for your business'
        },
        heroSubtitle: {
            vi: 'Phần mềm riêng của bạn - Tải về và sử dụng ngay hôm nay',
            en: 'Your custom software - Download and use today'
        },
        featuredProducts: {
            vi: 'Sản phẩm nổi bật',
            en: 'Featured products'
        },
        ourServices: {
            vi: 'Dịch vụ của chúng tôi',
            en: 'Our services'
        },
        testimonials: {
            vi: 'Khách hàng nói gì về chúng tôi',
            en: 'What our customers say'
        },
        contactUs: {
            vi: 'Liên hệ với chúng tôi',
            en: 'Contact us'
        },
        newProducts: {
            vi: 'Phần mềm mới',
            en: 'New software'
        }
    },

    // Trang Giới thiệu
    about: {
        pageTitle: {
            vi: 'Về chúng tôi',
            en: 'About us'
        },
        companyDescription: {
            vi: 'XLab - Đơn vị tiên phong trong lĩnh vực phát triển phần mềm và các giải pháp công nghệ tại Việt Nam',
            en: 'XLab - A pioneer in software development and technology solutions in Vietnam'
        },
        ourHistory: {
            vi: 'Câu chuyện của chúng tôi',
            en: 'Our Story'
        },
        historyParagraph1: {
            vi: 'XLab được thành lập vào năm 2018 bởi một nhóm kỹ sư phần mềm đam mê và có tầm nhìn về việc tạo ra các giải pháp công nghệ tiên tiến, giúp doanh nghiệp Việt Nam nâng cao hiệu quả hoạt động và năng lực cạnh tranh trong kỷ nguyên số.',
            en: 'XLab was founded in 2018 by a passionate group of software engineers with a vision to create advanced technology solutions that help Vietnamese businesses improve operational efficiency and competitiveness in the digital era.'
        },
        historyParagraph2: {
            vi: 'Sau hơn 10 năm hoạt động và phát triển, XLab đã trở thành đối tác công nghệ tin cậy của hàng trăm doanh nghiệp trong và ngoài nước, từ các công ty khởi nghiệp cho đến các tập đoàn lớn thuộc nhiều lĩnh vực khác nhau như tài chính, bán lẻ, sản xuất, giáo dục và y tế.',
            en: 'After more than 10 years of operation and development, XLab has become a trusted technology partner for hundreds of businesses both domestically and internationally, from startups to large corporations in various sectors such as finance, retail, manufacturing, education, and healthcare.'
        },
        historyParagraph3: {
            vi: 'Chúng tôi tự hào về đội ngũ nhân sự tài năng và đam mê công nghệ, với hơn 100 chuyên gia phần mềm, kỹ sư hệ thống, và chuyên gia tư vấn giàu kinh nghiệm, luôn tận tâm với mục tiêu mang lại những giải pháp tối ưu cho đối tác và khách hàng.',
            en: 'We are proud of our talented team passionate about technology, with over 100 software experts, system engineers, and experienced consultants, always dedicated to bringing optimal solutions to our partners and customers.'
        },
        workspaceImageAlt: {
            vi: 'Không gian làm việc tại XLab',
            en: 'XLab workspace'
        },
        teamImageAlt: {
            vi: 'Đội ngũ XLab làm việc cùng nhau',
            en: 'XLab team working together'
        },
        techspaceImageAlt: {
            vi: 'Không gian công nghệ tại XLab',
            en: 'Technology space at XLab'
        },
        ourMission: {
            vi: 'Sứ mệnh',
            en: 'Our Mission'
        },
        missionContent: {
            vi: 'Sứ mệnh của XLab là ứng dụng công nghệ tiên tiến để tạo ra các giải pháp phần mềm xuất sắc, giúp doanh nghiệp Việt Nam tối ưu hóa quy trình, tăng năng suất và phát triển bền vững trong kỷ nguyên số. Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao, đáp ứng nhu cầu đa dạng của khách hàng, đồng thời góp phần thúc đẩy sự phát triển của ngành công nghệ thông tin Việt Nam.',
            en: 'The mission of XLab is to apply advanced technology to create excellent software solutions, helping Vietnamese businesses optimize processes, increase productivity, and develop sustainably in the digital era. We commit to delivering high-quality products and services that meet diverse customer needs while contributing to the development of the Vietnamese IT industry.'
        },
        ourVision: {
            vi: 'Tầm nhìn',
            en: 'Our Vision'
        },
        visionContent: {
            vi: 'XLab hướng tới trở thành doanh nghiệp công nghệ hàng đầu tại Việt Nam và khu vực Đông Nam Á trong lĩnh vực phát triển phần mềm và cung cấp giải pháp công nghệ thông tin toàn diện. Chúng tôi nỗ lực trở thành đối tác tin cậy và lâu dài của các doanh nghiệp trong hành trình chuyển đổi số, đồng thời là môi trường làm việc lý tưởng cho các tài năng công nghệ phát triển sự nghiệp.',
            en: 'XLab aims to become a leading technology company in Vietnam and Southeast Asia in software development and comprehensive IT solutions. We strive to be a reliable, long-term partner for businesses in their digital transformation journey, while also being an ideal working environment for technology talents to develop their careers.'
        },
        ourValues: {
            vi: 'Giá trị cốt lõi',
            en: 'Core Values'
        },
        valuesDescription: {
            vi: 'Những giá trị tạo nên văn hóa và định hướng mọi hoạt động của XLab',
            en: 'The values that create XLab\'s culture and guide all our activities'
        },
        valueQuality: {
            vi: 'Chất lượng',
            en: 'Quality'
        },
        qualityDesc: {
            vi: 'Đặt chất lượng sản phẩm và dịch vụ lên hàng đầu, không ngừng cải tiến để đạt được sự xuất sắc',
            en: 'Prioritizing product and service quality, continuously improving to achieve excellence'
        },
        valueInnovation: {
            vi: 'Đổi mới',
            en: 'Innovation'
        },
        innovationDesc: {
            vi: 'Khuyến khích tư duy sáng tạo, dám thử nghiệm những ý tưởng mới và công nghệ tiên tiến',
            en: 'Encouraging creative thinking, daring to experiment with new ideas and advanced technologies'
        },
        valueCollaboration: {
            vi: 'Hợp tác',
            en: 'Collaboration'
        },
        collaborationDesc: {
            vi: 'Xây dựng mối quan hệ đối tác lâu dài dựa trên sự tôn trọng và hợp tác cùng có lợi',
            en: 'Building long-term partnerships based on respect and mutually beneficial cooperation'
        },
        valueResponsibility: {
            vi: 'Trách nhiệm',
            en: 'Responsibility'
        },
        responsibilityDesc: {
            vi: 'Làm việc với tinh thần trách nhiệm cao, cam kết hoàn thành mọi cam kết với khách hàng',
            en: 'Working with a high sense of responsibility, committed to fulfilling all commitments to customers'
        },
        ctaTitle: {
            vi: 'Hợp tác cùng XLab',
            en: 'Partner with XLab'
        },
        ctaText: {
            vi: 'Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng doanh nghiệp của bạn trong hành trình chuyển đổi số và phát triển bền vững.',
            en: 'We are always ready to listen and accompany your business on the journey of digital transformation and sustainable development.'
        },
        ctaButton: {
            vi: 'Liên hệ ngay',
            en: 'Contact Us Now'
        }
    },

    // Trang Liên hệ 
    contact: {
        pageTitle: {
            vi: 'Liên hệ với chúng tôi',
            en: 'Contact us'
        },
        formTitle: {
            vi: 'Gửi tin nhắn cho chúng tôi',
            en: 'Send us a message'
        },
        fullName: {
            vi: 'Họ và tên',
            en: 'Full name'
        },
        email: {
            vi: 'Email',
            en: 'Email'
        },
        phone: {
            vi: 'Số điện thoại',
            en: 'Phone number'
        },
        subject: {
            vi: 'Tiêu đề',
            en: 'Subject'
        },
        message: {
            vi: 'Nội dung tin nhắn',
            en: 'Message'
        },
        sendMessage: {
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
        phoneNumber: {
            vi: 'Số điện thoại',
            en: 'Phone number'
        },
        emailAddress: {
            vi: 'Địa chỉ email',
            en: 'Email address'
        },
        workingHours: {
            vi: 'Giờ làm việc',
            en: 'Working hours'
        }
    }
}

export default translations; 