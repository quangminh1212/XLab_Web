'use client';

export default function ProductDetailLoading() {
  return (
    <div>
      <div className="loading-breadcrumb"></div>
      
      <div className="loading-hero">
        <div className="loading-image"></div>
        <div className="loading-details">
          <div className="loading-title"></div>
          <div className="loading-description"></div>
          <div className="loading-price"></div>
          <div className="loading-actions"></div>
        </div>
      </div>
      
      <div className="loading-features"></div>
      <div className="loading-tabs"></div>
      <div className="loading-related"></div>
    </div>
  );
} 