'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Đã xảy ra lỗi</h2>
      <p>Xin lỗi, đã có sự cố xảy ra. Vui lòng thử lại.</p>
      <button
        onClick={() => reset()}
        className="error-button"
      >
        Thử lại
      </button>
    </div>
  );
} 