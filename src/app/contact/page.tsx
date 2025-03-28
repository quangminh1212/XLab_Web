'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { translate, isLoaded } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  // Set page title
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Liên hệ | XLab - Phần mềm và Dịch vụ'
    }
  }, [])

  // Fallback text cho trường hợp dịch không thành công
  const getTranslation = (key, fallback) => {
    return isLoaded ? translate(key) : fallback;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically send the data to your backend
    alert(getTranslation('contact.messageSent', 'Tin nhắn đã được gửi thành công!'))
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {getTranslation('contact.pageTitle', 'Liên hệ')}
          </h1>
          <p className="text-xl max-w-3xl">
            {getTranslation('contact.pageDescription', 'Liên hệ với chúng tôi để được hỗ trợ hoặc tư vấn về các sản phẩm và dịch vụ của XLab.')}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">
                {getTranslation('contact.sendMessage', 'Gửi tin nhắn')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {getTranslation('contact.name', 'Họ và tên')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {getTranslation('contact.email', 'Email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {getTranslation('contact.phone', 'Số điện thoại')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {getTranslation('contact.subject', 'Chủ đề')}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    >
                      <option value="">{getTranslation('contact.selectSubject', 'Chọn chủ đề')}</option>
                      <option value="general">{getTranslation('contact.generalInquiry', 'Câu hỏi chung')}</option>
                      <option value="support">{getTranslation('contact.technicalSupport', 'Hỗ trợ kỹ thuật')}</option>
                      <option value="sales">{getTranslation('contact.salesInquiry', 'Tư vấn mua hàng')}</option>
                      <option value="partnership">{getTranslation('contact.partnership', 'Hợp tác')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation('contact.message', 'Nội dung')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-secondary-600 text-white font-medium rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    {getTranslation('contact.send', 'Gửi')}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">
                {getTranslation('contact.contactInfo', 'Thông tin liên hệ')}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {getTranslation('contact.address', 'Địa chỉ')}
                  </h3>
                  <p className="text-gray-600">
                    123 Tech Street, District 1<br />
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {getTranslation('contact.phone', 'Điện thoại')}
                  </h3>
                  <p className="text-gray-600">
                    +84 (0)28 1234 5678<br />
                    +84 (0)90 1234 567
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {getTranslation('contact.email', 'Email')}
                  </h3>
                  <p className="text-gray-600">
                    info@xlab.vn<br />
                    support@xlab.vn
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {getTranslation('contact.businessHours', 'Giờ làm việc')}
                  </h3>
                  <p className="text-gray-600">
                    {getTranslation('contact.weekdays', 'Thứ 2 - Thứ 6')}: 8:30 AM - 6:00 PM<br />
                    {getTranslation('contact.weekend', 'Thứ 7 - Chủ nhật')}: {getTranslation('contact.closed', 'Đóng cửa')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {getTranslation('contact.findUs', 'Tìm chúng tôi')}
          </h2>
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            {/* You would typically insert a map here */}
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <p className="text-gray-600">
                {getTranslation('contact.mapPlaceholder', 'Bản đồ đang được tải...')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 