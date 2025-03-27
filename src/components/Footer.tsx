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
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">
                X
              </div>
              <span className="ml-2 font-bold text-xl text-primary-700 group-hover:text-primary-500 transition-colors">XLab</span>
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              Chúng tôi phát triển giải pháp phần mềm sáng tạo, giúp biến ý tưởng của bạn thành hiện thực.
            </p>
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Chứng nhận & Đối tác</h4>
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                    <path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.138 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.215 2 10.535 2 12s.802 2.785 2.035 3.479A3.976 3.976 0 0 0 4 16c0 2.379 2.138 4.283 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.288 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.785 22 13.465 22 12s-.802-2.785-2.035-3.479zm-9.01 7.895-3.667-3.714 1.424-1.404 2.257 2.286 4.327-4.294 1.408 1.42-5.749 5.706z" />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1 12v2a1 1 0 0 0 1 1h1v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-2a1.02 1.02 0 0 0-.072-.393zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z" />
                    <ellipse cx="8.5" cy="12" rx="1.5" ry="2" />
                    <ellipse cx="15.5" cy="12" rx="1.5" ry="2" />
                    <path d="M8 16h8v2H8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase border-b border-gray-200 pb-2">
              Sản phẩm
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/products" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Tổng quan
                </Link>
              </li>
              <li>
                <Link href="/products/software" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Phần mềm
                </Link>
              </li>
              <li>
                <Link href="/products/mobile" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Ứng dụng di động
                </Link>
              </li>
              <li>
                <Link href="/products/cloud" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Dịch vụ Cloud
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Bảng giá
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase border-b border-gray-200 pb-2">
              Công ty
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact and Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase border-b border-gray-200 pb-2">
              Liên hệ & Cập nhật
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-base text-gray-600 hover:text-gray-900 transition-colors">
                  123 Đường Nguyễn Huệ, Quận 1, TP. HCM
                </span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-primary-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:+84123456789" className="ml-3 text-base text-gray-600 hover:text-primary-600 transition-colors">
                  (84) 123-456-789
                </a>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-primary-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:contact@xlab.com" className="ml-3 text-base text-gray-600 hover:text-primary-600 transition-colors">
                  contact@xlab.com
                </a>
              </li>
            </ul>
            
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Nhận thông tin cập nhật
              </h3>
              {subscribed ? (
                <div className="mt-2 p-3 bg-green-50 rounded-md text-green-700 text-sm border border-green-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Cảm ơn bạn đã đăng ký!</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-2">
                  <div className="flex rounded-md">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email-address" 
                      id="email-address" 
                      autoComplete="email" 
                      required 
                      className="w-full min-w-0 appearance-none rounded-l-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-primary-500" 
                      placeholder="Email của bạn" 
                    />
                    <button 
                      type="submit" 
                      className="flex-shrink-0 rounded-r-md border-transparent bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    >
                      Đăng ký
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Chúng tôi quan tâm đến việc bảo vệ dữ liệu của bạn. Đọc <Link href="/privacy" className="text-primary-600 hover:underline">Chính sách bảo mật</Link> của chúng tôi.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-500">
              &copy; {currentYear} XLab Inc. Tất cả các quyền được bảo lưu.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4">
              <Link href="/sitemap" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Sơ đồ trang
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Chính sách cookie
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>Đã tối ưu cho trải nghiệm người dùng cá nhân. Cập nhật lần cuối: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </footer>
  )
} 