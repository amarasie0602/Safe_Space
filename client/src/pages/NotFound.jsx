import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <h1>404 — Page Not Found</h1>
    <p>The page you&apos;re looking for doesn&apos;t exist.</p>
    <Link to="/" className="btn btn-primary">
      Back to Posts
    </Link>
  </div>
);

export default NotFound;
