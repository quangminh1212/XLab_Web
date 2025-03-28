'use client'

import React, { useEffect } from 'react'

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
    useEffect(() => {
        // Nếu script Google Translate đã tồn tại, không thêm lại
        const hasScript = document.querySelector('script#google-translate-api')

        if (!hasScript) {
            // Tạo hàm gọi lại khi script Google Translate được tải
            window.googleTranslateElementInit = function () {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'vi',
                        includedLanguages: 'en,vi',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    'google_translate_element'
                )
            }

            // Thêm script Google Translate
            const script = document.createElement('script')
            script.id = 'google-translate-api'
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            script.async = true
            document.head.appendChild(script)
        }

        // Cleanup function
        return () => {
            if (typeof window !== 'undefined') {
                window.googleTranslateElementInit = undefined as any
            }
        }
    }, [])

    return (
        <div className={`google-translate-container ${className}`}>
            <div
                id="google_translate_element"
                className="google-translate-element"
            />
            <style jsx>{`
        .google-translate-container {
          width: 100%;
        }
        .google-translate-element {
          padding: 0;
          margin: 0;
        }
        :global(.goog-te-gadget) {
          font-family: inherit !important;
          font-size: 0.875rem !important;
          color: #4B5563 !important;
        }
        :global(.goog-te-gadget-simple) {
          border: 1px solid #E5E7EB !important;
          border-radius: 9999px !important;
          padding: 0.375rem 0.75rem !important;
          background-color: white !important;
        }
        :global(.goog-te-gadget-icon) {
          margin-right: 8px !important;
          margin-top: 0 !important;
        }
        :global(.goog-te-menu-value) {
          color: #4B5563 !important;
          text-decoration: none !important;
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
        :global(body) {
          top: 0 !important;
        }
      `}</style>
        </div>
    )
} 