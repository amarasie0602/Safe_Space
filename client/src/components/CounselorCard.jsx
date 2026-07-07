import Card from './Card';

const CounselorCard = ({ counselor }) => (
  <Card>
    <p>
      <strong>{counselor.name}</strong>
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
