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
      <h1>Counselors</h1>
      {counselors.map((counselor) => (
        <CounselorCard key={counselor._id} counselor={counselor} />
      ))}
    </div>
  );
};

export default CounselorList;
