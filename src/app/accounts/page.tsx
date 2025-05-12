'use client'

import Link from 'next/link'
import { Container } from '@/components/common'

export default function AccountsPage() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-20 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trang đang được bảo trì</h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Chức năng tài khoản đang được nâng cấp và bảo trì. Chúng tôi sẽ sớm quay trở lại với trải nghiệm tốt hơn.
        </p>
        <p className="text-gray-500 mb-8">
          Vui lòng quay lại sau hoặc liên hệ với chúng tôi nếu bạn cần hỗ trợ.
        </p>
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </Container>
  )
}