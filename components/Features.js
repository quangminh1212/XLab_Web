export default function Features() {
  const features = [
    {
      id: 1,
      title: 'Tích hợp thông minh',
      description: 'Dễ dàng tích hợp với các hệ thống hiện có của doanh nghiệp, đảm bảo quá trình chuyển đổi mượt mà.',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Bảo mật cao cấp',
      description: 'Bảo vệ dữ liệu của bạn với các biện pháp bảo mật tiên tiến, tuân thủ các tiêu chuẩn quốc tế.',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Phân tích dữ liệu',
      description: 'Tận dụng công nghệ AI để phân tích dữ liệu, cung cấp thông tin chi tiết và dự báo chính xác.',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ kỹ thuật chuyên nghiệp luôn sẵn sàng giải quyết mọi vấn đề của bạn.',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Tính năng nổi bật</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp các giải pháp phần mềm với những tính năng vượt trội, đáp ứng mọi nhu cầu của doanh nghiệp hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 