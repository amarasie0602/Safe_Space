import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Bookings</h1>
      {bookings.length === 0 && <div className="empty-state">No bookings yet.</div>}
      {bookings.map((booking) => (
        <Card key={booking._id}>
          <p>
            <strong>{booking.counselor?.name}</strong>
          </p>
          <span className="badge">{booking.status}</span>
        </Card>
      ))}
    </div>
  );
};

export default AdminBookings;
