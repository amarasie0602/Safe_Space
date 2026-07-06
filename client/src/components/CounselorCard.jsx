const CounselorCard = ({ counselor }) => (
  <div>
    <p>{counselor.name}</p>
    <div>
      {counselor.specialties?.map((specialty) => (
        <span key={specialty}>{specialty}</span>
      ))}
    </div>
  </div>
);

export default CounselorCard;
