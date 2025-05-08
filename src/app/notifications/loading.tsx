export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-primary-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải thông báo...</p>
      </div>
    </div>
  );
} 