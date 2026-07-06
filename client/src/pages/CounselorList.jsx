import { useEffect, useState } from 'react';
import api from '../api/axios';

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
        <div key={counselor._id}>
          <p>{counselor.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CounselorList;
