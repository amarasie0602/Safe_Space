import { useContext, useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import { ToastContext } from '../../context/ToastContext';

const ReportsQueue = () => {
  const [reports, setReports] = useState([]);
  const { showToast } = useContext(ToastContext);

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
    showToast(status === 'resolved' ? 'Report resolved' : 'Report dismissed');
  };

  const handleModerate = async (report, action) => {
    try {
      if (action === 'suspend') {
        await api.patch(`/admin/users/${report.targetId}/suspend`, { days: 7 });
        showToast('User suspended for 7 days');
      } else {
        await api.patch(`/admin/users/${report.targetId}/ban`);
        showToast('User banned');
      }
      await handleResolve(report._id, 'resolved');
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to take that action right now.');
    }
  };

  return (
    <div>
      <h1>Reports</h1>
      {reports.length === 0 && <div className="empty-state">No open reports.</div>}
      {reports.map((report) => (
        <Card key={report._id}>
          <p>{report.reason}</p>
          <div className="card-meta">
            <span className="badge">{report.targetType}</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary btn-sm" onClick={() => handleResolve(report._id, 'resolved')}>
              Resolve
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => handleResolve(report._id, 'dismissed')}>
              Dismiss
            </button>
            {report.targetType === 'user' && (
              <>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleModerate(report, 'suspend')}
                >
                  Suspend 7 days
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleModerate(report, 'ban')}>
                  Ban user
                </button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportsQueue;
