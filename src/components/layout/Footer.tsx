'use client';

import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

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

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-x-6 md:gap-x-10 lg:gap-x-12 gap-y-8 sm:gap-x-8 sm:gap-y-12">
          {/* Column 1: Logo and Company Info */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-12 xl:col-span-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 lg:gap-8 mb-6">
              <div className="flex-shrink-0 mb-4 self-center sm:mb-0 sm:self-start w-24 sm:w-28 md:w-36 lg:w-40 xl:w-44">
                <Link href="/" className="inline-block w-full">
                  <Image src="/images/logo.jpg" alt={t('logo.alt')} width={280} height={140} unoptimized className="w-full h-auto" sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 144px, (max-width: 1280px) 160px, 176px" />
                </Link>
              </div>
              <div className="flex-1 min-w-0 max-w-none md:max-w-lg lg:max-w-xl">
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {t('footer.companyDescription1')}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {t('footer.companyDescription2')}
                </p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-start flex-wrap gap-3 sm:gap-4 mt-4 mb-6">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2 sm:p-2.5 rounded-lg bg-slate-800/40 hover:bg-blue-600/80 transition-colors duration-200 border border-slate-700/40"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-hover:text-white transition-colors"
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
                className="group p-2 sm:p-2.5 rounded-lg bg-slate-800/40 hover:bg-sky-500/80 transition-colors duration-200 border border-slate-700/40"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-hover:text-white transition-colors"
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
                className="group p-2 sm:p-2.5 rounded-lg bg-slate-800/40 hover:bg-blue-700/80 transition-colors duration-200 border border-slate-700/40"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Products and Services */}
          <div className="flex flex-col items-center sm:items-start md:col-span-1 lg:col-span-6 xl:col-span-2">
            <h3 className="text-white text-base sm:text-xl font-bold mb-4 sm:mb-5 relative group">
              <span className="relative z-10">{t('footer.productsAndServices')}</span>
              <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-14 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:w-16"></div>
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-center sm:text-left mb-2 sm:mb-4">
              <li>
                <Link
                  href="/products"
                  className="group inline-flex items-center text-slate-400 hover:text-emerald-400 text-sm transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('footer.products')}
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
          </div>

          {/* Column 3: Navigation Links */}
          <div className="flex flex-col items-center sm:items-start md:col-span-1 lg:col-span-6 xl:col-span-2">
            <h3 className="text-white text-base sm:text-xl font-bold mb-4 sm:mb-5 relative group">
              <span className="relative z-10">{t('footer.navigationLinks')}</span>
              <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-14 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:w-16"></div>
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-center sm:text-left mb-2 sm:mb-4">
              <li>
                <Link
                  href="/"
                  className="group inline-flex items-center text-slate-400 hover:text-emerald-400 text-sm sm:text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="group inline-flex items-center text-slate-400 hover:text-emerald-400 text-sm sm:text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="group inline-flex items-center text-slate-400 hover:text-emerald-400 text-sm sm:text-base transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-0 group-hover:w-1.5 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-2.5 transition-all duration-300"></span>
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col items-center sm:items-start md:col-span-1 lg:col-span-12 xl:col-span-2">
            <h3 className="text-white text-base sm:text-xl font-bold mb-4 sm:mb-5 relative group">
              <span className="relative z-10">{t('footer.contactLink')}</span>
              <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-14 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:w-16"></div>
            </h3>

            <ul className="space-y-3 sm:space-y-4 text-center sm:text-left mb-3 sm:mb-4">
              <li className="flex items-start justify-center sm:justify-start group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mr-3 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300 border border-orange-500/20">
                  <svg
                    className="h-5 w-5 text-orange-400 flex-shrink-0"
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
                <span className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[22rem] sm:max-w-sm">
                  {t('footer.address')}
                </span>
              </li>

              <li className="flex items-start justify-center sm:justify-start group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mr-3 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-500/20">
                  <svg
                    className="h-5 w-5 text-blue-400 flex-shrink-0"
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
                <span className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[22rem] sm:max-w-sm">
                  {t('footer.phone')}
                </span>
              </li>

              <li className="flex items-start justify-center sm:justify-start group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mr-3 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300 border border-green-500/20">
                  <svg
                    className="h-5 w-5 text-green-400 flex-shrink-0"
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
                <span className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[22rem] sm:max-w-sm">
                  {t('footer.email')}
                </span>
              </li>

              <li className="flex items-start justify-center sm:justify-start group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 mr-3 group-hover:from-purple-500/30 group-hover:to-indigo-500/30 transition-all duration-300 border border-purple-500/20">
                  <svg
                    className="h-5 w-5 text-purple-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[22rem] sm:max-w-sm">
                  {t('footer.supportHours')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0 mt-8 sm:mt-12">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-slate-400">
              &copy; {currentYear} <span className="text-white font-medium">{siteConfig.name}</span>.{' '}
              {t('footer.copyright')} <span className="text-primary-400">{siteConfig.legal.companyName}</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-col lg:flex-row items-center lg:items-start space-y-2 sm:space-y-2 lg:space-y-0 sm:space-x-0 lg:space-x-6 w-full lg:w-auto">
            <span className="text-xs sm:text-sm text-slate-400 font-medium w-full text-center lg:text-left">
              {t('footer.acceptedPayments')}
            </span>
            <div className="flex items-center justify-center lg:justify-end flex-wrap space-x-1.5 sm:space-x-2.5 gap-y-2 w-full">
              {/* Visa */}
              <div className="group relative">
                <div className="w-8 h-6 sm:w-11 sm:h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-5">
                    <path
                      fill="#1565C0"
                      d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
                    />
                    <path
                      fill="#FFF"
                      d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.177 1.991.177l.355-2.073c0 0-1.113-.393-2.887-.393-2.545 0-4.482.674-4.482 3.07 0 2.417 2.627 2.215 2.627 3.329 0 .394-.333.82-1.441.82-1.721 0-3.014-.517-3.014-.517l-.368 2.055c0 0 1.357.591 3.329.591 2.453 0 4.34-.854 4.34-3.214C28.746 22.966 26.369 23.046 26.369 22.206z"
                    />
                  </svg>
                </div>
              </div>

              {/* MasterCard */}
              <div className="group relative">
                <div className="w-8 h-6 sm:w-11 sm:h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-5">
                    <path fill="#FF9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
                    <path fill="#D50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
                    <path
                      fill="#FFC400"
                      d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                    />
                  </svg>
                </div>
              </div>

              {/* Momo */}
              <div className="group relative">
                <div className="w-8 h-6 sm:w-11 sm:h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg viewBox="0 0 48 48" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" fill="#ae2070" />
                    <path
                      d="M22.11,15.08a5.83,5.83,0,0,0-5.18,3.26A5.83,5.83,0,0,0,11.44,21a3.6,3.6,0,0,0-3.36,3.8v6.52A1.44,1.44,0,0,0,9.52,32.8h8.51A1.44,1.44,0,0,0,19.47,31V25.33a.86.86,0,0,1,1.72,0V31A1.44,1.44,0,0,0,22.64,32.8h8.51a1.44,1.44,0,0,0,1.44-1.44V24.84a3.6,3.6,0,0,0-3.36-3.8A5.83,5.83,0,0,0,23.74,18,5.83,5.83,0,0,0,22.11,15.08Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>

              {/* ZaloPay */}
              <div className="group relative">
                <div className="w-8 h-6 sm:w-11 sm:h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <Image src="/images/payment/zalopay.svg" alt="ZaloPay" width={24} height={24} className="w-6 h-6" />
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="group relative">
                <div className="w-8 h-6 sm:w-11 sm:h-7 bg-white/95 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="#1976D2"
                      d="M2,15V12H22V15H2M2,19V16H6V19H2M7,19V16H11V19H7M12,19V16H16V19H12M17,19V16H22V19H17M2,11V8H22V11H2M2,7V4H22V7H2Z"
                    />
                  </svg>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
