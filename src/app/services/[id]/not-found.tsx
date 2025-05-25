import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy dịch vụ</h1>
        <p className="mb-6 text-gray-600">Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link 
          href="/services"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
        >
          Quay lại danh sách dịch vụ
        </Link>
      </div>
    </div>
  );
} 