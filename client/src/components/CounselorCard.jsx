import { Link } from 'react-router-dom';
import Card from './Card';
import CategoryTag from './CategoryTag';
import AnonymousAvatar from './AnonymousAvatar';
import Icon from './Icon';

const isOpenForBooking = (availability = '') =>
  /available|open/i.test(availability) && !/booked|unavailable/i.test(availability);

const CounselorCard = ({ counselor }) => {
  const open = isOpenForBooking(counselor.availability);

  return (
    <Card>
      <div className="post-card-header">
        <AnonymousAvatar seed={counselor._id} />
        <div>
          <Link to={`/counselors/${counselor._id}`}>
            <strong>{counselor.name}</strong>
          </Link>
          <div className="counselor-availability">
            <span className={`availability-dot${open ? ' open' : ''}`} aria-hidden="true" />
            {counselor.availability}
          </div>
        </div>
      </div>
      {counselor.credentials && <p className="text-muted">{counselor.credentials}</p>}
      <div className="card-meta">
        {counselor.specialties?.map((specialty) => (
          <CategoryTag key={specialty} category={specialty} />
        ))}
      </div>
      <div className="card-meta">
        {typeof counselor.rating === 'number' && (
          <span className="badge badge-success">
            <Icon name="star" size={12} /> {counselor.rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="card-actions">
        <Link to={`/counselors/${counselor._id}`} className="btn btn-primary btn-sm">
          {open ? 'Book Anonymous Session' : 'View Profile'}
        </Link>
      </div>
    </Card>
  );
};

export default CounselorCard;
