'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Điều khoản dịch vụ</h1>

          <div className="prose prose-teal max-w-none">
            <p className="text-gray-600 mb-6">
              Cập nhật lần cuối: {siteConfig.legal.termsLastUpdated}
            </p>

            <h2>1. Giới thiệu</h2>
            <p>
              Chào mừng bạn đến với {siteConfig.name}! Các Điều khoản Dịch vụ này ("Điều khoản") chi
              phối việc truy cập và sử dụng trang web, sản phẩm và dịch vụ của chúng tôi. Bằng cách
              truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân theo các Điều khoản này.
            </p>

            <h2>2. Tài khoản của bạn</h2>
            <p>
              Để sử dụng một số tính năng của dịch vụ chúng tôi, bạn cần tạo tài khoản. Bạn chịu
              trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu của mình, đồng thời bạn
              cũng chịu trách nhiệm cho tất cả hoạt động diễn ra dưới tài khoản của mình.
            </p>

            <h2>3. Nội dung và quyền sở hữu trí tuệ</h2>
            <p>
              {siteConfig.legal.companyName} và bên cấp phép sở hữu tất cả các quyền, quyền sở hữu
              và lợi ích đối với dịch vụ, bao gồm tất cả quyền sở hữu trí tuệ liên quan. Bạn không
              được sao chép, sửa đổi, phân phối, hoặc bán bất kỳ phần nào của dịch vụ của chúng tôi
              mà không có sự cho phép rõ ràng bằng văn bản.
            </p>

            <h2>4. Giấy phép sử dụng</h2>
            <p>
              {siteConfig.legal.companyName} cấp cho bạn giấy phép sử dụng cá nhân, không độc quyền,
              không thể chuyển nhượng để sử dụng dịch vụ của chúng tôi. Bạn không được sao chép, sửa
              đổi, phân phối, bán, cho thuê, thuê, hoặc cấp phép phụ bất kỳ phần nào của dịch vụ.
            </p>

            <h2>5. Giá cả và thanh toán</h2>
            <p>
              Đối với các dịch vụ trả phí, bạn đồng ý thanh toán tất cả các khoản phí liên quan.
              Chúng tôi có thể thay đổi giá cả bằng cách thông báo trước cho bạn. Việc thanh toán
              không được hoàn lại trừ khi có quy định khác trong chính sách hoàn tiền của chúng tôi.
            </p>

            <h2>6. Bảo mật và dữ liệu cá nhân</h2>
            <p>
              Chúng tôi thu thập và xử lý dữ liệu cá nhân của bạn theo{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">
                Chính sách Bảo mật
              </Link>{' '}
              của chúng tôi. Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với việc thu thập
              và xử lý dữ liệu theo chính sách này.
            </p>

            <h2>7. Tuyên bố từ chối trách nhiệm</h2>
            <p>
              Dịch vụ của chúng tôi được cung cấp "nguyên trạng" và "như sẵn có".{' '}
              {siteConfig.legal.companyName} từ chối tất cả các bảo đảm, dù rõ ràng hay ngụ ý, bao
              gồm nhưng không giới hạn ở các bảo đảm về tính thương mại, sự phù hợp cho một mục đích
              cụ thể, và không vi phạm.
            </p>

            <h2>8. Giới hạn trách nhiệm</h2>
            <p>
              Trong mọi trường hợp, {siteConfig.legal.companyName} sẽ không chịu trách nhiệm đối với
              bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc trừng phạt nào, bao gồm
              mất lợi nhuận, doanh thu, dữ liệu, hoặc cơ hội kinh doanh.
            </p>

            <h2>9. Chấm dứt</h2>
            <p>
              Chúng tôi có thể đình chỉ hoặc chấm dứt quyền truy cập của bạn vào tất cả hoặc một
              phần của dịch vụ nếu bạn vi phạm các Điều khoản này, hoặc nếu chúng tôi tin rằng việc
              sử dụng của bạn có thể gây thiệt hại cho {siteConfig.legal.companyName} hoặc người
              dùng khác.
            </p>

            <h2>10. Thay đổi điều khoản</h2>
            <p>
              Chúng tôi có thể sửa đổi các Điều khoản này bất kỳ lúc nào. Nếu chúng tôi thực hiện
              những thay đổi quan trọng, chúng tôi sẽ thông báo cho bạn. Việc tiếp tục sử dụng dịch
              vụ của chúng tôi sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các
              điều khoản mới.
            </p>

            <h2>11. Luật áp dụng</h2>
            <p>
              Các Điều khoản này sẽ được điều chỉnh và giải thích theo luật pháp Việt Nam, không
              liên quan đến xung đột các nguyên tắc pháp luật.
            </p>

            <h2>12. Liên hệ</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi
              qua địa chỉ email:{' '}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-primary-600 hover:underline"
              >
                {siteConfig.contact.email}
              </a>{' '}
              hoặc truy cập trang{' '}
              <Link href="/contact" className="text-primary-600 hover:underline">
                Liên hệ
              </Link>{' '}
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
