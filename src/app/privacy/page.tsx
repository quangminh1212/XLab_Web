import Link from 'next/link'
import { siteConfig } from '@/config/siteConfig'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm p-8 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Chính sách bảo mật</h1>

                    <div className="prose prose-teal max-w-none">
                        <p className="text-gray-600 mb-6">
                            Cập nhật lần cuối: {siteConfig.legal.privacyLastUpdated}
                        </p>

                        <h2>1. Giới thiệu</h2>
                        <p>
                            {siteConfig.legal.companyName} ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và chia sẻ thông tin cá nhân của bạn khi bạn truy cập hoặc sử dụng trang web, ứng dụng hoặc dịch vụ của chúng tôi.
                        </p>

                        <h2>2. Thông tin chúng tôi thu thập</h2>
                        <p>
                            Chúng tôi có thể thu thập các loại thông tin sau từ bạn:
                        </p>
                        <ul>
                            <li><strong>Thông tin cá nhân:</strong> Tên, địa chỉ email, số điện thoại, địa chỉ thanh toán.</li>
                            <li><strong>Thông tin tài khoản:</strong> Tên đăng nhập, mật khẩu (được lưu trữ dưới dạng mã hóa).</li>
                            <li><strong>Thông tin thanh toán:</strong> Chi tiết thẻ tín dụng hoặc phương thức thanh toán khác.</li>
                            <li><strong>Thông tin thiết bị:</strong> Loại thiết bị, hệ điều hành, trình duyệt, địa chỉ IP.</li>
                            <li><strong>Dữ liệu sử dụng:</strong> Thông tin về cách bạn sử dụng trang web và dịch vụ của chúng tôi.</li>
                        </ul>

                        <h2>3. Cách chúng tôi sử dụng thông tin của bạn</h2>
                        <p>
                            Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:
                        </p>
                        <ul>
                            <li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi</li>
                            <li>Xử lý giao dịch và thanh toán</li>
                            <li>Gửi thông báo liên quan đến tài khoản hoặc dịch vụ của bạn</li>
                            <li>Gửi thông tin tiếp thị nếu bạn đã đồng ý</li>
                            <li>Phát hiện và ngăn chặn gian lận hoặc lạm dụng</li>
                            <li>Tuân thủ nghĩa vụ pháp lý</li>
                        </ul>

                        <h2>4. Chia sẻ thông tin của bạn</h2>
                        <p>
                            Chúng tôi không bán thông tin cá nhân của bạn. Tuy nhiên, chúng tôi có thể chia sẻ thông tin trong các trường hợp sau:
                        </p>
                        <ul>
                            <li>Với các nhà cung cấp dịch vụ giúp chúng tôi điều hành dịch vụ (ví dụ: xử lý thanh toán, lưu trữ đám mây)</li>
                            <li>Khi được yêu cầu theo quy định pháp luật</li>
                            <li>Để bảo vệ quyền, tài sản hoặc sự an toàn của chúng tôi hoặc người khác</li>
                            <li>Trong trường hợp sáp nhập, bán tài sản công ty hoặc tài trợ</li>
                            <li>Với sự đồng ý của bạn</li>
                        </ul>

                        <h2>5. Bảo mật dữ liệu</h2>
                        <p>
                            Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn. Tuy nhiên, không có phương thức truyền qua internet hoặc lưu trữ điện tử nào là 100% an toàn. Do đó, chúng tôi không thể đảm bảo bảo mật tuyệt đối.
                        </p>

                        <h2>6. Quyền của bạn</h2>
                        <p>
                            Tùy thuộc vào địa điểm của bạn, bạn có thể có các quyền sau liên quan đến dữ liệu cá nhân của mình:
                        </p>
                        <ul>
                            <li>Quyền truy cập và nhận bản sao dữ liệu của bạn</li>
                            <li>Quyền sửa đổi hoặc cập nhật dữ liệu của bạn</li>
                            <li>Quyền xóa dữ liệu của bạn</li>
                            <li>Quyền hạn chế xử lý dữ liệu của bạn</li>
                            <li>Quyền phản đối việc xử lý dữ liệu của bạn</li>
                            <li>Quyền di chuyển dữ liệu</li>
                        </ul>
                        <p>
                            Để thực hiện bất kỳ quyền nào trong số này, vui lòng liên hệ với chúng tôi theo thông tin bên dưới.
                        </p>

                        <h2>7. Cookie và công nghệ theo dõi</h2>
                        <p>
                            Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn và thu thập thông tin về cách bạn sử dụng dịch vụ của chúng tôi. Bạn có thể quản lý tùy chọn cookie thông qua cài đặt trình duyệt của mình.
                        </p>

                        <h2>8. Liên kết đến trang web khác</h2>
                        <p>
                            Dịch vụ của chúng tôi có thể chứa liên kết đến các trang web khác không do chúng tôi vận hành. Nếu bạn nhấp vào liên kết của bên thứ ba, bạn sẽ được chuyển hướng đến trang web của bên đó. Chúng tôi không chịu trách nhiệm về chính sách bảo mật hoặc nội dung của các trang web bên ngoài.
                        </p>

                        <h2>9. Thay đổi chính sách bảo mật</h2>
                        <p>
                            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về những thay đổi quan trọng bằng cách đăng thông báo trên trang web của chúng tôi hoặc gửi email trực tiếp.
                        </p>

                        <h2>10. Liên hệ</h2>
                        <p>
                            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua:
                        </p>
                        <ul>
                            <li>Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 hover:underline">{siteConfig.contact.email}</a></li>
                            <li>Điện thoại: {siteConfig.contact.phone}</li>
                            <li>Hoặc truy cập trang <Link href="/contact" className="text-primary-600 hover:underline">Liên hệ</Link> của chúng tôi</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
} 