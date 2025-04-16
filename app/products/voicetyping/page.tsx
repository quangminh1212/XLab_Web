import React from 'react';

export default function VoiceTypingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">VoiceTyping</h1>
      <p className="text-lg mb-6">
        VoiceTyping là một ứng dụng máy tính cho phép người dùng nhập văn bản bằng giọng nói tại vị trí con trỏ chuột, sử dụng công nghệ nhận dạng giọng nói của Google Speech Recognition.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Kiến trúc dự án</h2>
      <p className="mb-4">
        Dự án được chia thành hai phần chính:
      </p>
      <ol className="list-decimal list-inside mb-4 space-y-1">
        <li>Frontend: Giao diện người dùng (GUI)</li>
        <li>Backend:
          <ul className="list-disc list-inside ml-4">
            <li>Mô-đun nhận dạng giọng nói</li>
            <li>Mô-đun xử lý văn bản</li>
            <li>Mô-đun điều khiển con trỏ và nhập liệu</li>
          </ul>
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mb-3">Công nghệ sử dụng</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li><strong>Ngôn ngữ lập trình:</strong> Python</li>
        <li><strong>GUI Framework:</strong> PyQt5</li>
        <li><strong>Nhận dạng giọng nói:</strong> SpeechRecognition với Google Speech API</li>
        <li><strong>Điều khiển con trỏ và nhập liệu:</strong> PyAutoGUI, pyperclip, keyboard</li>
        <li><strong>Xử lý văn bản:</strong> NLTK (Natural Language Toolkit)</li>
        <li><strong>Xử lý âm thanh:</strong> PyAudio, pydub (yêu cầu FFmpeg)</li>
      </ul>

      {/* Phần Cấu trúc dự án và chức năng có thể thêm vào nếu cần */}

      <h2 className="text-2xl font-semibold mb-3">Cài đặt và Sử dụng</h2>
      <p className="mb-4">Vui lòng tham khảo README gốc để biết chi tiết cài đặt đầy đủ, bao gồm cả cài đặt FFmpeg và PyAudio nếu cần.</p>

      <h3 className="text-xl font-semibold mb-2">Phương pháp 1: Sử dụng script tự động (khuyến nghị)</h3>
      <ol className="list-decimal list-inside mb-4 space-y-1">
        <li><strong>Tải và cài đặt Python</strong> (phiên bản 3.8 trở lên, chọn "Add Python to PATH").</li>
        <li><strong>Tải và giải nén dự án</strong> VoiceTyping.</li>
        <li><strong>Chạy file `run.bat`</strong> để tự động cài đặt và khởi động.</li>
      </ol>

      <h3 className="text-xl font-semibold mb-2">Phương pháp 2: Cài đặt thủ công</h3>
      <ol className="list-decimal list-inside mb-4 space-y-1">
        <li>Tạo và kích hoạt môi trường ảo (`python -m venv venv`, `venv\Scripts\activate`).</li>
        <li>Cài đặt thư viện (`pip install -r requirements.txt`).</li>
        <li>Chạy ứng dụng (`python main.py`).</li>
      </ol>

      <h2 className="text-2xl font-semibold mb-3">Sử dụng ứng dụng</h2>
      <ol className="list-decimal list-inside mb-4 space-y-1">
        <li>Khởi động ứng dụng.</li>
        <li>Nhấn nút "Start" hoặc giữ phím Ctrl để bắt đầu nhận dạng.</li>
        <li>Nói vào microphone, văn bản sẽ được nhập vào vị trí con trỏ.</li>
        <li>Nhấn nút "Stop" hoặc thả phím Ctrl để dừng.</li>
      </ol>

      <h2 className="text-2xl font-semibold mb-3">Xử lý lỗi thường gặp</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li><strong>Không tìm thấy FFmpeg:</strong> Đảm bảo đã cài đặt và thêm vào PATH.</li>
        <li><strong>Không tìm thấy microphone:</strong> Kiểm tra kết nối và cài đặt microphone.</li>
        <li><strong>Lỗi nhận dạng giọng nói:</strong> Đảm bảo có kết nối Internet.</li>
        <li><strong>Văn bản không xuất hiện:</strong> Kiểm tra ứng dụng đích có cho phép dán văn bản không.</li>
      </ul>

      {/* Thêm các phần khác như Tài nguyên, Đóng góp, Giấy phép nếu cần */}

    </div>
  );
} 