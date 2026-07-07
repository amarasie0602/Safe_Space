import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AnalyticsView = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await api.get('/admin/analytics');
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1>Analytics</h1>
    </div>
  );
};

export default AnalyticsView;
