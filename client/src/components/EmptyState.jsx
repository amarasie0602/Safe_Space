const EmptyState = ({ message }) => (
  <div className="empty-state-illustrated">
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="emptyGradient" x1="0" y1="0" x2="140" y2="140">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#fce7f3" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r="60" fill="url(#emptyGradient)" opacity="0.6" />
      <circle cx="50" cy="60" r="13" fill="#c4b5fd" />
      <circle cx="90" cy="60" r="13" fill="#f9a8d4" />
      <path d="M48 88 Q70 108 92 88" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="34" r="4" fill="#7dd3fc" />
      <circle cx="107" cy="38" r="3" fill="#fbcfe8" />
      <circle cx="102" cy="102" r="5" fill="#a7f3d0" />
    </svg>
    <p className="empty-state-message">{message}</p>
  </div>
);

export default EmptyState;
