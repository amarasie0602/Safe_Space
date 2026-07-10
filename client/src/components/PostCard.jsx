import { useContext, useState } from 'react';
import api from '../api/axios';
import AnonymousAvatar from './AnonymousAvatar';
import CategoryTag from './CategoryTag';
import { timeAgo } from '../utils/timeAgo';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { SavedPostsContext } from '../context/SavedPostsContext';
import PostOptionsMenu from './PostOptionsMenu';
import PostReplies from './PostReplies';
import Icon from './Icon';

const PostCard = ({ post, showFlagged }) => {
  const { user } = useContext(AuthContext);
  const [supported, setSupported] = useState(
    () => !!user && (post.supporters || []).some((id) => id === user.id)
  );
  const [count, setCount] = useState((post.supporters || []).length);
  const [showReplies, setShowReplies] = useState(false);
  const { showToast } = useContext(ToastContext);
  const { isSaved, toggleSaved } = useContext(SavedPostsContext);
  const saved = isSaved(post._id);

  const handleSupport = async () => {
    if (!user) {
      showToast('Log in to support a post');
      return;
    }
    const nextSupported = !supported;
    setSupported(nextSupported);
    setCount((prev) => (nextSupported ? prev + 1 : prev - 1));
    try {
      const { data } = await api.patch(`/posts/${post._id}/support`);
      setSupported(data.supported);
      setCount(data.count);
    } catch {
      setSupported(supported);
      setCount((prev) => (nextSupported ? prev - 1 : prev + 1));
      showToast('Unable to update support right now.');
    }
  };

  const handleReply = () => setShowReplies((prev) => !prev);

  const handleSave = async () => {
    if (!user) {
      showToast('Log in to save a post');
      return;
    }
    try {
      const nowSaved = await toggleSaved(post._id);
      showToast(nowSaved ? 'Post saved' : 'Removed from saved posts');
    } catch {
      showToast('Unable to update saved posts right now.');
    }
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
        <PostOptionsMenu post={post} />
      </div>
      <p className="post-card-content">{post.content}</p>
      <div className="post-card-reactions">
        <button
          type="button"
          className={`reaction-btn${supported ? ' active' : ''}`}
          onClick={handleSupport}
        >
          <Icon name="heart" size={16} /> {count > 0 ? count : 'Support'}
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
