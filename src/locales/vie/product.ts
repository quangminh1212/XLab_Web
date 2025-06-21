export const product = {
  // General product UI elements
  'product.details': 'Chi tiết sản phẩm',
  'product.description': 'Mô tả',
  'product.specifications': 'Thông số kỹ thuật',
  'product.reviews': 'Đánh giá',
  'product.relatedProducts': 'Sản phẩm liên quan',
  'product.relatedProductsSubtitle': 'Các sản phẩm tương tự mà bạn có thể quan tâm',
  'product.addToCart': 'Thêm vào giỏ hàng',
  'product.buyNow': 'Mua ngay',
  'product.outOfStock': 'Hết hàng',
  'product.inStock': 'Còn hàng',
  'product.warranty': 'Chính sách bảo hành',
  'product.warranty.days': 'Bảo hành 30 ngày',
  'product.warranty.description': 'Hoàn tiền hoặc đổi sản phẩm nếu không hài lòng trong vòng 30 ngày',
  'product.support': 'Hỗ trợ 24/7',
  'product.support.description': 'Đội ngũ hỗ trợ kỹ thuật luôn sẵn sàng giúp đỡ bạn mọi lúc',
  'product.documentation': 'Tài liệu đầy đủ',
  'product.documentation.description': 'Hướng dẫn sử dụng chi tiết và tài liệu tham khảo đầy đủ',
  'product.needHelp': 'Cần hỗ trợ thêm về sản phẩm?',
  'product.supportDescription': 'Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn',
  'product.supportEmail': 'Email hỗ trợ',
  'product.emailResponse': 'Phản hồi trong vòng 24 giờ',
  'product.supportPhone': 'Hotline',
  'product.phoneHours': 'Hỗ trợ từ 8h-22h hàng ngày',
  'product.liveChat': 'Live Chat',
  'product.chatDescription': 'Chat trực tiếp với nhân viên hỗ trợ',
  'product.startChat': 'Bắt đầu chat',
  'product.quantity': 'Số lượng',
  'product.options': 'Tùy chọn',
  'product.purchasesPerWeek': '{count} lượt/tuần',
  'product.totalSold': 'Đã bán {count}',
  'product.added': 'Đã thêm',
  'product.shortDescription': 'Mô tả sản phẩm',
  
  // Product option related texts
  'product.productOptions': 'Tùy chọn sản phẩm',
  'product.optionsList': 'Danh sách tùy chọn',
  'product.noFileSelected': 'Không có tệp nào được chọn',
  'product.default': 'Mặc định',
  'product.discount': 'Giảm giá',
  'product.duration': 'Thời hạn',
  'product.sellingPrice': 'Giá bán',
  'product.originalPrice': 'Giá gốc',
  'product.preview': 'Xem trước:',
  'product.addOption': 'Thêm:',
  'product.removeOption': 'Xóa',
  'product.fullUseOption': 'Full - Dùng riêng - 1 Tháng',
  'product.discountPercent': 'Giảm {percent}%',
  'product.setDefault': 'Đặt làm mặc định',

  // Product descriptions for specific products
  'product.products.chatgpt.shortDescription': 'ChatGPT là một chat bot cực mạnh hiện nay. Có thể trả lời được rất nhiều các câu hỏi cả tiếng anh và tiếng việt. Có thể hỗ trợ cả lập trình từ Front-end cho tới Back-end.',
  'product.products.grok.shortDescription': 'Grok AI giúp tự động phân tích và xử lý dữ liệu nhanh chóng.',

  // Product status
  'product.status.draft': 'Nháp',
  'product.status.public': 'Công khai',
  
  // Product specific descriptions
  products: {
    // ChatGPT product
    chatgpt: {
      description: `<p style="margin-bottom: 1rem; font-size: 18px; color: rgb(32, 41, 47); font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; letter-spacing: -0.176px;">ChatGPT là một chat bot cực mạnh hiện nay. Có thể trả lời được rất nhiều các câu hỏi cả tiếng anh và tiếng việt. Có thể hỗ trợ cả lập trình từ Front-end cho tới Back-end. Ngoài ra, tài khoản ChatGPT có khả năng trả lời nhiều loại câu hỏi khác nhau, bao gồm cả câu hỏi có liên quan đến lĩnh vực tri thức, văn hóa, xã hội và các lĩnh vực khác.</p>`,
      shortDescription: 'ChatGPT là một chat bot cực mạnh hiện nay. Có thể trả lời được rất nhiều các câu hỏi cả tiếng anh và tiếng việt. Có thể hỗ trợ cả lập trình từ Front-end cho tới Back-end.'
    },
    
    // Grok product
    grok: {
      description: 'Grok AI giúp tự động phân tích và xử lý dữ liệu lớn nhanh chóng, hỗ trợ ra quyết định chính xác và tiết kiệm thời gian. Ứng dụng rộng rãi trong nhiều lĩnh vực.',
      shortDescription: 'Grok AI giúp tự động phân tích và xử lý dữ liệu nhanh chóng.'
    }
  }
}; 

// Legacy format for backward compatibility
export const legacyProductTranslations = {
  'product.chatgpt.description': product.products.chatgpt.description,
  'product.chatgpt.shortDescription': product.products.chatgpt.shortDescription,
  'product.grok.description': product.products.grok.description,
  'product.grok.shortDescription': product.products.grok.shortDescription
}; 