'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Các trang không hiển thị header và footer
const noLayoutPaths = ['/login', '/register', '/admin/login']

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const showLayout = !noLayoutPaths.includes(pathname);

  return (
    <>
      {showLayout && <Header />}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      {showLayout && <Footer />}
    </>
  )
} 