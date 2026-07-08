import { Link } from 'react-router-dom';
import Card from './Card';

const CounselorCard = ({ counselor }) => (
  <Card>
    <p>
      <Link to={`/counselors/${counselor._id}`}>
        <strong>{counselor.name}</strong>
      </Link>
    </p>
    <div className="card-meta">
      {counselor.specialties?.map((specialty) => (
        <span key={specialty} className="badge">
          {specialty.replace('_', ' ')}
        </span>
      ))}
    </div>
  </Card>
);

export default CounselorCard;
