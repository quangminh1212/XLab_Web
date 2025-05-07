'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/mockData';
import Image from 'next/image';

function HomePage() {
  // Lọc sản phẩm nổi bật
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);

  // Lọc sản phẩm mới nhất
  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-teal-50 via-white to-teal-50 py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-full">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-900">X</span><span className="text-teal-600">Lab</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8">
              Phần mềm riêng của bạn - Tải về và sử dụng ngay hôm nay
            </p>

            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm, ứng dụng..."
                className="w-full px-4 py-3 pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full max-w-full">
        {/* Chuyển sang layout 2 cột với sidebar bên trái */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Sidebar Column - Left */}
          <div className="w-full md:w-1/4 space-y-4">
            {/* About Section */}
            <section className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-teal-500 to-blue-500 p-1 mb-3">
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">Về XLab</h2>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    XLab là nền tảng cung cấp các giải pháp phần mềm tích hợp AI tiên tiến giúp người dùng nâng cao hiệu suất công việc và cuộc sống hàng ngày.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    Sứ mệnh của chúng tôi là đem đến cho người Việt cơ hội tiếp cận với các công cụ phục vụ làm việc, học tập, giải trí với giá cả phải chăng và chất lượng quốc tế.
                  </p>
                  <Link 
                    href="/about"
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-sm sm:text-base"
                  >
                    Tìm hiểu thêm
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-3 shadow">
                  <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Sản phẩm trong nước</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Phát triển bởi đội ngũ kỹ sư Việt Nam</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-3 shadow">
                  <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Hỗ trợ 24/7</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Đội ngũ hỗ trợ tận tâm</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-3 shadow">
                  <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Bảo mật cao</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Dữ liệu được mã hóa an toàn</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-3 shadow">
                  <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Giá cả hợp lý</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Nhiều lựa chọn phù hợp mọi ngân sách</p>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gray-50 rounded-xl p-4">
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">Khách hàng nói gì về chúng tôi</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của XLab
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Nguyễn Văn A</h3>
                      <p className="text-xs text-gray-500">Giám đốc công nghệ</p>
                    </div>
                  </div>
                  <div className="mb-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">
                    "SmartAI Assistant đã giúp công ty chúng tôi tự động hóa nhiều quy trình, tiết kiệm thời gian và nguồn lực đáng kể."
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Trần Thị B</h3>
                      <p className="text-xs text-gray-500">Nhà thiết kế</p>
                    </div>
                  </div>
                  <div className="mb-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}>
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">
                    "VideoEditor Pro là phần mềm chỉnh sửa video tốt nhất tôi từng dùng. Giao diện trực quan và đầy đủ tính năng chuyên nghiệp."
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Lê Văn C</h3>
                      <p className="text-xs text-gray-500">Sinh viên</p>
                    </div>
                  </div>
                  <div className="mb-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">
                    "VoiceTyping giúp tôi ghi chép bài giảng nhanh hơn rất nhiều. Ứng dụng miễn phí nhưng chất lượng không kém các phần mềm trả phí."
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          {/* Main Content Column - Right */}
          <div className="w-full md:w-3/4">
            {/* Tabs điều hướng */}
            <div className="mb-4 bg-white rounded-xl p-3 shadow-sm">
              <div className="flex space-x-4 border-b border-gray-200 pb-2 mb-3">
                <button className="py-2 px-3 text-teal-600 border-b-2 border-teal-600 font-medium">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Phần mềm
                  </div>
                </button>
                <Link href="/accounts">
                  <div className="py-2 px-3 text-gray-500 hover:text-gray-700 font-medium">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Tài khoản
                    </div>
                  </div>
                </Link>
              </div>

              {/* Phần mềm - Sản phẩm nổi bật */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold">Phần mềm nổi bật</h2>
                  <Link
                    href="/products?filter=featured"
                    className="text-teal-600 hover:text-teal-800 transition-colors text-sm"
                  >
                    Xem tất cả
                  </Link>
                </div>

                {featuredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {featuredProducts
                      .filter(product => !product.isAccount && product.type !== 'account')
                      .slice(0, 4)
                      .map(product => (
                        <div className="w-full" key={product.id}>
                          <ProductCard key={product.id} product={product} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <h3 className="text-base font-medium text-gray-700 mb-1">Chưa có sản phẩm nổi bật</h3>
                      <p className="text-gray-500 max-w-lg mx-auto text-xs">
                        Chúng tôi sẽ sớm cập nhật các sản phẩm tốt nhất.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tài khoản nổi bật */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold">Tài khoản nổi bật</h2>
                  <Link
                    href="/accounts"
                    className="text-teal-600 hover:text-teal-800 transition-colors text-sm"
                  >
                    Xem tất cả
                  </Link>
                </div>

                {featuredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {featuredProducts
                      .filter(product => product.isAccount || product.type === 'account')
                      .slice(0, 4)
                      .map(product => (
                        <div className="w-full" key={product.id}>
                          <ProductCard key={product.id} product={product} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <h3 className="text-base font-medium text-gray-700 mb-1">Chưa có tài khoản nổi bật</h3>
                      <p className="text-gray-500 max-w-lg mx-auto text-xs">
                        Chúng tôi sẽ sớm cập nhật các tài khoản tốt nhất.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* New products */}
            <section className="mb-4 bg-white rounded-xl p-3 shadow-sm">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold">Phần mềm mới</h2>
                  <Link
                    href="/products?filter=new"
                    className="text-teal-600 hover:text-teal-800 transition-colors text-sm"
                  >
                    Xem tất cả
                  </Link>
                </div>

                {newProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {newProducts
                      .filter(product => !product.isAccount && product.type !== 'account')
                      .slice(0, 4)
                      .map(product => (
                        <div className="w-full" key={product.id}>
                          <ProductCard key={product.id} product={product} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <h3 className="text-base font-medium text-gray-700 mb-1">Chưa có phần mềm mới</h3>
                      <p className="text-gray-500 max-w-lg mx-auto text-xs">
                        Hãy quay lại sau để xem các phần mềm mới nhất.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tài khoản mới */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold">Tài khoản mới</h2>
                  <Link
                    href="/accounts"
                    className="text-teal-600 hover:text-teal-800 transition-colors text-sm"
                  >
                    Xem tất cả
                  </Link>
                </div>

                {newProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {newProducts
                      .filter(product => product.isAccount || product.type === 'account')
                      .slice(0, 4)
                      .map(product => (
                        <div className="w-full" key={product.id}>
                          <ProductCard key={product.id} product={product} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <h3 className="text-base font-medium text-gray-700 mb-1">Chưa có tài khoản mới</h3>
                      <p className="text-gray-500 max-w-lg mx-auto text-xs">
                        Hãy quay lại sau để xem các tài khoản mới nhất.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Câu hỏi thường gặp */}
        <section className="py-10 bg-gray-50">
          <div className="mx-auto px-4 w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Câu hỏi thường gặp</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Giải đáp những thắc mắc phổ biến của khách hàng về sản phẩm và dịch vụ của XLab
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-none mx-auto">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Làm thế nào để tải xuống phần mềm?</h3>
                <p className="text-gray-600">
                  Bạn có thể tải xuống phần mềm miễn phí tại trang sản phẩm tương ứng sau khi đăng nhập vào tài khoản của mình. Đối với sản phẩm trả phí, bạn cần hoàn tất thanh toán trước khi tải xuống.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Làm thế nào để kích hoạt bản quyền?</h3>
                <p className="text-gray-600">
                  Sau khi mua sản phẩm, bạn sẽ nhận được mã kích hoạt qua email. Mở ứng dụng, vào phần "Kích hoạt bản quyền" và nhập mã này để sử dụng đầy đủ tính năng.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tôi có thể sử dụng trên mấy thiết bị?</h3>
                <p className="text-gray-600">
                  Mỗi bản quyền cho phép bạn sử dụng trên tối đa 3 thiết bị cùng một lúc. Bạn có thể quản lý danh sách thiết bị trong phần "Tài khoản" trên website.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Chính sách hoàn tiền như thế nào?</h3>
                <p className="text-gray-600">
                  Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày kể từ ngày mua nếu sản phẩm không đáp ứng được nhu cầu của bạn. Liên hệ với bộ phận hỗ trợ để được hướng dẫn.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/support"
                className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium"
              >
                Xem thêm câu hỏi
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-500 text-white">
          <div className="mx-auto px-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Bắt đầu sử dụng các sản phẩm của XLab ngay hôm nay</h2>
                <p className="text-teal-100">Tải xuống miễn phí hoặc mua sản phẩm với giá ưu đãi</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-white text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors text-center"
                >
                  Khám phá sản phẩm
                </Link>
                <Link
                  href="/contact"
                  className="inline-block px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-center"
                >
                  Liên hệ với chúng tôi
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage; 