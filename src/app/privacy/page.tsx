'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy.title')}</h1>

          <div className="prose prose-teal max-w-none">
            <p className="text-gray-600 mb-6">
              {t('privacy.lastUpdated')}: {siteConfig.legal.privacyLastUpdated}
            </p>

            <h2>1. {t('privacy.section1.title')}</h2>
            <p>
              {t('privacy.section1.content', { companyName: siteConfig.legal.companyName })}
            </p>

            <h2>2. {t('privacy.section2.title')}</h2>
            <p>{t('privacy.section2.intro')}</p>
            <ul>
              <li>
                <strong>{t('privacy.section2.item1').split(':')[0]}:</strong> {t('privacy.section2.item1').split(':')[1]}
              </li>
              <li>
                <strong>{t('privacy.section2.item2').split(':')[0]}:</strong> {t('privacy.section2.item2').split(':')[1]}
              </li>
              <li>
                <strong>{t('privacy.section2.item3').split(':')[0]}:</strong> {t('privacy.section2.item3').split(':')[1]}
              </li>
              <li>
                <strong>{t('privacy.section2.item4').split(':')[0]}:</strong> {t('privacy.section2.item4').split(':')[1]}
              </li>
              <li>
                <strong>{t('privacy.section2.item5').split(':')[0]}:</strong> {t('privacy.section2.item5').split(':')[1]}
              </li>
            </ul>

            <h2>3. {t('privacy.section3.title')}</h2>
            <p>{t('privacy.section3.intro')}</p>
            <ul>
              <li>{t('privacy.section3.item1')}</li>
              <li>{t('privacy.section3.item2')}</li>
              <li>{t('privacy.section3.item3')}</li>
              <li>{t('privacy.section3.item4')}</li>
              <li>{t('privacy.section3.item5')}</li>
              <li>{t('privacy.section3.item6')}</li>
            </ul>

            <h2>4. Chia sẻ thông tin của bạn</h2>
            <p>
              Chúng tôi không bán thông tin cá nhân của bạn. Tuy nhiên, chúng tôi có thể chia sẻ
              thông tin trong các trường hợp sau:
            </p>
            <ul>
              <li>
                Với các nhà cung cấp dịch vụ giúp chúng tôi điều hành dịch vụ (ví dụ: xử lý thanh
                toán, lưu trữ đám mây)
              </li>
              <li>Khi được yêu cầu theo quy định pháp luật</li>
              <li>Để bảo vệ quyền, tài sản hoặc sự an toàn của chúng tôi hoặc người khác</li>
              <li>Trong trường hợp sáp nhập, bán tài sản công ty hoặc tài trợ</li>
              <li>Với sự đồng ý của bạn</li>
            </ul>

            <h2>5. Bảo mật dữ liệu</h2>
            <p>
              Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn.
              Tuy nhiên, không có phương thức truyền qua internet hoặc lưu trữ điện tử nào là 100%
              an toàn. Do đó, chúng tôi không thể đảm bảo bảo mật tuyệt đối.
            </p>

            <h2>6. Quyền của bạn</h2>
            <p>
              Tùy thuộc vào địa điểm của bạn, bạn có thể có các quyền sau liên quan đến dữ liệu cá
              nhân của mình:
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
              Để thực hiện bất kỳ quyền nào trong số này, vui lòng liên hệ với chúng tôi theo thông
              tin bên dưới.
            </p>

            <h2>7. Cookie và công nghệ theo dõi</h2>
            <p>
              Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn và
              thu thập thông tin về cách bạn sử dụng dịch vụ của chúng tôi. Bạn có thể quản lý tùy
              chọn cookie thông qua cài đặt trình duyệt của mình.
            </p>

            <h2>8. Liên kết đến trang web khác</h2>
            <p>
              Dịch vụ của chúng tôi có thể chứa liên kết đến các trang web khác không do chúng tôi
              vận hành. Nếu bạn nhấp vào liên kết của bên thứ ba, bạn sẽ được chuyển hướng đến trang
              web của bên đó. Chúng tôi không chịu trách nhiệm về chính sách bảo mật hoặc nội dung
              của các trang web bên ngoài.
            </p>

            <h2>9. Thay đổi chính sách bảo mật</h2>
            <p>
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông
              báo cho bạn về những thay đổi quan trọng bằng cách đăng thông báo trên trang web của
              chúng tôi hoặc gửi email trực tiếp.
            </p>

            <h2>10. Liên hệ</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng
              tôi qua:
            </p>
            <ul>
              <li>
                Email:{' '}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-primary-600 hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>Điện thoại: {siteConfig.contact.phone}</li>
              <li>
                Hoặc truy cập trang{' '}
                <Link href="/contact" className="text-primary-600 hover:underline">
                  Liên hệ
                </Link>{' '}
                của chúng tôi
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
