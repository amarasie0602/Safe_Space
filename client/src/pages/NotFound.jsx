import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <svg width="120" height="120" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="10" fill="#EDE3D3" />
      <path d="M13 18h20v11a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8V18z" fill="#8B6F5A" opacity="0.5" />
      <path
        d="M33 20h2.5a5 5 0 0 1 0 10H33"
        fill="none"
        stroke="#8B6F5A"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="19" cy="24" r="1.6" fill="#3E2F26" />
      <circle cx="27" cy="24" r="1.6" fill="#3E2F26" />
      <path d="M18 30q5 4 10 0" fill="none" stroke="#3E2F26" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    <h1>Page not found</h1>
    <p className="text-muted">This page doesn&apos;t exist, but you&apos;re still welcome here.</p>
    <Link to="/" className="btn btn-primary">
      Return to SafeSpace
    </Link>
  </div>
);

export default NotFound;
