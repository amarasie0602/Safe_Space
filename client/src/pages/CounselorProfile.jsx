import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import NetworkError from '../components/NetworkError';

const CounselorProfile = () => {
  const { id } = useParams();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCounselor = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/counselors');
      const match = data.find((c) => c._id === id);
      if (!match) {
        setError('Counselor not found or not yet verified.');
      } else {
        setCounselor(match);
      }
    } catch {
      setError('Unable to load content right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <NetworkError message={error} onRetry={fetchCounselor} />;

  return (
    <div className="counselor-profile">
      <h1>{counselor.name}</h1>
      <div className="card-meta">
        {counselor.specialties?.map((specialty) => (
          <span key={specialty} className="badge">
            {specialty.replace('_', ' ')}
          </span>
        ))}
      </div>

      <h2>About</h2>
      <p>{counselor.credentials || 'No additional credential details provided.'}</p>

      <h2>Privacy</h2>
      <p className="text-muted">
        Sessions are anonymous — the counselor will only see your nickname, never your real
        identity.
      </p>

      <h2>Reviews</h2>
      <p className="text-muted">Reviews and ratings aren't available yet.</p>
    </div>
  );
};

export default CounselorProfile;
