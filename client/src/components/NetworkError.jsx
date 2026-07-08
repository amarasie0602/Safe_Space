const NetworkError = ({ message = 'Unable to load content right now.', onRetry }) => (
  <div className="empty-state">
    <p>{message}</p>
    {onRetry && (
      <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export default NetworkError;
