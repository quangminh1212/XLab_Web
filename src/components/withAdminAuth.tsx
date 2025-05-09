'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAuth(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      if (status === 'loading') return

      if (!session) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`)
        return
      }

      // Kiểm tra nếu người dùng không phải là admin
      if (!session.user?.isAdmin) {
        router.push('/') // Chuyển hướng về trang chủ
      }
    }, [session, status, router, pathname])

    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      )
    }

    if (!session || !session.user?.isAdmin) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}