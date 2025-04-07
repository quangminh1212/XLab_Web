import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { translate, isLoaded } = useLanguage()

  return (
    <Layout>
      <Head>
        <title>Giới thiệu | XLab</title>
        <meta name="description" content="Giới thiệu về XLab - Công ty phát triển phần mềm chất lượng cao" />
      </Head>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {isLoaded ? translate('navigation.about') : 'Giới thiệu'}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            XLab là công ty chuyên phát triển các giải pháp phần mềm chất lượng cao, tập trung vào trải nghiệm người dùng và hiệu suất.
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-8 my-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn của chúng tôi</h2>
          <p className="text-gray-600 mb-6">
            Trở thành đối tác công nghệ đáng tin cậy, cung cấp các giải pháp phần mềm sáng tạo và hiệu quả, 
            góp phần vào sự phát triển và thành công của khách hàng trong kỷ nguyên số.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
          <p className="text-gray-600 mb-6">
            Phát triển các sản phẩm phần mềm chất lượng cao với trải nghiệm người dùng xuất sắc, 
            đáp ứng nhu cầu thực tế và mang lại giá trị thiết thực cho khách hàng.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Chất lượng là ưu tiên hàng đầu</li>
            <li>Sáng tạo và đổi mới liên tục</li>
            <li>Cam kết với khách hàng</li>
            <li>Làm việc nhóm hiệu quả</li>
            <li>Học hỏi và phát triển không ngừng</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
} 