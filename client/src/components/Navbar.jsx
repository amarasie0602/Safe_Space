import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        SafeSpace
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" end className={navLinkClass}>
          Posts
        </NavLink>
        <NavLink to="/threads" className={navLinkClass}>
          Threads
        </NavLink>
        <NavLink to="/counselors" className={navLinkClass}>
          Counselors
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        )}
        {user && (
          <NavLink to="/my-activity" className={navLinkClass}>
            My Activity
          </NavLink>
        )}
        {user ? (
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-primary btn-sm">
              Register
            </NavLink>
          </>
        )}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
