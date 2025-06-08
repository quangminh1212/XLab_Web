'use client';

import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>

      <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
          {/* Logo và social icons - Cột riêng bên trái */}
          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-center justify-center group mb-6 sm:mb-8">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/images/logo.jpg"
                  alt={`${siteConfig.name} Logo`}
                  width={560}
                  height={224}
                  className="w-auto h-40 sm:h-48 md:h-56 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Social icons */}
            <div className="flex justify-center space-x-3 mt-2">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2.5 rounded-xl bg-slate-800/60 hover:bg-blue-600/90 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-500/25 border border-slate-700/50 hover:border-blue-500/50"
              >
                <svg
                  className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2.5 rounded-xl bg-slate-800/60 hover:bg-sky-500/90 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-sky-500/25 border border-slate-700/50 hover:border-sky-500/50"
              >
                <svg
                  className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2.5 rounded-xl bg-slate-800/60 hover:bg-blue-700/90 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-700/25 border border-slate-700/50 hover:border-blue-700/50"
              >
                <svg
                  className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Giới thiệu */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-5 relative group">
              <span className="relative z-10">{t('footer.about')}</span>
              <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-14 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 group-hover:w-16"></div>
            </h3>
            <div className="space-y-3 text-center sm:text-left">
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                XLab là công ty hàng đầu trong lĩnh vực phát triển giải pháp công nghệ và phần mềm
                chuyên nghiệp cho doanh nghiệp.
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Với đội ngũ chuyên gia giàu kinh nghiệm, XLab tự hào là đối tác tin cậy của hơn 500+
                doanh nghiệp.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30">
                  500+ Khách hàng
                </span>
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  5+ Năm
                </span>
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                  24/7 Hỗ trợ
                </span>
              </div>
            </div>
          </div>

          {/* Sản phẩm & Dịch vụ + Điều hướng */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-5 relative group">
              <span className="relative z-10">{t('footer.company')}</span>
              <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-14 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:w-16"></div>
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-center sm:text-left mb-4">
              <li>
                <Link
                  href="/products"
                  className="group inline-flex items-center text-slate-400 hover:text-emerald-400 text-sm sm:text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="group inline-flex items-center text-slate-400 hover:text-emerald-400 text-sm sm:text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('footer.services')}
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="group inline-flex items-center text-slate-400 hover:text-emerald-400 text-sm sm:text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('footer.testimonials')}
                </Link>
              </li>
            </ul>

            {/* Điều hướng */}
            <div className="pt-4 border-t border-slate-700 w-full">
              <h4 className="text-white text-base font-semibold mb-3 text-center sm:text-left">
                {t('footer.navigation')}
              </h4>
              <div className="space-y-3 text-center sm:text-left">
                <Link
                  href="/"
                  className="group inline-flex items-center text-slate-400 hover:text-primary-400 text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('nav.home')}
                </Link>
                <br />
                <Link
                  href="/about"
                  className="group inline-flex items-center text-slate-400 hover:text-primary-400 text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('nav.about')}
                </Link>
                <br />
                <Link
                  href="/pricing"
                  className="group inline-flex items-center text-slate-400 hover:text-primary-400 text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('footer.pricing')}
                </Link>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-5 relative group">
              <span className="relative z-10">{t('footer.contact')}</span>
              <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-14 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300 group-hover:w-16"></div>
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-center sm:text-left mb-4">
              <li className="flex items-start justify-center sm:justify-start group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mr-2.5 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300 border border-orange-500/20">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[180px]">
                  {siteConfig.contact.address}
                </span>
              </li>
              <li className="flex items-start justify-center sm:justify-start group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mr-2.5 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300 border border-green-500/20">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-slate-400">
                  {siteConfig.contact.phone}
                </span>
              </li>
              <li className="flex items-start justify-center sm:justify-start group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mr-2.5 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-500/20">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-slate-400">
                  {siteConfig.contact.email}
                </span>
              </li>
            </ul>

            {/* Pháp lý */}
            <div className="pt-4 border-t border-slate-700 w-full">
              <h4 className="text-white text-base font-semibold mb-3 text-center sm:text-left">
                {t('footer.legal')}
              </h4>
              <div className="space-y-3 text-center sm:text-left">
                <Link
                  href="/terms"
                  className="group inline-flex items-center text-slate-400 hover:text-primary-400 text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('footer.terms')}
                </Link>
                <br />
                <Link
                  href="/privacy"
                  className="group inline-flex items-center text-slate-400 hover:text-primary-400 text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('footer.privacy')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-10 pt-5 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-xs sm:text-sm">
            © {currentYear} {siteConfig.legal.companyName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
