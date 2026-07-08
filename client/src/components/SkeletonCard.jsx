const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-header">
      <span className="skeleton skeleton-avatar" />
      <span className="skeleton skeleton-line skeleton-line-sm" />
    </div>
    <span className="skeleton skeleton-line" />
    <span className="skeleton skeleton-line skeleton-line-short" />
  </div>
);

export default SkeletonCard;
