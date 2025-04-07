'use client';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-500/10"></div>
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <svg 
              className="w-20 h-20 text-primary-500" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                className="opacity-25" 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none" 
              />
              <path 
                className="opacity-75" 
                d="M10,50 A40,40 0 0,1 50,10"
                strokeLinecap="round"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-gray-900">Đang tải...</h2>
          <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
        
        <div className="mt-8 relative">
          <div className="h-1 w-32 mx-auto bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full w-1/3 loading-bar"></div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .loading-bar {
          animation: loading 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
} 