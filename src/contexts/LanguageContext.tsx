'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Tạo một context mới
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.about': 'Giới thiệu',
    'nav.contact': 'Liên hệ',
    'nav.warranty': 'Bảo hành',
    'nav.login': 'Đăng nhập',
    'nav.logout': 'Đăng xuất',
    'nav.language': 'English',
    
    // Login page
    'login.welcome': 'Chào mừng trở lại!',
    'login.continue': 'Để tiếp tục sử dụng các dịch vụ của XLab',
    'login.connect': 'Kết nối an toàn với tài khoản Google của bạn',
    'login.google': 'Tiếp tục với Google',
    'login.secure': 'Bảo mật 100%',
    'login.terms': 'Bằng cách tiếp tục, bạn đồng ý với',
    'login.termsLink': 'Điều khoản dịch vụ',
    'login.and': 'và',
    'login.privacyLink': 'Chính sách bảo mật',
    'login.ourCompany': 'của chúng tôi.',
    
    // Homepage
    'home.slogan': 'Tối ưu hiệu quả, tối thiểu chi phí!',
    'home.search': 'Tìm kiếm phần mềm, ứng dụng...',
    'home.aboutTitle': 'Về XLab',
    'home.aboutDesc1': 'XLab là nền tảng cung cấp các giải pháp phần mềm tích hợp AI tiên tiến giúp người dùng nâng cao hiệu suất công việc và cuộc sống hàng ngày.',
    'home.aboutDesc2': 'Sứ mệnh của chúng tôi là đem đến cho người Việt cơ hội tiếp cận với các công cụ phục vụ làm việc, học tập, giải trí với giá cả phải chăng và chất lượng quốc tế.',
    'home.learnMore': 'Tìm hiểu thêm',
    'home.domesticProduct': 'Sản phẩm trong nước',
    'home.vietnamDevs': 'Phát triển bởi đội ngũ kỹ sư Việt Nam',
    'home.support247': 'Hỗ trợ 24/7',
    'home.supportTeam': 'Đội ngũ hỗ trợ tận tâm',
    'home.highSecurity': 'Bảo mật cao',
    'home.encryptedData': 'Dữ liệu được mã hóa an toàn',
    'home.reasonablePrice': 'Giá cả hợp lý',
    'home.budgetOptions': 'Nhiều lựa chọn phù hợp mọi ngân sách',
    'home.aiIntegration': 'Tích hợp AI',
    'home.aiSupport': 'Công nghệ AI tiên tiến hỗ trợ bạn',
    'home.continuousUpdates': 'Cập nhật liên tục',
    'home.newFeatures': 'Luôn được cập nhật tính năng mới',
    'home.achievements': 'Thành tựu của chúng tôi',
    'home.customers': 'Khách hàng tin dùng',
    'home.softwareSolutions': 'Giải pháp phần mềm',
    'home.yearsExperience': 'Năm kinh nghiệm',
    'home.software': 'Phần mềm',
    'home.services': 'Dịch vụ',
    'home.viewAll': 'Xem tất cả',
    'home.noSoftware': 'Chưa có phần mềm',
    'home.updateSoon': 'Chúng tôi sẽ sớm cập nhật các phần mềm.',
    'home.noServices': 'Chưa có dịch vụ',
    'home.updateServices': 'Chúng tôi sẽ sớm cập nhật các dịch vụ.',
    'home.faq': 'Câu hỏi thường gặp',
    'home.faqDesc': 'Giải đáp những thắc mắc phổ biến của khách hàng về sản phẩm và dịch vụ của XLab',
    'home.faq1Title': 'Làm thế nào để tải xuống phần mềm?',
    'home.faq1Desc': 'Bạn có thể tải xuống phần mềm miễn phí tại trang sản phẩm tương ứng sau khi đăng nhập vào tài khoản của mình. Đối với sản phẩm trả phí, bạn cần hoàn tất thanh toán trước khi tải xuống.',
    'home.faq2Title': 'Làm thế nào để kích hoạt bản quyền?',
    'home.faq2Desc': 'Sau khi mua sản phẩm, bạn sẽ nhận được mã kích hoạt qua email. Mở ứng dụng, vào phần "Kích hoạt bản quyền" và nhập mã này để sử dụng đầy đủ tính năng.',
    'home.faq3Title': 'Tôi có thể sử dụng trên bao nhiêu thiết bị?',
    'home.faq3Desc': 'Mỗi bản quyền cho phép bạn sử dụng trên tối đa 3 thiết bị khác nhau. Nếu bạn muốn sử dụng trên nhiều thiết bị hơn, vui lòng mua thêm bản quyền hoặc nâng cấp lên gói doanh nghiệp.',
    'home.faq4Title': 'Chính sách hoàn tiền như thế nào?',
    'home.faq4Desc': 'Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày kể từ ngày mua nếu sản phẩm không đáp ứng nhu cầu của bạn. Vui lòng liên hệ với đội ngũ hỗ trợ để được hướng dẫn.',
    'home.faq5Title': 'Làm thế nào để liên hệ hỗ trợ kỹ thuật?',
    'home.faq5Desc': 'Bạn có thể liên hệ đội ngũ hỗ trợ kỹ thuật qua email support@xlab.vn, hotline 1900.xxxx hoặc chat trực tiếp trên website. Chúng tôi phản hồi trong vòng 24 giờ làm việc.',
    'home.faq6Title': 'XLab có cung cấp giải pháp cho doanh nghiệp không?',
    'home.faq6Desc': 'Có, chúng tôi có các gói dịch vụ đặc biệt dành cho doanh nghiệp với ưu đãi về giá và hỗ trợ kỹ thuật chuyên biệt. Vui lòng liên hệ với chúng tôi để có giải pháp phù hợp nhất.',
    'home.moreQuestions': 'Xem thêm câu hỏi',
    'home.ctaTitle': 'Sẵn sàng nâng cao hiệu suất công việc với XLab?',
    'home.ctaDesc': 'Chúng tôi cung cấp nhiều mức giá ưu đãi đặc biệt dành cho khách hàng mua số lượng lớn. Càng mua nhiều, mức giảm giá càng cao. Chúng tôi cam kết mang đến cho bạn những giải pháp tốt nhất với chi phí hợp lý nhất.',
    'home.contactUs': 'Liên hệ tư vấn',
    
    // Product card
    'product.addToCart': 'Thêm vào giỏ',
    'product.buyNow': 'Mua ngay',
    'product.added': 'Đã thêm',
    
    // About page
    'about.title': 'Giới thiệu về XLab',
    'about.subtitle': 'Đồng hành cùng doanh nghiệp của bạn trong hành trình chuyển đổi số',
    'about.values': 'Giá trị cốt lõi của chúng tôi',
    'about.innovation': 'Đổi mới',
    'about.innovationDesc': 'Không ngừng sáng tạo và đổi mới công nghệ để mang lại giá trị tốt nhất',
    'about.quality': 'Chất lượng',
    'about.qualityDesc': 'Cam kết chất lượng cao nhất trong mọi sản phẩm và dịch vụ',
    'about.integrity': 'Chính trực',
    'about.integrityDesc': 'Luôn giữ vững đạo đức kinh doanh và minh bạch trong mọi hoạt động',
    'about.collaboration': 'Hợp tác',
    'about.collaborationDesc': 'Xây dựng mối quan hệ đối tác lâu dài dựa trên sự tôn trọng và hợp tác cùng có lợi',
    'about.partnership': 'Hợp tác cùng XLab',
    'about.partnershipDesc': 'Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng doanh nghiệp của bạn trong hành trình chuyển đổi số và phát triển bền vững.',
    'about.contactNow': 'Liên hệ ngay',
    'about.exploreServices': 'Khám phá dịch vụ',

    // About page - Additional keys
    'about.pageTitle': 'Về chúng tôi',
    'about.pageSubtitle': 'XLab - Đơn vị tiên phong trong lĩnh vực phát triển phần mềm và các giải pháp công nghệ tại Việt Nam',
    'about.ourStory': 'Câu chuyện của chúng tôi',
    'about.storyP1': 'XLab được thành lập vào năm 2018 bởi một nhóm kỹ sư phần mềm đam mê và có tầm nhìn về việc tạo ra các giải pháp công nghệ tiên tiến, giúp doanh nghiệp Việt Nam nâng cao hiệu quả hoạt động và năng lực cạnh tranh trong kỷ nguyên số.',
    'about.storyP2': 'Sau hơn 10 năm hoạt động và phát triển, XLab đã trở thành đối tác công nghệ tin cậy của hàng trăm doanh nghiệp trong và ngoài nước, từ các công ty khởi nghiệp cho đến các tập đoàn lớn thuộc nhiều lĩnh vực khác nhau như tài chính, bán lẻ, sản xuất, giáo dục và y tế.',
    'about.storyP3': 'Chúng tôi tự hào về đội ngũ nhân sự tài năng và đam mê công nghệ, với hơn 100 chuyên gia phần mềm, kỹ sư hệ thống, và chuyên gia tư vấn giàu kinh nghiệm, luôn tận tâm với mục tiêu mang lại những giải pháp tối ưu cho đối tác và khách hàng.',
    'about.mission': 'Sứ mệnh',
    'about.missionDesc': 'Sứ mệnh của XLab là ứng dụng công nghệ tiên tiến để tạo ra các giải pháp phần mềm xuất sắc, giúp doanh nghiệp Việt Nam tối ưu hóa quy trình, tăng năng suất và phát triển bền vững trong kỷ nguyên số. Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao, đáp ứng nhu cầu đa dạng của khách hàng, đồng thời góp phần thúc đẩy sự phát triển của ngành công nghệ thông tin Việt Nam.',
    'about.vision': 'Tầm nhìn',
    'about.visionDesc': 'XLab hướng tới trở thành doanh nghiệp công nghệ hàng đầu tại Việt Nam và khu vực Đông Nam Á trong lĩnh vực phát triển phần mềm và cung cấp giải pháp công nghệ thông tin toàn diện. Chúng tôi nỗ lực trở thành đối tác tin cậy và lâu dài của các doanh nghiệp trong hành trình chuyển đổi số, đồng thời là môi trường làm việc lý tưởng cho các tài năng công nghệ phát triển sự nghiệp.',
    'about.coreValues': 'Giá trị cốt lõi',
    'about.coreValuesDesc': 'Những giá trị tạo nên văn hóa và định hướng mọi hoạt động của XLab',
    'about.value1': 'Chất lượng',
    'about.value1Desc': 'Đặt chất lượng sản phẩm và dịch vụ lên hàng đầu, không ngừng cải tiến để đạt được sự xuất sắc',
    'about.value2': 'Đổi mới',
    'about.value2Desc': 'Khuyến khích tư duy sáng tạo, dám thử nghiệm những ý tưởng mới và công nghệ tiên tiến',
    'about.value3': 'Hợp tác',
    'about.value3Desc': 'Xây dựng mối quan hệ đối tác lâu dài dựa trên sự tôn trọng và hợp tác cùng có lợi',
    'about.value4': 'Trách nhiệm',
    'about.value4Desc': 'Làm việc với tinh thần trách nhiệm cao, cam kết hoàn thành mọi cam kết với khách hàng',
    
    // Contact page
    'contact.title': 'Liên hệ với chúng tôi',
    'contact.subtitle': 'Hãy liên hệ với chúng tôi để được tư vấn về giải pháp phù hợp nhất cho doanh nghiệp của bạn.',
    'contact.sendMessage': 'Gửi tin nhắn cho chúng tôi',
    'contact.yourName': 'Họ và tên của bạn',
    'contact.yourEmail': 'Email của bạn',
    'contact.yourPhone': 'Số điện thoại',
    'contact.subject': 'Chủ đề',
    'contact.message': 'Tin nhắn',
    'contact.send': 'Gửi tin nhắn',
    'contact.info': 'Thông tin liên hệ',
    'contact.address': 'Địa chỉ',
    'contact.email': 'Email',
    'contact.phone': 'Điện thoại',
    'contact.connectWithUs': 'Kết nối với chúng tôi',

    // Contact page - Additional keys
    'contact.pageTitle': 'Liên hệ với chúng tôi',
    'contact.pageSubtitle': 'Hãy liên hệ với chúng tôi để được tư vấn về giải pháp phù hợp nhất cho doanh nghiệp của bạn.',
    'contact.yourCompany': 'Công ty',
    'contact.serviceInterest': 'Dịch vụ bạn quan tâm',
    'contact.selectService': '-- Chọn dịch vụ --',
    'contact.softwareDev': 'Phát triển phần mềm',
    'contact.cloudServices': 'Dịch vụ đám mây',
    'contact.consulting': 'Tư vấn công nghệ',
    'contact.techSupport': 'Hỗ trợ kỹ thuật',
    'contact.other': 'Khác',
    'contact.required': 'Trường bắt buộc',
    'contact.sending': 'Đang gửi...',
    'contact.successMessage': 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
    'contact.errorMessage': 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại sau.',

    // Voucher widget
    'voucher.title': 'Mã giảm giá',
    'voucher.viewAll': 'Xem tất cả',
    'voucher.loading': 'Đang tải...',
    'voucher.yourVouchers': 'Voucher của bạn',
    'voucher.expiryDate': 'HSD:',
    'voucher.usesLeft': 'Còn {count} lượt',
    'voucher.minOrder': 'Đơn tối thiểu:',
    'voucher.noLimit': 'Không giới hạn đơn',

    // Cart and Checkout
    'cart.title': 'Giỏ hàng',
    'cart.empty': 'Giỏ hàng của bạn đang trống',
    'cart.continueShopping': 'Tiếp tục mua sắm',
    'cart.subtotal': 'Tạm tính',
    'cart.discount': 'Giảm giá',
    'cart.total': 'Tổng cộng',
    'cart.checkout': 'Thanh toán',
    'cart.remove': 'Xóa',
    'cart.quantity': 'Số lượng',
    'cart.price': 'Giá',
    'cart.voucher': 'Mã giảm giá',
    'cart.applyVoucher': 'Áp dụng',

    // Footer
    'footer.company': 'Công ty',
    'footer.about': 'Giới thiệu',
    'footer.contact': 'Liên hệ',
    'footer.careers': 'Tuyển dụng',
    'footer.terms': 'Điều khoản dịch vụ',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.services': 'Dịch vụ',
    'footer.softwareDev': 'Phát triển phần mềm',
    'footer.consulting': 'Tư vấn công nghệ',
    'footer.cloudServices': 'Dịch vụ đám mây',
    'footer.techSupport': 'Hỗ trợ kỹ thuật',
    'footer.resources': 'Tài nguyên',
    'footer.blog': 'Blog',
    'footer.documentation': 'Tài liệu',
    'footer.faq': 'FAQ',
    'footer.support': 'Hỗ trợ',
    'footer.copyright': '© 2023 XLab. Tất cả các quyền được bảo lưu.',
    'footer.followUs': 'Theo dõi chúng tôi',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.warranty': 'Warranty',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.language': 'Tiếng Việt',
    
    // Login page
    'login.welcome': 'Welcome back!',
    'login.continue': 'To continue using XLab services',
    'login.connect': 'Connect securely with your Google account',
    'login.google': 'Continue with Google',
    'login.secure': '100% Secure',
    'login.terms': 'By continuing, you agree to our',
    'login.termsLink': 'Terms of Service',
    'login.and': 'and',
    'login.privacyLink': 'Privacy Policy',
    'login.ourCompany': '.',
    
    // Homepage
    'home.slogan': 'Maximize efficiency, minimize costs!',
    'home.search': 'Search for software, applications...',
    'home.aboutTitle': 'About XLab',
    'home.aboutDesc1': 'XLab is a platform providing advanced AI-integrated software solutions that help users enhance productivity in work and daily life.',
    'home.aboutDesc2': 'Our mission is to provide Vietnamese people with access to tools for work, study, and entertainment at reasonable prices and international quality.',
    'home.learnMore': 'Learn more',
    'home.domesticProduct': 'Domestic Products',
    'home.vietnamDevs': 'Developed by Vietnamese engineers',
    'home.support247': '24/7 Support',
    'home.supportTeam': 'Dedicated support team',
    'home.highSecurity': 'High Security',
    'home.encryptedData': 'Securely encrypted data',
    'home.reasonablePrice': 'Reasonable Pricing',
    'home.budgetOptions': 'Multiple options for any budget',
    'home.aiIntegration': 'AI Integration',
    'home.aiSupport': 'Advanced AI technology to support you',
    'home.continuousUpdates': 'Continuous Updates',
    'home.newFeatures': 'Always updated with new features',
    'home.achievements': 'Our Achievements',
    'home.customers': 'Trusted customers',
    'home.softwareSolutions': 'Software solutions',
    'home.yearsExperience': 'Years of experience',
    'home.software': 'Software',
    'home.services': 'Services',
    'home.viewAll': 'View all',
    'home.noSoftware': 'No software yet',
    'home.updateSoon': 'We will update our software soon.',
    'home.noServices': 'No services yet',
    'home.updateServices': 'We will update our services soon.',
    'home.faq': 'Frequently Asked Questions',
    'home.faqDesc': 'Answers to common questions from customers about XLab products and services',
    'home.faq1Title': 'How do I download software?',
    'home.faq1Desc': 'You can download free software from the corresponding product page after logging into your account. For paid products, you need to complete payment before downloading.',
    'home.faq2Title': 'How do I activate the license?',
    'home.faq2Desc': 'After purchasing, you will receive an activation code by email. Open the application, go to "Activate License" and enter this code to use all features.',
    'home.faq3Title': 'How many devices can I use?',
    'home.faq3Desc': 'Each license allows you to use up to 3 different devices. If you want to use more devices, please purchase additional licenses or upgrade to a business plan.',
    'home.faq4Title': 'What is the refund policy?',
    'home.faq4Desc': 'We have a 7-day refund policy from the purchase date if the product does not meet your needs. Contact our support team for guidance.',
    'home.faq5Title': 'How do I contact technical support?',
    'home.faq5Desc': 'You can contact our technical support team via email at support@xlab.vn, hotline 1900.xxxx, or chat directly on the website. We respond within 24 business hours.',
    'home.faq6Title': 'Does XLab provide enterprise solutions?',
    'home.faq6Desc': 'Yes, we offer special service packages for businesses with pricing benefits and specialized technical support. Contact us for the most suitable solution.',
    'home.moreQuestions': 'View more questions',
    'home.ctaTitle': 'Ready to boost your productivity with XLab?',
    'home.ctaDesc': 'We offer special discounts for customers who purchase in bulk. The more you buy, the higher the discount. We are committed to bringing you the best solutions at the most reasonable cost.',
    'home.contactUs': 'Contact us',
    
    // Product card
    'product.addToCart': 'Add to cart',
    'product.buyNow': 'Buy now',
    'product.added': 'Added',
    
    // About page
    'about.title': 'About XLab',
    'about.subtitle': 'Partnering with your business on the digital transformation journey',
    'about.values': 'Our Core Values',
    'about.innovation': 'Innovation',
    'about.innovationDesc': 'Constantly creating and innovating technology to deliver the best value',
    'about.quality': 'Quality',
    'about.qualityDesc': 'Commitment to the highest quality in all products and services',
    'about.integrity': 'Integrity',
    'about.integrityDesc': 'Always maintaining business ethics and transparency in all activities',
    'about.collaboration': 'Collaboration',
    'about.collaborationDesc': 'Building long-term partnerships based on respect and mutual cooperation',
    'about.partnership': 'Partner with XLab',
    'about.partnershipDesc': 'We are always ready to listen and accompany your business on the journey of digital transformation and sustainable development.',
    'about.contactNow': 'Contact now',
    'about.exploreServices': 'Explore services',

    // About page - Additional keys
    'about.pageTitle': 'About Us',
    'about.pageSubtitle': 'XLab - A pioneer in software development and technology solutions in Vietnam',
    'about.ourStory': 'Our Story',
    'about.storyP1': 'XLab was founded in 2018 by a group of passionate software engineers with a vision to create advanced technology solutions that help Vietnamese businesses improve their operational efficiency and competitiveness in the digital age.',
    'about.storyP2': 'After more than 10 years of operation and development, XLab has become a trusted technology partner for hundreds of businesses both domestically and internationally, from startups to large corporations across various fields such as finance, retail, manufacturing, education, and healthcare.',
    'about.storyP3': 'We are proud of our talented and technology-passionate team, with over 100 software experts, system engineers, and experienced consultants, always dedicated to the goal of delivering optimal solutions to our partners and customers.',
    'about.mission': 'Mission',
    'about.missionDesc': "XLab's mission is to apply advanced technology to create excellent software solutions that help Vietnamese businesses optimize processes, increase productivity, and develop sustainably in the digital era. We are committed to delivering high-quality products and services that meet the diverse needs of our customers while contributing to the development of Vietnam's information technology industry.",
    'about.vision': 'Vision',
    'about.visionDesc': 'XLab aims to become a leading technology company in Vietnam and Southeast Asia in software development and comprehensive IT solutions. We strive to be a trusted and long-term partner for businesses in their digital transformation journey, and an ideal workplace for technology talents to develop their careers.',
    'about.coreValues': 'Core Values',
    'about.coreValuesDesc': 'The values that shape our culture and guide all our activities',
    'about.value1': 'Quality',
    'about.value1Desc': 'Placing product and service quality as our top priority, continuously improving to achieve excellence',
    'about.value2': 'Innovation',
    'about.value2Desc': 'Encouraging creative thinking, daring to experiment with new ideas and cutting-edge technologies',
    'about.value3': 'Collaboration',
    'about.value3Desc': 'Building long-term partnerships based on respect and mutually beneficial cooperation',
    'about.value4': 'Responsibility',
    'about.value4Desc': 'Working with a high sense of responsibility, committed to fulfilling all commitments to customers',
    
    // Contact page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with us for consultation on the most suitable solution for your business.',
    'contact.sendMessage': 'Send us a message',
    'contact.yourName': 'Your name',
    'contact.yourEmail': 'Your email',
    'contact.yourPhone': 'Phone number',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.info': 'Contact information',
    'contact.address': 'Address',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.connectWithUs': 'Connect with us',

    // Contact page - Additional keys
    'contact.pageTitle': 'Contact Us',
    'contact.pageSubtitle': 'Get in touch with us for consultation on the most suitable solution for your business.',
    'contact.yourCompany': 'Company',
    'contact.serviceInterest': 'Service you are interested in',
    'contact.selectService': '-- Select a service --',
    'contact.softwareDev': 'Software Development',
    'contact.cloudServices': 'Cloud Services',
    'contact.consulting': 'Technology Consulting',
    'contact.techSupport': 'Technical Support',
    'contact.other': 'Other',
    'contact.required': 'Required field',
    'contact.sending': 'Sending...',
    'contact.successMessage': 'Thank you for contacting us! We will respond as soon as possible.',
    'contact.errorMessage': 'An error occurred while sending the form. Please try again later.',

    // Voucher widget
    'voucher.title': 'Discount Codes',
    'voucher.viewAll': 'View all',
    'voucher.loading': 'Loading...',
    'voucher.yourVouchers': 'Your Vouchers',
    'voucher.expiryDate': 'Expires:',
    'voucher.usesLeft': '{count} uses left',
    'voucher.minOrder': 'Min order:',
    'voucher.noLimit': 'No minimum order',

    // Cart and Checkout
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue shopping',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Discount',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    'cart.price': 'Price',
    'cart.voucher': 'Voucher code',
    'cart.applyVoucher': 'Apply',

    // Footer
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.careers': 'Careers',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.services': 'Services',
    'footer.softwareDev': 'Software Development',
    'footer.consulting': 'Technology Consulting',
    'footer.cloudServices': 'Cloud Services',
    'footer.techSupport': 'Technical Support',
    'footer.resources': 'Resources',
    'footer.blog': 'Blog',
    'footer.documentation': 'Documentation',
    'footer.faq': 'FAQ',
    'footer.support': 'Support',
    'footer.copyright': '© 2023 XLab. All rights reserved.',
    'footer.followUs': 'Follow us',
  },
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Mặc định là tiếng Việt
  const [language, setLanguageState] = useState<Language>('vi');

  // Khởi tạo ngôn ngữ từ localStorage khi component được mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Lưu ngôn ngữ vào localStorage khi thay đổi
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Hàm dịch văn bản
  const t = (key: string, params?: Record<string, any>): string => {
    let text = translations[language][key] || key;
    
    if (params) {
      // Thay thế các tham số trong chuỗi
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), value);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook để sử dụng context này
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 