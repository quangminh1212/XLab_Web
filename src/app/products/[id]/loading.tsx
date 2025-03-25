export default function ProductDetailLoading() {
  return (
    <div className="product-detail-loading">
      <div className="container">
        <div className="loading-breadcrumb"></div>
        <div className="loading-hero">
          <div className="loading-image"></div>
          <div className="loading-info">
            <div className="loading-title"></div>
            <div className="loading-description"></div>
            <div className="loading-price"></div>
            <div className="loading-actions"></div>
            <div className="loading-features"></div>
          </div>
        </div>
        <div className="loading-tabs"></div>
        <div className="loading-related"></div>
      </div>
      <style jsx>{`
        .loading-breadcrumb {
          height: 20px;
          width: 300px;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
          animation: pulse 1.5s infinite;
        }
        .loading-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .loading-image {
          height: 400px;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          animation: pulse 1.5s infinite;
        }
        .loading-title, .loading-description, .loading-price, .loading-actions, .loading-features {
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          margin-bottom: 1.5rem;
          animation: pulse 1.5s infinite;
        }
        .loading-title {
          height: 40px;
          width: 80%;
        }
        .loading-description {
          height: 80px;
        }
        .loading-price {
          height: 60px;
          width: 50%;
        }
        .loading-actions {
          height: 50px;
        }
        .loading-features {
          height: 150px;
        }
        .loading-tabs {
          height: 300px;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          margin-bottom: 3rem;
          animation: pulse 1.5s infinite;
        }
        .loading-related {
          height: 300px;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @media (max-width: 992px) {
          .loading-hero {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
} 