'use client'

const NoScriptMessage = () => {
  return (
    <noscript>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 text-white p-4">
        <div className="bg-red-600 p-6 rounded-lg max-w-md text-center">
          {/* Vietnamese message */}
          <div lang="vi">
            <h2 className="text-xl font-bold mb-2">JavaScript Bị Vô Hiệu Hóa</h2>
            <p>Website này yêu cầu JavaScript để hoạt động đúng. Vui lòng bật JavaScript và tải lại trang.</p>
          </div>
          
          {/* English message */}
          <div lang="en" className="hidden" data-show-when-lang="en">
            <h2 className="text-xl font-bold mb-2">JavaScript Disabled</h2>
            <p>This website requires JavaScript to function properly. Please enable JavaScript and reload the page.</p>
          </div>
        </div>
      </div>
    </noscript>
  )
}

export default NoScriptMessage 