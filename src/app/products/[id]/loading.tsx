'use client';

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row">
            {/* Phần hình ảnh - loading state */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
              <div className="bg-gray-200 rounded-lg flex items-center justify-center h-64"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            </div>
            
            {/* Phần thông tin - loading state */}
            <div className="w-full md:w-2/3">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-28 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-28 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              
              <div className="flex space-x-4">
                <div className="h-12 bg-gray-200 rounded w-36"></div>
                <div className="h-12 bg-gray-200 rounded w-36"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  );
} 