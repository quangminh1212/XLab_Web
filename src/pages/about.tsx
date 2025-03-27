import type { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';

const About: NextPage = () => {
  return (
    <Layout title="Giới thiệu - XLab" description="Giới thiệu về XLab - Nền tảng nghiên cứu khoa học hàng đầu">
      <h1 className="text-3xl font-bold text-primary mb-6">Giới thiệu về XLab</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-lg mb-4">
          XLab là nền tảng nghiên cứu khoa học tiên tiến, được phát triển với mục tiêu kết nối các nhà nghiên cứu
          và cung cấp công cụ hiện đại cho cộng đồng khoa học.
        </p>
        
        <p className="text-lg mb-4">
          Chúng tôi cam kết xây dựng một môi trường nghiên cứu mở, minh bạch và hiệu quả, nơi các ý tưởng mới
          có thể phát triển và các phát kiến mang tính đột phá có thể được chia sẻ với thế giới.
        </p>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Sứ mệnh của chúng tôi</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Thúc đẩy sự hợp tác giữa các nhà nghiên cứu trên toàn cầu</li>
            <li>Cung cấp công cụ và nguồn lực để tăng tốc quá trình nghiên cứu</li>
            <li>Mở rộng khả năng tiếp cận với khoa học cho tất cả mọi người</li>
            <li>Hỗ trợ các nhà nghiên cứu trẻ phát triển sự nghiệp</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default About; 