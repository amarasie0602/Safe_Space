import { useEffect, useState } from 'react';
import api from '../api/axios';
import CounselorCard from '../components/CounselorCard';
import SkeletonCard from '../components/SkeletonCard';
import NetworkError from '../components/NetworkError';

const CounselorList = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCounselors = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/counselors');
      setCounselors(data);
    } catch {
      setError('Unable to load content right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {!loading && error && <NetworkError message={error} onRetry={fetchCounselors} />}
      {!loading && !error && counselors.length === 0 && (
        <div className="empty-state">No verified counselors yet.</div>
      )}
      {!loading &&
        !error &&
        counselors.map((counselor) => <CounselorCard key={counselor._id} counselor={counselor} />)}
    </div>
  );
};

export default CounselorList;
