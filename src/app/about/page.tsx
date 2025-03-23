import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Về chúng tôi | XLab Web',
  description: 'Tìm hiểu về XLab - đội ngũ, sứ mệnh và giá trị cốt lõi của chúng tôi.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Banner section */}
      <div className="bg-indigo-50 rounded-2xl p-8 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Về chúng tôi</h1>
          <p className="text-lg text-gray-700">
            XLab là đơn vị tiên phong trong lĩnh vực phân tích dữ liệu và tự động hóa quy trình, 
            giúp doanh nghiệp khai thác tối đa giá trị từ dữ liệu và tối ưu hóa hoạt động kinh doanh.
          </p>
        </div>
      </div>

      {/* Mission section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Sứ mệnh của chúng tôi</h2>
            <p className="text-gray-700 mb-4">
              Tại XLab, chúng tôi tin rằng dữ liệu là tài sản quý giá nhất của mọi doanh nghiệp trong kỷ nguyên số. 
              Sứ mệnh của chúng tôi là giúp doanh nghiệp khai phá sức mạnh của dữ liệu thông qua các giải pháp 
              phân tích thông minh và tự động hóa.
            </p>
            <p className="text-gray-700">
              Chúng tôi cam kết mang đến những công nghệ tiên tiến nhất, kết hợp với hiểu biết sâu sắc về ngành, 
              để cung cấp các giải pháp cá nhân hóa đáp ứng nhu cầu cụ thể của từng khách hàng.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 rounded-full bg-indigo-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                <svg className="w-40 h-40 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Đổi mới</h3>
            <p className="text-gray-600">Chúng tôi không ngừng tìm kiếm những cách tiếp cận mới để giải quyết các thách thức phức tạp.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Hợp tác</h3>
            <p className="text-gray-600">Chúng tôi xây dựng mối quan hệ đối tác dài hạn với khách hàng, làm việc cùng nhau để đạt được thành công.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Chính trực</h3>
            <p className="text-gray-600">Chúng tôi luôn đặt tính minh bạch và đạo đức lên hàng đầu trong mọi quyết định và hành động.</p>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-10">Đội ngũ lãnh đạo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { name: 'Nguyễn Văn A', role: 'CEO & Founder', image: '/images/placeholder/placeholder.svg' },
            { name: 'Trần Thị B', role: 'CTO', image: '/images/placeholder/placeholder.svg' },
            { name: 'Lê Văn C', role: 'Head of Data Science', image: '/images/placeholder/placeholder.svg' },
            { name: 'Phạm Thị D', role: 'Head of Product', image: '/images/placeholder/placeholder.svg' },
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="w-full h-48 bg-indigo-100 flex items-center justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjxwYXRoIGQ9Ik0xMDAgODBDMTA4LjI4NCA4MCAxMTUgNzMuMjg0MiAxMTUgNjVDMTE1IDU2LjcxNTggMTA4LjI4NCA1MCAxMDAgNTBDOTEuNzE1OCA1MCA4NSA1Ni43MTU4IDg1IDY1Qzg1IDczLjI4NDIgOTEuNzE1OCA4MCAxMDAgODBaIiBmaWxsPSIjOTk5Ii8+PHBhdGggZD0iTTY1IDEzMEM2NSAxMTMuNDMxIDgzLjQzMTUgMTAwIDEwMCAxMDBDMTE2LjU2OSAxMDAgMTM1IDExMy40MzEgMTM1IDEzMEMxMzUgMTQ2LjU2OSAxMTYuNTY5IDE2MCAxMDAgMTYwQzgzLjQzMTUgMTYwIDY1IDE0Ni41NjkgNjUgMTMwWiIgZmlsbD0iIzk5OSIvPjwvc3ZnPg==' // Fallback SVG
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 