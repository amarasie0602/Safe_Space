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

  return (
    <div>
      <h1>Reports</h1>
      {reports.map((report) => (
        <div key={report._id}>
          <p>{report.reason}</p>
          <span>{report.targetType}</span>
        </div>
      ))}
    </div>
  );
};

export default ReportsQueue;
