import { useEffect, useState } from 'react';
import api from '../../api/axios';

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
      {bookings.map((booking) => (
        <div key={booking._id}>
          <p>{booking.counselor?.name}</p>
          <span>{booking.status}</span>
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;
