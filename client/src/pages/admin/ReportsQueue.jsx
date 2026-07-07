import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ReportsQueue = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await api.get('/admin/reports', { params: { status: 'open' } });
      setReports(data);
    };
    fetchReports();
  }, []);

  const handleResolve = async (reportId, status) => {
    await api.patch(`/admin/reports/${reportId}/resolve`, { status });
    setReports((prev) => prev.filter((report) => report._id !== reportId));
  };

  return (
    <div>
      <h1>Reports</h1>
      {reports.map((report) => (
        <div key={report._id}>
          <p>{report.reason}</p>
          <span>{report.targetType}</span>
          <button onClick={() => handleResolve(report._id, 'resolved')}>Resolve</button>
          <button onClick={() => handleResolve(report._id, 'dismissed')}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};

export default ReportsQueue;
