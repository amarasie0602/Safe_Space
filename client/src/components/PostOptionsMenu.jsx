import { useContext, useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { ToastContext } from '../context/ToastContext';
import { blockUser } from '../utils/blockedUsers';
import ConfirmDialog from './ConfirmDialog';

const PostOptionsMenu = ({ post, onBlocked }) => {
  const [open, setOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const menuRef = useRef(null);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleReportPost = async () => {
    await api.post('/reports', {
      targetType: 'post',
      targetId: post._id,
      reason: 'Reported from post feed for review.',
    });
    showToast('Report submitted — our moderators will review it');
    setConfirmAction(null);
  };

  const handleReportUser = async () => {
    await api.post('/reports', {
      targetType: 'user',
      targetId: post.author?._id,
      reason: 'User reported from post feed for review.',
    });
    showToast('Report submitted — our moderators will review it');
    setConfirmAction(null);
  };

  const handleBlockUser = () => {
    blockUser(post.author?._id);
    showToast("User blocked — you won't see their posts anymore");
    setConfirmAction(null);
    onBlocked?.(post.author?._id);
  };

  return (
    <div className="post-options" ref={menuRef}>
      <button
        type="button"
        className="post-options-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Post options"
        title="Post options"
        aria-haspopup="true"
        aria-expanded={open}
      >
        ⋯
      </button>
      {open && (
        <div className="post-options-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setConfirmAction('post');
            }}
          >
            Report post
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setConfirmAction('user');
            }}
          >
            Report user
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setConfirmAction('block');
            }}
          >
            Block user
          </button>
        </div>
      )}
      {confirmAction === 'post' && (
        <ConfirmDialog
          title="Report this post?"
          message="Reports help us maintain a safe and respectful community. Our moderators will review it."
          confirmLabel="Report"
          danger
          onConfirm={handleReportPost}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'user' && (
        <ConfirmDialog
          title="Report this user?"
          message="Reports help us maintain a safe and respectful community. Our moderators will review it."
          confirmLabel="Report"
          danger
          onConfirm={handleReportUser}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'block' && (
        <ConfirmDialog
          title="Block this user?"
          message="You won't see posts from this user anymore. This only affects your view in this browser."
          confirmLabel="Block"
          danger
          onConfirm={handleBlockUser}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};

export default PostOptionsMenu;
