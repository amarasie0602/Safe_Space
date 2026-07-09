import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

// There's no backend notification model yet (no event feed for replies,
// support reactions, etc.), so this is an honest empty shell rather than
// fabricated activity. Wiring it up for real just needs a Notification
// collection and a GET /notifications endpoint.
const NotificationsDropdown = () => {
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
    <div className="notifications" ref={ref}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        title="Notifications"
      >
        <Icon name="bell" size={18} />
      </button>
      {open && (
        <div className="notifications-menu">
          <h3>Notifications</h3>
          <p className="empty-state">You&apos;re all caught up — no new notifications.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
