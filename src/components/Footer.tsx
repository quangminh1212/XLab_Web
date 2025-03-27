'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here would be the actual subscription logic
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo và giới thiệu */}
          <div className="mb-8">
            <Link href="/" className="flex items-center mb-4">
              <Image 
                src="/images/xlab-logo.png" 
                alt="XLab Logo" 
                width={48} 
                height={48} 
                className="h-10 w-auto mr-2"
              />
              <span className="text-2xl font-bold">
                <span className="text-white">X</span>
                <span className="text-primary-500">Lab</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Chúng tôi chuyên cung cấp các giải pháp phần mềm và dịch vụ công nghệ
              giúp doanh nghiệp tối ưu hóa hoạt động và tăng trưởng bền vững.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.486 2 2 6.486 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-5.514-4.486-10-10-10zm5.777 13.516c-.215.35-.677.655-1.151.634-.508-.023-1-.371-1.533-.716-.412-.265-.935-.613-1.243-.613a.5.5 0 0 0-.37.835c.899.707 1.728 1.344 1.913 1.398.302.09.695-.115.945-.249l.22.429c-.122.059-.806.452-1.419.452-.487 0-.966-.163-1.274-.355-.276-.172-1.422-.988-1.9-1.334-.198-.143-.451-.291-.714-.291-.263 0-1.177 1.068-1.912 1.068-.328 0-.756-.135-1.075-.301l-.018-.007c-.276-.125-.522-.267-.522-.631 0-.239.201-.53.757-.853.237-.138.857-.43 1.619-.626-.221-.251-.605-.903-.605-1.607 0-.866.376-1.571 1.146-2.125.673-.486 1.502-.731 2.458-.731 1.36 0 2.455.56 3.05 1.533.375-.16.936-.404 1.417-.404.438 0 .828.123 1.094.482.38.512.163 1.44-.012 1.987h-2.023c.067.232.147.459.237.677h1.964c-.139.5-.284.879-.455 1.197h-1.694c.163.228.345.438.55.623h1.376zM12 3.75a8.25 8.25 0 0 1 8.25 8.25 8.25 8.25 0 0 1-8.25 8.25 8.25 8.25 0 0 1-8.25-8.25A8.25 8.25 0 0 1 12 3.75z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">Sản phẩm</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Dịch vụ</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Liên hệ</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
            </ul>
          </div>
          
          {/* Sản phẩm */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">Sản phẩm</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products/xlab-office-suite" className="hover:text-white transition-colors">
                  XLab Office Suite
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-erp-system" className="hover:text-white transition-colors">
                  XLab ERP System
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-secure-vault" className="hover:text-white transition-colors">
                  XLab Secure Vault
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-design-master" className="hover:text-white transition-colors">
                  XLab Design Master
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-code-ide" className="hover:text-white transition-colors">
                  XLab Code IDE
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-primary-500 hover:text-primary-400 transition-colors">
                  Xem tất cả →
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+84 28 1234 5678</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@xlab.vn</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Thứ 2 - Thứ 6: 8:30 - 17:30<br />Thứ 7: 8:30 - 12:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} XLab. Bản quyền thuộc về công ty phần mềm XLab.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Chính sách cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 