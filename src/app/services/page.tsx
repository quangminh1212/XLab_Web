'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ServicesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect về trang products với filter dịch vụ
    router.replace('/products?filter=service')
  }, [router])

  return (
    <div className="py-12 flex justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  )
} 