const EmptyState = ({ message }) => (
  <div className="empty-state-illustrated">
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="emptyGradient" x1="0" y1="0" x2="140" y2="140">
          <stop offset="0%" stopColor="#e3d6c8" />
          <stop offset="100%" stopColor="#e3e8d9" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r="60" fill="url(#emptyGradient)" opacity="0.7" />
      <circle cx="50" cy="60" r="13" fill="#c8a27c" />
      <circle cx="90" cy="60" r="13" fill="#a3b18a" />
      <path d="M48 88 Q70 108 92 88" stroke="#8b6f5a" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="34" r="4" fill="#b97a56" />
      <circle cx="107" cy="38" r="3" fill="#d6cfc7" />
      <circle cx="102" cy="102" r="5" fill="#a3b18a" />
    </svg>
    <p className="empty-state-message">{message}</p>
  </div>
);

export default EmptyState;
