<<<<<<< HEAD
'use client';

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
      
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }
        
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
      `}</style>
=======
export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-white bg-opacity-60" style={{ 
        backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(to right, #d1d5db 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
      
      <div className="z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-primary-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2.90625 20.2491C3.82834 18.6531 5.1542 17.3278 6.75064 16.4064C8.34708 15.485 10.1579 15 12.0011 15C13.8444 15 15.6552 15.4851 17.2516 16.4066C18.848 17.3281 20.1738 18.6533 21.0958 20.2494" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute -right-1 -top-1">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xác thực...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
        
        <div className="relative pt-1 mb-6">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-100">
            <div className="animate-loading-progress shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"></div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Bạn sẽ được chuyển hướng sau khi xác thực thành công</p>
        </div>
      </div>
>>>>>>> 2aea817a
    </div>
  );
} 