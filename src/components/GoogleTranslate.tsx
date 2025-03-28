'use client'

import React, { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface GoogleTranslateProps {
  className?: string
}

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: any
  }
}

export default function GoogleTranslate({ className = '' }: GoogleTranslateProps) {
  const { language } = useLanguage()
  const translationInitialized = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Không tạo lại nếu đã khởi tạo
    if (translationInitialized.current) return

    const initializeTranslation = () => {
      // Nếu script Google Translate đã tồn tại, không thêm lại
      const hasScript = document.querySelector('script#google-translate-api')

      if (!hasScript) {
        // Xóa các phiên bản cũ của cookie để tránh xung đột
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Tạo hàm gọi lại khi script Google Translate được tải
        window.googleTranslateElementInit = function () {
          try {
            if (window.google && window.google.translate) {
              new window.google.translate.TranslateElement(
                {
                  pageLanguage: 'vi',
                  includedLanguages: 'en,vi,zh-CN,ko,ja,fr,de,es,ru,th',
                  layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false,
                  multilanguagePage: true,
                },
                'google_translate_element'
              )
              translationInitialized.current = true
            }
          } catch (error) {
            console.error('Lỗi khởi tạo Google Translate:', error)
          }
        }

        // Thêm script Google Translate với thuộc tính crossorigin
        const script = document.createElement('script')
        script.id = 'google-translate-api'
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }
    }

    // Thêm một khoảng thời gian nhỏ trước khi khởi tạo để đảm bảo DOM đã sẵn sàng
    const timer = setTimeout(() => {
      initializeTranslation()
    }, 300)

    return () => {
      clearTimeout(timer)
      if (typeof window !== 'undefined') {
        window.googleTranslateElementInit = undefined as any
      }
    }
  }, [])

  // Ngăn chặn việc ẩn UI khi Google Translate thêm top: -40px vào body
  useEffect(() => {
    const fixGoogleTranslateUI = () => {
      if (document.body.style.top) {
        document.body.style.top = ''
      }
    }

    const intervalId = setInterval(fixGoogleTranslateUI, 1000)
    window.addEventListener('load', fixGoogleTranslateUI)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('load', fixGoogleTranslateUI)
    }
  }, [])

  return (
    <div ref={containerRef} className={`google-translate-container ${className}`}>
      <div
        id="google_translate_element"
        className="google-translate-element"
      />
      <style jsx>{`
        .google-translate-container {
          width: 100%;
          min-height: 40px;
          position: relative;
        }
        .google-translate-element {
          padding: 0;
          margin: 0;
          min-height: 30px;
        }
        :global(.goog-te-gadget) {
          font-family: inherit !important;
          font-size: 0.875rem !important;
          color: #4B5563 !important;
          margin: 0 !important;
        }
        :global(.goog-te-gadget-simple) {
          border: 1px solid #E5E7EB !important;
          border-radius: 9999px !important;
          padding: 0.375rem 0.75rem !important;
          background-color: white !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        :global(.goog-te-gadget-icon) {
          margin-right: 8px !important;
          margin-top: 0 !important;
        }
        :global(.goog-te-menu-value) {
          color: #4B5563 !important;
          text-decoration: none !important;
          display: flex !important;
          align-items: center !important;
        }
        :global(.goog-te-menu-value span) {
          text-decoration: none !important;
          color: #4B5563 !important;
          font-family: inherit !important;
        }
        :global(.goog-te-menu-value span:hover) {
          text-decoration: none !important;
          color: #0EA5E9 !important;
        }
        :global(.goog-te-banner-frame) {
          display: none !important;
        }
        :global(.goog-te-menu-frame) {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          border-radius: 0.5rem !important;
          margin-top: 0.25rem !important;
        }
        :global(.goog-te-menu2) {
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }
        :global(body) {
          top: 0 !important;
          position: static !important;
        }
        :global(.VIpgJd-ZVi9od-aZ2wEe-wOHMyf) {
          display: none !important;
        }
        :global(.VIpgJd-ZVi9od-aZ2wEe) {
          display: none !important;
        }
        :global(.skiptranslate iframe) {
          visibility: visible !important;
        }
      `}</style>
    </div>
  )
} 