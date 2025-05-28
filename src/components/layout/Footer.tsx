'use client'

import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
      
      <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center group mb-4">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/images/logo.jpg"
                alt={`${siteConfig.name} Logo`}
                width={560}
                height={224}
                className="w-auto h-56 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
          
          {/* Giới thiệu */}
          <div className="max-w-4xl space-y-4">
            <h3 className="text-white text-2xl font-bold">Về XLab</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              XLab là công ty hàng đầu trong lĩnh vực phát triển giải pháp công nghệ và phần mềm chuyên nghiệp cho doanh nghiệp. 
              Với đội ngũ chuyên gia giàu kinh nghiệm, XLab tự hào là đối tác tin cậy của hơn 500+ doanh nghiệp.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-3 py-1.5 text-sm bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30">
                500+ Khách hàng
              </span>
              <span className="px-3 py-1.5 text-sm bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                5+ Năm
              </span>
              <span className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                24/7 Hỗ trợ
              </span>
            </div>
          </div>

          {/* Tất cả links trong một section */}
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              
              {/* Sản phẩm & Dịch vụ */}
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">Sản phẩm & Dịch vụ</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/products" className="text-slate-400 hover:text-emerald-400 text-base transition-colors duration-300">
                      Sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="text-slate-400 hover:text-emerald-400 text-base transition-colors duration-300">
                      Dịch vụ
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonials" className="text-slate-400 hover:text-emerald-400 text-base transition-colors duration-300">
                      Đánh giá
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Điều hướng */}
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">Điều hướng</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="text-slate-400 hover:text-primary-400 text-base transition-colors duration-300">
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-slate-400 hover:text-primary-400 text-base transition-colors duration-300">
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-slate-400 hover:text-primary-400 text-base transition-colors duration-300">
                      Bảng giá
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Hỗ trợ */}
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">Hỗ trợ</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/support" className="text-slate-400 hover:text-orange-400 text-base transition-colors duration-300">
                      Hỗ trợ
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-slate-400 hover:text-orange-400 text-base transition-colors duration-300">
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Liên hệ nhanh */}
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">Liên hệ nhanh</h4>
                <ul className="space-y-3">
                  <li className="text-slate-400 text-sm">{siteConfig.contact.phone}</li>
                  <li className="text-slate-400 text-sm">{siteConfig.contact.email}</li>
                  <li className="text-slate-400 text-sm">{siteConfig.contact.workingHours}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex justify-center space-x-4">
            <a 
              href={siteConfig.social.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-3 rounded-xl bg-slate-800/60 hover:bg-blue-600/90 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-500/25 border border-slate-700/50 hover:border-blue-500/50"
            >
              <svg className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a 
              href={siteConfig.social.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-3 rounded-xl bg-slate-800/60 hover:bg-sky-500/90 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-sky-500/25 border border-slate-700/50 hover:border-sky-500/50"
            >
              <svg className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a 
              href={siteConfig.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-3 rounded-xl bg-slate-800/60 hover:bg-blue-700/90 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-700/25 border border-slate-700/50 hover:border-blue-700/50"
            >
              <svg className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Divider với gradient đẹp */}
        <div className="relative mt-14 mb-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom section - Cải thiện layout */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-5 lg:space-y-0">
          <div className="text-center lg:text-left">
            <p className="text-sm text-slate-400">
              &copy; {currentYear} <span className="text-white font-medium">{siteConfig.name}</span>. Bản quyền thuộc về công ty <span className="text-primary-400">{siteConfig.legal.companyName}</span>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <span className="text-sm text-slate-400 font-medium">Chấp nhận thanh toán</span>
            <div className="flex items-center space-x-2.5">
              {/* Visa */}
              <div className="group relative">
                <div className="w-11 h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-5">
                    <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
                    <path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.177 1.991.177l.355-2.073c0 0-1.113-.393-2.887-.393-2.545 0-4.482.674-4.482 3.07 0 2.417 2.627 2.215 2.627 3.329 0 .394-.333.82-1.441.82-1.721 0-3.014-.517-3.014-.517l-.368 2.055c0 0 1.357.591 3.329.591 2.453 0 4.34-.854 4.34-3.214C28.746 22.966 26.369 23.046 26.369 22.206z"/>
                  </svg>
                </div>
              </div>
              
              {/* MasterCard */}
              <div className="group relative">
                <div className="w-11 h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-5">
                    <path fill="#FF9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"/>
                    <path fill="#D50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"/>
                    <path fill="#FFC400" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"/>
                  </svg>
                </div>
              </div>
              
              {/* Momo */}
              <div className="group relative">
                <div className="w-11 h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg viewBox="0 0 48 48" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" fill="#ae2070"/>
                    <path d="M22.11,15.08a5.83,5.83,0,0,0-5.18,3.26A5.83,5.83,0,0,0,11.44,21a3.6,3.6,0,0,0-3.36,3.8v6.52A1.44,1.44,0,0,0,9.52,32.8h8.51A1.44,1.44,0,0,0,19.47,31V25.33a.86.86,0,0,1,1.72,0V31A1.44,1.44,0,0,0,22.64,32.8h8.51a1.44,1.44,0,0,0,1.44-1.44V24.84a3.6,3.6,0,0,0-3.36-3.8A5.83,5.83,0,0,0,23.74,18,5.83,5.83,0,0,0,22.11,15.08Z" fill="white"/>
                  </svg>
                </div>
              </div>
              
              {/* ZaloPay */}
              <div className="group relative">
                <div className="w-11 h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg viewBox="0 0 48 48" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" fill="#005ec2"/>
                    <path d="M34.5,18.5H13.5v11h21V18.5z M31.8,26.8H16.2v-5.6h15.6V26.8z" fill="white"/>
                    <circle cx="24" cy="24" r="2.5" fill="#005ec2"/>
                  </svg>
                </div>
              </div>
              
              {/* Bank Transfer */}
              <div className="group relative">
                <div className="w-11 h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
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