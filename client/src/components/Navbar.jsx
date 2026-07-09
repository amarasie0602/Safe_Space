import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Icon from './Icon';
import NotificationsDropdown from './NotificationsDropdown';
import AnonymousAvatar from './AnonymousAvatar';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="navbar-brand-icon">
          <Icon name="home" size={18} />
        </span>
        SafeSpace
      </NavLink>
      <div className="navbar-tabs">
        <NavLink to="/" end className={navLinkClass}>
          <Icon name="home" size={15} /> Posts
        </NavLink>
        <NavLink to="/threads" className={navLinkClass}>
          <Icon name="message" size={15} /> Threads
        </NavLink>
        <NavLink to="/counselors" className={navLinkClass}>
          <Icon name="users" size={15} /> Counselors
        </NavLink>
      </div>
      <div className="navbar-links">
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
        {!user && (
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
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
        </button>
        {user && <NotificationsDropdown />}
        {user && (
          <button
            className="icon-btn navbar-avatar-btn"
            onClick={logout}
            aria-label={`Log out ${user.pseudonym}`}
            title={`Log out ${user.pseudonym}`}
          >
            <AnonymousAvatar seed={user.id} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
