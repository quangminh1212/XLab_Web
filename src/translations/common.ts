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
    },

    // Services page
    'services.pageTitle': 'Dịch vụ',
    'services.pageTitle_en': 'Services',
    'services.pageDescription': 'Chúng tôi cung cấp các dịch vụ công nghệ chuyên nghiệp giúp doanh nghiệp của bạn phát triển.',
    'services.pageDescription_en': 'We provide professional technology services to help your business grow.',
    'services.customSoftwareDev': 'Phát triển phần mềm theo yêu cầu',
    'services.customSoftwareDev_en': 'Custom Software Development',
    'services.customSoftwareDesc': 'Chúng tôi xây dựng các giải pháp phần mềm tùy chỉnh theo nhu cầu cụ thể của doanh nghiệp, từ ứng dụng web đến ứng dụng di động và hệ thống backend.',
    'services.customSoftwareDesc_en': 'We build customized software solutions tailored to your business needs, from web applications to mobile apps and backend systems.',
    'services.cloudServices': 'Dịch vụ đám mây',
    'services.cloudServices_en': 'Cloud Services',
    'services.cloudServicesDesc': 'Cung cấp giải pháp đám mây toàn diện, từ tư vấn và triển khai đến quản lý và tối ưu hóa, giúp doanh nghiệp tiết kiệm chi phí và tăng cường khả năng mở rộng.',
    'services.cloudServicesDesc_en': 'Providing comprehensive cloud solutions, from consulting and implementation to management and optimization, helping businesses save costs and enhance scalability.',
    'services.techConsulting': 'Tư vấn công nghệ',
    'services.techConsulting_en': 'Technology Consulting',
    'services.techConsultingDesc': 'Cung cấp dịch vụ tư vấn chuyên nghiệp về chiến lược công nghệ, lộ trình chuyển đổi số và tối ưu hóa quy trình, giúp doanh nghiệp đưa ra quyết định đúng đắn.',
    'services.techConsultingDesc_en': 'Providing professional consulting services on technology strategy, digital transformation roadmap, and process optimization, helping businesses make informed decisions.',
    'services.technicalSupport': 'Hỗ trợ kỹ thuật',
    'services.technicalSupport_en': 'Technical Support',
    'services.technicalSupportDesc': 'Đội ngũ hỗ trợ kỹ thuật 24/7 luôn sẵn sàng giải quyết mọi vấn đề, đảm bảo hệ thống của bạn hoạt động trơn tru và hiệu quả.',
    'services.technicalSupportDesc_en': 'Our 24/7 technical support team is always ready to solve any issues, ensuring your systems run smoothly and efficiently.',
    'services.additionalServices': 'Dịch vụ bổ sung',
    'services.additionalServices_en': 'Additional Services',
    'services.additionalServicesDesc': 'Ngoài các dịch vụ chính, chúng tôi còn cung cấp nhiều dịch vụ bổ sung để đáp ứng đầy đủ nhu cầu của doanh nghiệp.',
    'services.additionalServicesDesc_en': 'In addition to our main services, we offer many supplementary services to fully meet your business needs.',
    'services.training': 'Đào tạo',
    'services.training_en': 'Training',
    'services.trainingDesc': 'Chương trình đào tạo chuyên sâu giúp nhân viên của bạn nắm vững cách sử dụng và tối ưu hóa các giải pháp phần mềm.',
    'services.trainingDesc_en': 'In-depth training programs to help your staff master the use and optimization of software solutions.',
    'services.maintenance': 'Bảo trì và nâng cấp',
    'services.maintenance_en': 'Maintenance & Upgrades',
    'services.maintenanceDesc': 'Dịch vụ bảo trì và nâng cấp hệ thống thường xuyên, đảm bảo phần mềm luôn hoạt động ổn định và cập nhật với công nghệ mới nhất.',
    'services.maintenanceDesc_en': 'Regular system maintenance and upgrade services, ensuring that your software always operates stably and is updated with the latest technology.',
    'services.systemIntegration': 'Tích hợp hệ thống',
    'services.systemIntegration_en': 'System Integration',
    'services.systemIntegrationDesc': 'Giúp kết nối và tích hợp các hệ thống, ứng dụng và dịch vụ khác nhau để tạo ra một hệ sinh thái công nghệ thống nhất.',
    'services.systemIntegrationDesc_en': 'Helping connect and integrate different systems, applications and services to create a unified technology ecosystem.',
    'services.cybersecurity': 'An ninh mạng',
    'services.cybersecurity_en': 'Cybersecurity',
    'services.cybersecurityDesc': 'Dịch vụ bảo mật toàn diện, từ đánh giá rủi ro đến triển khai các giải pháp bảo mật và giám sát liên tục.',
    'services.cybersecurityDesc_en': 'Comprehensive security services, from risk assessment to implementation of security solutions and continuous monitoring.',
    'services.dataAnalytics': 'Phân tích dữ liệu',
    'services.dataAnalytics_en': 'Data Analytics',
    'services.dataAnalyticsDesc': 'Dịch vụ phân tích dữ liệu chuyên sâu giúp bạn khai thác giá trị từ dữ liệu và đưa ra quyết định kinh doanh sáng suốt.',
    'services.dataAnalyticsDesc_en': 'In-depth data analysis services to help you extract value from data and make informed business decisions.',
    'services.digitalTransformation': 'Chuyển đổi số',
    'services.digitalTransformation_en': 'Digital Transformation',
    'services.digitalTransformationDesc': 'Dịch vụ chuyển đổi số toàn diện, giúp doanh nghiệp áp dụng công nghệ mới một cách hiệu quả và phát triển bền vững.',
    'services.digitalTransformationDesc_en': 'Comprehensive digital transformation services to help businesses effectively adopt new technologies and develop sustainably.',
    'services.ctaTitle': 'Sẵn sàng nâng cấp hệ thống công nghệ của bạn?',
    'services.ctaTitle_en': 'Ready to upgrade your technology systems?',
    'services.ctaDescription': 'Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp phù hợp nhất cho doanh nghiệp của bạn.',
    'services.ctaDescription_en': 'Contact us today for a free consultation on the most suitable solution for your business.',
    'services.contactUs': 'Liên hệ ngay',
    'services.contactUs_en': 'Contact Us Now',
    'actions.learnMore': 'Tìm hiểu thêm',
    'actions.learnMore_en': 'Learn More',

    // Contact page
    'contact.pageTitle': 'Liên hệ với chúng tôi',
    'contact.pageTitle_en': 'Contact Us',
    'contact.pageDescription': 'Hãy liên hệ với chúng tôi để được tư vấn về giải pháp phù hợp nhất cho doanh nghiệp của bạn.',
    'contact.pageDescription_en': 'Contact us to get advice on the most suitable solution for your business.',
    'contact.sendMessage': 'Gửi tin nhắn cho chúng tôi',
    'contact.sendMessage_en': 'Send us a message',
    'contact.name': 'Họ và tên',
    'contact.name_en': 'Full Name',
    'contact.email': 'Email',
    'contact.email_en': 'Email',
    'contact.phone': 'Số điện thoại',
    'contact.phone_en': 'Phone Number',
    'contact.subject': 'Chủ đề',
    'contact.subject_en': 'Subject',
    'contact.selectSubject': '-- Chọn chủ đề --',
    'contact.selectSubject_en': '-- Select a subject --',
    'contact.generalInquiry': 'Thông tin chung',
    'contact.generalInquiry_en': 'General Inquiry',
    'contact.technicalSupport': 'Hỗ trợ kỹ thuật',
    'contact.technicalSupport_en': 'Technical Support',
    'contact.salesInquiry': 'Thông tin bán hàng',
    'contact.salesInquiry_en': 'Sales Inquiry',
    'contact.partnership': 'Đối tác',
    'contact.partnership_en': 'Partnership',
    'contact.message': 'Tin nhắn',
    'contact.message_en': 'Message',
    'contact.send': 'Gửi tin nhắn',
    'contact.send_en': 'Send Message',
    'contact.contactInfo': 'Thông tin liên hệ',
    'contact.contactInfo_en': 'Contact Information',
    'contact.address': 'Địa chỉ',
    'contact.address_en': 'Address',
    'contact.businessHours': 'Giờ làm việc',
    'contact.businessHours_en': 'Business Hours',
    'contact.weekdays': 'Thứ Hai - Thứ Sáu',
    'contact.weekdays_en': 'Monday - Friday',
    'contact.weekend': 'Thứ Bảy & Chủ Nhật',
    'contact.weekend_en': 'Saturday & Sunday',
    'contact.closed': 'Đóng cửa',
    'contact.closed_en': 'Closed',
    'contact.findUs': 'Tìm chúng tôi',
    'contact.findUs_en': 'Find Us',
    'contact.mapPlaceholder': 'Bản đồ sẽ được hiển thị tại đây',
    'contact.mapPlaceholder_en': 'Map will be displayed here',
    'contact.messageSent': 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.',
    'contact.messageSent_en': 'Thank you! Your message has been sent successfully.',

    // Loading page
    'loading.title': 'Đang tải...',
    'loading.title_en': 'Loading...',
    'loading.message': 'Vui lòng đợi trong giây lát',
    'loading.message_en': 'Please wait a moment',

    // Software page
    'software.pageTitle': 'Phần mềm riêng của bạn - Tải về và sử dụng ngay hôm nay',
    'software.pageTitle_en': 'Your exclusive software - Download and use today',
    'software.pageDescription': 'Chúng tôi cung cấp các phần mềm chất lượng cao, được thiết kế riêng cho nhu cầu của bạn',
    'software.pageDescription_en': 'We provide high-quality software designed specifically for your needs',
    'software.searchPlaceholder': 'Tìm kiếm phần mềm, ứng dụng...',
    'software.searchPlaceholder_en': 'Search for software, applications...',
    'software.categories': 'Danh mục',
    'software.categories_en': 'Categories',
    'software.viewAll': 'Xem tất cả',
    'software.viewAll_en': 'View all',
    'software.businessSoftware': 'Phần mềm doanh nghiệp',
    'software.businessSoftware_en': 'Business Software',
    'software.officeSoftware': 'Ứng dụng văn phòng',
    'software.officeSoftware_en': 'Office Applications',
    'software.designSoftware': 'Phần mềm đồ họa',
    'software.designSoftware_en': 'Design Software',
    'software.securitySoftware': 'Bảo mật & Antivirus',
    'software.securitySoftware_en': 'Security & Antivirus',
    'software.educationSoftware': 'Ứng dụng giáo dục',
    'software.educationSoftware_en': 'Education Applications',
    'software.products': 'sản phẩm',
    'software.products_en': 'products',
    'software.featured': 'Phần mềm nổi bật',
    'software.featured_en': 'Featured Software',
    'software.details': 'Chi tiết',
    'software.details_en': 'Details',
    'software.download': 'Tải xuống',
    'software.download_en': 'Download',
    'software.customTitle': 'Bạn cần phần mềm tùy chỉnh?',
    'software.customTitle_en': 'Need custom software?',
    'software.customDescription': 'Chúng tôi có thể phát triển phần mềm theo yêu cầu cụ thể của doanh nghiệp bạn',
    'software.customDescription_en': 'We can develop software according to your specific business requirements',
    'software.contactUs': 'Liên hệ ngay',
    'software.contactUs_en': 'Contact us now',
    'software.xManager': 'XManager - Phần mềm quản lý doanh nghiệp',
    'software.xManager_en': 'XManager - Business Management Software',
    'software.xManagerDesc': 'Quản lý hiệu quả mọi hoạt động của doanh nghiệp với giao diện thân thiện',
    'software.xManagerDesc_en': 'Effectively manage all business operations with a user-friendly interface',
    'software.cloudBackup': 'Cloud Backup Pro',
    'software.cloudBackup_en': 'Cloud Backup Pro',
    'software.cloudBackupDesc': 'Sao lưu dữ liệu an toàn trên đám mây, truy cập mọi lúc mọi nơi',
    'software.cloudBackupDesc_en': 'Safely back up data to the cloud, access anytime, anywhere',
    'software.secureOffice': 'Secure Office Suite',
    'software.secureOffice_en': 'Secure Office Suite',
    'software.secureOfficeDesc': 'Bộ ứng dụng văn phòng với tính năng bảo mật cao cấp',
    'software.secureOfficeDesc_en': 'Office application suite with advanced security features',
}

export default translations; 