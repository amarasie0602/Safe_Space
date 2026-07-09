import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import NetworkError from '../components/NetworkError';
import ErrorMessage from '../components/ErrorMessage';
import Calendar from '../components/Calendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import CategoryTag from '../components/CategoryTag';

const CounselorProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [bookingError, setBookingError] = useState('');

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

  const handleConfirmBooking = async () => {
    setBookingStatus('processing');
    setBookingError('');
    try {
      const requestedTime = `${date}T${time}:00`;
      const { data } = await api.post('/bookings', { counselor: id, requestedTime, notes });
      setBooking(data);
      setBookingStatus('confirmed');
      setStep(4);
    } catch (err) {
      setBookingStatus('failed');
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <NetworkError message={error} onRetry={fetchCounselor} />;

  return (
    <div className="counselor-profile">
      <h1>{counselor.name}</h1>
      <div className="card-meta">
        {counselor.specialties?.map((specialty) => (
          <CategoryTag key={specialty} category={specialty} />
        ))}
      </div>
      <div className="card-meta">
        {typeof counselor.rating === 'number' && (
          <span className="badge badge-success">{counselor.rating.toFixed(1)} rating</span>
        )}
        <span className="badge">{counselor.availability}</span>
      </div>

      <h2>About</h2>
      <p>{counselor.credentials || 'No additional credential details provided.'}</p>

      <h2>Privacy</h2>
      <p className="text-muted">
        Sessions are anonymous — the counselor will only see your nickname, never your real
        identity.
      </p>

      <h2>Reviews</h2>
      <p className="text-muted">
        {typeof counselor.rating === 'number'
          ? `Rated ${counselor.rating.toFixed(1)} out of 5 by clients who've booked a session.`
          : "Reviews and ratings aren't available yet."}
      </p>

      <h2>Book an anonymous session</h2>
      {!user && (
        <p className="text-muted">
          Please <Link to="/login">log in</Link> to book a session.
        </p>
      )}

      {user && step === 1 && (
        <>
          <p className="text-muted">Step 1 of 3 — choose a date</p>
          <Calendar
            selectedDate={date}
            onSelect={(d) => {
              setDate(d);
              setStep(2);
            }}
          />
        </>
      )}

      {user && step === 2 && (
        <>
          <p className="text-muted">Step 2 of 3 — choose a time on {date}</p>
          <TimeSlotPicker
            selectedTime={time}
            onSelect={(t) => {
              setTime(t);
              setStep(3);
            }}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>
            Back
          </button>
        </>
      )}

      {user && step === 3 && (
        <>
          <p className="text-muted">Step 3 of 3 — confirm your appointment</p>
          <ul>
            <li>Date: {date}</li>
            <li>Time: {time}</li>
            <li>Counselor: {counselor.name}</li>
          </ul>
          <label className="field">
            Notes (optional)
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          {bookingError && <ErrorMessage message={bookingError} />}
          <div className="card-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmBooking}
              disabled={bookingStatus === 'processing'}
            >
              {bookingStatus === 'processing' ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </>
      )}

      {user && step === 4 && booking && (
        <div className="empty-state">
          <p className="badge badge-success">Booking confirmed</p>
          <p>
            Your anonymous session with {counselor.name} is requested for {date} at {time}. You'll
            see its status update as the counselor confirms.
          </p>
          <Link to="/counselors" className="btn btn-primary btn-sm">
            Back to Counselors
          </Link>
        </div>
      )}
    </div>
  );
};

export default CounselorProfile;
