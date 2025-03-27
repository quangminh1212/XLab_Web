import type { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';

const Analytics: NextPage = () => {
  return (
    <Layout title="Phân tích - XLab" description="Công cụ phân tích dữ liệu khoa học XLab">
      <h1 className="text-3xl font-bold text-primary mb-6">Phân tích dữ liệu</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Công cụ phân tích mạnh mẽ</h2>
        <p className="text-lg mb-4">
          XLab cung cấp các công cụ phân tích dữ liệu tiên tiến, giúp các nhà nghiên cứu
          rút ra những hiểu biết sâu sắc từ dữ liệu nghiên cứu của họ.
        </p>
        <div className="mt-6 flex space-x-4">
          <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors">
            Bắt đầu phân tích
          </button>
          <button className="border border-primary text-primary hover:bg-blue-50 px-5 py-2 rounded-md transition-colors">
            Xem hướng dẫn
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3 text-primary">Biểu đồ tương tác</h3>
          <p className="text-gray-700 mb-4">
            Tạo và tùy chỉnh các biểu đồ tương tác để khám phá dữ liệu của bạn.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3 text-secondary">Mô hình thống kê</h3>
          <p className="text-gray-700 mb-4">
            Áp dụng các mô hình thống kê tiên tiến cho phân tích sâu.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3 text-accent">Báo cáo tự động</h3>
          <p className="text-gray-700 mb-4">
            Tạo báo cáo chuyên nghiệp với chỉ một vài cú nhấp chuột.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Bạn cần hỗ trợ phân tích?</h2>
        <p className="text-gray-700 mb-4">
          Đội ngũ chuyên gia của chúng tôi sẵn sàng giúp bạn phân tích dữ liệu nghiên cứu.
        </p>
        <button className="text-primary hover:text-blue-700 font-medium">
          Liên hệ với chúng tôi
        </button>
      </div>
    </Layout>
  );
};

export default Analytics; 