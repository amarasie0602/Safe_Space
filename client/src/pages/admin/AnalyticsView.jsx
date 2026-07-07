import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AnalyticsView = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await api.get('/admin/analytics');
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <LoadingSpinner />;

  const postsByCategory = analytics.postsByCategory.map((d) => ({
    category: d._id.replace('_', ' '),
    count: d.count,
  }));

  return (
    <div>
      <h1>Analytics</h1>
      <div className="metrics">
        <div className="metric-card">
          <h2>Flagged Posts</h2>
          <p>{analytics.flaggedCount}</p>
        </div>
        <div className="metric-card">
          <h2>Avg Resolution Time</h2>
          <p>{Math.round(analytics.avgResolutionMs / 3600000)}h</p>
        </div>
      </div>

      <h2>Posts by Category</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={postsByCategory}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <h2>Category Trend</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={postsByCategory}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsView;
