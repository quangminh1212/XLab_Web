import type { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';

const Community: NextPage = () => {
  return (
    <Layout title="Cộng đồng - XLab" description="Cộng đồng nghiên cứu khoa học XLab">
      <h1 className="text-3xl font-bold text-primary mb-6">Cộng đồng XLab</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Kết nối với các nhà nghiên cứu</h2>
        <p className="text-lg mb-4">
          Tham gia cộng đồng XLab để kết nối với các nhà nghiên cứu, chuyên gia và
          những người đam mê khoa học từ khắp nơi trên thế giới.
        </p>
        <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors">
          Tham gia ngay
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3 text-primary">Diễn đàn</h3>
          <p className="text-gray-700 mb-4">
            Thảo luận về các chủ đề khoa học, chia sẻ kiến thức và tìm kiếm sự hợp tác.
          </p>
          <div className="flex justify-end">
            <button className="text-primary hover:text-blue-700 font-medium">Khám phá</button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3 text-primary">Sự kiện</h3>
          <p className="text-gray-700 mb-4">
            Hội thảo, hội nghị và webinar về các chủ đề khoa học mới nhất.
          </p>
          <div className="flex justify-end">
            <button className="text-primary hover:text-blue-700 font-medium">Xem lịch</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community; 