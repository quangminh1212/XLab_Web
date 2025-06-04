'use client';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Đang tải...</p>
      </div>
    </div>
  );
}
