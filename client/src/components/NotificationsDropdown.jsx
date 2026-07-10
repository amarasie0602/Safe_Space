import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Icon from './Icon';
import { timeAgo } from '../utils/timeAgo';

const TYPE_ICONS = {
  post_reply: 'message',
  thread_reply: 'message',
  booking_status: 'heart',
};

const NotificationsDropdown = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) return undefined;
    let active = true;

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        if (active) setNotifications(data);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchNotifications();

    const token = localStorage.getItem('token');
    const baseURL = api.defaults.baseURL || '';
    const source = new EventSource(`${baseURL}/notifications/stream?token=${encodeURIComponent(token)}`);
    source.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
    };
    // EventSource retries on its own; this just avoids console spam from the
    // expected reconnect-on-drop cycle.
    source.onerror = () => {};

    return () => {
      active = false;
      source.close();
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      try {
        await api.patch('/notifications/read-all');
      } catch {
        // Best-effort — the unread dot will just reappear on next fetch.
      }
    }
  };

  const handleClick = (notification) => {
    setOpen(false);
    navigate(notification.link || '/');
  };

  return (
    <div className="notifications" ref={ref}>
      <button
        type="button"
        className="icon-btn notifications-trigger"
        onClick={handleToggle}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
        title="Notifications"
      >
        <Icon name="bell" size={18} />
        {unreadCount > 0 && <span className="notifications-dot" aria-hidden="true" />}
      </button>
      {open && (
        <div className="notifications-menu">
          <h3>Notifications</h3>
          {loading && <p className="text-muted">Loading...</p>}
          {!loading && notifications.length === 0 && (
            <p className="empty-state">You&apos;re all caught up — no new notifications.</p>
          )}
          {!loading &&
            notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                className="notification-item"
                onClick={() => handleClick(notification)}
              >
                <Icon name={TYPE_ICONS[notification.type] || 'bell'} size={15} />
                <span>
                  <span className="notification-message">{notification.message}</span>
                  <span className="text-muted">{timeAgo(notification.createdAt)}</span>
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
