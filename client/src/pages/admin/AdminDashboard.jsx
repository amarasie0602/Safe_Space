import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

const AdminDashboard = () => (
  <div className="admin-layout">
    <nav className="admin-sidebar">
      <NavLink to="/admin/posts" className={navLinkClass}>
        Flagged Posts
      </NavLink>
      <NavLink to="/admin/reports" className={navLinkClass}>
        Reports
      </NavLink>
      <NavLink to="/admin/counselors" className={navLinkClass}>
        Counselors
      </NavLink>
      <NavLink to="/admin/bookings" className={navLinkClass}>
        Bookings
      </NavLink>
      <NavLink to="/admin/analytics" className={navLinkClass}>
        Analytics
      </NavLink>
    </nav>
    <div className="admin-content">
      <Outlet />
    </div>
  </div>
);

export default AdminDashboard;
