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
    console.error(error);
  }, [error]);

  return (
    <div className="error-container container">
      <div className="error-content">
        <h2>Đã xảy ra lỗi</h2>
        <p>Xin lỗi, đã có lỗi xảy ra khi tải trang. Vui lòng thử lại sau.</p>
        <button
          className="btn btn-primary"
          onClick={() => reset()}
        >
          Thử lại
        </button>
      </div>
    </div>
  );
} 