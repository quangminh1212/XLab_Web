export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-center">
            <div className="bg-primary-50 p-4 rounded-full mb-6">
              <div className="text-primary-600 font-bold text-2xl">XLab</div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-xl font-medium text-gray-900 mb-2">Đang xác thực</h1>
            <p className="text-gray-500 text-sm">Vui lòng đợi trong khi chúng tôi đang xử lý yêu cầu của bạn</p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg 
                className="w-16 h-16 text-primary-500 animate-spin" 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle className="opacity-20" cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
                <path className="opacity-75" d="M10,50 A40,40 0 0,1 50,10" strokeLinecap="round" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="bg-primary-400 h-full loading-progress"></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Đang xác thực thông tin</span>
              <span className="text-primary-600">Vui lòng đợi...</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .loading-progress {
          width: 75%;
          animation: shimmer 2s infinite;
          background: linear-gradient(
            90deg,
            rgba(75, 136, 229, 0.8) 0%,
            rgba(77, 176, 168, 0.8) 50%,
            rgba(75, 136, 229, 0.8) 100%
          );
          background-size: 200% 100%;
        }
        
        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }
      `}</style>
    </div>
  );
} 