import type { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">XLab</h1>
        <p className="text-xl text-gray-600">Nền tảng nghiên cứu khoa học hàng đầu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-primary text-2xl mb-4">🔬</div>
          <h2 className="text-xl font-semibold mb-2">Nghiên cứu</h2>
          <p className="text-gray-600">Truy cập vào cơ sở dữ liệu khoa học và công cụ nghiên cứu tiên tiến.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-secondary text-2xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2">Cộng đồng</h2>
          <p className="text-gray-600">Kết nối với các nhà nghiên cứu và chuyên gia từ khắp nơi trên thế giới.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-accent text-2xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Phân tích</h2>
          <p className="text-gray-600">Công cụ phân tích dữ liệu mạnh mẽ để rút ra những hiểu biết sâu sắc.</p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
          Bắt đầu ngay
        </button>
      </div>
    </Layout>
  );
};

export default Home; 