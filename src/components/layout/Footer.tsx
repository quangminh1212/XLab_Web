'use client'

import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container max-w-[97.5%] mx-auto pt-20 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Logo và giới thiệu */}
          <div className="mb-12 flex flex-col items-center">
            <Link href="/" className="flex items-center justify-center mb-8">
              <span className="w-auto h-auto inline-flex items-center justify-center p-6 rounded-xl bg-white">
                <Image
                  src="/images/logo.jpg"
                  alt={`${siteConfig.name} Logo`}
                  width={250}
                  height={100}
                  className="w-auto h-28"
                />
              </span>
            </Link>
            <p className="text-gray-400 mb-8 text-lg text-left">
              Chúng tôi chuyên cung cấp các giải pháp phần mềm và dịch vụ công nghệ
              giúp doanh nghiệp tối ưu hóa hoạt động và tăng trưởng bền vững.
            </p>
            
            <div className="flex space-x-6">
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div className="flex flex-col items-start">
            <h3 className="text-white text-xl font-semibold mb-6">Liên kết nhanh</h3>
            <ul className="space-y-4 text-left">
              <li>
                <Link href="/" className="hover:text-white text-lg transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white text-lg transition-colors">Sản phẩm</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white text-lg transition-colors">Dịch vụ</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white text-lg transition-colors">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white text-lg transition-colors">Liên hệ</Link>
              </li>
            </ul>
          </div>

          {/* Sản phẩm */}
          <div className="flex flex-col items-start">
            <h3 className="text-white text-xl font-semibold mb-6">Sản phẩm</h3>
            <ul className="space-y-4 text-left">
              <li>
                <Link href="/products/xlab-office-suite" className="hover:text-white text-lg transition-colors">
                  XLab Office Suite
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-erp-system" className="hover:text-white text-lg transition-colors">
                  XLab ERP System
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-secure-vault" className="hover:text-white text-lg transition-colors">
                  XLab Secure Vault
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-design-master" className="hover:text-white text-lg transition-colors">
                  XLab Design Master
                </Link>
              </li>
              <li>
                <Link href="/products/xlab-code-ide" className="hover:text-white text-lg transition-colors">
                  XLab Code IDE
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className="flex flex-col items-start">
            <h3 className="text-white text-xl font-semibold mb-6">Liên hệ</h3>
            <ul className="space-y-4 text-left">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-lg">{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-lg">{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">{siteConfig.contact.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <p className="text-lg">&copy; {currentYear} {siteConfig.name}. Bản quyền thuộc về công ty {siteConfig.legal.companyName}.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center">
              <span className="text-base text-gray-400 mb-3 sm:mb-0 sm:mr-5">Chấp nhận thanh toán</span>
              <div className="flex space-x-5">
                {/* Visa */}
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-7">
                    <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
                    <path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.177 1.991.177l.355-2.073c0 0-1.113-.393-2.887-.393-2.545 0-4.482.674-4.482 3.07 0 2.417 2.627 2.215 2.627 3.329 0 .394-.333.82-1.441.82-1.721 0-3.014-.517-3.014-.517l-.368 2.055c0 0 1.357.591 3.329.591 2.453 0 4.34-.854 4.34-3.214C28.746 22.966 26.369 23.046 26.369 22.206z"/>
                  </svg>
                </div>
                
                {/* MasterCard */}
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-7">
                    <path fill="#FF9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"/>
                    <path fill="#D50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"/>
                    <path fill="#FFC400" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"/>
                  </svg>
                </div>
                
                {/* PayPal */}
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-7">
                    <path fill="#1565C0" d="M18.7,13.767l-0.497,3.074L18.161,17h-0.01c-0.116,0.723-0.581,1.256-1.309,1.256h-0.367c-0.106,0-0.213-0.035-0.301-0.088c-0.434-0.265-0.477-0.886-0.371-1.322l0.392-2.06L15.6,13.767c-0.177-0.619,0.133-1.636,1.193-1.636h0.917C18.089,12.131,18.869,13.113,18.7,13.767z"/>
                    <path fill="#1565C0" d="M27.5,29.987c-0.578,0.428-1.513,0.67-2.421,0.67c-0.85,0-1.535-0.258-1.917-0.694c-0.384-0.436-0.508-1.077-0.364-1.808l0.101-0.511c0.236-1.236,1.31-2.062,2.575-2.062c0.636,0,1.170,0.182,1.515,0.493c0.324,0.292,0.5,0.759,0.443,1.325h-1.56c0.019-0.13-0.13-0.182-0.07-0.236c-0.097-0.124-0.253-0.182-0.441-0.182c-0.376,0-0.657,0.207-0.733,0.599l-0.087,0.459c-0.071,0.366,0.106,0.561,0.512,0.561c0.272,0,0.506-0.137,0.676-0.33h1.687L27.5,29.987z"/>
                    <path fill="#1565C0" d="M32,30.694h-1.669L31,27.331h1.669L32,30.694z M31.701,26.8h-1.669l0.338-1.732h1.669L31.701,26.8z"/>
                    <path fill="#1565C0" d="M10.165,30.694h-1.66l0.338-1.749h-1.2l-0.338,1.749H5.629l0.991-5.126h1.676l-0.438,2.263h1.206l0.438-2.263h1.675L10.165,30.694z"/>
                    <path fill="#1565C0" d="M13.161,30.694l0.382-1.974l-0.455,0.625l-0.559,0.196l-0.566-2.863l0.328-1.077l0.816-0.033l0.325,0.471l-0.005-0.503h1.544l-0.874,4.522l0.284,0.562l-0.318,0.074H13.161z"/>
                    <path fill="#1565C0" d="M19.892,30.694h-3.937l0.991-5.095h3.835L20.5,26.62h-2.16l-0.133,0.666h2l-0.235,1.193h-1.997l-0.134,0.7H19.6L19.892,30.694z"/>
                    <path fill="#1565C0" d="M23.322,27.283c-0.054,0.277-0.205,0.526-0.398,0.704C22.433,28.2,22.052,28.26,21.429,28.26l-0.445,2.434h-1.614l1.075-5.6c0.46-0.039,0.924-0.064,1.391-0.064c1.756,0,2.067,0.615,1.819,1.627L23.322,27.283z M22.35,26.683l0.102-0.552c0.066-0.344-0.078-0.502-0.461-0.502c-0.16,0-0.339,0.013-0.471,0.026l-0.411,2.12h0.304c0.395,0,0.763-0.162,0.867-0.666L22.35,26.683z"/>
                    <path fill="#1565C0" d="M28.564,30.694h-1.557L27.43,29.41l-1.075,0.094l-0.23,1.191h-1.593l1.001-5.126h1.573l-0.456,2.322l0.935-0.509l0.667-1.814h1.677l-1.049,2.111l0.486,2.015H28.564z"/>
                  </svg>
                </div>
                
                {/* Momo */}
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" fill="#ae2070"/>
                    <path d="M22.11,15.08a5.83,5.83,0,0,0-5.18,3.26A5.83,5.83,0,0,0,11.44,21a3.6,3.6,0,0,0-3.36,3.8v6.52A1.44,1.44,0,0,0,9.52,32.8h8.51A1.44,1.44,0,0,0,19.47,31V25.33a.86.86,0,0,1,1.72,0V31A1.44,1.44,0,0,0,22.64,32.8h8.51a1.44,1.44,0,0,0,1.44-1.44V24.84a3.6,3.6,0,0,0-3.36-3.8A5.83,5.83,0,0,0,23.74,18,5.83,5.83,0,0,0,22.11,15.08Z" fill="white"/>
                  </svg>
                </div>
                
                {/* Bank Transfer */}
                <div className="w-14 h-9 bg-white rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7">
                    <path fill="#1976D2" d="M2,15V12H22V15H2M2,19V16H6V19H2M7,19V16H11V19H7M12,19V16H16V19H12M17,19V16H22V19H17M2,11V8H22V11H2M2,7V4H22V7H2Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 