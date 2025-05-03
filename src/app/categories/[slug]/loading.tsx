export default function CategoryLoading() {
  return (
    <div className="container mx-auto py-8 px-4 min-h-[70vh]">
      <div className="animate-pulse">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="w-48 h-10 bg-gray-200 rounded mb-4 md:mb-0"></div>
          <div className="w-32 h-8 bg-gray-200 rounded"></div>
        </div>
        
        {/* Filters */}
        <div className="p-4 bg-gray-50 rounded-lg mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-4"></div>
                <div className="w-1/3 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 