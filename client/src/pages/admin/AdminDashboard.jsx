import { NavLink, Outlet } from 'react-router-dom';

const AdminDashboard = () => (
  <div>
    <nav>
      <NavLink to="/admin/posts">Flagged Posts</NavLink>
      <NavLink to="/admin/reports">Reports</NavLink>
      <NavLink to="/admin/counselors">Counselors</NavLink>
      <NavLink to="/admin/bookings">Bookings</NavLink>
      <NavLink to="/admin/analytics">Analytics</NavLink>
    </nav>
    <div>
      <Outlet />
    </div>
  </div>
);

export default AdminDashboard;
