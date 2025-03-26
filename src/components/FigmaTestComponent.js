import { useState, useEffect } from 'react';

export default function FigmaTestComponent() {
  const [figmaData, setFigmaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFigmaData = async () => {
      try {
        // Sử dụng một file Figma UI Kit phổ biến để test
        const fileKey = 'FP8EJoQGN5PVkvzqlD7Qb5';
        const response = await fetch(`/api/figma?fileKey=${fileKey}`);
        
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu từ Figma');
        }
        
        const data = await response.json();
        setFigmaData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFigmaData();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu Figma...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;

  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Dữ liệu từ Figma</h2>
      {figmaData && (
        <div className="bg-white p-4 rounded shadow">
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(figmaData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 