import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      bio: 'Với hơn 15 năm kinh nghiệm trong lĩnh vực công nghệ phần mềm, Nguyễn Văn A đã lãnh đạo XLab từ một startup nhỏ thành công ty phát triển phần mềm hàng đầu.',
      image: '/images/team/member1.jpg'
    },
    {
      name: 'Trần Thị B',
      role: 'CTO',
      bio: 'Trần Thị B là chuyên gia công nghệ với hơn 10 năm kinh nghiệm phát triển phần mềm. Cô ấy là người đứng sau các giải pháp công nghệ tiên tiến của XLab.',
      image: '/images/team/member2.jpg'
    },
    {
      name: 'Lê Văn C',
      role: 'Lead Developer',
      bio: 'Lê Văn C là kỹ sư phần mềm tài năng với chuyên môn trong phát triển ứng dụng web và di động. Anh đã dẫn dắt nhiều dự án thành công tại XLab.',
      image: '/images/team/member3.jpg'
    },
    {
      name: 'Phạm Thị D',
      role: 'UX/UI Designer',
      bio: 'Phạm Thị D đam mê thiết kế trải nghiệm người dùng tuyệt vời. Cô ấy đảm bảo các sản phẩm của XLab không chỉ hoạt động tốt mà còn đẹp mắt và dễ sử dụng.',
      image: '/images/team/member4.jpg'
    }
  ];

  const milestones = [
    {
      year: '2015',
      title: 'Thành lập công ty',
      description: 'XLab được thành lập với sứ mệnh cung cấp các giải pháp phần mềm chất lượng cao cho doanh nghiệp.'
    },
    {
      year: '2017',
      title: 'Mở rộng dịch vụ',
      description: 'Chúng tôi bắt đầu cung cấp dịch vụ phát triển ứng dụng di động và tư vấn CNTT.'
    },
    {
      year: '2019',
      title: 'Văn phòng mới',
      description: 'Mở rộng văn phòng tại Thành phố Hồ Chí Minh để đáp ứng nhu cầu ngày càng tăng.'
    },
    {
      year: '2021',
      title: 'Mở rộng quốc tế',
      description: 'Bắt đầu cung cấp dịch vụ cho khách hàng quốc tế và mở rộng đội ngũ phát triển.'
    },
    {
      year: '2023',
      title: 'Đổi mới công nghệ',
      description: 'Áp dụng các công nghệ mới nhất như AI và Machine Learning vào các giải pháp phần mềm.'
    }
  ];

  const values = [
    {
      title: 'Chất lượng',
      description: 'Chúng tôi không ngừng nỗ lực để cung cấp các sản phẩm và dịch vụ chất lượng cao nhất.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Đổi mới',
      description: 'Chúng tôi luôn tìm kiếm các giải pháp sáng tạo và áp dụng công nghệ mới nhất.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Tập trung vào khách hàng',
      description: 'Chúng tôi đặt nhu cầu của khách hàng lên hàng đầu và nỗ lực vượt qua mong đợi của họ.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Liêm chính',
      description: 'Chúng tôi hoạt động với sự trung thực và minh bạch cao nhất trong mọi tương tác.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Về chúng tôi</h1>
          <p className="text-xl max-w-3xl mx-auto">
            XLab là công ty phát triển phần mềm chuyên nghiệp, cung cấp các giải pháp công nghệ tùy chỉnh để giúp doanh nghiệp phát triển trong kỷ nguyên số.
          </p>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
              <p className="text-lg text-gray-700 mb-6">
                XLab được thành lập vào năm 2015 bởi một nhóm các chuyên gia phần mềm đam mê với tầm nhìn cung cấp các giải pháp công nghệ sáng tạo và chất lượng cao. Từ một nhóm nhỏ chỉ với 5 thành viên, chúng tôi đã phát triển thành công ty với hơn 50 nhân viên tài năng.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Trong suốt hành trình phát triển, chúng tôi luôn giữ vững cam kết về chất lượng và sự đổi mới. Chúng tôi tự hào về việc xây dựng các mối quan hệ lâu dài với khách hàng, nhiều người trong số họ đã làm việc với chúng tôi từ những ngày đầu tiên.
              </p>
              <p className="text-lg text-gray-700">
                Ngày nay, XLab là đối tác công nghệ đáng tin cậy cho nhiều doanh nghiệp từ các công ty khởi nghiệp đến các tập đoàn lớn. Chúng tôi tiếp tục đổi mới và mở rộng danh mục dịch vụ để đáp ứng nhu cầu ngày càng tăng của thị trường công nghệ.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/office.jpg" 
                  alt="XLab Office" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi của chúng tôi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hành trình phát triển</h2>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                  <div className="md:w-1/2 mb-6 md:mb-0 md:px-8">
                    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${index % 2 === 0 ? 'md:text-right border-indigo-600' : 'border-blue-600'}`}>
                      <span className="text-indigo-600 font-bold">{milestone.year}</span>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="z-10 flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Đội ngũ của chúng tôi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/careers" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-medium">
              Tham gia đội ngũ chúng tôi
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-indigo-100">Dự án hoàn thành</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-indigo-100">Chuyên gia phần mềm</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8+</div>
              <p className="text-indigo-100">Năm kinh nghiệm</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <p className="text-indigo-100">Quốc gia có khách hàng</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng hợp tác với chúng tôi?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để thảo luận về cách chúng tôi có thể giúp doanh nghiệp của bạn phát triển thông qua các giải pháp công nghệ tiên tiến.
          </p>
          <Link 
            href="/contact" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-medium inline-block"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </main>
  );
} 