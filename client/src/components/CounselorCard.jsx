import Card from './Card';

const CounselorCard = ({ counselor }) => (
  <Card>
    <p>{counselor.name}</p>
    <div>
      {counselor.specialties?.map((specialty) => (
        <span key={specialty}>{specialty}</span>
      ))}
    </div>
  </Card>
);

export default CounselorCard;
