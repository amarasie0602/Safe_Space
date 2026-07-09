import { useContext, useState } from 'react';
import AnonymousAvatar from './AnonymousAvatar';
import CategoryTag from './CategoryTag';
import { timeAgo } from '../utils/timeAgo';
import { ToastContext } from '../context/ToastContext';
import PostOptionsMenu from './PostOptionsMenu';
import PostReplies from './PostReplies';
import Icon from './Icon';
import { isSaved, toggleSavedPost } from '../utils/savedPosts';

const PostCard = ({ post, showFlagged, onBlocked, supported, supportCount, onToggleSupport }) => {
  const [localSupported, setLocalSupported] = useState(false);
  const [localCount, setLocalCount] = useState(0);
  const [saved, setSaved] = useState(() => isSaved(post._id));
  const [showReplies, setShowReplies] = useState(false);
  const { showToast } = useContext(ToastContext);

  const isControlled = onToggleSupport != null;
  const effectiveSupported = isControlled ? supported : localSupported;
  const effectiveCount = isControlled ? supportCount : localCount;

  const handleSupport = () => {
    if (isControlled) {
      onToggleSupport();
    } else {
      setLocalSupported((prev) => !prev);
      setLocalCount((prev) => (localSupported ? prev - 1 : prev + 1));
    }
  };

  const handleReply = () => setShowReplies((prev) => !prev);

  const handleSave = () => {
    const nowSaved = toggleSavedPost(post._id);
    setSaved(nowSaved);
    showToast(nowSaved ? 'Post saved' : 'Removed from saved posts');
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <AnonymousAvatar seed={post.author?._id} avatarId={post.author?.avatarId} />
        <div className="post-card-authorline">
          <div className="post-card-meta">
            <strong>{post.author?.pseudonym}</strong>
            <CategoryTag category={post.category} />
          </div>
          <span className="text-muted">{timeAgo(post.createdAt)}</span>
        </div>
        {showFlagged && post.flagged && <span className="badge badge-danger">flagged</span>}
        <PostOptionsMenu post={post} onBlocked={onBlocked} />
      </div>
      <p className="post-card-content">{post.content}</p>
      <div className="post-card-reactions">
        <button
          type="button"
          className={`reaction-btn${effectiveSupported ? ' active' : ''}`}
          onClick={handleSupport}
        >
          <Icon name="heart" size={16} /> {effectiveCount > 0 ? effectiveCount : 'Support'}
        </button>
        <button type="button" className={`reaction-btn${showReplies ? ' active' : ''}`} onClick={handleReply}>
          <Icon name="message" size={16} /> Reply
        </button>
        <button
          type="button"
          className={`reaction-btn${saved ? ' active' : ''}`}
          onClick={handleSave}
          aria-label={saved ? 'Remove from saved posts' : 'Save this post'}
          title={saved ? 'Remove from saved posts' : 'Save this post'}
        >
          <Icon name="bookmark" size={16} />
        </button>
      </div>
      {showReplies && <PostReplies postId={post._id} />}
    </div>
  );
};

export default PostCard;
