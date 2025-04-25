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
    </div>
  );
} 