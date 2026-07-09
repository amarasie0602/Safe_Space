import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import AnonymousAvatar from '../components/AnonymousAvatar';
import Card from '../components/Card';
import CategoryTag from '../components/CategoryTag';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../components/Icon';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';

const ThreadDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [thread, setThread] = useState(null);
  const [supported, setSupported] = useState(false);
  const [replies, setReplies] = useState([]);
  const [body, setBody] = useState('');
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const fetchThread = async () => {
      const [{ data: threadData }, { data: repliesData }] = await Promise.all([
        api.get(`/threads/${id}`),
        api.get(`/threads/${id}/replies`),
      ]);
      setThread(threadData);
      setSupported(!!user && (threadData.upvotedBy || []).some((uid) => uid === user.id));
      setReplies(repliesData);
    };
    fetchThread();
  }, [id, user]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/threads/${id}/replies`, { body });
    setReplies((prev) => [...prev, data]);
    setBody('');
  };

  const handleFlag = async (replyId) => {
    await api.patch(`/replies/${replyId}/flag`);
    setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, flagged: true } : r)));
    showToast('Reply flagged');
  };

  const handleUpvoteThread = async () => {
    if (!user) {
      showToast('Log in to support a thread');
      return;
    }
    const nextSupported = !supported;
    setSupported(nextSupported);
    setThread((prev) => ({ ...prev, upvotes: prev.upvotes + (nextSupported ? 1 : -1) }));
    try {
      const { data } = await api.patch(`/threads/${id}/upvote`);
      setSupported(data.supported);
      setThread((prev) => ({ ...prev, upvotes: data.upvotes }));
    } catch {
      setSupported(supported);
      setThread((prev) => ({ ...prev, upvotes: prev.upvotes - (nextSupported ? 1 : -1) }));
    }
  };

  const handleUpvoteReply = async (replyId) => {
    setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r)));
    try {
      await api.patch(`/replies/${replyId}/upvote`);
    } catch {
      setReplies((prev) => prev.map((r) => (r._id === replyId ? { ...r, upvotes: r.upvotes - 1 } : r)));
    }
  };

  if (!thread) return <LoadingSpinner />;

  return (
    <div>
      <div className="thread-header">
        <AnonymousAvatar seed={thread.author?._id} avatarId={thread.author?.avatarId} />
        <div className="post-card-authorline">
          <div className="post-card-meta">
            <strong>{thread.author?.pseudonym}</strong>
            <CategoryTag category={thread.category} />
          </div>
          <span className="text-muted">{timeAgo(thread.createdAt)}</span>
        </div>
      </div>
      <h1>{thread.title}</h1>
      <p>{thread.body}</p>
      <button
        className={`btn btn-ghost btn-sm${supported ? ' active' : ''}`}
        onClick={handleUpvoteThread}
      >
        <Icon name="heart" size={15} /> {thread.upvotes} supports
      </button>

      <h2>Replies</h2>
      <p className="kindness-banner">
        <Icon name="heart" size={14} /> Respond with kindness and respect — everyone here is going
        through something.
      </p>
      {replies.length === 0 && <div className="empty-state">No replies yet.</div>}
      {replies.map((reply) => (
        <Card key={reply._id}>
          <div className="post-card-header">
            <AnonymousAvatar seed={reply.author?._id} avatarId={reply.author?.avatarId} />
            <div className="post-card-meta">
              <strong>{reply.author?.pseudonym}</strong>
              <span className="text-muted">{timeAgo(reply.createdAt)}</span>
            </div>
          </div>
          <p>{reply.body}</p>
          <div className="card-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => handleUpvoteReply(reply._id)}>
              <Icon name="heart" size={14} /> {reply.upvotes}
            </button>
            {reply.flagged ? (
              <span className="badge badge-danger">flagged</span>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => handleFlag(reply._id)}>
                Flag
              </button>
            )}
          </div>
        </Card>
      ))}

      <h2>Write a reply</h2>
      <form className="form form-wide" onSubmit={handleReplySubmit}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a reply"
          required
        />
        <button type="submit" className="btn btn-primary">
          Reply
        </button>
      </form>
    </div>
  );
};

export default ThreadDetail;
