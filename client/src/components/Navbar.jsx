import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Icon from './Icon';
import NotificationsDropdown from './NotificationsDropdown';
import AccountMenu from './AccountMenu';
import logo from '../assets/logo-icon.png';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);
const desktopOnlyNavLinkClass = ({ isActive }) =>
  `navbar-desktop-only${isActive ? ' active' : ''}`;

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
        <span className="navbar-brand-icon">
          <img src={logo} alt="" width={22} height={22} />
        </span>
        <span className="navbar-brand-text">SafeSpace</span>
      </NavLink>
      <div className="navbar-tabs navbar-desktop-only">
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
          <NavLink to="/admin" className={desktopOnlyNavLinkClass}>
            Admin
          </NavLink>
        )}
        {user && (
          <NavLink to="/my-activity" className={desktopOnlyNavLinkClass}>
            My Activity
          </NavLink>
        )}
        {!user && (
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Log in
          </NavLink>
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
        {user && <AccountMenu />}
        <button
          type="button"
          className="icon-btn navbar-menu-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} size={18} />
        </button>
      </div>
      {mobileOpen && (
        <div className="navbar-mobile-panel">
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            <Icon name="home" size={15} /> Posts
          </NavLink>
          <NavLink to="/threads" className={navLinkClass} onClick={closeMenu}>
            <Icon name="message" size={15} /> Threads
          </NavLink>
          <NavLink to="/counselors" className={navLinkClass} onClick={closeMenu}>
            <Icon name="users" size={15} /> Counselors
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
              Admin
            </NavLink>
          )}
          {user && (
            <NavLink to="/my-activity" className={navLinkClass} onClick={closeMenu}>
              My Activity
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
