'use client'

import Link from 'next/link'
import Image from 'next/image'
import { footerLinks, newsletterConfig } from '@/config/siteConfig'
import { useLanguage } from '@/contexts/LanguageContext'

// Hàm chuyển đổi chuỗi tiếng Việt sang không dấu và lowercase
function convertToKey(text: string): string {
  if (!text) return '';

  // Chuyển về chữ thường và loại bỏ khoảng trắng
  text = text.toLowerCase().replace(/\s+/g, '');

  // Bảng chuyển đổi các ký tự có dấu sang không dấu
  const map: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
  };

  // Áp dụng bảng chuyển đổi
  return text.replace(/[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g,
    function (m) { return map[m]; });
}

export default function Footer() {
  const { translate } = useLanguage()

  const currentYear = new Date().getFullYear()

  // Ánh xạ từ tên tiếng Việt sang key cho các section
  const sectionKeys: Record<string, string> = {
    'Sản phẩm': 'products',
    'Hỗ trợ': 'support',
    'Về chúng tôi': 'aboutus',
    'Pháp lý': 'legal'
  }

  // Ánh xạ từ tên tiếng Việt sang key cho các link
  const linkKeys: Record<string, string> = {
    'Tất cả sản phẩm': 'allproducts',
    'Mới phát hành': 'newreleases',
    'Phổ biến nhất': 'mostpopular',
    'Khuyến mãi': 'onsale',
    'Liên hệ': 'contact',
    'FAQ': 'faq',
    'Hướng dẫn sử dụng': 'userguides',
    'Báo lỗi': 'reportbug',
    'Giới thiệu': 'aboutus',
    'Blog': 'blog',
    'Tuyển dụng': 'careers',
    'Đối tác': 'partners',
    'Điều khoản dịch vụ': 'termsofservice',
    'Chính sách bảo mật': 'privacypolicy',
    'Chính sách hoàn tiền': 'refundpolicy',
    'Quyền sở hữu trí tuệ': 'intellectualproperty'
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Thông tin */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.jpg"
                alt="XLab Logo"
                width={80}
                height={80}
                className="w-full sm:w-60 md:w-72 lg:w-80 h-auto rounded-lg"
              />
            </Link>
            <p className="text-gray-400 text-sm">
              {translate('footer.companyDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold">
                {translate(`footer.${sectionKeys[section.title] || convertToKey(section.title)}`)}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {translate(`footer.${linkKeys[link.name] || convertToKey(link.name)}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-3 lg:col-span-2">
            <h3 className="text-lg font-semibold">{translate('footer.newsletter')}</h3>
            <p className="text-gray-400 text-sm">{translate('footer.newsletterDescription')}</p>
            <form className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder={translate('footer.emailPlaceholder')}
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm font-medium"
              >
                {translate('footer.subscribeButton')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs">
          <p>
            © {currentYear} XLab. {translate('footer.allRightsReserved')}.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {translate('footer.privacyPolicy')}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {translate('footer.termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 