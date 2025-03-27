import type { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';

const Research: NextPage = () => {
  return (
    <Layout title="Nghiên cứu - XLab" description="Nghiên cứu khoa học trên nền tảng XLab">
      <h1 className="text-3xl font-bold text-primary mb-6">Nghiên cứu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">Khám phá các nghiên cứu mới nhất</h2>
          <p className="text-gray-700 mb-4">
            Truy cập vào kho dữ liệu nghiên cứu đa ngành, cập nhật liên tục từ các nhà khoa học hàng đầu.
          </p>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
            Khám phá ngay
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-secondary">Công cụ phân tích dữ liệu</h2>
          <p className="text-gray-700 mb-4">
            Sử dụng các công cụ phân tích dữ liệu tiên tiến để khám phá và hiểu sâu hơn về dữ liệu nghiên cứu của bạn.
          </p>
          <button className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
            Truy cập công cụ
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Các lĩnh vực nghiên cứu</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Khoa học máy tính</h3>
            <p className="text-gray-600">Trí tuệ nhân tạo, học máy, khoa học dữ liệu</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Y học</h3>
            <p className="text-gray-600">Nghiên cứu lâm sàng, sinh học phân tử, dược phẩm</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Vật lý</h3>
            <p className="text-gray-600">Vật lý lượng tử, vật lý hạt, thiên văn học</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Sinh học</h3>
            <p className="text-gray-600">Di truyền học, sinh học tế bào, sinh thái học</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Kỹ thuật</h3>
            <p className="text-gray-600">Kỹ thuật điện, cơ khí, xây dựng</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Khoa học xã hội</h3>
            <p className="text-gray-600">Tâm lý học, xã hội học, kinh tế học</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Research; 