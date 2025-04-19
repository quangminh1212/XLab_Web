export default function ProductsLoading() {
  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="h-9 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-5 w-full max-w-2xl bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="space-y-12">
          <section>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse"></div>
                  <div className="p-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                    <div className="h-px bg-gray-100 w-full my-2"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 