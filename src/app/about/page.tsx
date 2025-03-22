export const metadata = {
  title: 'Giới thiệu | XLab - Phần mềm và Dịch vụ',
  description: 'Tìm hiểu về XLab - Đơn vị tiên phong trong lĩnh vực phát triển phần mềm và các giải pháp công nghệ tại Việt Nam',
}

export default function AboutPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Về chúng tôi</h1>
          <p className="text-xl max-w-3xl">
            XLab - Đơn vị tiên phong trong lĩnh vực phát triển phần mềm và các giải pháp công nghệ tại Việt Nam
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
              <p className="mb-4">
                XLab được thành lập vào năm 2010 bởi một nhóm kỹ sư phần mềm đam mê và có tầm nhìn 
                về việc tạo ra các giải pháp công nghệ tiên tiến, giúp doanh nghiệp Việt Nam 
                nâng cao hiệu quả hoạt động và năng lực cạnh tranh trong kỷ nguyên số.
              </p>
              <p className="mb-4">
                Sau hơn 13 năm hoạt động và phát triển, XLab đã trở thành đối tác công nghệ 
                tin cậy của hàng trăm doanh nghiệp trong và ngoài nước, từ các công ty khởi nghiệp 
                cho đến các tập đoàn lớn thuộc nhiều lĩnh vực khác nhau như tài chính, bán lẻ, 
                sản xuất, giáo dục và y tế.
              </p>
              <p>
                Chúng tôi tự hào về đội ngũ nhân sự tài năng và đam mê công nghệ, 
                với hơn 100 chuyên gia phần mềm, kỹ sư hệ thống, và chuyên gia tư vấn 
                giàu kinh nghiệm, luôn tận tâm với mục tiêu mang lại những giải pháp 
                tối ưu cho đối tác và khách hàng.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-200 h-96 flex items-center justify-center">
                <p className="text-gray-500">Hình ảnh văn phòng XLab</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Sứ mệnh</h2>
              <p className="text-gray-600">
                Sứ mệnh của XLab là ứng dụng công nghệ tiên tiến để tạo ra các giải pháp 
                phần mềm xuất sắc, giúp doanh nghiệp Việt Nam tối ưu hóa quy trình, 
                tăng năng suất và phát triển bền vững trong kỷ nguyên số. 
                Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao, 
                đáp ứng nhu cầu đa dạng của khách hàng, đồng thời góp phần thúc đẩy 
                sự phát triển của ngành công nghệ thông tin Việt Nam.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-secondary-600 text-white rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Tầm nhìn</h2>
              <p className="text-gray-600">
                XLab hướng tới trở thành doanh nghiệp công nghệ hàng đầu tại Việt Nam 
                và khu vực Đông Nam Á trong lĩnh vực phát triển phần mềm và cung cấp 
                giải pháp công nghệ thông tin toàn diện. Chúng tôi nỗ lực trở thành 
                đối tác tin cậy và lâu dài của các doanh nghiệp trong hành trình 
                chuyển đổi số, đồng thời là môi trường làm việc lý tưởng cho 
                các tài năng công nghệ phát triển sự nghiệp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị tạo nên văn hóa và định hướng mọi hoạt động của XLab
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Chất lượng</h3>
              <p className="text-gray-600">
                Đặt chất lượng sản phẩm và dịch vụ lên hàng đầu, 
                không ngừng cải tiến để đạt được sự xuất sắc
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Đổi mới</h3>
              <p className="text-gray-600">
                Khuyến khích tư duy sáng tạo, dám thử nghiệm 
                những ý tưởng mới và công nghệ tiên tiến
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Hợp tác</h3>
              <p className="text-gray-600">
                Xây dựng mối quan hệ đối tác lâu dài dựa trên 
                sự tôn trọng và hợp tác cùng có lợi
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Trách nhiệm</h3>
              <p className="text-gray-600">
                Làm việc với tinh thần trách nhiệm cao, 
                cam kết hoàn thành mọi cam kết với khách hàng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ lãnh đạo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gặp gỡ những con người đứng sau thành công của XLab
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-200 h-64 flex items-center justify-center">
                <p className="text-gray-500">Ảnh nhân viên</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Nguyễn Văn A</h3>
                <p className="text-primary-600 mb-4">Giám đốc điều hành (CEO)</p>
                <p className="text-gray-600 mb-4">
                  Với hơn 20 năm kinh nghiệm trong ngành công nghệ thông tin, 
                  ông A đã dẫn dắt XLab từ một startup nhỏ trở thành một trong 
                  những công ty phát triển phần mềm hàng đầu tại Việt Nam.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-200 h-64 flex items-center justify-center">
                <p className="text-gray-500">Ảnh nhân viên</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Trần Thị B</h3>
                <p className="text-primary-600 mb-4">Giám đốc công nghệ (CTO)</p>
                <p className="text-gray-600 mb-4">
                  Với nền tảng vững chắc về khoa học máy tính và hơn 15 năm kinh nghiệm 
                  trong phát triển phần mềm, bà B là người định hướng chiến lược công nghệ 
                  và đảm bảo chất lượng sản phẩm của XLab.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-200 h-64 flex items-center justify-center">
                <p className="text-gray-500">Ảnh nhân viên</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Lê Văn C</h3>
                <p className="text-primary-600 mb-4">Giám đốc kinh doanh (COO)</p>
                <p className="text-gray-600 mb-4">
                  Ông C có hơn 12 năm kinh nghiệm trong lĩnh vực quản lý dự án 
                  và phát triển kinh doanh. Ông chịu trách nhiệm xây dựng và 
                  mở rộng quan hệ đối tác chiến lược của XLab.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <a href="#" className="btn btn-primary">Xem thêm về đội ngũ của chúng tôi</a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Hợp tác cùng XLab</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng doanh nghiệp của bạn
              trong hành trình chuyển đổi số và phát triển bền vững.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <a href="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Liên hệ ngay
              </a>
              <a href="/services" className="btn border border-white text-white hover:bg-primary-700">
                Khám phá dịch vụ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 