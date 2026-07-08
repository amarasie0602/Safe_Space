import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnonymousAvatar from './AnonymousAvatar';
import CategoryTag from './CategoryTag';
import { timeAgo } from '../utils/timeAgo';
import { ToastContext } from '../context/ToastContext';

const PostCard = ({ post, showFlagged }) => {
  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSupport = () => {
    setSupported((prev) => !prev);
    setSupportCount((prev) => (supported ? prev - 1 : prev + 1));
  };

  const handleReply = () => {
    showToast('Posts are for sharing — head to Threads to reply and discuss');
    navigate('/threads');
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <AnonymousAvatar seed={post._id} />
        <div className="post-card-meta">
          <CategoryTag category={post.category} />
          <span className="text-muted">{timeAgo(post.createdAt)}</span>
        </div>
        {showFlagged && post.flagged && <span className="badge badge-danger">flagged</span>}
      </div>
      <p className="post-card-content">{post.content}</p>
      <div className="post-card-reactions">
        <button
          type="button"
          className={`reaction-btn${supported ? ' active' : ''}`}
          onClick={handleSupport}
        >
          <span aria-hidden="true">❤️</span> {supportCount > 0 ? supportCount : 'Support'}
        </button>
        <button type="button" className="reaction-btn" onClick={handleReply}>
          <span aria-hidden="true">💬</span> Reply
        </button>
      </div>
    </div>
  );
};

export default PostCard;
