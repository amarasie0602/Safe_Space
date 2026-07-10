import { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { CounselorAuthContext } from '../context/CounselorAuthContext';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DAYS = [
  { dayOfWeek: 1, label: 'Mon' },
  { dayOfWeek: 2, label: 'Tue' },
  { dayOfWeek: 3, label: 'Wed' },
  { dayOfWeek: 4, label: 'Thu' },
  { dayOfWeek: 5, label: 'Fri' },
  { dayOfWeek: 6, label: 'Sat' },
  { dayOfWeek: 0, label: 'Sun' },
];

const SLOT_OPTIONS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const ScheduleEditor = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const fetchSchedule = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/counselors/me/schedule');
      const byDay = {};
      data.weeklySchedule.forEach((entry) => {
        byDay[entry.dayOfWeek] = entry.slots;
      });
      setSchedule(byDay);
    } catch {
      setError('Unable to load your schedule right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const toggleSlot = (dayOfWeek, slot) => {
    setSaved(false);
    setSchedule((prev) => {
      const daySlots = prev[dayOfWeek] || [];
      const next = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot].sort();
      return { ...prev, [dayOfWeek]: next };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const weeklySchedule = Object.entries(schedule)
        .filter(([, slots]) => slots.length > 0)
        .map(([dayOfWeek, slots]) => ({ dayOfWeek: Number(dayOfWeek), slots }));
      await api.patch('/counselors/me/schedule', { weeklySchedule });
      setSaved(true);
    } catch {
      setError('Unable to save your schedule right now.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Card>
      <h2>My Weekly Schedule</h2>
      <p className="text-muted">
        Choose the recurring hours you're open for anonymous sessions. Clients can only book a
        slot you've selected here, and only if it isn't already booked.
      </p>
      {error && <ErrorMessage message={error} />}
      <div className="schedule-grid">
        {DAYS.map(({ dayOfWeek, label }) => (
          <div key={dayOfWeek} className="schedule-day">
            <strong>{label}</strong>
            <div className="time-slots">
              {SLOT_OPTIONS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`tab${(schedule[dayOfWeek] || []).includes(slot) ? ' active' : ''}`}
                  onClick={() => toggleSlot(dayOfWeek, slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="card-actions">
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Schedule'}
        </button>
        {saved && <span className="badge badge-success">Saved</span>}
      </div>
    </Card>
  );
};

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

      <ScheduleEditor />

      <h2>Booking Requests</h2>
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
