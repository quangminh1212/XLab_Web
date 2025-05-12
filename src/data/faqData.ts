export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'product' | 'account' | 'payment' | 'technical' | 'business' | 'general';
}

export const faqCategories = [
  { id: 'product', name: 'Sản phẩm & Dịch vụ' },
  { id: 'account', name: 'Tài khoản' },
  { id: 'payment', name: 'Thanh toán & Đơn hàng' },
  { id: 'technical', name: 'Hỗ trợ kỹ thuật' },
  { id: 'business', name: 'Giải pháp doanh nghiệp' },
  { id: 'general', name: 'Thông tin chung' },
];

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Làm thế nào để tải xuống phần mềm?',
    answer: 'Bạn có thể tải xuống phần mềm miễn phí tại trang sản phẩm tương ứng sau khi đăng nhập vào tài khoản của mình. Đối với sản phẩm trả phí, bạn cần hoàn tất thanh toán trước khi tải xuống.',
    category: 'product'
  },
  {
    id: 'faq-2',
    question: 'Làm thế nào để kích hoạt bản quyền?',
    answer: 'Sau khi mua sản phẩm, bạn sẽ nhận được mã kích hoạt qua email. Mở ứng dụng, vào phần "Kích hoạt bản quyền" và nhập mã này để sử dụng đầy đủ tính năng.',
    category: 'product'
  },
  {
    id: 'faq-3',
    question: 'Tôi có thể sử dụng trên mấy thiết bị?',
    answer: 'Mỗi bản quyền cho phép bạn sử dụng trên tối đa 3 thiết bị cùng một lúc. Bạn có thể quản lý danh sách thiết bị trong phần "Tài khoản" trên website.',
    category: 'account'
  },
  {
    id: 'faq-4',
    question: 'Chính sách hoàn tiền như thế nào?',
    answer: 'Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày kể từ ngày mua nếu sản phẩm không đáp ứng được nhu cầu của bạn. Liên hệ với bộ phận hỗ trợ để được hướng dẫn.',
    category: 'payment'
  },
  {
    id: 'faq-5',
    question: 'Làm thế nào để liên hệ hỗ trợ kỹ thuật?',
    answer: 'Bạn có thể liên hệ với đội ngũ hỗ trợ kỹ thuật thông qua email support@xlab.vn, hotline 1900.xxxx, hoặc chat trực tiếp trên website. Chúng tôi phản hồi trong vòng 24 giờ làm việc.',
    category: 'technical'
  },
  {
    id: 'faq-6',
    question: 'XLab có cung cấp giải pháp cho doanh nghiệp?',
    answer: 'Có, chúng tôi có các gói dịch vụ đặc biệt dành cho doanh nghiệp với nhiều ưu đãi về giá và hỗ trợ kỹ thuật chuyên biệt. Liên hệ với chúng tôi để được tư vấn phương án phù hợp nhất.',
    category: 'business'
  },
  {
    id: 'faq-7',
    question: 'Thời gian hỗ trợ kỹ thuật là bao lâu?',
    answer: 'Thời gian hỗ trợ kỹ thuật tiêu chuẩn là 1 năm kể từ ngày mua sản phẩm. Bạn có thể gia hạn thời gian hỗ trợ bằng cách mua gói dịch vụ hỗ trợ bổ sung.',
    category: 'technical'
  },
  {
    id: 'faq-8',
    question: 'Có phí nâng cấp phiên bản không?',
    answer: 'Các bản cập nhật nhỏ (vd: từ v1.1 lên v1.2) thường miễn phí. Các bản nâng cấp lớn (vd: từ v1.x lên v2.0) có thể yêu cầu phí nâng cấp, nhưng khách hàng hiện tại sẽ được hưởng mức giá ưu đãi.',
    category: 'payment'
  },
  {
    id: 'faq-9',
    question: 'Tôi quên mật khẩu thì phải làm sao?',
    answer: 'Bạn có thể sử dụng tính năng "Quên mật khẩu" trên trang đăng nhập. Hệ thống sẽ gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email đã đăng ký.',
    category: 'account'
  },
  {
    id: 'faq-10',
    question: 'Các phương thức thanh toán nào được chấp nhận?',
    answer: 'Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, MasterCard), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay, VNPay), và thanh toán khi nhận hàng (COD) cho một số sản phẩm.',
    category: 'payment'
  },
  {
    id: 'faq-11',
    question: 'Cách tạo tài khoản mới trên XLab?',
    answer: 'Bạn có thể tạo tài khoản mới bằng cách nhấp vào "Đăng ký" trên trang chủ, sau đó điền thông tin cá nhân và xác nhận qua email. Bạn cũng có thể đăng ký nhanh thông qua tài khoản Google hoặc Facebook.',
    category: 'account'
  },
  {
    id: 'faq-12',
    question: 'XLab hoạt động được bao lâu rồi?',
    answer: 'XLab được thành lập vào năm 2018 và đã phát triển thành một trong những công ty phần mềm hàng đầu Việt Nam, với hơn 50.000 khách hàng trong và ngoài nước.',
    category: 'general'
  },
  {
    id: 'faq-13',
    question: 'Các sản phẩm có bản dùng thử không?',
    answer: 'Hầu hết các sản phẩm của chúng tôi đều có bản dùng thử miễn phí với đầy đủ tính năng trong thời gian giới hạn (thường là 7-14 ngày), giúp bạn đánh giá sản phẩm trước khi quyết định mua.',
    category: 'product'
  },
  {
    id: 'faq-14',
    question: 'Có cần kết nối internet để sử dụng phần mềm không?',
    answer: 'Điều này phụ thuộc vào từng sản phẩm. Một số phần mềm hoạt động hoàn toàn offline, trong khi những phần mềm khác có thể yêu cầu kết nối internet để xác thực hoặc đồng bộ dữ liệu. Thông tin này được ghi rõ trong mô tả sản phẩm.',
    category: 'technical'
  },
  {
    id: 'faq-15',
    question: 'Làm thế nào để được giảm giá khi mua số lượng lớn?',
    answer: 'Chúng tôi cung cấp chiết khấu đặc biệt cho khách hàng mua nhiều bản quyền hoặc nhiều sản phẩm khác nhau. Vui lòng liên hệ với bộ phận kinh doanh theo email sales@xlab.vn để nhận báo giá tốt nhất.',
    category: 'business'
  }
]; 