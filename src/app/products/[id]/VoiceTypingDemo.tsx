'use client';

import Image from 'next/image';

// import { SpeechToTextDemo } from '@/components/product';

const VoiceTypingDemo = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Trải nghiệm thử VoiceTyping</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-1">
          <div className="bg-blue-50 rounded-lg p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Các tính năng nổi bật</h3>

            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-gray-700">
                  Nhận diện giọng nói chính xác với hơn 99% độ chính xác
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-gray-700">Hỗ trợ tiếng Việt và hơn 100 ngôn ngữ khác</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-gray-700">Tích hợp với Microsoft Office 365</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-gray-700">Học hỏi và thích ứng với giọng nói của bạn</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-gray-700">Hoạt động cả online và offline</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          {/* SpeechToTextDemo removed as per request */}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-center mb-2">
                <Image
                  src="/images/speech-to-text/conversation.svg"
                  alt="Conversation"
                  width={100}
                  height={100}
                />
              </div>
              <h4 className="text-center font-medium text-gray-900">Nhận diện đa ngôn ngữ</h4>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-center mb-2">
                <Image
                  src="/images/speech-to-text/office-integration.svg"
                  alt="Office Integration"
                  width={100}
                  height={100}
                />
              </div>
              <h4 className="text-center font-medium text-gray-900">Tích hợp Office</h4>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-center mb-2">
                <Image
                  src="/images/speech-to-text/workflow.svg"
                  alt="Workflow"
                  width={100}
                  height={100}
                />
              </div>
              <h4 className="text-center font-medium text-gray-900">Quy trình làm việc</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTypingDemo;
