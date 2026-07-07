import { useEffect, useState } from 'react';
import api from '../api/axios';
import CounselorCard from '../components/CounselorCard';

const CounselorList = () => {
  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    const fetchCounselors = async () => {
      const { data } = await api.get('/counselors');
      setCounselors(data);
    };
    fetchCounselors();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Counselors</h1>
      </div>
      {counselors.length === 0 && <div className="empty-state">No verified counselors yet.</div>}
      {counselors.map((counselor) => (
        <CounselorCard key={counselor._id} counselor={counselor} />
      ))}
    </div>
  );
};

export default CounselorList;
