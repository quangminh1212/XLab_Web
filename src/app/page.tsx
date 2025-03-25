import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-gray-50 to-transparent"></div>
        </div>
        <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:px-8">
          <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-0 lg:py-32">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                <span className="block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Chào mừng đến với</span>
                <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">XLab</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Nền tảng xây dựng, phân tích và chia sẻ dữ liệu thông minh cho doanh nghiệp thời đại số.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="/contact"
                  className="group relative rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <span className="relative">Liên hệ ngay</span>
                </a>
                <a href="/services" className="group text-sm font-semibold leading-6 text-gray-900">
                  Tìm hiểu thêm <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center px-4 sm:px-6 lg:px-0">
            <div className="relative w-full max-w-2xl">
              <div className="absolute -top-4 -right-4 -bottom-4 -left-4 rounded-2xl bg-gradient-to-tr from-blue-100 to-white"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 opacity-10 blur-3xl"></div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,theme(colors.blue.50),transparent_60%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,theme(colors.blue.100),transparent_60%)]"></div>
                <div className="relative h-full w-full">
                  <svg className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 transform text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center space-x-2">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.gray.50)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.gray.50)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Giải pháp tối ưu</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Giải pháp tối ưu cho doanh nghiệp
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Tối ưu hiệu suất và đơn giản hóa quy trình làm việc với các tính năng tiên tiến
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative flex flex-col transition-all duration-300 hover:-translate-y-2">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="relative mb-6 flex h-14 w-14 items-center justify-center">
                    <div className="absolute inset-0 rounded-lg bg-blue-600 transition-colors duration-300 group-hover:bg-blue-500"></div>
                    <div className="absolute inset-0 rounded-lg bg-blue-600 blur-lg opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
                    <svg className="relative h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  Phân tích dữ liệu
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Thu thập, phân tích và trực quan hóa dữ liệu giúp ra quyết định tốt hơn.</p>
                  <p className="mt-6">
                    <a href="/services/analytics" className="group inline-flex items-center text-sm font-semibold leading-6 text-blue-600">
                      Tìm hiểu thêm <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </p>
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="group relative flex flex-col transition-all duration-300 hover:-translate-y-2">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="relative mb-6 flex h-14 w-14 items-center justify-center">
                    <div className="absolute inset-0 rounded-lg bg-blue-600 transition-colors duration-300 group-hover:bg-blue-500"></div>
                    <div className="absolute inset-0 rounded-lg bg-blue-600 blur-lg opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
                    <svg className="relative h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  Quản lý khách hàng
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Theo dõi tương tác, hiểu nhu cầu và tạo trải nghiệm tuyệt vời cho khách hàng.</p>
                  <p className="mt-6">
                    <a href="/services/crm" className="group inline-flex items-center text-sm font-semibold leading-6 text-blue-600">
                      Tìm hiểu thêm <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </p>
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="group relative flex flex-col transition-all duration-300 hover:-translate-y-2">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="relative mb-6 flex h-14 w-14 items-center justify-center">
                    <div className="absolute inset-0 rounded-lg bg-blue-600 transition-colors duration-300 group-hover:bg-blue-500"></div>
                    <div className="absolute inset-0 rounded-lg bg-blue-600 blur-lg opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
                    <svg className="relative h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  Tự động hóa
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Tự động hóa quy trình lặp lại giúp tiết kiệm thời gian và tăng năng suất.</p>
                  <p className="mt-6">
                    <a href="/services/automation" className="group inline-flex items-center text-sm font-semibold leading-6 text-blue-600">
                      Tìm hiểu thêm <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden">
        <div className="relative bg-gradient-to-b from-blue-950 to-blue-900 px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(255,255,255,0.1),transparent)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_800px,rgba(255,255,255,0.1),transparent)]"></div>
          </div>
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="bg-gradient-to-r from-blue-100 to-blue-50 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Sẵn sàng nâng cấp doanh nghiệp của bạn?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Bắt đầu ngay hôm nay với giải pháp phần mềm hoàn chỉnh từ XLab. Chúng tôi sẽ đồng hành cùng bạn trong hành trình chuyển đổi số.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/contact"
                className="group relative rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-950 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-blue-200/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative">Liên hệ tư vấn</span>
              </a>
              <a href="/products" className="group text-sm font-semibold leading-6 text-white">
                Xem tất cả sản phẩm <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 