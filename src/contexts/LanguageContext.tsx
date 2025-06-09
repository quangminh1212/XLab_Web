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

    // Products page
    'products.title': 'Sản phẩm',
    'products.subtitle': 'Danh sách các phần mềm và dịch vụ chất lượng cao với mức giá tốt nhất thị trường.',
    'products.pageTitle': 'Phần mềm | XLab - Phần mềm và Dịch vụ',
    'products.all': 'Tất cả',
    'products.software': 'Phần mềm',
    'products.service': 'Dịch vụ',
    'products.showing': 'Hiển thị {count} kết quả',
    'products.sortBy': 'Sắp xếp',
    'products.sortNewest': 'Mới nhất',
    'products.sortPriceLow': 'Giá thấp đến cao',
    'products.sortPriceHigh': 'Giá cao đến thấp',
    'products.sortPopular': 'Phổ biến nhất',
    'products.sortRating': 'Đánh giá cao nhất',
    'products.loading': 'Đang tải sản phẩm...',
    'products.errorTitle': 'Không thể tải sản phẩm',
    'products.loadError': 'Không thể tải sản phẩm',
    'products.invalidData': 'Định dạng dữ liệu không hợp lệ',
    'products.error': 'Đã xảy ra lỗi',
    'products.tryAgain': 'Thử lại',
    'products.backToHome': 'Về trang chủ',

    // Product detail page
    'product.details': 'Thông tin chi tiết',
    'product.specifications': 'Thông số kỹ thuật',
    'product.requirements': 'Yêu cầu hệ thống',
    'product.metaTitle': 'XLab - Phần mềm và Dịch vụ',
    'product.loading': 'Đang tải thông tin sản phẩm...',
    'product.version': 'Phiên bản',
    'product.quantity': 'Số lượng',
    'product.availableIn': 'Có sẵn trong',
    'product.price': 'Giá',
    'product.originalPrice': 'Giá gốc',
    'product.discount': 'Giảm',
    'product.relatedProducts': 'Sản phẩm liên quan',
    'product.reviews': 'Đánh giá',
    'product.features': 'Tính năng',
    'product.description': 'Mô tả',
    'product.options': 'Tùy chọn',
    'product.selectOption': 'Chọn tùy chọn',
    'product.downloadCount': 'Lượt tải',
    'product.viewCount': 'Lượt xem',
    'product.addedToCart': 'Đã thêm {quantity} sản phẩm vào giỏ hàng',
    'product.outOfStock': 'Hết hàng',
    'product.inStock': 'Còn hàng',
    'product.tryDemo': 'Dùng thử',

    // Warranty page
    'warranty.title': 'Bảo Hành',
    'warranty.subtitle': 'XLab sẵn sàng hỗ trợ tư vấn và xử lý bảo hành suốt 365 ngày!',
    'warranty.policyTitle': 'Chính sách bảo hành',
    'warranty.periodTitle': 'Thời gian bảo hành',
    'warranty.period': 'XLab cam kết bảo hành cho tất cả các tài khoản và phần mềm trong thời hạn <strong>{days} ngày</strong> kể từ ngày mua.',
    'warranty.processTitle': 'Quy trình bảo hành',
    'warranty.process': 'Khi tài khoản gặp sự cố, quý khách vui lòng gửi yêu cầu hỗ trợ thông qua form bên cạnh hoặc liên hệ trực tiếp qua Zalo, Email.',
    'warranty.conditionsTitle': 'Điều kiện bảo hành',
    'warranty.conditions': 'Tài khoản phải nằm trong thời hạn bảo hành và được sử dụng đúng quy định.',
    'warranty.refundPolicyTitle': 'Chính sách đổi trả',
    'warranty.refundPeriodTitle': 'Thời gian đổi trả',
    'warranty.refundPeriod': 'Trong vòng <strong>{days} ngày</strong> kể từ ngày mua, quý khách có thể yêu cầu hoàn tiền nếu sản phẩm không đáp ứng được nhu cầu sử dụng.',
    'warranty.refundConditionsTitle': 'Điều kiện đổi trả',
    'warranty.refundConditions': 'Sản phẩm chưa bị sửa đổi, can thiệp và không vi phạm các điều khoản sử dụng.',
    'warranty.refundProcessTitle': 'Quy trình hoàn tiền',
    'warranty.refundProcess': 'Sau khi xác nhận yêu cầu hợp lệ, chúng tôi sẽ hoàn tiền qua phương thức thanh toán ban đầu trong vòng 3-5 ngày làm việc.',
    'warranty.supportRequestTitle': 'Yêu cầu hỗ trợ kỹ thuật',
    'warranty.submitSuccess': 'Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
    'warranty.formError': 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.',
    'warranty.formName': 'Họ và tên',
    'warranty.formEmail': 'Email',
    'warranty.formPhone': 'Số điện thoại',
    'warranty.formOrderCode': 'Mã đơn hàng',
    'warranty.formAccountName': 'Tên tài khoản',
    'warranty.formProblem': 'Mô tả vấn đề',
    'warranty.formProblemPlaceholder': 'Mô tả chi tiết vấn đề bạn đang gặp phải',
    'warranty.formSubmitting': 'Đang gửi...',
    'warranty.formSubmit': 'Gửi yêu cầu hỗ trợ',
    'warranty.contactInfoTitle': 'Thông tin liên hệ',
    'warranty.supportInfo1': 'XLab hỗ trợ tư vấn mua hàng hoặc bảo hành từ <strong>8h00 đến 21h00 hàng ngày (kể cả ngày lễ)</strong>. Chúng tôi xử lý rất nhiều đơn hàng mỗi ngày và sẽ xử lý từng yêu cầu theo thứ tự. Chúng tôi sẽ hỗ trợ<strong> nhanh chóng trong vòng 24h</strong> sau khi nhận được yêu cầu.',
    'warranty.supportInfo2': 'Để được hỗ trợ bảo hành nhanh chóng, bạn vui lòng điền vấn đề cụ thể vào form yêu cầu hỗ trợ. Chúng tôi sẽ kiểm tra, hướng dẫn cách sửa lỗi hoặc gửi tài khoản mới tự động qua Email/Zalo của bạn.',
    'warranty.address': 'Địa chỉ',
    'warranty.workingHours': 'Giờ làm việc',
    'warranty.ourMission': 'Sứ mệnh của chúng tôi',
    'warranty.missionDescription': 'Sứ mệnh của XLab là đem đến cho người Việt cơ hội tiếp cận với các công cụ phục vụ làm việc, học tập, giải trí với giá cả phải chăng và chất lượng quốc tế.',
    'warranty.contactNow': 'Liên hệ ngay',
    'warranty.faq': 'Câu hỏi thường gặp',

    // Footer
    'footer.productsAndServices': 'Sản phẩm & Dịch vụ',
    'footer.products': 'Sản phẩm',
    'footer.services': 'Dịch vụ',
    'footer.testimonials': 'Đánh giá',
    'footer.navigation': 'Điều hướng',
    'footer.pricing': 'Bảng giá',
    'footer.copyright': 'Bản quyền thuộc về công ty',
    'footer.acceptedPayments': 'Chấp nhận thanh toán',
    'footer.companyDescription1': 'XLab là công ty hàng đầu trong lĩnh vực phát triển giải pháp công nghệ và phần mềm chuyên nghiệp cho doanh nghiệp.',
    'footer.companyDescription2': 'Với đội ngũ chuyên gia giàu kinh nghiệm, XLab tự hào là đối tác tin cậy của hơn 500+ doanh nghiệp.',
    'footer.customers': '500+ Khách hàng',
    'footer.years': '5+ Năm',
    'footer.support': '24/7 Hỗ trợ',
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
    'about.title': 'About Us',
    'about.subtitle': 'Learn about our mission, vision, and team',
    'about.pageTitle': 'About | XLab - Software and Services',
    'about.storyTitle': 'Our Story',
    'about.storyContent': 'Founded in 2019, XLab started with a simple mission: to make high-quality software accessible to everyone. We believe that powerful tools should not be limited to those who can afford expensive subscriptions or licenses.',
    'about.missionTitle': 'Our Mission',
    'about.missionContent': 'To provide Vietnamese users with easy access to professional software and services at affordable prices, while maintaining the highest quality standards and customer support.',
    'about.visionTitle': 'Our Vision',
    'about.visionContent': 'To become the leading platform for software distribution in Vietnam, known for our exceptional product quality, customer service, and community impact.',
    'about.valuesTitle': 'Our Values',
    'about.value1Title': 'Accessibility',
    'about.value1Content': 'Making professional tools available at affordable prices',
    'about.value2Title': 'Quality',
    'about.value2Content': 'Never compromising on the quality of our products and services',
    'about.value3Title': 'Integrity',
    'about.value3Content': 'Conducting business with honesty and transparency',
    'about.value4Title': 'Innovation',
    'about.value4Content': 'Constantly evolving and improving our offerings',
    'about.teamTitle': 'Our Team',
    'about.teamSubtitle': 'Meet the people behind XLab',
    'about.ceo': 'CEO & Founder',
    'about.cto': 'CTO',
    'about.cmo': 'CMO',
    'about.supportManager': 'Support Manager',
    'about.joinTeam': 'Join Our Team',
    'about.joinContent': 'Interested in working with us? Check out our open positions and become part of our growing team.',
    'about.viewPositions': 'View Open Positions',
    'about.partnersTitle': 'Our Partners',
    'about.partnersSubtitle': 'Companies we work with',

    // Contact page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We\'re here to help and answer any question you might have',
    'contact.pageTitle': 'Contact | XLab - Software and Services',
    'contact.getInTouch': 'Get In Touch',
    'contact.callUs': 'Call Us',
    'contact.emailUs': 'Email Us',
    'contact.visitUs': 'Visit Us',
    'contact.workingHours': 'Working Hours',
    'contact.formName': 'Your Name',
    'contact.formEmail': 'Your Email',
    'contact.formPhone': 'Your Phone (optional)',
    'contact.formSubject': 'Subject',
    'contact.formMessage': 'Your Message',
    'contact.formPlaceholder': 'Type your message here...',
    'contact.formSubmit': 'Send Message',
    'contact.formSubmitting': 'Sending...',
    'contact.formSuccess': 'Your message has been sent! We\'ll get back to you soon.',
    'contact.formError': 'There was an error sending your message. Please try again.',
    'contact.faq': 'Frequently Asked Questions',
    'contact.faqSubtitle': 'Find quick answers to common questions',
    'contact.connectWithUs': 'Connect With Us',
    'contact.followUs': 'Follow us on social media',
    'contact.newsletterTitle': 'Subscribe to Our Newsletter',
    'contact.newsletterSubtitle': 'Get the latest news and updates',
    'contact.newsletterPlaceholder': 'Enter your email',
    'contact.newsletterSubmit': 'Subscribe',
    'contact.monday': 'Monday',
    'contact.tuesday': 'Tuesday',
    'contact.wednesday': 'Wednesday',
    'contact.thursday': 'Thursday',
    'contact.friday': 'Friday',
    'contact.saturday': 'Saturday',
    'contact.sunday': 'Sunday',
    'contact.closed': 'Closed',

    // Common buttons
    'button.getStarted': 'Get Started',
    'button.learnMore': 'Learn More',
    'button.viewDetails': 'View Details',
    'button.addToCart': 'Add to Cart',
    'button.buyNow': 'Buy Now',
    'button.download': 'Download',
    'button.contactUs': 'Contact Us',
    'button.viewAll': 'View All',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Discount',
    'cart.total': 'Total',
    'cart.remove': 'Remove',
    'cart.apply': 'Apply',
    'cart.enterCoupon': 'Enter coupon code',

    // Footer
    'footer.about': 'About XLab',
    'footer.contact': 'Contact',
    'footer.productsServices': 'Products & Services',
    'footer.productsList': 'Products',
    'footer.servicesList': 'Services',
    'footer.testimonialsList': 'Testimonials',
    'footer.navigation': 'Navigation',
    'footer.pricing': 'Pricing',
    'footer.copyright': 'Copyright owned by',
    'footer.acceptedPayments': 'Accepted Payments',
    'footer.companyDescription1': 'XLab is a leading company in the field of technology solutions and professional software development for businesses.',
    'footer.companyDescription2': 'With a team of experienced experts, XLab is proud to be a trusted partner of over 500+ businesses.',
    'footer.customers': '500+ Customers',
    'footer.years': '5+ Years',
    'footer.support': '24/7 Support',
    
    // Products page
    'products.title': 'Products',
    'products.subtitle': 'List of high-quality software and services with the best prices on the market.',
    'products.pageTitle': 'Software | XLab - Software and Services',
    'products.all': 'All',
    'products.software': 'Software',
    'products.service': 'Service',
    'products.showing': 'Showing {count} results',
    'products.sortBy': 'Sort by',
    'products.sortNewest': 'Newest',
    'products.sortPriceLow': 'Price: Low to High',
    'products.sortPriceHigh': 'Price: High to Low',
    'products.sortPopular': 'Most Popular',
    'products.sortRating': 'Highest Rated',
    'products.loading': 'Loading products...',
    'products.errorTitle': 'Unable to load products',
    'products.loadError': 'Unable to load products',
    'products.invalidData': 'Invalid data format',
    'products.error': 'An error occurred',
    'products.tryAgain': 'Try Again',
    'products.backToHome': 'Back to Home',
    
    // Product detail page
    'product.details': 'Product Details',
    'product.specifications': 'Technical Specifications',
    'product.requirements': 'System Requirements',
    'product.metaTitle': 'XLab - Software and Services',
    'product.loading': 'Loading product information...',
    'product.version': 'Version',
    'product.quantity': 'Quantity',
    'product.availableIn': 'Available in',
    'product.price': 'Price',
    'product.originalPrice': 'Original Price',
    'product.discount': 'Discount',
    'product.relatedProducts': 'Related Products',
    'product.reviews': 'Reviews',
    'product.features': 'Features',
    'product.description': 'Description',
    'product.options': 'Options',
    'product.selectOption': 'Select option',
    'product.downloadCount': 'Downloads',
    'product.viewCount': 'Views',
    'product.addedToCart': 'Added {quantity} product(s) to cart',
    'product.outOfStock': 'Out of stock',
    'product.inStock': 'In stock',
    'product.tryDemo': 'Try demo',

    // Warranty page
    'warranty.title': 'Warranty',
    'warranty.subtitle': 'XLab is ready to provide consultation and warranty service for 365 days!',
    'warranty.policyTitle': 'Warranty Policy',
    'warranty.periodTitle': 'Warranty Period',
    'warranty.period': 'XLab guarantees warranty for all accounts and software for <strong>{days} days</strong> from the date of purchase.',
    'warranty.processTitle': 'Warranty Process',
    'warranty.process': 'When your account encounters issues, please send a support request through the form on the side or contact us directly via Zalo, Email.',
    'warranty.conditionsTitle': 'Warranty Conditions',
    'warranty.conditions': 'The account must be within the warranty period and used according to regulations.',
    'warranty.refundPolicyTitle': 'Refund Policy',
    'warranty.refundPeriodTitle': 'Refund Period',
    'warranty.refundPeriod': 'Within <strong>{days} days</strong> from the date of purchase, you can request a refund if the product does not meet your needs.',
    'warranty.refundConditionsTitle': 'Refund Conditions',
    'warranty.refundConditions': 'The product has not been modified, tampered with, and does not violate the terms of use.',
    'warranty.refundProcessTitle': 'Refund Process',
    'warranty.refundProcess': 'After confirming the valid request, we will refund through the original payment method within 3-5 business days.',
    'warranty.supportRequestTitle': 'Technical Support Request',
    'warranty.submitSuccess': 'Thank you for submitting your request! We will respond as soon as possible.',
    'warranty.formError': 'An error occurred while submitting the request. Please try again later.',
    'warranty.formName': 'Full Name',
    'warranty.formEmail': 'Email',
    'warranty.formPhone': 'Phone Number',
    'warranty.formOrderCode': 'Order Code',
    'warranty.formAccountName': 'Account Name',
    'warranty.formProblem': 'Issue Description',
    'warranty.formProblemPlaceholder': 'Describe in detail the issue you are experiencing',
    'warranty.formSubmitting': 'Submitting...',
    'warranty.formSubmit': 'Submit Support Request',
    'warranty.contactInfoTitle': 'Contact Information',
    'warranty.supportInfo1': 'XLab provides purchase or warranty consultation from <strong>8:00 AM to 9:00 PM daily (including holidays)</strong>. We process many orders every day and will process each request in order. We will provide <strong>quick support within 24 hours</strong> after receiving the request.',
    'warranty.supportInfo2': 'For fast warranty support, please fill in the specific issue in the support request form. We will check, guide how to fix the error, or send a new account automatically via your Email/Zalo.',
    'warranty.address': 'Address',
    'warranty.workingHours': 'Working Hours',
    'warranty.ourMission': 'Our Mission',
    'warranty.missionDescription': 'XLab\'s mission is to provide Vietnamese people with access to tools for work, study, and entertainment at reasonable prices and international quality.',
    'warranty.contactNow': 'Contact Now',
    'warranty.faq': 'Frequently Asked Questions',
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
    try {
      // Kiểm tra key hợp lệ
      if (typeof key !== 'string' || !key) {
        console.warn('Invalid translation key:', key);
        return '';
      }
      
      // Lấy chuỗi dịch hoặc trả về key nếu không tìm thấy
      let text = translations[language]?.[key] || key;
      
      // Chỉ xử lý thay thế tham số khi có tham số được truyền vào
      if (params && typeof params === 'object') {
        // Kiểm tra xem params có phải là object rỗng không
        if (Object.keys(params).length > 0) {
          // Thay thế các tham số trong chuỗi
          Object.entries(params).forEach(([param, value]) => {
            // Xác định mẫu thay thế an toàn
            const regex = new RegExp(`\\{${param}\\}`, 'g');
            
            // Xử lý các trường hợp giá trị
            if (value !== undefined && value !== null) {
              try {
                // Chuyển đổi an toàn sang chuỗi
                const strValue = String(value);
                text = text.replace(regex, strValue);
              } catch (err) {
                // Nếu có lỗi khi chuyển đổi, thay thế bằng chuỗi rỗng
                text = text.replace(regex, '');
                console.warn(`Error converting value for param ${param}:`, err);
              }
            } else {
              // Thay thế giá trị undefined hoặc null bằng chuỗi rỗng
              text = text.replace(regex, '');
            }
          });
        }
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return key || ''; // Trả về key gốc hoặc chuỗi rỗng nếu có lỗi xảy ra
    }
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