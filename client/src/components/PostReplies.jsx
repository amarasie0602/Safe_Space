import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import AnonymousAvatar from './AnonymousAvatar';
import Icon from './Icon';
import { timeAgo } from '../utils/timeAgo';

const PostReplies = ({ postId }) => {
  const { user } = useContext(AuthContext);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchReplies = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${postId}/replies`);
        if (active) setReplies(data);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchReplies();
    return () => {
      active = false;
    };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/replies`, { body });
      setReplies((prev) => [...prev, data]);
      setBody('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (replyId) => {
    setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r)));
    try {
      await api.patch(`/replies/${replyId}/upvote`);
    } catch {
      setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, upvotes: r.upvotes - 1 } : r)));
    }
  };

  return (
    <div className="post-replies">
      {loading && <p className="text-muted">Loading replies...</p>}
      {!loading && replies.length === 0 && (
        <p className="text-muted">No replies yet — be the first to respond.</p>
      )}
      {!loading &&
        replies.map((reply) => (
          <div className="post-reply" key={reply._id}>
            <AnonymousAvatar seed={reply.author?._id} avatarId={reply.author?.avatarId} size={28} />
            <div className="post-reply-body">
              <div className="post-card-meta">
                <strong>{reply.author?.pseudonym}</strong>
                <span className="text-muted">{timeAgo(reply.createdAt)}</span>
              </div>
              <p>{reply.body}</p>
              <button
                type="button"
                className="reaction-btn reaction-btn-sm"
                onClick={() => handleUpvote(reply._id)}
              >
                <Icon name="heart" size={13} /> {reply.upvotes}
              </button>
            </div>
          </div>
        ))}
      {user ? (
        <form className="post-reply-form" onSubmit={handleSubmit}>
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a reply..." />
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !body.trim()}>
            Reply
          </button>
        </form>
      ) : (
        <p className="text-muted">
          <Link to="/login">Log in</Link> to reply.
        </p>
      )}
    </div>
  );
};

export default PostReplies;
