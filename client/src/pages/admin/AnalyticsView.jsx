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

  const postsByCategory = analytics.postsByCategory.map((d) => ({ category: d._id, count: d.count }));

  return (
    <div>
      <h1>Analytics</h1>
      <div>
        <h2>Flagged Posts</h2>
        <p>{analytics.flaggedCount}</p>
      </div>
      <div>
        <h2>Avg Resolution Time</h2>
        <p>{Math.round(analytics.avgResolutionMs / 3600000)} hours</p>
      </div>
      <h2>Posts by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={postsByCategory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <h2>Category Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={postsByCategory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsView;
