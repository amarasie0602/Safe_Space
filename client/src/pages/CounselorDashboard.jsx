import { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { CounselorAuthContext } from '../context/CounselorAuthContext';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const NEXT_ACTIONS = {
  pending: [
    { status: 'confirmed', label: 'Confirm', className: 'btn-primary' },
    { status: 'cancelled', label: 'Decline', className: 'btn-ghost' },
  ],
  confirmed: [
    { status: 'completed', label: 'Mark completed', className: 'btn-primary' },
    { status: 'cancelled', label: 'Cancel', className: 'btn-ghost' },
  ],
  completed: [],
  cancelled: [],
};

const CounselorDashboard = () => {
  const { counselor, logout } = useContext(CounselorAuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/bookings/mine');
      setBookings(data);
    } catch {
      setError('Unable to load your bookings right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? data : b)));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update that booking.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Bookings</h1>
        <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
          Log out
        </button>
      </div>
      <p className="text-muted">
        Signed in as {counselor.name}. Sessions are anonymous — you'll only see the client's
        nickname, never their real identity.
      </p>

      {loading && <LoadingSpinner />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && bookings.length === 0 && (
        <div className="empty-state">No booking requests yet.</div>
      )}
      {!loading &&
        bookings.map((booking) => (
          <Card key={booking._id}>
            <p>
              <strong>{booking.user?.pseudonym}</strong> requested{' '}
              {new Date(booking.requestedTime).toLocaleString()}
            </p>
            {booking.notes && <p className="text-muted">Notes: {booking.notes}</p>}
            <div className="card-meta">
              <span className={`badge${booking.status === 'cancelled' ? ' badge-danger' : ''}`}>
                {booking.status}
              </span>
            </div>
            <div className="card-actions">
              {NEXT_ACTIONS[booking.status].map((action) => (
                <button
                  key={action.status}
                  type="button"
                  className={`btn btn-sm ${action.className}`}
                  onClick={() => handleStatusChange(booking._id, action.status)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </Card>
        ))}
    </div>
  );
};

export default CounselorDashboard;
