import { Link } from 'react-router-dom';
import Card from './Card';
import CategoryTag from './CategoryTag';

const CounselorCard = ({ counselor }) => (
  <Card>
    <p>
      <Link to={`/counselors/${counselor._id}`}>
        <strong>{counselor.name}</strong>
      </Link>
    </p>
    <div className="card-meta">
      {counselor.specialties?.map((specialty) => (
        <CategoryTag key={specialty} category={specialty} />
      ))}
    </div>
    <div className="card-meta">
      {typeof counselor.rating === 'number' && (
        <span className="badge badge-success">{counselor.rating.toFixed(1)} rating</span>
      )}
      <span className="text-muted">{counselor.availability}</span>
    </div>
  </Card>
);

export default CounselorCard;
