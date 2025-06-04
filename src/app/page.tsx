'use client';

// Thêm comment này để kiểm tra hot-reload
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { categories } from '@/data/mockData';
import Image from 'next/image';

// Helper function to lấy URL ảnh hợp lệ
const getValidImageUrl = (product: any): string => {
  if (!product) return '/images/placeholder/product-placeholder.jpg';

  // Kiểm tra nếu có hình ảnh trong mảng hình ảnh
  if (product.images && product.images.length > 0) {
    const imageUrl = product.images[0];
    // Kiểm tra xem đây là string hay object
    if (typeof imageUrl === 'string') {
      return imageUrl;
    } else if (imageUrl.url) {
      return imageUrl.url;
    }
  }

  // Kiểm tra nếu có thuộc tính imageUrl
  if (product.imageUrl) {
    return product.imageUrl;
  }

  return '/images/placeholder/product-placeholder.jpg';
};

function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          console.error('Failed to fetch products:', result.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc sản phẩm nổi bật (giả định tất cả sản phẩm đều là featured trong trường hợp này)
  const featuredProducts = products.slice(0, 6);

  // Lọc sản phẩm mới nhất
  const newProducts = [...products]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary-50 via-white to-primary-50 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="container mx-auto px-responsive">
          <div className="flex flex-col items-center text-center">
            <h1 className="heading-1 mb-3 sm:mb-4 md:mb-6">
              <span className="text-gray-900">X</span>
              <span className="text-primary-500">Lab</span>
            </h1>
            <p className="text-responsive-lg text-gray-600 max-w-3xl mb-6 sm:mb-8">
              Tối ưu hiệu quả, tối thiểu chi phí!
            </p>

            <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm, ứng dụng..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm sm:text-base"
              />
              <button className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-responsive">
        {/* Chuyển sang layout 2 cột với sidebar bên trái */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-responsive">
          {/* Sidebar Column - Left */}
          <div className="w-full flex flex-col h-full md:col-span-1">
            {/* About Section */}
            <section className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 p-1 mb-responsive-sm">
                <div className="bg-white rounded-lg p-responsive-sm">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 sm:w-12 sm:h-12 text-primary-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                          clipRule="evenodd"
                        />
                        <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="heading-3 mb-3 text-gray-800 text-center">Về XLab</h2>
                  <p className="text-responsive-sm text-gray-700 mb-3">
                    XLab là nền tảng cung cấp các giải pháp phần mềm tích hợp AI tiên tiến giúp
                    người dùng nâng cao hiệu suất công việc và cuộc sống hàng ngày.
                  </p>
                  <p className="text-responsive-sm text-gray-700 mb-3">
                    Sứ mệnh của chúng tôi là đem đến cho người Việt cơ hội tiếp cận với các công cụ
                    phục vụ làm việc, học tập, giải trí với giá cả phải chăng và chất lượng quốc tế.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/about"
                      className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center text-responsive-sm"
                    >
                      Tìm hiểu thêm
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-3 snap-y snap-mandatory">
                <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">Sản phẩm trong nước</h3>
                  <p className="text-sm text-gray-600">Phát triển bởi đội ngũ kỹ sư Việt Nam</p>
                </div>
                <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">Hỗ trợ 24/7</h3>
                  <p className="text-sm text-gray-600">Đội ngũ hỗ trợ tận tâm</p>
                </div>
                <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">Bảo mật cao</h3>
                  <p className="text-sm text-gray-600">Dữ liệu được mã hóa an toàn</p>
                </div>
                <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">Giá cả hợp lý</h3>
                  <p className="text-sm text-gray-600">Nhiều lựa chọn phù hợp mọi ngân sách</p>
                </div>
                <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.3 1.046a.75.75 0 011.4.042l3.926 8.137h4.396a.75.75 0 01.578 1.268l-8.459 8.459a.75.75 0 01-1.268-.578v-4.396L2.41 11.7a.75.75 0 01.578-1.268h4.396L11.3 1.046z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">Tích hợp AI</h3>
                  <p className="text-sm text-gray-600">Công nghệ AI tiên tiến hỗ trợ bạn</p>
                </div>
                <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h5M20 20v-5h-5M5 10a8 8 0 0111.966-2.79M18.364 18.364A8 8 0 015 10"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">Cập nhật liên tục</h3>
                  <p className="text-sm text-gray-600">Luôn được cập nhật tính năng mới</p>
                </div>
              </div>
            </section>

            {/* Thống kê - Phần mới */}
            <section className="bg-white rounded-xl shadow-sm p-4 mb-3">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thành tựu của chúng tôi</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-lg p-3 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">10,000+</div>
                    <div className="text-xs text-gray-600">Khách hàng tin dùng</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 rounded-lg p-3 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-green-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">30+</div>
                    <div className="text-xs text-gray-600">Giải pháp phần mềm</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-3 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-blue-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.315 2.1c.663 0 1.32.087 1.946.254C14.5 1.817 17.52 2.119 19.388 3.036c1.05.517 1.173 1.146 1.087 1.486-.247.972-1.564 1.54-3.161 1.197a19.096 19.096 0 00-1.138-3.255c-.855.169-1.711.615-2.398 1.307a18.167 18.167 0 00-2.157-1.128c-.146.471-.4.824-.746 1.08-.072 1.249.383 2.289.841 3.483l.034.087c.894.471 1.561 1.123 1.946 1.89 1.231-.283 2.495-.038 3.366.704.301.255.513.621.513 1.029 0 1.117-.947 1.996-2.02 1.996-1.04 0-1.956-.809-2.03-1.882-1.031-.523-2.119-.92-2.95-1.133.512-.82.78-1.705.78-2.618 0-1.183-.512-2.339-1.384-3.098-.87-.76-2.072-1.146-3.29-1.073-.236.014-.468.024-.672.075a3.345 3.345 0 01-.707-.178z"
                        clipRule="evenodd"
                      />
                      <path d="M4.326 6.955c-1.196.822-1.256 2.396-.933 3.158.4.964 1.752 1.527 3.305 1.007 1.133-.38 2.035-1.41 2.459-2.628.276-.798.39-1.775.224-2.58-.229.279-.489.506-.777.679-.88.053-.18.121-.28.173a4.129 4.129 0 01-2.768.302c-.343-.074-.668-.161-.952-.264zm2.457 10.047c1.172 0 2.013-.823 2.013-1.834 0-.905-.66-1.607-1.596-1.758l-.189.492c-.71-.001-1.4-.205-1.998-.602-.644-.44-1.058-1.046-1.244-1.743-.594.276-1.136.657-1.553 1.12a3.307 3.307 0 00-.728 3.041c.199.757.7 1.404 1.376 1.819.677.414 1.523.57 2.338.403.257-.053.509-.13.75-.229-.009.075-.004.149.002.222.072.935.88 1.675 1.913 1.769.506.046 1.02-.088 1.397-.404.473-.329.766-.863.766-1.444 0-1.02-.857-1.862-2.045-1.862-.285 0-.554.05-.783.14l-.315-.414c-.019-.025-.038-.05-.057-.075.184-.15.368-.292.558-.44l.179-.145.479.619c.233-.11.486-.19.755-.234v-.497c-.577.11-1.123.348-1.605.773zm.16 1.835a.816.816 0 01-.702.747.756.756 0 01-.594-.14.691.691 0 01-.26-.548c0-.381.238-.695.572-.825.285-.11.56-.067.66.014.1.082.147.223.147.4 0 .138.06.27.17.352z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">5+</div>
                    <div className="text-xs text-gray-600">Năm kinh nghiệm</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Main Content Column - Right */}
          <div className="w-full md:col-span-4">
            {/* Phần mềm */}
            <div className="mb-4 bg-white rounded-xl p-5 shadow-sm">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold text-gray-800">Phần mềm</h2>
                  <Link
                    href="/products"
                    className="text-primary-600 hover:text-primary-800 transition-colors text-base font-medium"
                  >
                    Xem tất cả
                  </Link>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-fr">
                    {featuredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id.toString()}
                        name={product.name}
                        description={product.shortDescription || ''}
                        price={product.price || 0}
                        originalPrice={product.originalPrice}
                        image={getValidImageUrl(product)}
                        rating={product.rating}
                        reviewCount={product.reviewCount || 0}
                        weeklyPurchases={product.weeklyPurchases || 0}
                        totalSold={product.totalSold || 0}
                        slug={product.slug}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="text-center py-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <h3 className="text-base font-medium text-gray-700 mb-1">Chưa có phần mềm</h3>
                      <p className="text-gray-500 max-w-lg mx-auto text-sm">
                        Chúng tôi sẽ sớm cập nhật các phần mềm.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dịch vụ */}
            <div className="mb-4 bg-white rounded-xl p-5 shadow-sm">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold text-gray-800">Dịch vụ</h2>
                  <Link
                    href="/products?filter=service"
                    className="text-primary-600 hover:text-primary-800 transition-colors text-base font-medium"
                  >
                    Xem tất cả
                  </Link>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-fr">
                    {products
                      .filter((product) => product.isAccount || product.type === 'account')
                      .slice(0, 6)
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id.toString()}
                          name={product.name}
                          description={product.shortDescription || ''}
                          price={product.price || 0}
                          originalPrice={product.originalPrice}
                          image={getValidImageUrl(product)}
                          rating={product.rating}
                          reviewCount={product.reviewCount || 0}
                          weeklyPurchases={product.weeklyPurchases || 0}
                          totalSold={product.totalSold || 0}
                          slug={product.slug}
                          isAccount={true}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="text-center py-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <h3 className="text-base font-medium text-gray-700 mb-1">Chưa có dịch vụ</h3>
                      <p className="text-gray-500 max-w-lg mx-auto text-sm">
                        Chúng tôi sẽ sớm cập nhật các dịch vụ.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Câu hỏi thường gặp */}
            <section className="py-8 bg-white rounded-xl shadow-sm mb-4">
              <div className="px-5">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Câu hỏi thường gặp</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Giải đáp những thắc mắc phổ biến của khách hàng về sản phẩm và dịch vụ của XLab
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-primary-600 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Làm thế nào để tải xuống phần mềm?
                    </h3>
                    <p className="text-gray-600">
                      Bạn có thể tải xuống phần mềm miễn phí tại trang sản phẩm tương ứng sau khi
                      đăng nhập vào tài khoản của mình. Đối với sản phẩm trả phí, bạn cần hoàn tất
                      thanh toán trước khi tải xuống.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-primary-600 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Làm thế nào để kích hoạt bản quyền?
                    </h3>
                    <p className="text-gray-600">
                      Sau khi mua sản phẩm, bạn sẽ nhận được mã kích hoạt qua email. Mở ứng dụng,
                      vào phần "Kích hoạt bản quyền" và nhập mã này để sử dụng đầy đủ tính năng.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-primary-600 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Tôi có thể sử dụng trên mấy thiết bị?
                    </h3>
                    <p className="text-gray-600">
                      Mỗi bản quyền cho phép bạn sử dụng trên tối đa 3 thiết bị cùng một lúc. Bạn có
                      thể quản lý danh sách thiết bị trong phần "Tài khoản" trên website.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-primary-600 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Chính sách hoàn tiền như thế nào?
                    </h3>
                    <p className="text-gray-600">
                      Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày kể từ ngày mua nếu sản
                      phẩm không đáp ứng được nhu cầu của bạn. Liên hệ với bộ phận hỗ trợ để được
                      hướng dẫn.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-primary-600 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Làm thế nào để liên hệ hỗ trợ kỹ thuật?
                    </h3>
                    <p className="text-gray-600">
                      Bạn có thể liên hệ với đội ngũ hỗ trợ kỹ thuật thông qua email
                      support@xlab.vn, hotline 1900.xxxx, hoặc chat trực tiếp trên website. Chúng
                      tôi phản hồi trong vòng 24 giờ làm việc.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-primary-600 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      XLab có cung cấp giải pháp cho doanh nghiệp?
                    </h3>
                    <p className="text-gray-600">
                      Có, chúng tôi có các gói dịch vụ đặc biệt dành cho doanh nghiệp với nhiều ưu
                      đãi về giá và hỗ trợ kỹ thuật chuyên biệt. Liên hệ với chúng tôi để được tư
                      vấn phương án phù hợp nhất.
                    </p>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <Link
                    href="/support"
                    className="inline-flex items-center bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Xem thêm câu hỏi
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Sẵn sàng nâng cao hiệu suất công việc với XLab?
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Chúng tôi cung cấp nhiều mức giá ưu đãi đặc biệt dành cho khách hàng mua số lượng lớn.
              Càng mua nhiều, mức giảm giá càng cao. Chúng tôi cam kết mang đến cho bạn những giải
              pháp tốt nhất với chi phí hợp lý nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
