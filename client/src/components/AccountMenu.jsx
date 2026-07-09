import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AnonymousAvatar from './AnonymousAvatar';

const AccountMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="account-menu" ref={ref}>
      <button
        type="button"
        className="icon-btn navbar-avatar-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Account menu for ${user.pseudonym}`}
        title={user.pseudonym}
      >
        <AnonymousAvatar seed={user.id} avatarId={user.avatarId} />
      </button>
      {open && (
        <div className="account-menu-dropdown">
          <p className="account-menu-name">{user.pseudonym}</p>
          <Link to="/profile" onClick={() => setOpen(false)}>
            View Profile
          </Link>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
