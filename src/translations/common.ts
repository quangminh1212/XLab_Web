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
        switchToEnglish: {
            vi: 'Tiếng Anh',
            en: 'Tiếng Việt'
        },
        englishName: {
            vi: 'Tiếng Anh',
            en: 'English'
        },
        vietnameseName: {
            vi: 'Tiếng Việt',
            en: 'Vietnamese'
        },
        languages: {
            vietnamese: {
                vi: 'Tiếng Việt',
                en: 'Vietnamese'
            },
            english: {
                vi: 'Tiếng Anh',
                en: 'English'
            }
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
        },
        noCategories: {
            vi: 'Chưa có danh mục nào.',
            en: 'No categories available yet.'
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
    },

    // Danh mục sản phẩm
    categories: {
        pageTitle: {
            vi: 'Danh mục sản phẩm',
            en: 'Product Categories'
        },
        pageDescription: {
            vi: 'Khám phá các phần mềm của chúng tôi theo danh mục',
            en: 'Explore our software by category'
        },
        backToCategories: {
            vi: 'Quay lại danh mục',
            en: 'Back to categories'
        },
        productCount: {
            vi: 'Sản phẩm: ',
            en: 'Products: '
        },
        products: {
            vi: 'sản phẩm',
            en: 'products'
        },
        categoriesList: {
            businessSoftware: {
                name: {
                    vi: 'Phần mềm doanh nghiệp',
                    en: 'Business Software'
                },
                description: {
                    vi: 'Các phần mềm phục vụ cho doanh nghiệp như ERP, CRM, thanh toán...',
                    en: 'Software for businesses such as ERP, CRM, payment systems...'
                }
            },
            officeApps: {
                name: {
                    vi: 'Ứng dụng văn phòng',
                    en: 'Office Applications'
                },
                description: {
                    vi: 'Các ứng dụng văn phòng như soạn thảo, bảng tính, thuyết trình...',
                    en: 'Office applications like word processing, spreadsheets, presentations...'
                }
            },
            graphicSoftware: {
                name: {
                    vi: 'Phần mềm đồ họa',
                    en: 'Graphic Software'
                },
                description: {
                    vi: 'Các phần mềm thiết kế, chỉnh sửa ảnh, video và đồ họa...',
                    en: 'Design software, photo editing, video and graphics tools...'
                }
            },
            security: {
                name: {
                    vi: 'Bảo mật & Antivirus',
                    en: 'Security & Antivirus'
                },
                description: {
                    vi: 'Các phần mềm bảo mật, diệt virus, mã hóa dữ liệu...',
                    en: 'Security software, antivirus, data encryption tools...'
                }
            },
            education: {
                name: {
                    vi: 'Ứng dụng giáo dục',
                    en: 'Educational Applications'
                },
                description: {
                    vi: 'Các ứng dụng học ngoại ngữ, lập trình, toán học...',
                    en: 'Language learning, programming, mathematics applications...'
                }
            }
        }
    },

    // Trang dịch vụ
    services: {
        pageTitle: {
            vi: 'Dịch vụ của XLab',
            en: 'XLab Services'
        },
        pageDescription: {
            vi: 'Chúng tôi cung cấp các dịch vụ CNTT chất lượng cao, giúp doanh nghiệp của bạn phát triển trong kỷ nguyên số.',
            en: 'We provide high-quality IT services to help your business thrive in the digital era.'
        },
        customSoftwareDev: {
            vi: 'Phát triển phần mềm tùy chỉnh',
            en: 'Custom Software Development'
        },
        customSoftwareDesc: {
            vi: 'Chúng tôi xây dựng các giải pháp phần mềm tùy chỉnh theo yêu cầu cụ thể của doanh nghiệp bạn, từ ứng dụng di động đến phần mềm doanh nghiệp.',
            en: 'We build custom software solutions tailored to your specific business needs, from mobile apps to enterprise software.'
        },
        cloudServices: {
            vi: 'Dịch vụ đám mây',
            en: 'Cloud Services'
        },
        cloudServicesDesc: {
            vi: 'Tối ưu hóa hoạt động kinh doanh của bạn với các dịch vụ đám mây của chúng tôi, bao gồm di chuyển lên đám mây, quản lý, và tối ưu hóa.',
            en: 'Optimize your business operations with our cloud services, including cloud migration, management, and optimization.'
        },
        techConsulting: {
            vi: 'Tư vấn công nghệ',
            en: 'Technology Consulting'
        },
        techConsultingDesc: {
            vi: 'Đội ngũ chuyên gia của chúng tôi cung cấp tư vấn chiến lược về các vấn đề công nghệ để giúp doanh nghiệp của bạn đưa ra quyết định đúng đắn.',
            en: 'Our expert team provides strategic advice on technology issues to help your business make the right decisions.'
        },
        technicalSupport: {
            vi: 'Hỗ trợ kỹ thuật',
            en: 'Technical Support'
        },
        technicalSupportDesc: {
            vi: 'Dịch vụ hỗ trợ kỹ thuật 24/7 của chúng tôi đảm bảo các hệ thống của bạn luôn hoạt động hiệu quả và giảm thiểu thời gian ngừng hoạt động.',
            en: 'Our 24/7 technical support services ensure your systems are always running efficiently and minimize downtime.'
        },
        additionalServices: {
            vi: 'Dịch vụ bổ sung',
            en: 'Additional Services'
        },
        additionalServicesDesc: {
            vi: 'Chúng tôi cung cấp nhiều dịch vụ CNTT chuyên biệt khác để đáp ứng mọi nhu cầu công nghệ của doanh nghiệp bạn.',
            en: 'We provide a range of specialized IT services to meet all your business technology needs.'
        },
        training: {
            vi: 'Đào tạo và phát triển kỹ năng',
            en: 'Training and Skill Development'
        },
        trainingDesc: {
            vi: 'Các khóa đào tạo về công nghệ được thiết kế riêng cho đội ngũ của bạn, giúp họ nắm bắt các kỹ năng và công nghệ mới.',
            en: 'Technology training courses tailored for your team, helping them acquire new skills and technologies.'
        },
        maintenance: {
            vi: 'Bảo trì và nâng cấp',
            en: 'Maintenance and Upgrades'
        },
        maintenanceDesc: {
            vi: 'Dịch vụ bảo trì và nâng cấp thường xuyên để đảm bảo hệ thống của bạn luôn được cập nhật và hoạt động tốt nhất.',
            en: 'Regular maintenance and upgrade services to ensure your systems are always up-to-date and performing at their best.'
        },
        systemIntegration: {
            vi: 'Tích hợp hệ thống',
            en: 'System Integration'
        },
        systemIntegrationDesc: {
            vi: 'Kết nối các hệ thống và ứng dụng khác nhau trong doanh nghiệp của bạn để tạo ra một quy trình làm việc liền mạch.',
            en: 'Connect different systems and applications in your business to create a seamless workflow.'
        },
        cybersecurity: {
            vi: 'An ninh mạng',
            en: 'Cybersecurity'
        },
        cybersecurityDesc: {
            vi: 'Các giải pháp bảo mật toàn diện để bảo vệ dữ liệu và hệ thống của bạn khỏi các mối đe dọa trực tuyến.',
            en: 'Comprehensive security solutions to protect your data and systems from online threats.'
        },
        dataAnalytics: {
            vi: 'Phân tích dữ liệu',
            en: 'Data Analytics'
        },
        dataAnalyticsDesc: {
            vi: 'Biến dữ liệu thành những hiểu biết có giá trị với các dịch vụ phân tích dữ liệu tiên tiến của chúng tôi.',
            en: 'Turn data into valuable insights with our advanced data analytics services.'
        },
        digitalTransformation: {
            vi: 'Chuyển đổi số',
            en: 'Digital Transformation'
        },
        digitalTransformationDesc: {
            vi: 'Hỗ trợ doanh nghiệp của bạn thực hiện chuyển đổi số toàn diện, từ chiến lược đến triển khai.',
            en: 'Support your business in comprehensive digital transformation, from strategy to implementation.'
        },
        ctaTitle: {
            vi: 'Sẵn sàng nâng cấp công nghệ cho doanh nghiệp của bạn?',
            en: 'Ready to upgrade technology for your business?'
        },
        ctaDescription: {
            vi: 'Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn về các giải pháp CNTT phù hợp nhất cho doanh nghiệp của bạn.',
            en: 'Contact us today for advice on the most suitable IT solutions for your business.'
        },
        contactUs: {
            vi: 'Liên hệ với chúng tôi',
            en: 'Contact us'
        }
    },

    // Trang giới thiệu
    about: {
        pageTitle: {
            vi: 'Giới thiệu về XLab',
            en: 'About XLab'
        },
        companyDescription: {
            vi: 'XLab là công ty công nghệ hàng đầu tập trung vào phát triển giải pháp phần mềm sáng tạo và dịch vụ CNTT cho doanh nghiệp.',
            en: 'XLab is a leading technology company focused on developing innovative software solutions and IT services for businesses.'
        },
        ourHistory: {
            vi: 'Lịch sử của chúng tôi',
            en: 'Our History'
        },
        historyParagraph1: {
            vi: 'Thành lập vào năm 2015, XLab bắt đầu như một nhóm nhỏ các nhà phát triển phần mềm và kỹ sư CNTT đam mê tạo ra các sản phẩm chất lượng cao cho thị trường Việt Nam.',
            en: 'Founded in 2015, XLab started as a small team of passionate software developers and IT engineers dedicated to creating high-quality products for the Vietnamese market.'
        },
        historyParagraph2: {
            vi: 'Trong những năm qua, chúng tôi đã phát triển thành một công ty công nghệ toàn diện với đội ngũ chuyên gia giàu kinh nghiệm trong nhiều lĩnh vực khác nhau của công nghệ thông tin.',
            en: 'Over the years, we have grown into a comprehensive technology company with a team of experts experienced in various fields of information technology.'
        },
        historyParagraph3: {
            vi: 'Ngày nay, XLab tự hào cung cấp một loạt các giải pháp phần mềm và dịch vụ CNTT chất lượng cao, phục vụ hàng trăm khách hàng từ các doanh nghiệp nhỏ đến các tập đoàn lớn trong nước và quốc tế.',
            en: 'Today, XLab proudly offers a range of high-quality software solutions and IT services, serving hundreds of clients from small businesses to large corporations both domestically and internationally.'
        },
        workspaceImageAlt: {
            vi: 'Không gian làm việc của XLab',
            en: 'XLab workspace'
        },
        teamImageAlt: {
            vi: 'Đội ngũ XLab',
            en: 'XLab team'
        },
        techspaceImageAlt: {
            vi: 'Không gian công nghệ XLab',
            en: 'XLab technology space'
        },
        ourMission: {
            vi: 'Sứ mệnh của chúng tôi',
            en: 'Our Mission'
        },
        missionContent: {
            vi: 'Sứ mệnh của chúng tôi là cung cấp các giải pháp công nghệ sáng tạo và đáng tin cậy, giúp các doanh nghiệp Việt Nam và thế giới phát triển trong kỷ nguyên số.',
            en: 'Our mission is to provide innovative and reliable technology solutions that help Vietnamese and global businesses thrive in the digital era.'
        },
        ourVision: {
            vi: 'Tầm nhìn của chúng tôi',
            en: 'Our Vision'
        },
        visionContent: {
            vi: 'Chúng tôi khát vọng trở thành đối tác công nghệ hàng đầu tại Việt Nam, được công nhận bởi chất lượng sản phẩm và dịch vụ, sự đổi mới không ngừng, và cam kết với sự thành công của khách hàng.',
            en: 'We aspire to become a leading technology partner in Vietnam, recognized for product and service quality, continuous innovation, and commitment to customer success.'
        },
        ourValues: {
            vi: 'Giá trị cốt lõi',
            en: 'Our Core Values'
        },
        valuesDescription: {
            vi: 'Tại XLab, chúng tôi tin vào việc duy trì những giá trị cốt lõi mạnh mẽ để định hướng mọi khía cạnh hoạt động của mình.',
            en: 'At XLab, we believe in maintaining strong core values to guide every aspect of our operations.'
        },
        valueQuality: {
            vi: 'Chất lượng',
            en: 'Quality'
        },
        qualityDesc: {
            vi: 'Chúng tôi cam kết cung cấp các sản phẩm và dịch vụ đạt tiêu chuẩn cao nhất, vượt qua mong đợi của khách hàng.',
            en: 'We are committed to delivering products and services of the highest standard, exceeding customer expectations.'
        },
        valueInnovation: {
            vi: 'Đổi mới',
            en: 'Innovation'
        },
        innovationDesc: {
            vi: 'Chúng tôi luôn tìm kiếm những cách thức mới để giải quyết các thách thức và nắm bắt các công nghệ mới nhất.',
            en: 'We constantly seek new ways to solve challenges and embrace the latest technologies.'
        },
        valueCollaboration: {
            vi: 'Hợp tác',
            en: 'Collaboration'
        },
        collaborationDesc: {
            vi: 'Chúng tôi tin vào sức mạnh của làm việc nhóm và xây dựng mối quan hệ dài lâu với khách hàng và đối tác.',
            en: 'We believe in the power of teamwork and building lasting relationships with customers and partners.'
        },
        valueResponsibility: {
            vi: 'Trách nhiệm',
            en: 'Responsibility'
        },
        responsibilityDesc: {
            vi: 'Chúng tôi có trách nhiệm với lời hứa của mình và luôn hành động với sự liêm chính và minh bạch.',
            en: 'We take responsibility for our promises and always act with integrity and transparency.'
        },
        ctaTitle: {
            vi: 'Hãy trở thành đối tác của chúng tôi',
            en: 'Become Our Partner'
        },
        ctaText: {
            vi: 'Bạn muốn tìm hiểu thêm về cách XLab có thể giúp doanh nghiệp của bạn phát triển?',
            en: 'Want to learn more about how XLab can help your business grow?'
        },
        ctaButton: {
            vi: 'Liên hệ với chúng tôi',
            en: 'Contact Us'
        }
    }
};

export default translations; 