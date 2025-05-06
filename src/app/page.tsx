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
        <div className="container mx-auto px-6 max-w-6xl">
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

      <div className="container px-6 mx-auto max-w-6xl">
        {/* Danh mục sản phẩm */}
        <section className="py-12 bg-white">
          <div className="container max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
              <Link
                href="/categories"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                >
                  <div className="bg-white rounded-full p-3 mb-3 shadow-sm">
                    <Image
                      src={category.imageUrl || '/images/placeholder/category.png'}
                      alt={category.name}
                      width={50}
                      height={50}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-center">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.productCount} sản phẩm</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
              <Link
                href="/products?filter=featured"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm nổi bật</h3>
                  <p className="text-gray-500 max-w-lg mx-auto">
                    Chúng tôi sẽ sớm cập nhật các sản phẩm tốt nhất.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Giới thiệu về XLab */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-teal-500 to-blue-500 p-1">
                  <div className="bg-white rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Về XLab</h2>
                    <p className="text-gray-600 mb-4">
                      XLab là nền tảng cung cấp các giải pháp phần mềm tích hợp AI tiên tiến giúp người dùng nâng cao hiệu suất công việc và cuộc sống hàng ngày.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Sứ mệnh của chúng tôi là đem đến cho người Việt cơ hội tiếp cận với các công cụ phục vụ làm việc, học tập, giải trí với giá cả phải chăng và chất lượng quốc tế.
                    </p>
                    <Link 
                      href="/about"
                      className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium"
                    >
                      Tìm hiểu thêm
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 shadow-sm">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sản phẩm trong nước</h3>
                    <p className="text-sm text-gray-600">Phát triển bởi đội ngũ kỹ sư Việt Nam</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 shadow-sm">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hỗ trợ 24/7</h3>
                    <p className="text-sm text-gray-600">Đội ngũ hỗ trợ tận tâm</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 shadow-sm">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Bảo mật cao</h3>
                    <p className="text-sm text-gray-600">Dữ liệu được mã hóa an toàn</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 shadow-sm">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Giá cả hợp lý</h3>
                    <p className="text-sm text-gray-600">Nhiều lựa chọn phù hợp mọi ngân sách</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New products */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
              <Link
                href="/products?filter=new"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            {newProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm mới</h3>
                  <p className="text-gray-500 max-w-lg mx-auto">
                    Hãy quay lại sau để xem các Sản phẩm mới nhất.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main content with sidebar */}
        <div className="py-12 bg-white">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main content */}
              <div className="lg:w-2/3">
                {/* Khách hàng đánh giá */}
                <div className="mb-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của XLab
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center mb-4">
                        <div className="bg-teal-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Nguyễn Văn A</h3>
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

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center mb-4">
                        <div className="bg-teal-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Trần Thị B</h3>
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

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center mb-4">
                        <div className="bg-teal-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Lê Văn C</h3>
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
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-6">
                {/* Tin tức & cập nhật */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Tin tức & cập nhật</h3>
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Phiên bản mới: VideoEditor Pro 2.5</h4>
                      <p className="text-xs text-gray-600 mb-2">Cập nhật ngày 15/06/2024</p>
                      <p className="text-sm text-gray-700">Thêm nhiều hiệu ứng mới và công cụ xử lý âm thanh nâng cao</p>
                    </div>
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Khuyến mãi mùa hè</h4>
                      <p className="text-xs text-gray-600 mb-2">Từ 01/07 - 31/07/2024</p>
                      <p className="text-sm text-gray-700">Giảm 30% tất cả sản phẩm dành cho sinh viên</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Sắp ra mắt: SecureGuard Pro</h4>
                      <p className="text-xs text-gray-600 mb-2">Dự kiến 10/08/2024</p>
                      <p className="text-sm text-gray-700">Giải pháp bảo mật toàn diện cho doanh nghiệp vừa và nhỏ</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/news" className="text-sm text-teal-600 hover:text-teal-800 font-medium">
                      Xem tất cả tin tức →
                    </Link>
                  </div>
                </div>

                {/* Hỗ trợ nhanh */}
                <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Hỗ trợ nhanh</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/support"
                      className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="bg-teal-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-teal-600">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Trung tâm trợ giúp</h4>
                        <p className="text-xs text-gray-600">Câu hỏi thường gặp & hướng dẫn</p>
                      </div>
                    </Link>
                    <Link 
                      href="/contact"
                      className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="bg-teal-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-teal-600">
                          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Liên hệ với chúng tôi</h4>
                        <p className="text-xs text-gray-600">Hỗ trợ 24/7</p>
                      </div>
                    </Link>
                    <Link 
                      href="/downloads"
                      className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="bg-teal-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-teal-600">
                          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Tải xuống</h4>
                        <p className="text-xs text-gray-600">Phiên bản mới nhất</p>
                      </div>
                    </Link>
                  </div>

                  {/* Thống kê */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Thống kê XLab</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">Hơn <span className="font-semibold">100,000+</span> người dùng</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                            <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900"><span className="font-semibold">25+</span> ứng dụng</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900"><span className="font-semibold">99.9%</span> uptime</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-500 text-white">
          <div className="container max-w-6xl mx-auto px-6">
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