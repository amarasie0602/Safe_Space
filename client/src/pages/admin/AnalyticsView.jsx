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
          <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text)',
            }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <h2>Category Trend</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={postsByCategory}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text)',
            }}
          />
          <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsView;
