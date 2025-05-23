'use client'

import { useState } from 'react'
import { siteConfig } from '@/config/siteConfig'
import Link from 'next/link'

export default function WarrantyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderCode: '',
    accountName: '',
    problem: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Mô phỏng gửi form thành công
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderCode: '',
        accountName: '',
        problem: '',
      })
    } catch (error) {
      setSubmitError('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bảo Hành</h1>
          <p className="text-xl max-w-3xl">
            XLab sẵn sàng hỗ trợ tư vấn và xử lý bảo hành suốt 365 ngày!
          </p>
        </div>
      </section>

      {/* Chính sách bảo hành và đổi trả */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Chính sách bảo hành */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Chính sách bảo hành</h2>
              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="text-gray-700">
                    <span className="font-medium block mb-1">Thời gian bảo hành</span> 
                    XLab cam kết bảo hành cho tất cả các tài khoản và phần mềm trong thời hạn <strong>365 ngày</strong> kể từ ngày mua.
                  </p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="text-gray-700">
                    <span className="font-medium block mb-1">Quy trình bảo hành</span>
                    Khi tài khoản gặp sự cố, quý khách vui lòng gửi yêu cầu hỗ trợ thông qua form bên cạnh hoặc liên hệ trực tiếp qua Zalo, Email.
                  </p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-lg">
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="text-gray-700">
                    <span className="font-medium block mb-1">Điều kiện bảo hành</span>
                    Tài khoản phải nằm trong thời hạn bảo hành và được sử dụng đúng quy định.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Chính sách đổi trả */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Chính sách đổi trả</h2>
              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-gray-700">
                    <span className="font-medium block mb-1">Thời gian đổi trả</span>
                    Trong vòng <strong>7 ngày</strong> kể từ ngày mua, quý khách có thể yêu cầu hoàn tiền nếu sản phẩm không đáp ứng được nhu cầu sử dụng.
                  </p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-gray-700">
                    <span className="font-medium block mb-1">Điều kiện đổi trả</span>
                    Sản phẩm chưa bị sửa đổi, can thiệp và không vi phạm các điều khoản sử dụng.
                  </p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-lg">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-gray-700">
                    <span className="font-medium block mb-1">Quy trình hoàn tiền</span>
                    Sau khi xác nhận yêu cầu hợp lệ, chúng tôi sẽ hoàn tiền qua phương thức thanh toán ban đầu trong vòng 3-5 ngày làm việc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Form & Info */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Warranty Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Yêu cầu hỗ trợ kỹ thuật</h2>
              {submitSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p>Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      <p>{submitError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="orderCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Mã đơn hàng
                      </label>
                      <input
                        type="text"
                        id="orderCode"
                        name="orderCode"
                        value={formData.orderCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên tài khoản
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả vấn đề <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="problem"
                      name="problem"
                      rows={5}
                      required
                      value={formData.problem}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white bg-primary-600 hover:bg-primary-700 rounded-lg px-8 py-3 transition-colors font-medium shadow-sm"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Warranty Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <p className="text-gray-700 mb-4">
                  XLab hỗ trợ tư vấn mua hàng hoặc bảo hành từ <strong>8h00 đến 21h00 hàng ngày (kể cả ngày lễ)</strong>. 
                  Chúng tôi xử lý rất nhiều đơn hàng mỗi ngày và sẽ xử lý từng yêu cầu theo thứ tự. Chúng tôi sẽ hỗ trợ 
                  <strong> nhanh chóng trong vòng 24h</strong> sau khi nhận được yêu cầu.
                </p>
                
                <p className="text-gray-700 mb-6">
                  Để được hỗ trợ bảo hành nhanh chóng, bạn vui lòng điền vấn đề cụ thể vào form yêu cầu hỗ trợ. 
                  Chúng tôi sẽ kiểm tra, hướng dẫn cách sửa lỗi hoặc gửi tài khoản mới tự động qua Email/Zalo của bạn.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
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
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">Zalo/Hotline</p>
                        <p className="text-gray-600">{siteConfig.contact.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
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
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">Email</p>
                        <p className="text-gray-600">{siteConfig.contact.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
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
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">Địa chỉ</p>
                        <p className="text-gray-600">{siteConfig.contact.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
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
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">Giờ làm việc</p>
                        <p className="text-gray-600">{siteConfig.contact.workingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 