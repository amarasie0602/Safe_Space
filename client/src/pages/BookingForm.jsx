import { useState } from 'react';
import api from '../api/axios';

const BookingForm = ({ counselorId, onBooked }) => {
  const [requestedTime, setRequestedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/bookings', { counselor: counselorId, requestedTime, notes });
    setConfirmed(true);
    onBooked?.(data);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        Requested time
        <input
          type="datetime-local"
          value={requestedTime}
          onChange={(e) => setRequestedTime(e.target.value)}
          required
        />
      </label>
      <label className="field">
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      {confirmed && <p className="badge badge-success">Booking request sent! We&apos;ll confirm shortly.</p>}
      <button type="submit" className="btn btn-primary">
        Book Session
      </button>
    </form>
  );
};

export default BookingForm;
