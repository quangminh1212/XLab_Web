export default function Hero() {
  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Giải pháp phần mềm thông minh cho doanh nghiệp hiện đại
            </h1>
            <p className="text-xl text-white opacity-90 mb-8">
              XLab cung cấp các giải pháp phần mềm tiên tiến giúp doanh nghiệp của bạn tối ưu hoá quy trình, tăng năng suất và phát triển bền vững.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
                Khám phá ngay
              </button>
              <button className="bg-transparent text-white border border-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
                Liên hệ tư vấn
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-xl p-4">
              <img 
                src="/hero-image.svg" 
                alt="XLab Software Solutions" 
                className="w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x400?text=XLab+Software";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 