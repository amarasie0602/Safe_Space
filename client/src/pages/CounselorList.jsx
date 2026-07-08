import { useEffect, useState } from 'react';
import api from '../api/axios';
import CounselorCard from '../components/CounselorCard';
import SkeletonCard from '../components/SkeletonCard';

const CounselorList = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounselors = async () => {
      const { data } = await api.get('/counselors');
      setCounselors(data);
      setLoading(false);
    };
    fetchCounselors();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Counselors</h1>
      </div>
      {loading && (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}
      {!loading && counselors.length === 0 && (
        <div className="empty-state">No verified counselors yet.</div>
      )}
      {!loading &&
        counselors.map((counselor) => <CounselorCard key={counselor._id} counselor={counselor} />)}
    </div>
  );
};

export default CounselorList;
