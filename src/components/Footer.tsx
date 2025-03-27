import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-8 bg-gray-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} XLab. Tất cả các quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer; 