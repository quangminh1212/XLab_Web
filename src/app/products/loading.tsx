'use client';

export default function ProductsLoading() {
  return (
    <div className="products-loading">
      <div className="container">
        <div className="loading-header"></div>
        <div className="loading-filters"></div>
        <div className="loading-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="loading-card"></div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .loading-header, .loading-filters {
          height: 100px;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
          animation: pulse 1.5s infinite;
        }
        .loading-filters {
          height: 60px;
        }
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .loading-card {
          height: 350px;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
} 