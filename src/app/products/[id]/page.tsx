import Image from 'next/image'
import Link from 'next/link'

// This would typically come from a database or API
const getProductById = (id: string) => {
  const products = {
    'business-suite': {
      id: 'business-suite',
      name: 'XLab Business Suite',
      shortDescription: 'Giải pháp phần mềm toàn diện cho việc quản lý doanh nghiệp',
      fullDescription: 'Giải pháp phần mềm toàn diện cho việc quản lý doanh nghiệp, bao gồm kế toán, quản lý nhân sự, quản lý khách hàng và nhiều tính năng khác.',
      price: 5990000,
      discountPrice: 4990000,
      features: [
        'Quản lý khách hàng (CRM)',
        'Quản lý nhân sự (HRM)',
        'Quản lý tài chính và kế toán',
        'Báo cáo phân tích doanh số',
        'Tích hợp thanh toán trực tuyến',
        'Hỗ trợ đa ngôn ngữ',
        'Truy cập từ mọi thiết bị',
        'Cập nhật tự động',
      ],
      systemRequirements: {
        os: 'Windows 10/11, macOS 11+, Linux',
        processor: 'Intel Core i3 hoặc AMD Ryzen 3 trở lên',
        ram: '8GB RAM',
        storage: '250MB dung lượng trống',
        browser: 'Chrome, Firefox, Safari, Edge phiên bản mới nhất',
      },
      versions: [
        {
          name: 'Cơ bản',
          price: 2990000,
          features: ['Quản lý khách hàng cơ bản', 'Báo cáo hàng tháng', 'Hỗ trợ email'],
        },
        {
          name: 'Chuyên nghiệp',
          price: 4990000,
          features: ['Tất cả tính năng cơ bản', 'Quản lý tài chính', 'Quản lý nhân sự', 'Hỗ trợ 24/7'],
          recommended: true,
        },
        {
          name: 'Doanh nghiệp',
          price: 9990000,
          features: ['Tất cả tính năng chuyên nghiệp', 'API tích hợp', 'Tùy chỉnh theo yêu cầu', 'Hỗ trợ ưu tiên'],
        },
      ],
      reviews: [
        {
          name: 'Nguyễn Văn A',
          position: 'CEO, Công ty XYZ',
          rating: 5,
          comment: 'Phần mềm tuyệt vời, giúp doanh nghiệp của chúng tôi tiết kiệm thời gian và tăng hiệu quả làm việc.',
        },
        {
          name: 'Trần Thị B',
          position: 'Giám đốc tài chính, Tập đoàn ABC',
          rating: 4,
          comment: 'Dễ sử dụng, đầy đủ tính năng, hỗ trợ kỹ thuật nhanh chóng và hiệu quả.',
        },
      ],
    },
    // Add more products as needed
  };

  return products[id as keyof typeof products];
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  return {
    title: `${product?.name || 'Sản phẩm'} | XLab - Phần mềm và Dịch vụ`,
    description: product?.shortDescription || 'Chi tiết sản phẩm phần mềm từ XLab',
  };
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Sản phẩm không tồn tại</h1>
        <p className="mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/products" className="btn bg-primary-600 text-white">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div>
      {/* Product Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl max-w-3xl">{product.shortDescription}</p>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center p-6">
                <Image
                  src={product.imageUrl || '/images/product-placeholder.svg'}
                  alt={product.name}
                  width={240}
                  height={240}
                  className="max-w-full max-h-[320px] w-auto h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product-placeholder.svg';
                  }}
                />
              </div>
              
              {/* Product Demo/Screenshots */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Demo và hình ảnh</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((index) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <div className="h-20 flex items-center justify-center text-gray-400">
                        Screenshot {index}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button className="btn bg-secondary-600 text-white">Xem Demo Trực tuyến</button>
                </div>
              </div>
            </div>

            {/* Product Info & Purchase */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-3xl font-bold text-primary-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.discountPrice || product.price)}
                    </p>
                    {product.discountPrice && (
                      <p className="text-gray-500 line-through">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </p>
                    )}
                  </div>
                  <div className="flex">
                    {renderStars(4.5)}
                    <span className="ml-2 text-gray-600">(18 đánh giá)</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="text-green-500 mt-1 mr-3">✓</div>
                    <p>Bản quyền trọn đời, cập nhật miễn phí trong 1 năm</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mt-1 mr-3">✓</div>
                    <p>Hỗ trợ kỹ thuật 24/7</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mt-1 mr-3">✓</div>
                    <p>Cài đặt không giới hạn thiết bị cho 1 người dùng</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="btn bg-primary-600 text-white w-full">Thêm vào giỏ hàng</button>
                  <button className="btn bg-secondary-600 text-white w-full">Mua ngay</button>
                  <button className="btn bg-gray-100 text-gray-700 w-full">Dùng thử miễn phí 30 ngày</button>
                </div>
              </div>

              {/* System Requirements */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Yêu cầu hệ thống</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="font-semibold w-1/3">Hệ điều hành:</span>
                    <span>{product.systemRequirements.os}</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Bộ vi xử lý:</span>
                    <span>{product.systemRequirements.processor}</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Bộ nhớ RAM:</span>
                    <span>{product.systemRequirements.ram}</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Dung lượng:</span>
                    <span>{product.systemRequirements.storage}</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Trình duyệt:</span>
                    <span>{product.systemRequirements.browser}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Tính năng của {product.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {product.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <span className="text-xl">✓</span>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {feature.split('(')[0].trim()}
                  {feature.includes('(') && (
                    <span className="text-primary-600">
                      {' '}({feature.split('(')[1]}
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">
                  Tính năng này giúp tối ưu hóa quy trình làm việc và nâng cao hiệu quả.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Version Comparison */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">So sánh các phiên bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.versions.map((version, index) => (
              <div 
                key={index} 
                className={`border rounded-lg overflow-hidden ${version.recommended ? 'border-primary-600 shadow-xl' : 'border-gray-200 shadow-md'}`}
              >
                {version.recommended && (
                  <div className="bg-primary-600 text-white py-2 px-4 text-center">
                    Được lựa chọn nhiều nhất
                  </div>
                )}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold mb-2">{version.name}</h3>
                  <p className="text-3xl font-bold text-primary-600 mb-6">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(version.price)}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {version.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="text-green-500 mt-1 mr-3">✓</div>
                        <p>{feature}</p>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`btn w-full ${version.recommended ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    Chọn gói {version.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Đánh giá từ khách hàng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-gray-600 text-xl">{review.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <p className="text-gray-600 text-sm">{review.position}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button className="btn bg-white border border-gray-300 text-gray-700">
              Xem tất cả đánh giá
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Câu hỏi thường gặp</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Tôi có thể sử dụng phần mềm trên bao nhiêu thiết bị?',
                answer: 'Bạn có thể cài đặt và sử dụng phần mềm trên không giới hạn số lượng thiết bị cá nhân, nhưng chỉ một người dùng có thể sử dụng tại một thời điểm. Đối với giấy phép doanh nghiệp, số lượng người dùng sẽ phụ thuộc vào gói bạn chọn.'
              },
              {
                question: 'Phần mềm có cập nhật tự động không?',
                answer: 'Có, phần mềm sẽ tự động cập nhật khi có phiên bản mới. Bạn có thể tùy chỉnh cài đặt cập nhật trong phần Cài đặt của phần mềm.'
              },
              {
                question: 'Tôi có được hỗ trợ kỹ thuật sau khi mua không?',
                answer: 'Có, khi mua phần mềm, bạn sẽ được hỗ trợ kỹ thuật trong thời gian 1 năm. Sau đó, bạn có thể gia hạn gói hỗ trợ hoặc nâng cấp phiên bản để tiếp tục nhận hỗ trợ.'
              },
              {
                question: 'Làm thế nào để tôi nhận được bản cập nhật sau khi mua?',
                answer: 'Tất cả bản cập nhật sẽ được tự động cung cấp thông qua ứng dụng trong thời gian bảo hành của bạn. Bạn cũng có thể tải xuống phiên bản mới nhất từ khu vực Tài khoản của bạn trên trang web của chúng tôi.'
              },
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-white">
                  <h4 className="font-bold text-lg">{faq.question}</h4>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/support" className="btn bg-gray-100 text-gray-700">
              Xem tất cả câu hỏi thường gặp
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng nâng cấp trải nghiệm với {product.name}?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay và nhận giảm giá 20% cho 3 tháng đầu tiên. Áp dụng cho tất cả các gói dịch vụ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-primary-600">Mua ngay</button>
            <button className="btn bg-primary-700 text-white">Dùng thử miễn phí</button>
          </div>
        </div>
      </section>
    </div>
  );
} 