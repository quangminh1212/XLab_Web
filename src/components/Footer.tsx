'use client'

import Link from 'next/link'
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
    <footer className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center">
              <div className="w-9 h-9 bg-primary-600 flex items-center justify-center rounded-md text-white font-bold">
                X
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">XLab</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs">
              Phát triển giải pháp phần mềm sáng tạo, giúp biến ý tưởng của bạn thành hiện thực.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Sản phẩm
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/products/analytics" className="text-base text-gray-500 hover:text-gray-900">
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/automation" className="text-base text-gray-500 hover:text-gray-900">
                      Automation
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/crm" className="text-base text-gray-500 hover:text-gray-900">
                      CRM
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/security" className="text-base text-gray-500 hover:text-gray-900">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Dịch vụ
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/services/consulting" className="text-base text-gray-500 hover:text-gray-900">
                      Tư vấn
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/development" className="text-base text-gray-500 hover:text-gray-900">
                      Phát triển
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/support" className="text-base text-gray-500 hover:text-gray-900">
                      Hỗ trợ
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/training" className="text-base text-gray-500 hover:text-gray-900">
                      Đào tạo
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Công ty
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-base text-gray-500 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-base text-gray-500 hover:text-gray-900">
                      Tuyển dụng
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Đăng ký nhận tin
                </h3>
                <p className="mt-4 text-base text-gray-500">
                  Nhận thông tin mới nhất về sản phẩm và dịch vụ.
                </p>
                <form className="mt-4" onSubmit={handleSubscribe}>
                  <div className="flex">
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input 
                      id="email-address" 
                      name="email-address" 
                      type="email" 
                      autoComplete="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Email của bạn"
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 text-white bg-primary-600 border border-transparent rounded-r-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Đăng ký
                    </button>
                  </div>
                  {subscribed && (
                    <p className="mt-2 text-sm text-green-600">
                      Đăng ký thành công! Cảm ơn bạn đã quan tâm.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {currentYear} XLab Software. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
} 